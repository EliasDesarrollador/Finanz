import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Shield, 
  Smartphone, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

const Index = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Análisis Visual",
      description: "Visualiza tus gastos con gráficos interactivos y reportes detallados"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Seguimiento Inteligente",
      description: "Monitorea tendencias y recibe alertas personalizadas sobre tus finanzas"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Totalmente Seguro",
      description: "Tus datos están protegidos con encriptación de nivel bancario"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Multi-dispositivo",
      description: "Accede desde cualquier dispositivo con sincronización en tiempo real"
    }
  ];

  const benefits = [
    "Control total de tus gastos mensuales",
    "Categorización automática de transacciones",
    "Metas de ahorro personalizables",
    "Reportes detallados y exportables",
    "Sincronización en la nube"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">ExpenseTracker</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Características</a>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Iniciar Sesión
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-primary hover:opacity-90 transition-smooth"
                onClick={() => navigate('/auth')}
              >
                Comenzar Gratis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="Financial Dashboard" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Controla tus
              <span className="block text-primary-glow">gastos mensuales</span>
              como nunca antes
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              La aplicación más intuitiva para gestionar tus finanzas personales. 
              Visualiza, analiza y optimiza tus gastos con herramientas inteligentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur"
              />
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 transition-smooth w-full sm:w-auto whitespace-nowrap"
                onClick={() => navigate('/auth')}
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              ✨ 100% Gratuito • Sin tarjeta de crédito • Sin límites
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas para gestionar tus finanzas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas poderosas e intuitivas diseñadas para simplificar el control de tus gastos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4 text-accent-foreground">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                ¿Por qué elegir ExpenseTracker?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-smooth"
                onClick={() => navigate('/auth')}
              >
                Empezar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 bg-gradient-card shadow-elegant">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-card-foreground">Resumen Mensual</h3>
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ingresos</span>
                    <span className="font-semibold text-primary">$3,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gastos</span>
                    <span className="font-semibold text-destructive">-$2,850</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-card-foreground">Balance</span>
                    <span className="font-bold text-lg text-primary">$650</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-accent/20 rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    📊 Has ahorrado un 23% más que el mes pasado
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Únete a miles de usuarios que ya están optimizando sus gastos de forma completamente gratuita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 transition-smooth"
              onClick={() => navigate('/auth')}
            >
              Comenzar Gratis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 transition-smooth"
              onClick={() => navigate('/dashboard')}
            >
              Ver demo en vivo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">ExpenseTracker</span>
            </div>
            <p className="text-muted-foreground mb-4">
              La manera más inteligente de gestionar tus gastos mensuales
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">Privacidad</a>
              <a href="#" className="hover:text-primary transition-smooth">Términos</a>
              <a href="#" className="hover:text-primary transition-smooth">Soporte</a>
              <a href="#" className="hover:text-primary transition-smooth">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;