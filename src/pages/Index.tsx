import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/components/LogoIcon";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <LogoIcon className="h-12 w-12" />
          <h1 className="text-4xl font-bold text-foreground">Finanz</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mb-8">
          Gestiona tus gastos mensuales de forma simple 
        </p>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
            onClick={() => navigate('/auth')}
          >
            Comenzar 
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Ver Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;