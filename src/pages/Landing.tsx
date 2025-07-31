import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

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

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Japanese Walking</h1>
          <p className="text-lg text-muted-foreground">Keep Moving - Stay Healthy</p>
        </div>

        {/* Learn More Button */}
        <Button 
          onClick={() => navigate('/about')}
          className="w-full max-w-xs mx-auto"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default Landing;