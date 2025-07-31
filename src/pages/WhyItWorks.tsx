import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const WhyItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="px-5">
          <img 
            src="/lovable-uploads/41e5b279-c040-43ff-b859-7dd480f9a1bc.png" 
            alt="Japanese Walking Logo" 
            className="w-full"
          />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Why It Works</h1>
          <p className="text-lg text-muted-foreground">The Science Behind Japanese Walking</p>
        </div>

        {/* Benefits Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">❤️ Heart Health</h3>
              <p className="text-muted-foreground">Regular interval walking strengthens your cardiovascular system and improves circulation.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">⚡ Energy Boost</h3>
              <p className="text-muted-foreground">Short bursts of activity increase your energy levels throughout the day.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">🧠 Mental Clarity</h3>
              <p className="text-muted-foreground">Walking intervals improve focus and reduce stress naturally.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">📊 Proven Results</h3>
              <p className="text-muted-foreground">Research shows 30 minutes of Japanese walking daily can transform your health.</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Back to Welcome
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhyItWorks;