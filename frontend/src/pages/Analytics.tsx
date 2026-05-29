import { useAuth } from "../lib/auth";
import {
  getSentimentBreakdown,
  getWeeklySentimentTrend,
  getTagDistribution,
  getLeaderboard,
  getVibes,
  getPulses
} from "../lib/mockData";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import {
  TrendingUp,
  Heart,
  MessageSquare,
  Smile,
  Trophy,
  Download,
  ShieldAlert
} from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Analytics() {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") return <Navigate to="/feed" replace />;

  const sentiment = getSentimentBreakdown();
  const trend = getWeeklySentimentTrend();
  const tags = getTagDistribution();
  const leaderboard = getLeaderboard();
  const totalVibes = getVibes().length;
  const totalPulses = getPulses().length;

  const kpis = [
    { label: "Sentimento positivo", value: `${sentiment.positive}%`, delta: "+8%", icon: Smile, color: "emerald" },
    { label: "Vibes este mês", value: totalVibes.toString(), delta: "+24%", icon: Heart, color: "rose" },
    { label: "Respostas Pulse", value: totalPulses.toString(), delta: "+12%", icon: MessageSquare, color: "brand" },
    { label: "Loop fechado", value: "87%", delta: "+5%", icon: TrendingUp, color: "amber" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">
            Visão agregada e anónima do engagement organizacional.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          const bgMap: Record<string, string> = {
            emerald: "bg-emerald-50 text-emerald-600",
            rose: "bg-rose-50 text-rose-600",
            brand: "bg-brand-50 text-brand-600",
            amber: "bg-amber-50 text-amber-600"
          };
          return (
            <Card key={k.label}>
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bgMap[k.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <Badge variant="success">{k.delta}</Badge>
              </div>
              <p className="text-2xl font-bold mt-3">{k.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sentiment trend */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Evolução do sentimento</h3>
              <p className="text-xs text-slate-500 mt-0.5">Últimas 8 semanas · score médio</p>
            </div>
            <Badge variant="brand">Anónimo (≥5 respostas)</Badge>
          </div>
          <div className="flex items-end gap-2 h-44">
            {trend.map((t) => (
              <div key={t.week} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-md transition-all"
                    style={{ height: `${t.score}%` }}
                    title={`${t.score}%`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{t.week}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sentiment breakdown */}
        <Card>
          <h3 className="font-semibold mb-1">Distribuição atual</h3>
          <p className="text-xs text-slate-500 mb-4">Período corrente</p>
          <div className="space-y-3">
            {[
              { label: "Positivo", value: sentiment.positive, color: "bg-emerald-500" },
              { label: "Neutro", value: sentiment.neutral, color: "bg-slate-400" },
              { label: "Negativo", value: sentiment.negative, color: "bg-rose-500" }
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{s.label}</span>
                  <span className="font-semibold text-slate-900">{s.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Os scores são apresentados apenas se houver no mínimo 5 respostas para prevenir reidentificação.</p>
          </div>
        </Card>

        {/* Top tags */}
        <Card>
          <h3 className="font-semibold mb-1">Top valores reconhecidos</h3>
          <p className="text-xs text-slate-500 mb-4">Frequência em Vibes</p>
          <div className="space-y-3">
            {tags.slice(0, 6).map((t, i) => {
              const max = tags[0]?.count || 1;
              const pct = Math.round((t.count / max) * 100);
              return (
                <div key={t.tag}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">
                      <span className="text-slate-400 mr-1.5">#{i + 1}</span>
                      {t.tag}
                    </span>
                    <span className="font-semibold text-slate-900">{t.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold">Leaderboard mensal</h3>
          </div>
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "bg-amber-100 text-amber-700" :
                  i === 1 ? "bg-slate-200 text-slate-700" :
                  i === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-slate-50 text-slate-500"
                }`}>
                  {i + 1}
                </div>
                <Avatar name={entry.user.name} color={entry.user.avatarColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{entry.user.department}</p>
                </div>
                <span className="text-sm font-bold text-brand-700">{entry.points} pts</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}