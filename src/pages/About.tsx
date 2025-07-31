import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Brain, Zap, Clock } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">About Japanese Walking</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Scientific Foundation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Scientific Foundation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Developed by:</strong> Japanese researchers Hiroshi Nose and Shizue Masuki at Shinshu University Graduate School of Medicine</p>
            <p><strong>Research scale:</strong> Over 5,000 people in a joint research study published in Mayo Clinic Proceedings</p>
            <p>This method, known as Interval Walking Training (IWT), has been proven superior to traditional continuous walking in multiple clinical studies.</p>
          </CardContent>
        </Card>

        {/* The Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              The Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">3 min</div>
                <div className="text-sm text-red-600 dark:text-red-400">Fast Walking</div>
                <div className="text-xs text-muted-foreground mt-1">≥70% max intensity</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3 min</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Slow Walking</div>
                <div className="text-xs text-muted-foreground mt-1">≤40% max intensity</div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Repeat 5 times • 4+ days per week<br />
              30 total minutes per session
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Proven Health Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-foreground">Cardiovascular</div>
                  <div className="text-muted-foreground">9% rise in peak oxygen</div>
                  <div className="text-muted-foreground">improved blood pressure</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Physical Strength</div>
                  <div className="text-muted-foreground">13-17% muscle strength</div>
                  <div className="text-muted-foreground">improvement</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-foreground">Mental Health</div>
                  <div className="text-muted-foreground">improved sleep quality</div>
                  <div className="text-muted-foreground">enhanced mood</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Disease Prevention</div>
                  <div className="text-muted-foreground">1% reduction in lifestyle</div>
                  <div className="text-muted-foreground">related disease risk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Roots */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Cultural Roots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Japanese walking connects to <strong>Forest Bathing (Shinrin-yoku)</strong> - Japan's mindful walking practice that emphasizes slow, intentional movement and awareness and sensory connection with nature.</p>
            <p>During the slower intervals, you can incorporate mindfulness techniques - engaging all five senses and staying present to enhance both mental and physical well-being.</p>
          </CardContent>
        </Card>

        {/* Key Research Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Key Research Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong>Mayo Clinic Study (2007):</strong> 246 participants showed an 8% increase in aerobic capacity and significant blood pressure improvements over 5 months.
            </div>
            <div>
              <strong>Follow-up Study (2018):</strong> 679 participants demonstrated 14% average increase in fitness and 17% reduction in lifestyle disease risk.
            </div>
            <div>
              <strong>Safety Profile:</strong> 94% adherence rate with no exercise-related injuries reported for all ages and fitness levels.
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button 
          onClick={() => navigate('/auth')}
          className="w-full"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default About;