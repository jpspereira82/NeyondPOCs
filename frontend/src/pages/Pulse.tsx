import { useState } from "react";
import { useAuth } from "../lib/auth";
import { getPulses, submitPulse, hasRespondedThisWeek } from "../lib/mockData";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Textarea } from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Activity, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

const MOODS = [
  { value: 1, emoji: "😞", label: "Difícil" },
  { value: 2, emoji: "😕", label: "Baixo" },
  { value: 3, emoji: "😐", label: "OK" },
  { value: 4, emoji: "🙂", label: "Bom" },
  { value: 5, emoji: "🤩", label: "Excelente" }
];

export default function Pulse() {
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(hasRespondedThisWeek());
  const [loading, setLoading] = useState(false);
  const history = getPulses();

  const handleSubmit = () => {
    if (mood === null) return;
    setLoading(true);
    setTimeout(() => {
      submitPulse(mood, comment || undefined);
      setSubmitted(true);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-5 h-5 text-brand-600" />
        <h1 className="text-2xl font-bold tracking-tight">Pulse Check-in semanal</h1>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Resposta anónima — a tua identidade não fica associada à submissão.
      </p>

      {submitted ? (
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Obrigado pela tua resposta!</h3>
              <p className="text-sm text-emerald-700 mt-1">
                A tua submissão foi registada de forma anónima e contribuiu para o sentimento agregado desta semana.
              </p>
              {user?.role === "MEMBER" && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  +15 pontos creditados
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <h2 className="text-base font-semibold mb-1">Como está a tua semana?</h2>
          <p className="text-sm text-slate-600 mb-5">Escolhe o humor que melhor te representa.</p>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-200 ${
                  mood === m.value
                    ? "border-brand-500 bg-brand-50 scale-105"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className={`text-xs font-medium ${mood === m.value ? "text-brand-700" : "text-slate-600"}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <Textarea
            label="Comentário (opcional)"
            rows={3}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Algo que queiras partilhar com a liderança?"
            helper={`Analisado por IA · ${comment.length}/500 caracteres · Anónimo`}
          />

          <div className="flex justify-end mt-5">
            <Button onClick={handleSubmit} loading={loading} disabled={mood === null}>
              Submeter resposta
            </Button>
          </div>
        </Card>
      )}

      {/* History */}
      <div className="mt-8">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-500" />
          Histórico das últimas semanas
        </h3>
        <div className="space-y-2">
          {history.slice(0, 5).map((p) => {
            const m = MOODS.find((x) => x.value === p.mood);
            return (
              <Card key={p.id} padding="sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">
                      {p.comment || <span className="italic text-slate-400">Sem comentário</span>}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                  <Badge
                    variant={
                      p.sentiment === "positive"
                        ? "success"
                        : p.sentiment === "negative"
                        ? "danger"
                        : "default"
                    }
                  >
                    {p.sentiment}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}