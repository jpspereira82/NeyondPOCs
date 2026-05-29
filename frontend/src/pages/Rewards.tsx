import { useState } from "react";
import { useAuth } from "../lib/auth";
import { REWARDS, redeemReward, Reward } from "../lib/mockData";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { Gift, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function Rewards() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Reward | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const balance = user?.points || 0;
  const categories = Array.from(new Set(REWARDS.map((r) => r.category)));
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const filtered = activeCategory === "Todas" ? REWARDS : REWARDS.filter((r) => r.category === activeCategory);

  const handleRedeem = () => {
    if (!selected || !user) return;
    setLoading(true);
    setTimeout(() => {
      redeemReward(selected.id, user.id);
      setLoading(false);
      setConfirmed(true);
    }, 700);
  };

  const closeModal = () => {
    setSelected(null);
    setConfirmed(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Recompensas</h1>
          <p className="text-sm text-slate-600 mt-1">
            Troca os teus pontos por experiências, vouchers e oportunidades.
          </p>
        </div>
        {user?.role === "MEMBER" && (
          <div className="px-4 py-2.5 bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-xl shadow-sm">
            <p className="text-xs text-brand-100">Saldo</p>
            <p className="text-lg font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {balance} pts
            </p>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["Todas", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === c
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const unavailable = r.stock === 0;
          const insufficient = balance < r.cost;
          return (
            <Card key={r.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-2xl">{r.icon}
                </div>
                <Badge>{r.category}</Badge>
              </div>
              <h3 className="font-semibold mt-3">{r.name}</h3>
              <p className="text-sm text-slate-600 mt-1 flex-1">{r.description}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Custo</p>
                  <p className="font-bold text-brand-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {r.cost} pts
                  </p>
                </div>
                <div className="text-right">
                  {r.stock !== null && (
                    <p className="text-xs text-slate-500 mb-1">
                      {unavailable ? "Esgotado" : `Stock: ${r.stock}`}
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant={unavailable || insufficient ? "secondary" : "primary"}
                    disabled={unavailable || insufficient || user?.role !== "MEMBER"}
                    onClick={() => setSelected(r)}
                  >
                    {unavailable ? "Esgotado" : insufficient ? "Saldo insuficiente" : "Resgatar"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Redemption modal */}
      <Modal
        open={!!selected}
        onClose={closeModal}
        title={confirmed ? "Resgate confirmado" : "Confirmar resgate"}
      >
        {selected && !confirmed && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl border border-slate-200">
                {selected.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{selected.name}</p>
                <p className="text-xs text-slate-500">{selected.category}</p>
              </div>
              <span className="text-sm font-bold text-brand-700">{selected.cost} pts</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Saldo atual</span>
                <span className="font-medium">{balance} pts</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Custo</span>
                <span className="font-medium">−{selected.cost} pts</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                <span>Saldo após resgate</span>
                <span>{balance - selected.cost} pts</span>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                O pedido fica em estado <strong>pendente</strong> até a People Ops confirmar a entrega.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleRedeem} loading={loading}>Confirmar resgate</Button>
            </div>
          </div>
        )}
        {confirmed && selected && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-semibold">Pedido criado com sucesso</h3>
            <p className="text-sm text-slate-600 mt-1">
              A People Ops foi notificada e vai entrar em contacto para finalizar a entrega de <strong>{selected.name}</strong>.
            </p>
            <Button className="mt-5" onClick={closeModal}>Fechar</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}