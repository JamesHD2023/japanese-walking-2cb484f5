import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBackgroundTimer } from '@/hooks/useBackgroundTimer';

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
}

export const useWalkTimer = ({ durationMinutes }: UseWalkTimerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentPhase, setCurrentPhase] = useState<WalkPhase>('stopped');
  const [intervalsCompleted, setIntervalsCompleted] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create audio context and handle user interaction
  useEffect(() => {
    let cleanupListeners: (() => void) | undefined;

    const initializeAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Add user interaction handler for mobile audio context activation
        const handleUserInteraction = async () => {
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
            console.log('Audio context resumed after user interaction');
          }
        };

        // Listen for user interactions to activate audio context
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('click', handleUserInteraction);
        
        cleanupListeners = () => {
          document.removeEventListener('touchstart', handleUserInteraction);
          document.removeEventListener('click', handleUserInteraction);
        };
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initializeAudio();

    return () => {
      if (cleanupListeners) cleanupListeners();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio cue functions
  const playBeep = useCallback(async (frequency: number = 800, duration: number = 200) => {
    if (!audioContextRef.current) return;

    try {
      // Resume audio context if suspended (important for mobile background)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Ensure audio context is running
      if (audioContextRef.current.state !== 'running') {
        console.log('Audio context not running, trying to resume...');
        await audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(8.0, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
      
      console.log(`Played beep at ${frequency}Hz for ${duration}ms`);
    } catch (error) {
      console.error('Failed to play beep:', error);
    }
  }, []);


  const triggerHaptic = useCallback((pattern: number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
      console.log(`Triggered haptic pattern: [${pattern.join(', ')}]`);
    } else {
      console.log('Haptic feedback not supported');
    }
  }, []);

  const playPhaseTransition = useCallback((phase: WalkPhase) => {
    if (phase === 'fast') {
      // Triple beeps for fast phase
      playBeep(1000, 150);
      setTimeout(() => playBeep(1000, 150), 200);
      setTimeout(() => playBeep(1000, 150), 400);
      // Strong haptic for fast phase - three strong vibrations
      triggerHaptic([400, 100, 400, 100, 400]);
    } else if (phase === 'slow') {
      // Triple beeps for slow phase
      playBeep(600, 200);
      setTimeout(() => playBeep(600, 200), 250);
      setTimeout(() => playBeep(600, 200), 500);
      // Strong haptic for slow phase - three long vibrations
      triggerHaptic([500, 150, 500, 150, 500]);
    }
  }, [playBeep, triggerHaptic]);

  // Track last phase transition to prevent duplicates
  const lastPhaseTransitionRef = useRef<number>(-1);

  // Handle timer tick with phase transitions
  const handleTimerTick = useCallback((timeElapsed: number) => {
    const totalDuration = durationMinutes * 60;

    // Check if walk is complete
    if (timeElapsed >= totalDuration) {
      // Complete the walk
      if (sessionId) {
        supabase
          .from('walk_sessions')
          .update({
            completed_at: new Date().toISOString(),
            intervals_completed: intervalsCompleted,
            is_completed: true,
          })
          .eq('id', sessionId);

        toast({
          title: "Walk completed!",
          description: `Congratulations! You completed your ${durationMinutes} minute walk.`,
        });
      }
      
      setCurrentPhase('stopped');
      setSessionId(null);
      return;
    }

    // Check for phase transitions (every 3 minutes = 180 seconds)
    const currentInterval = Math.floor(timeElapsed / 180);
    const phaseTransitionTime = currentInterval * 180;
    
    // Only trigger phase transition once per interval and prevent duplicates
    if (timeElapsed >= phaseTransitionTime && 
        timeElapsed > 0 && 
        lastPhaseTransitionRef.current !== currentInterval) {
      
      const nextPhase = currentInterval % 2 === 0 ? 'fast' : 'slow';
      
      // Only transition if we're not paused
      if (currentPhase !== 'paused') {
        console.log(`Phase transition at ${timeElapsed}s (interval ${currentInterval}): -> ${nextPhase}`);
        setCurrentPhase(nextPhase);
        playPhaseTransition(nextPhase);
        lastPhaseTransitionRef.current = currentInterval;
        
        if (nextPhase === 'fast') {
          setIntervalsCompleted(Math.floor(currentInterval / 2));
        }
      }
    }
  }, [durationMinutes, playPhaseTransition, sessionId, intervalsCompleted, toast, currentPhase]);

  const backgroundTimer = useBackgroundTimer({
    onTick: handleTimerTick,
    isActive: currentPhase === 'fast' || currentPhase === 'slow'
  });

  // Stop walk function
  const stopWalk = useCallback(async () => {
    if (!sessionId) return;

    try {
      const isCompleted = backgroundTimer.timeElapsed >= durationMinutes * 60;
      
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
      backgroundTimer.stop();

      toast({
        title: isCompleted ? "Walk completed!" : "Walk stopped",
        description: isCompleted 
          ? `Congratulations! You completed your ${durationMinutes} minute walk.`
          : `Walk session ended after ${Math.floor(backgroundTimer.timeElapsed / 60)} minutes.`,
      });

    } catch (error) {
      console.error('Failed to stop walk session:', error);
    }
  }, [sessionId, durationMinutes, intervalsCompleted, toast, backgroundTimer]);


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
      setIntervalsCompleted(0);
      setCurrentPhase('fast');
      
      // Start the background timer
      backgroundTimer.start();
      
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
  }, [user, durationMinutes, playPhaseTransition, toast, backgroundTimer]);

  // Pause/resume walk
  const pauseWalk = useCallback(() => {
    if (currentPhase === 'paused') {
      const phaseTime = backgroundTimer.timeElapsed % 360;
      const nextPhase = phaseTime < 180 ? 'fast' : 'slow';
      setCurrentPhase(nextPhase);
      backgroundTimer.resume();
    } else {
      setCurrentPhase('paused');
      backgroundTimer.pause();
    }
  }, [currentPhase, backgroundTimer]);

  const timeRemaining = Math.max(0, (durationMinutes * 60) - backgroundTimer.timeElapsed);
  const progress = (backgroundTimer.timeElapsed / (durationMinutes * 60)) * 100;
  const currentPhaseTime = backgroundTimer.timeElapsed % 180; // Time in current 3-minute phase
  const phaseProgress = (currentPhaseTime / 180) * 100;

  return {
    timeElapsed: backgroundTimer.timeElapsed,
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