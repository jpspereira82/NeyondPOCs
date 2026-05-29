import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { createVibe, getUsers, VALUE_TAGS } from "../lib/mockData";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Textarea } from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { ArrowLeft, Send, Sparkles, X } from "lucide-react";

export default function NewVibe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const users = getUsers().filter((u) => u.id !== user!.id);

  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleRecipient = (id: string) => {
    setRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const canSubmit = recipientIds.length > 0 && message.trim().length > 0 && tags.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      createVibe({
        senderId: user!.id,
        recipientIds,
        message: message.trim(),
        tags
      });
      navigate("/feed");
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <h1 className="text-2xl font-bold tracking-tight">Enviar um Good Vibe</h1>
      <p className="text-sm text-slate-600 mt-1 mb-6">
        Reconhece publicamente quem fez a diferença esta semana.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Recipients */}
        <Card>
          <label className="block text-sm font-semibold mb-3">Para quem?</label>
          {recipientIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {recipientIds.map((id) => {
                const u = users.find((x) => x.id === id)!;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium"
                  >
                    {u.name}
                    <button type="button" onClick={() => toggleRecipient(id)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {users.map((u) => {
              const selected = recipientIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleRecipient(u.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                    selected
                      ? "bg-brand-50 border-brand-300"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Avatar name={u.name} color={u.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 truncate">{u.department}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Message */}
        <Card>
          <Textarea
            label="Mensagem"
            rows={4}
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="O que queres reconhecer? Sê específico — exemplos contam."
            helper={`${message.length}/500 caracteres`}
            required
          />
        </Card>

        {/* Tags */}
        <Card>
          <label className="block text-sm font-semibold mb-3">Valores associados</label>
          <div className="flex flex-wrap gap-2">
            {VALUE_TAGS.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {active && <Sparkles className="w-3 h-3" />}
                  {t}
                </button>
              );
            })}
          </div>
          {tags.length === 0 && (
            <p className="text-xs text-slate-500 mt-2">Seleciona pelo menos um valor.</p>
          )}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Badge key={t} variant="brand">{t}</Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500">
            🎁 Ganhas <strong className="text-brand-700">10 pts</strong>; cada destinatário ganha <strong className="text-brand-700">5 pts</strong>.
          </p>
          <Button type="submit" loading={loading} disabled={!canSubmit}>
            <Send className="w-4 h-4" />
            Enviar Vibe
          </Button>
        </div>
      </form>
    </div>
  );
}