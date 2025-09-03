import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  Calendar,
  Filter,
  Download,
  CreditCard,
  Home,
  Car,
  ShoppingBag,
  Coffee,
  Gamepad2,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";

// URL base del backend empleada para consultar y persistir gastos y recuperar sesión
const API_BASE = import.meta.env.VITE_API_BASE || 'http://192.168.43.74:3000';

const Dashboard = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  // Estado del usuario autenticado (se restaura desde localStorage en useEffect)
  const [user, setUser] = useState<{ id?: number; name?: string; email?: string } | null>(null);

  // Estado principal de gastos en memoria (se llena desde la API si hay usuario con id)
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 850, category: "rent", description: "Alquiler mensual", date: "2024-01-15", icon: <Home className="h-4 w-4" /> },
    { id: 2, amount: 320, category: "food", description: "Supermercado semanal", date: "2024-01-14", icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 3, amount: 180, category: "transport", description: "Gasolina y mantenimiento", date: "2024-01-13", icon: <Car className="h-4 w-4" /> },
    { id: 4, amount: 95, category: "entertainment", description: "Suscripciones streaming", date: "2024-01-12", icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 5, amount: 45, category: "food", description: "Café y desayunos", date: "2024-01-11", icon: <Coffee className="h-4 w-4" /> }
  ]);
  // Estado del modal de presupuesto y del valor temporal a guardar
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState("");

  const categories = [
    { value: "rent", label: "Vivienda", icon: <Home className="h-4 w-4" />, color: "bg-chart-1" },
    { value: "food", label: "Alimentación", icon: <ShoppingBag className="h-4 w-4" />, color: "bg-chart-2" },
    { value: "transport", label: "Transporte", icon: <Car className="h-4 w-4" />, color: "bg-chart-3" },
    { value: "entertainment", label: "Entretenimiento", icon: <Gamepad2 className="h-4 w-4" />, color: "bg-chart-4" },
    { value: "other", label: "Otros", icon: <MoreHorizontal className="h-4 w-4" />, color: "bg-chart-5" }
  ];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  // Presupuesto mensual actual (persistido por usuario en localStorage)
  const [monthlyBudget, setMonthlyBudget] = useState(2500);
  const remaining = monthlyBudget - totalExpenses;

  // Carga inicial: restaura usuario, presupuesto por usuario y sincroniza gastos desde la API
  useEffect(() => {
    try {
      const raw = localStorage.getItem('et_user');
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
        const budgetKey = `et_budget_${u.id || u.email || 'default'}`;
        const savedBudget = localStorage.getItem(budgetKey);
        if (savedBudget && !Number.isNaN(Number(savedBudget))) {
          setMonthlyBudget(Number(savedBudget));
        }
        if (u && u.id) {
          fetch(`${API_BASE}/api/expenses?userId=${u.id}`)
            .then(r => r.json())
            .then(data => {
              if (Array.isArray(data.expenses)) {
                setExpenses(data.expenses.map((e: any) => ({
                  id: e.id,
                  amount: Number(e.amount),
                  category: e.category,
                  description: e.description,
                  date: e.date,
                  icon: undefined,
                })));
              }
            })
            .catch(() => {});
        }
      }
    } catch {}
  }, []);

  // Agregar un gasto: valida, crea objeto y persiste en la API si hay usuario con id
  const handleAddExpense = async () => {
    const amountNumber = Number(newExpense.amount);
    if (
      !newExpense.amount ||
      Number.isNaN(amountNumber) ||
      amountNumber <= 0 ||
      !newExpense.category ||
      !newExpense.description
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos con datos válidos",
        variant: "destructive"
      });
      return;
    }

    const categoryInfo = getCategoryInfo(newExpense.category);
    const nextId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;

    const expenseToAdd = {
      id: nextId,
      amount: amountNumber,
      category: newExpense.category,
      description: newExpense.description,
      date: newExpense.date,
      icon: categoryInfo.icon
    };

    if (user && user.id) {
      try {
        const res = await fetch(`${API_BASE}/api/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            amount: amountNumber,
            category: newExpense.category,
            description: newExpense.description,
            date: newExpense.date,
          })
        });
        const data = await res.json();
        if (res.ok && data && data.expense) {
          setExpenses(prev => [{ ...expenseToAdd, id: data.expense.id }, ...prev]);
        } else {
          setExpenses(prev => [expenseToAdd, ...prev]);
        }
      } catch {
        setExpenses(prev => [expenseToAdd, ...prev]);
      }
    } else {
      setExpenses(prev => [expenseToAdd, ...prev]);
    }

    toast({
      title: "¡Gasto agregado!",
      description: `Se agregó el gasto de ${formatCurrency(amountNumber)}`,
    });

    setNewExpense({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpense(false);
  };

  // Abre el modal de presupuesto precargando el valor actual
  const handleOpenBudget = () => {
    setNewBudget(monthlyBudget.toString());
    setShowBudgetModal(true);
  };

  // Guarda el presupuesto (valida y persiste por usuario en localStorage)
  const handleSaveBudget = () => {
    const amountNumber = Number(newBudget);
    if (!newBudget || Number.isNaN(amountNumber) || amountNumber <= 0) {
      toast({
        title: "Error",
        description: "Ingresa un presupuesto válido mayor a 0",
        variant: "destructive"
      });
      return;
    }
    // Validación extra: no permitir presupuesto menor al total de gastos actuales
    if (amountNumber < totalExpenses) {
      toast({
        title: "Error",
        description: `El presupuesto no puede ser menor a tus gastos actuales (${formatCurrency(totalExpenses)})`,
        variant: "destructive"
      });
      return;
    }
    setMonthlyBudget(amountNumber);
    try {
      const raw = localStorage.getItem('et_user');
      const u = raw ? JSON.parse(raw) : null;
      const budgetKey = `et_budget_${(u && (u.id || u.email)) || 'default'}`;
      localStorage.setItem(budgetKey, String(amountNumber));
    } catch {}
    setShowBudgetModal(false);
    toast({
      title: "Presupuesto actualizado",
      description: `Nuevo presupuesto: ${formatCurrency(amountNumber)}`,
    });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-smooth"
              onClick={() => navigate('/')}
            >
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">ExpenseTracker</span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Saludo al usuario logueado */}
              {user && (user.name || user.email) && (
                <span className="text-sm text-muted-foreground">Hola, {user.name || user.email}</span>
              )}
              <Button
                onClick={() => setShowAddExpense(true)}
                className="bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Gasto
              </Button>
              <Button variant="outline" onClick={handleOpenBudget}>
                <CreditCard className="h-4 w-4 mr-2" />
                Presupuesto
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gastos del Mes</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-full">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Presupuesto</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(monthlyBudget)}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Restante</p>
                <p className={`text-2xl font-bold ${remaining > 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatCurrency(remaining)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${remaining > 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                <TrendingUp className={`h-6 w-6 ${remaining > 0 ? 'text-primary' : 'text-destructive'}`} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Expenses */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Gastos Recientes</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {expenses.map((expense) => {
                  const categoryInfo = getCategoryInfo(expense.category);
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-4 bg-accent/20 rounded-lg hover:bg-accent/30 transition-smooth">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${categoryInfo.color}/20`}>
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">{categoryInfo.label} • {expense.date}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-destructive">-{formatCurrency(expense.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Categories Summary */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Categorías</h3>
              <div className="space-y-3">
                {categories.slice(0, 4).map((category) => {
                  const categoryExpenses = expenses
                    .filter(expense => expense.category === category.value)
                    .reduce((sum, expense) => sum + expense.amount, 0);
                  const percentage = totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0;
                  
                  return (
                    <div key={category.value} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span className="text-sm text-card-foreground">{category.label}</span>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {formatCurrency(categoryExpenses)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Análisis Detallado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ve gráficos detallados de tus gastos
                </p>
                <Button variant="outline" className="w-full">
                  Ver Reportes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-gradient-card animate-bounce-in">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">Agregar Nuevo Gasto</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  placeholder="Descripción del gasto"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddExpense(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
                onClick={handleAddExpense}
              >
                Agregar
              </Button>
            </div>
          </Card>
        </div>
      )}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-gradient-card animate-bounce-in">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">Configurar Presupuesto</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="budget">Monto del presupuesto</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBudgetModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
                onClick={handleSaveBudget}
              >
                Guardar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;