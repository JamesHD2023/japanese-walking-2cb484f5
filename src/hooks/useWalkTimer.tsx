import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type WalkPhase = 'fast' | 'slow' | 'paused' | 'stopped';

interface WalkSession {
  id?: string;
  duration_minutes: number;
  intervals_completed: number;
  started_at: string;
  completed_at?: string;
  is_completed: boolean;
}

interface UseWalkTimerProps {
  durationMinutes: number;
  audioPreference: 'beep' | 'voice';
}

export const useWalkTimer = ({ durationMinutes, audioPreference }: UseWalkTimerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [timeElapsed, setTimeElapsed] = useState(0); // seconds
  const [currentPhase, setCurrentPhase] = useState<WalkPhase>('stopped');
  const [intervalsCompleted, setIntervalsCompleted] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Create audio context and wake lock
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initializeAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Request wake lock when timer starts
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (error) {
      console.error('Failed to request wake lock:', error);
    }
  };

  // Release wake lock
  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  // Audio cue functions
  const playBeep = useCallback((frequency: number = 800, duration: number = 200) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, []);

  const playVoiceCue = useCallback((message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const playPhaseTransition = useCallback((phase: WalkPhase) => {
    if (audioPreference === 'beep') {
      if (phase === 'fast') {
        // Two quick beeps for fast phase
        playBeep(1000, 150);
        setTimeout(() => playBeep(1000, 150), 200);
      } else if (phase === 'slow') {
        // One low beep for slow phase
        playBeep(600, 300);
      }
    } else if (audioPreference === 'voice') {
      if (phase === 'fast') {
        playVoiceCue('Walk fast');
      } else if (phase === 'slow') {
        playVoiceCue('Walk slow');
      }
    }
  }, [audioPreference, playBeep, playVoiceCue]);

  // Start walk session
  const startWalk = useCallback(async () => {
    if (!user) return;

    try {
      // Create session in database
      const { data, error } = await supabase
        .from('walk_sessions')
        .insert({
          user_id: user.id,
          duration_minutes: durationMinutes,
          intervals_completed: 0,
          started_at: new Date().toISOString(),
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setTimeElapsed(0);
      setIntervalsCompleted(0);
      setCurrentPhase('fast');
      
      // Request wake lock
      await requestWakeLock();
      
      // Start with fast phase
      playPhaseTransition('fast');
      
      toast({
        title: "Walk started!",
        description: `${durationMinutes} minute walk session has begun.`,
      });

    } catch (error) {
      console.error('Failed to start walk session:', error);
      toast({
        title: "Error",
        description: "Failed to start walk session. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, durationMinutes, playPhaseTransition, toast]);

  // Pause/resume walk
  const pauseWalk = useCallback(() => {
    if (currentPhase === 'paused') {
      setCurrentPhase(timeElapsed % 360 < 180 ? 'fast' : 'slow'); // 3 min = 180 sec
    } else {
      setCurrentPhase('paused');
    }
  }, [currentPhase, timeElapsed]);

  // Stop walk
  const stopWalk = useCallback(async () => {
    if (!sessionId) return;

    try {
      const isCompleted = timeElapsed >= durationMinutes * 60;
      
      await supabase
        .from('walk_sessions')
        .update({
          completed_at: new Date().toISOString(),
          intervals_completed: intervalsCompleted,
          is_completed: isCompleted,
        })
        .eq('id', sessionId);

      setCurrentPhase('stopped');
      setSessionId(null);
      releaseWakeLock();

      toast({
        title: isCompleted ? "Walk completed!" : "Walk stopped",
        description: isCompleted 
          ? `Congratulations! You completed your ${durationMinutes} minute walk.`
          : `Walk session ended after ${Math.floor(timeElapsed / 60)} minutes.`,
      });

    } catch (error) {
      console.error('Failed to stop walk session:', error);
    }
  }, [sessionId, timeElapsed, durationMinutes, intervalsCompleted, toast]);

  // Timer effect
  useEffect(() => {
    if (currentPhase === 'fast' || currentPhase === 'slow') {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          const totalDuration = durationMinutes * 60;

          // Check if walk is complete
          if (newTime >= totalDuration) {
            stopWalk();
            return prev;
          }

          // Check for phase transitions (every 3 minutes = 180 seconds)
          const phaseTime = newTime % 180;
          const currentInterval = Math.floor(newTime / 180);

          // Phase transition at start of each 3-minute interval
          if (phaseTime === 0 && newTime > 0) {
            const nextPhase = currentInterval % 2 === 0 ? 'fast' : 'slow';
            setCurrentPhase(nextPhase);
            playPhaseTransition(nextPhase);
            
            if (nextPhase === 'fast') {
              setIntervalsCompleted(Math.floor(currentInterval / 2));
            }
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentPhase, durationMinutes, playPhaseTransition, stopWalk]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const timeRemaining = Math.max(0, (durationMinutes * 60) - timeElapsed);
  const progress = (timeElapsed / (durationMinutes * 60)) * 100;
  const currentPhaseTime = timeElapsed % 180; // Time in current 3-minute phase
  const phaseProgress = (currentPhaseTime / 180) * 100;

  return {
    timeElapsed,
    timeRemaining,
    currentPhase,
    intervalsCompleted,
    progress,
    phaseProgress,
    startWalk,
    pauseWalk,
    stopWalk,
    isActive: currentPhase !== 'stopped',
  };
};