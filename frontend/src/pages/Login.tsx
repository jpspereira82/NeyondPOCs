import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, Role } from "../lib/auth";
import { Sparkles, Mail, Lock, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@neyond.pt");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role>("MEMBER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      navigate("/feed");
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl">Vybe</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Reconhecimento que liga equipas.
          </h1>
          <p className="text-lg text-brand-100 leading-relaxed">
            Good Vibes, Pulse Check-in com IA e recompensas — tudo num espaço para celebrar quem faz a diferença.
          </p>
          <div className="space-y-3 pt-4">
            {[
              "Sentimento organizacional em tempo real",
              "Reconhecimento entre pares sem fricção",
              "Loop fechado de feedback com a liderança"
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-brand-50">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-brand-200">
          © 2026 Neyond · Confidencial
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Vybe</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
          <p className="text-sm text-slate-600 mt-1">Inicia sessão para aceder ao teu workspace.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="exemplo@empresa.pt"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Iniciar sessão como</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("MEMBER")}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                    role === "MEMBER"
                      ? "bg-brand-50 border-brand-500 text-brand-700"
                      : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  👤 Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                    role === "ADMIN"
                      ? "bg-brand-50 border-brand-500 text-brand-700"
                      : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
              <p className="text-xs text-slate-500">Demo: alterna entre perfis para veres ecrãs distintos.</p>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Entrar
            </Button>
          </form>

          <p className="text-xs text-center text-slate-500 mt-8">
            POC de demonstração — qualquer credencial é aceite.
          </p>
        </div>
      </div>
    </div>
  );
}