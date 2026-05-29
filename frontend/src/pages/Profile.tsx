import { useAuth } from "../lib/auth";
import { BADGES, getVibes, getRedemptions, REWARDS } from "../lib/mockData";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Sparkles, Award, History, AlertTriangle, Mail, Briefcase } from "lucide-react";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmErase, setConfirmErase] = useState(false);

  if (!user) return null;

  const myVibesSent = getVibes().filter((v) => v.senderId === user.id);
  const myVibesReceived = getVibes().filter((v) => v.recipientIds.includes(user.id));
  const myRedemptions = getRedemptions().filter((r) => r.userId === user.id);
  const unlockedBadges = BADGES.filter((b) => b.unlocked);

  const handleErase = () => {
    setConfirmErase(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Header card */}
      <Card padding="lg" className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar name={user.name} color={user.avatarColor} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {user.department}
              </span>
              <Badge variant="brand">{user.role}</Badge>
            </div>
          </div>
          {user.role === "MEMBER" && (
            <div className="px-4 py-2.5 bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-xl shadow-sm text-center">
              <p className="text-xs text-brand-100">Pontos</p>
              <p className="text-xl font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {user.points}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <Card>
          <p className="text-xs text-slate-500">Vibes enviados</p>
          <p className="text-2xl font-bold mt-1">{myVibesSent.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Vibes recebidos</p>
          <p className="text-2xl font-bold mt-1">{myVibesReceived.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Badges</p>
          <p className="text-2xl font-bold mt-1">{unlockedBadges.length}<span className="text-slate-400 text-base">/{BADGES.length}</span></p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Resgates</p>
          <p className="text-2xl font-bold mt-1">{myRedemptions.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Badges */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold">Badges</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className={`text-center p-3 rounded-xl border-2 transition-all ${
                  b.unlocked
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50 opacity-60 grayscale"
                }`}
                title={b.description}
              >
                <div className="text-3xl">{b.icon}</div>
                <p className="text-xs font-semibold mt-1">{b.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{b.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Redemptions history */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold">Histórico de resgates</h3>
          </div>
          {myRedemptions.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Ainda não fizeste resgates.</p>
          ) : (
            <div className="space-y-2">
              {myRedemptions.map((r) => {
                const reward = REWARDS.find((x) => x.id === r.rewardId);
                if (!reward) return null;
                return (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                      {reward.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{reward.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString("pt-PT")} · {reward.cost} pts
                      </p>
                    </div>
                    <Badge variant={r.status === "FULFILLED" ? "success" : "warning"}>
                      {r.status === "FULFILLED" ? "Entregue" : "Pendente"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* RGPD */}
      <Card className="mt-6 border-rose-200 bg-rose-50/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-rose-900">Direito ao esquecimento (RGPD)</h3>
            <p className="text-sm text-rose-700 mt-1">
              Podes solicitar a anonimização imediata dos teus dados pessoais. Ações realizadas (Vibes, pontos) ficam preservadas de forma anónima para integridade histórica.
            </p>
            <Button variant="danger" size="sm" className="mt-3" onClick={() => setConfirmErase(true)}>
              Solicitar apagamento da conta
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={confirmErase}
        onClose={() => setConfirmErase(false)}
        title="Confirmar apagamento RGPD"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Esta ação é <strong>irreversível</strong>. O teu nome será substituído por "Utilizador Anónimo", o email removido e o avatar apagado.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmErase(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleErase}>Confirmar apagamento</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}