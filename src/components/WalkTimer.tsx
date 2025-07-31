import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWalkTimer } from '@/hooks/useWalkTimer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Settings } from 'lucide-react';

interface Profile {
  audio_preference: 'beep' | 'voice';
  subscription_status: 'trial' | 'active' | 'expired';
  trial_end_date: string;
}

const WalkTimer = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [loading, setLoading] = useState(true);

  const timer = useWalkTimer({
    durationMinutes: selectedDuration,
    audioPreference: profile?.audio_preference || 'beep'
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('audio_preference, subscription_status, trial_end_date')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data as Profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Update audio preference
  const updateAudioPreference = async (preference: 'beep' | 'voice') => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({ audio_preference: preference })
        .eq('user_id', user.id);

      setProfile(prev => prev ? { ...prev, audio_preference: preference } : null);
    } catch (error) {
      console.error('Failed to update audio preference:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canUseFeatures = () => {
    if (!profile) return false;
    if (profile.subscription_status === 'active') return true;
    if (profile.subscription_status === 'trial') {
      return new Date() < new Date(profile.trial_end_date);
    }
    return false;
  };

  const isTrialExpired = profile?.subscription_status === 'trial' && 
    new Date() >= new Date(profile.trial_end_date || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Free users can only use 15-minute timer
  const availableDurations = canUseFeatures() 
    ? [15, 30, 45, 60] 
    : [15];

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Trial Status */}
      {profile && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Status</span>
              <Badge variant={
                profile.subscription_status === 'active' ? 'default' : 
                isTrialExpired ? 'destructive' : 'secondary'
              }>
                {profile.subscription_status === 'active' ? 'Premium' : 
                 isTrialExpired ? 'Trial Expired' : 'Trial Active'}
              </Badge>
            </div>
            {profile.subscription_status === 'trial' && !isTrialExpired && (
              <p className="text-xs text-muted-foreground">
                Trial ends: {new Date(profile.trial_end_date).toLocaleDateString()}
              </p>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Timer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Walk Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Duration Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Duration</label>
            <div className="grid grid-cols-2 gap-2">
              {availableDurations.map(duration => (
                <Button
                  key={duration}
                  variant={selectedDuration === duration ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDuration(duration)}
                  disabled={timer.isActive}
                >
                  {duration} min
                </Button>
              ))}
            </div>
            {!canUseFeatures() && (
              <p className="text-xs text-muted-foreground mt-2">
                Upgrade to access 30, 45, and 60 minute timers
              </p>
            )}
          </div>

          {/* Audio Preference */}
          {canUseFeatures() && profile && (
            <div>
              <label className="text-sm font-medium mb-2 block">Audio Cues</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={profile.audio_preference === 'beep' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateAudioPreference('beep')}
                  disabled={timer.isActive}
                >
                  Beep
                </Button>
                <Button
                  variant={profile.audio_preference === 'voice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateAudioPreference('voice')}
                  disabled={timer.isActive}
                >
                  Voice
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timer Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Japanese Walking Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Time Display */}
          <div className="space-y-2">
            <div className="text-4xl font-bold font-mono">
              {formatTime(timer.timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground">
              {timer.isActive ? 'Time remaining' : 'Ready to start'}
            </div>
          </div>

          {/* Current Phase */}
          {timer.isActive && (
            <div className="space-y-2">
              <Badge 
                variant={timer.currentPhase === 'fast' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {timer.currentPhase === 'paused' ? 'Paused' : 
                 timer.currentPhase === 'fast' ? 'Walk Fast' : 'Walk Slow'}
              </Badge>
              
              {canUseFeatures() && (
                <div className="space-y-1">
                  <Progress value={timer.phaseProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Phase progress • Intervals completed: {timer.intervalsCompleted}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Overall Progress */}
          {timer.isActive && (
            <div className="space-y-2">
              <Progress value={timer.progress} className="h-3" />
              <div className="text-sm text-muted-foreground">
                Overall progress
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2 justify-center">
            {!timer.isActive ? (
              <Button onClick={timer.startWalk} size="lg" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Walk
              </Button>
            ) : (
              <>
                <Button 
                  onClick={timer.pauseWalk} 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {timer.currentPhase === 'paused' ? 
                    <><Play className="h-4 w-4" /> Resume</> : 
                    <><Pause className="h-4 w-4" /> Pause</>
                  }
                </Button>
                <Button 
                  onClick={timer.stopWalk} 
                  variant="destructive" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Walking Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Japanese Walking Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>• <strong>3 minutes fast:</strong> Brisk pace, slightly out of breath</p>
            <p>• <strong>3 minutes slow:</strong> Comfortable pace, easy breathing</p>
            <p>• Repeat this pattern for the entire duration</p>
            {canUseFeatures() && (
              <p className="text-muted-foreground mt-3">
                Audio cues will guide you through each phase change.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalkTimer;