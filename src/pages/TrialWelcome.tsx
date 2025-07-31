import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TrialWelcome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="px-5">
          <img 
            src="/lovable-uploads/41e5b279-c040-43ff-b859-7dd480f9a1bc.png" 
            alt="Japanese Walking Logo" 
            className="w-full"
          />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Welcome!</h1>
          <p className="text-lg text-muted-foreground">Your 5-day free trial has started</p>
        </div>

        {/* Trial Info Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <p className="text-muted-foreground">Days of full access</p>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ All timer options (15, 30, 45, 60 minutes)</p>
              <p>✓ Walking history and progress tracking</p>
              <p>✓ Audio cues every 3 minutes</p>
              <p>✓ Personal best tracking</p>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <Button 
          onClick={() => navigate('/dashboard')}
          className="w-full max-w-xs mx-auto"
          size="lg"
        >
          Start My First Walk
        </Button>
      </div>
    </div>
  );
};

export default TrialWelcome;