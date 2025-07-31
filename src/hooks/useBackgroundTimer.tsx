import { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

interface UseBackgroundTimerProps {
  onTick: (timeElapsed: number) => void;
  isActive: boolean;
}

export const useBackgroundTimer = ({ onTick, isActive }: UseBackgroundTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Request wake lock for native app
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (error) {
      console.error('Failed to request wake lock:', error);
    }
  }, []);

  // Release wake lock
  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  // Handle visibility change for background processing
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // App went to background - store current time
      if (startTimeRef.current && isActive) {
        pausedTimeRef.current = Date.now() - startTimeRef.current;
      }
    } else {
      // App came to foreground - recalculate time and trigger any missed callbacks
      if (startTimeRef.current && isActive) {
        const now = Date.now();
        const timeSinceStart = now - startTimeRef.current;
        const newElapsed = Math.floor(timeSinceStart / 1000);
        const oldElapsed = timeElapsed;
        
        setTimeElapsed(newElapsed);
        
        // Check if we need to trigger callbacks for missed seconds while backgrounded
        if (newElapsed > oldElapsed) {
          // Trigger onTick for any missed intervals while we were backgrounded
          for (let i = oldElapsed + 1; i <= newElapsed; i++) {
            onTick(i);
          }
        }
      }
    }
  }, [isActive, onTick, timeElapsed]);

  // Start timer
  const start = useCallback(() => {
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    requestWakeLock();
  }, [requestWakeLock]);

  // Stop timer
  const stop = useCallback(() => {
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    setTimeElapsed(0);
    releaseWakeLock();
  }, [releaseWakeLock]);

  // Pause timer
  const pause = useCallback(() => {
    if (startTimeRef.current) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
    }
  }, []);

  // Resume timer
  const resume = useCallback(() => {
    if (pausedTimeRef.current > 0) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
    }
  }, []);

  // Main timer effect
  useEffect(() => {
    if (isActive && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current!) / 1000);
        setTimeElapsed(elapsed);
        onTick(elapsed);
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
  }, [isActive, onTick]);

  // Handle page visibility changes
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle app lifecycle events for mobile
    if (Capacitor.isNativePlatform()) {
      document.addEventListener('pause', handleVisibilityChange);
      document.addEventListener('resume', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (Capacitor.isNativePlatform()) {
        document.removeEventListener('pause', handleVisibilityChange);
        document.removeEventListener('resume', handleVisibilityChange);
      }
    };
  }, [handleVisibilityChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [releaseWakeLock]);

  return {
    timeElapsed,
    start,
    stop,
    pause,
    resume,
  };
};