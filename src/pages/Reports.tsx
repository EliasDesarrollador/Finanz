import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoIcon from "@/components/LogoIcon";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

// Base URL del backend. Configurable mediante variable de entorno de Vite.
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || '';

type Expense = {
  id: number;
  userId: number;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
};

const todayStr = () => new Date().toISOString().split('T')[0];
const firstDayOfMonthStr = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
};

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<{ id?: number; name?: string; email?: string } | null>(null);
  const [from, setFrom] = useState<string>(firstDayOfMonthStr());
  const [to, setTo] = useState<string>(todayStr());
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('et_user');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const total = useMemo(() => expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0), [expenses]);

  const handleGenerate = async () => {
    if (!user || !user.id) {
      toast({ title: 'Sesión requerida', description: 'Inicia sesión para ver reportes', variant: 'destructive' });
      return;
    }
    if (!from || !to) {
      toast({ title: 'Rango inválido', description: 'Indica fecha inicio y final', variant: 'destructive' });
      return;
    }
    if (from > to) {
      toast({ title: 'Rango inválido', description: 'La fecha inicio no puede ser mayor que la final', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const url = new URL(`${API_BASE}/api/expenses`, window.location.origin);
      url.searchParams.set('userId', String(user.id));
      if (from) url.searchParams.set('from', from);
      if (to) url.searchParams.set('to', to);

      const res = await fetch(url.toString().replace(window.location.origin, ''));
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Error generando reporte');
      }
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo generar el reporte', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-smooth" onClick={() => navigate('/') }>
              <LogoIcon className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">Finanz</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de filtros */}
          <Card className="p-6 bg-gradient-card shadow-card">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Reportes por Fecha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">Fecha Inicio</Label>
                <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="to">Fecha Final</Label>
                <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleGenerate} disabled={loading} className="bg-gradient-primary hover:opacity-90 transition-smooth">
                {loading ? 'Generando…' : 'Generar Reporte'}
              </Button>
            </div>
          </Card>

          {/* Resultados */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Resultados</h3>
                <div className="text-sm text-muted-foreground">{from} — {to}</div>
              </div>

              <div className="flex items-center justify-between border rounded-md p-3 bg-background mb-4">
                <span className="text-sm text-muted-foreground">Total Gastos</span>
                <span className="font-semibold text-destructive">-{formatCurrency(total)}</span>
              </div>

              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay gastos en el rango seleccionado.</p>
              ) : (
                <div className="space-y-3">
                  {expenses.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">{e.description}</p>
                        <p className="text-xs text-muted-foreground">{e.category} • {e.date}</p>
                      </div>
                      <span className="font-semibold text-destructive">-{formatCurrency(Number(e.amount))}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
