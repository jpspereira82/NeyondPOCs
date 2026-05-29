export interface MockTeamUser {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarColor: string;
  points: number;
}

export interface Vibe {
  id: string;
  senderId: string;
  recipientIds: string[];
  message: string;
  tags: string[];
  reactions: { type: ReactionType; userIds: string[] }[];
  comments: VibeComment[];
  createdAt: string;
}

export type ReactionType = "HighFive" | "Heart" | "Fire" | "Clap";

export interface VibeComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface PulseResponse {
  id: string;
  mood: number;
  comment?: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  stock: number | null;
  icon: string;
  category: string;
  active: boolean;
}

export interface Redemption {
  id: string;
  rewardId: string;
  userId: string;
  status: "PENDING" | "FULFILLED";
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const STORAGE = {
  vibes: "vybe.vibes",
  pulses: "vybe.pulses",
  redemptions: "vybe.redemptions"
};

export const TEAM: MockTeamUser[] = [
  { id: "u-current", name: "Alex Pereira", email: "alex@neyond.pt", department: "Engineering", avatarColor: "bg-brand-600", points: 340 },
  { id: "u-admin", name: "Sofia Carvalho", email: "sofia@neyond.pt", department: "People Ops", avatarColor: "bg-rose-500", points: 0 },
  { id: "u-2", name: "Margarida Sousa", email: "margarida@neyond.pt", department: "Design", avatarColor: "bg-amber-500", points: 510 },
  { id: "u-3", name: "Ricardo Lima", email: "ricardo@neyond.pt", department: "Engineering", avatarColor: "bg-emerald-500", points: 285 },
  { id: "u-4", name: "Inês Marques", email: "ines@neyond.pt", department: "Product", avatarColor: "bg-sky-500", points: 420 },
  { id: "u-5", name: "Tiago Ferreira", email: "tiago@neyond.pt", department: "Engineering", avatarColor: "bg-violet-500", points: 195 },
  { id: "u-6", name: "Beatriz Almeida", email: "beatriz@neyond.pt", department: "Marketing", avatarColor: "bg-pink-500", points: 365 },
  { id: "u-7", name: "Pedro Antunes", email: "pedro@neyond.pt", department: "Sales", avatarColor: "bg-orange-500", points: 240 },
  { id: "u-8", name: "Catarina Dias", email: "catarina@neyond.pt", department: "Design", avatarColor: "bg-teal-500", points: 470 },
  { id: "u-9", name: "João Mendes", email: "joao@neyond.pt", department: "Product", avatarColor: "bg-fuchsia-500", points: 310 },
  { id: "u-10", name: "Rita Carvalho", email: "rita@neyond.pt", department: "Engineering", avatarColor: "bg-cyan-500", points: 380 }
];

export const VALUE_TAGS = ["Teamwork", "Innovation", "Ownership", "Excellence", "Customer-First", "Kindness", "Growth"];

export const REACTION_EMOJI: Record<ReactionType, string> = {
  HighFive: "🙌",
  Heart: "❤️",
  Fire: "🔥",
  Clap: "👏"
};

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86400000).toISOString();
}

const SEED_VIBES: Vibe[] = [
  {
    id: "v-1",
    senderId: "u-2",
    recipientIds: ["u-current"],
    message: "Obrigada Alex pela ajuda no refactor da camada de auth — desbloqueaste a equipa toda. Brilhante!",
    tags: ["Teamwork", "Excellence"],
    reactions: [
      { type: "HighFive", userIds: ["u-3", "u-4", "u-5"] },
      { type: "Fire", userIds: ["u-6"] }
    ],
    comments: [
      { id: "c-1", authorId: "u-3", text: "Confirmo, salvou-nos o sprint!", createdAt: daysAgo(0.4) }
    ],
    createdAt: daysAgo(0.5)
  },
  {
    id: "v-2",
    senderId: "u-4",
    recipientIds: ["u-8", "u-2"],
    message: "O novo design system está absolutamente fantástico. Conseguiram simplificar 30 componentes em 12 — chapéu! 🎨",
    tags: ["Innovation", "Excellence"],
    reactions: [
      { type: "Heart", userIds: ["u-current", "u-6", "u-9"] },
      { type: "Clap", userIds: ["u-7"] }
    ],
    comments: [],
    createdAt: daysAgo(1)
  },
  {
    id: "v-3",
    senderId: "u-current",
    recipientIds: ["u-5"],
    message: "Tiago, a forma como assumiste o incidente de ontem foi exemplar. Comunicação clara, sangue-frio e resolução em 40min.",
    tags: ["Ownership", "Excellence"],
    reactions: [
      { type: "Fire", userIds: ["u-2", "u-3"] }
    ],
    comments: [
      { id: "c-2", authorId: "u-5", text: "Obrigado Alex! 🙏", createdAt: daysAgo(1.5) }
    ],
    createdAt: daysAgo(2)
  },
  {
    id: "v-4",
    senderId: "u-6",
    recipientIds: ["u-7"],
    message: "Pedro, o feedback que deste à Acme sobre o nosso pricing foi ouro. Já está a influenciar a roadmap.",
    tags: ["Customer-First", "Ownership"],
    reactions: [{ type: "HighFive", userIds: ["u-4"] }],
    comments: [],
    createdAt: daysAgo(3)
  },
  {
    id: "v-5",
    senderId: "u-9",
    recipientIds: ["u-10"],
    message: "Rita, a tua sessão de mentoring com os juniores fez toda a diferença esta semana. Generosidade pura.",
    tags: ["Kindness", "Growth"],
    reactions: [
      { type: "Heart", userIds: ["u-current", "u-2", "u-3", "u-4"] }
    ],
    comments: [
      { id: "c-3", authorId: "u-10", text: "Tão querido! Foi um prazer.", createdAt: daysAgo(3.2) }
    ],
    createdAt: daysAgo(4)
  },
  {
    id: "v-6",
    senderId: "u-8",
    recipientIds: ["u-current", "u-3", "u-5"],
    message: "Equipa de Engineering — entregaram a v2 do dashboard com 2 dias de antecedência. Disciplina e foco impressionantes.",
    tags: ["Teamwork", "Excellence", "Ownership"],
    reactions: [
      { type: "Clap", userIds: ["u-2", "u-4", "u-6", "u-9", "u-10"] },
      { type: "Fire", userIds: ["u-7"] }
    ],
    comments: [],
    createdAt: daysAgo(5)
  },
  {
    id: "v-7",
    senderId: "u-3",
    recipientIds: ["u-4"],
    message: "Inês, a tua análise do churn dos últimos 6 meses mudou completamente a nossa hipótese de produto. Obrigado!",
    tags: ["Innovation", "Growth"],
    reactions: [{ type: "Heart", userIds: ["u-2"] }],
    comments: [],
    createdAt: daysAgo(6)
  },
  {
    id: "v-8",
    senderId: "u-10",
    recipientIds: ["u-6"],
    message: "Beatriz, a campanha de lançamento foi um sucesso retumbante. 3x mais sign-ups que a estimativa. 🚀",
    tags: ["Excellence", "Innovation"],
    reactions: [{ type: "Fire", userIds: ["u-current", "u-7", "u-9"] }],
    comments: [],
    createdAt: daysAgo(7)
  },
  {
    id: "v-9",
    senderId: "u-7",
    recipientIds: ["u-current"],
    message: "Alex, obrigado pela demo brilhante na call com o cliente. Fechámos o contrato no dia seguinte.",
    tags: ["Customer-First", "Excellence"],
    reactions: [
      { type: "Clap", userIds: ["u-2", "u-4"] },
      { type: "Fire", userIds: ["u-8"] }
    ],
    comments: [],
    createdAt: daysAgo(8)
  },
  {
    id: "v-10",
    senderId: "u-2",
    recipientIds: ["u-9"],
    message: "João, sempre disponível para ajudar — quer seja code review, quer seja dúvidas de produto. És um pilar.",
    tags: ["Kindness", "Teamwork"],
    reactions: [{ type: "Heart", userIds: ["u-10", "u-4"] }],
    comments: [],
    createdAt: daysAgo(9)
  },
  {
    id: "v-11",
    senderId: "u-current",
    recipientIds: ["u-8"],
    message: "Catarina, o teu olhar atento aos detalhes de acessibilidade nas últimas screens fez subir a barra da equipa toda.",
    tags: ["Excellence", "Customer-First"],
    reactions: [{ type: "HighFive", userIds: ["u-4", "u-6"] }],
    comments: [],
    createdAt: daysAgo(10)
  },
  {
    id: "v-12",
    senderId: "u-5",
    recipientIds: ["u-3"],
    message: "Ricardo, a tua pair programming session ensinou-me mais sobre TypeScript do que 3 cursos juntos.",
    tags: ["Growth", "Kindness"],
    reactions: [{ type: "Heart", userIds: ["u-current"] }],
    comments: [],
    createdAt: daysAgo(11)
  }
];

const SEED_PULSES: PulseResponse[] = [
  { id: "p-1", mood: 4, comment: "Boa semana, ritmo equilibrado.", sentiment: "positive", sentimentScore: 0.82, createdAt: daysAgo(2) },
  { id: "p-2", mood: 5, comment: "Adorei a sessão de team building.", sentiment: "positive", sentimentScore: 0.94, createdAt: daysAgo(9) },
  { id: "p-3", mood: 3, comment: "Demasiadas reuniões esta semana.", sentiment: "neutral", sentimentScore: 0.45, createdAt: daysAgo(16) },
  { id: "p-4", mood: 4, sentiment: "positive", sentimentScore: 0.78, createdAt: daysAgo(23) },
  { id: "p-5", mood: 2, comment: "Senti pressão no prazo final.", sentiment: "negative", sentimentScore: 0.22, createdAt: daysAgo(30) }
];

export const REWARDS: Reward[] = [
  { id: "r-1", name: "Voucher FNAC 25€", description: "Voucher digital para usar em qualquer loja FNAC ou online.", cost: 250, stock: 12, icon: "🎁", category: "Vouchers", active: true },
  { id: "r-2", name: "Tarde livre", description: "Meia tarde livre à tua escolha — sem reuniões, sem Slack.", cost: 400, stock: null, icon: "🌴", category: "Tempo", active: true },
  { id: "r-3", name: "Workshop de liderança", description: "Inscrição num workshop externo à tua escolha (até 300€).", cost: 800, stock: 5, icon: "🎓", category: "Crescimento", active: true },
  { id: "r-4", name: "Almoço com o CEO", description: "Almoço informal de 1h com o CEO para partilhares ideias.", cost: 350, stock: 3, icon: "🍽️", category: "Experiências", active: true },
  { id: "r-5", name: "Cadeira ergonómica", description: "Cadeira Herman Miller para o teu home office.", cost: 1500, stock: 2, icon: "🪑", category: "Equipamento", active: true },
  { id: "r-6", name: "Donativo solidário 50€", description: "A Vybe doa 50€ à instituição que escolheres.", cost: 300, stock: null, icon: "❤️", category: "Solidário", active: true },
  { id: "r-7", name: "Headphones Sony", description: "Sony WH-1000XM5 — concentração em qualquer lugar.", cost: 1200, stock: 0, icon: "🎧", category: "Equipamento", active: true },
  { id: "r-8", name: "Curso Udemy à escolha", description: "Reembolso de qualquer curso Udemy até 50€.", cost: 200, stock: null, icon: "💻", category: "Crescimento", active: true }
];

export const BADGES: Badge[] = [
  { id: "b-1", name: "First Vibe", description: "Enviaste o teu primeiro Vibe.", icon: "🌟", unlocked: true },
  { id: "b-2", name: "Streak Master", description: "4 Pulses consecutivos respondidos.", icon: "🔥", unlocked: true },
  { id: "b-3", name: "Generous Soul", description: "Enviaste 10 Vibes.", icon: "💖", unlocked: true },
  { id: "b-4", name: "Connector", description: "Reconheceste pessoas de 5 departamentos diferentes.", icon: "🌐", unlocked: false },
  { id: "b-5", name: "Mentor", description: "Recebeste 20 reações nos teus Vibes.", icon: "🎓", unlocked: false },
  { id: "b-6", name: "Centurion", description: "100 pontos acumulados.", icon: "💯", unlocked: true }
];

// ---- helpers persistence ----
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- API ----
export function getVibes(): Vibe[] {
  return load<Vibe[]>(STORAGE.vibes, SEED_VIBES).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function createVibe(input: {
  senderId: string;
  recipientIds: string[];
  message: string;
  tags: string[];
}): Vibe {
  const vibes = getVibes();
  const newVibe: Vibe = {
    id: "v-" + Date.now(),
    ...input,
    reactions: [],
    comments: [],
    createdAt: new Date().toISOString()
  };
  save(STORAGE.vibes, [newVibe, ...vibes]);
  return newVibe;
}

export function toggleReaction(vibeId: string, type: ReactionType, userId: string) {
  const vibes = getVibes();
  const idx = vibes.findIndex((v) => v.id === vibeId);
  if (idx === -1) return;
  const vibe = vibes[idx];
  const rIdx = vibe.reactions.findIndex((r) => r.type === type);
  if (rIdx === -1) {
    vibe.reactions.push({ type, userIds: [userId] });
  } else {
    const userIds = vibe.reactions[rIdx].userIds;
    if (userIds.includes(userId)) {
      vibe.reactions[rIdx].userIds = userIds.filter((u) => u !== userId);
    } else {
      vibe.reactions[rIdx].userIds = [...userIds, userId];
    }
  }
  save(STORAGE.vibes, vibes);
}

export function addComment(vibeId: string, authorId: string, text: string) {
  const vibes = getVibes();
  const idx = vibes.findIndex((v) => v.id === vibeId);
  if (idx === -1) return;
  vibes[idx].comments.push({
    id: "c-" + Date.now(),
    authorId,
    text,
    createdAt: new Date().toISOString()
  });
  save(STORAGE.vibes, vibes);
}

export function getUsers(): MockTeamUser[] {
  return TEAM;
}

export function getUserById(id: string): MockTeamUser | undefined {
  return TEAM.find((u) => u.id === id);
}

export function getPulses(): PulseResponse[] {
  return load<PulseResponse[]>(STORAGE.pulses, SEED_PULSES);
}

export function submitPulse(mood: number, comment?: string): PulseResponse {
  const pulses = getPulses();
  // mock sentiment
  let sentiment: PulseResponse["sentiment"] = "neutral";
  let score = 0.5;
  if (mood >= 4) { sentiment = "positive"; score = 0.75 + Math.random() * 0.2; }
  else if (mood <= 2) { sentiment = "negative"; score = 0.15 + Math.random() * 0.2; }
  else { score = 0.45 + Math.random() * 0.15; }
  const newP: PulseResponse = {
    id: "p-" + Date.now(),
    mood,
    comment,
    sentiment,
    sentimentScore: parseFloat(score.toFixed(2)),
    createdAt: new Date().toISOString()
  };
  save(STORAGE.pulses, [newP, ...pulses]);
  return newP;
}

export function hasRespondedThisWeek(): boolean {
  const pulses = getPulses();
  const lastWeek = Date.now() - 7 * 86400000;
  return pulses.some((p) => +new Date(p.createdAt) > lastWeek);
}

export function getRedemptions(): Redemption[] {
  return load<Redemption[]>(STORAGE.redemptions, []);
}

export function redeemReward(rewardId: string, userId: string): Redemption {
  const list = getRedemptions();
  const r: Redemption = {
    id: "rd-" + Date.now(),
    rewardId,
    userId,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  save(STORAGE.redemptions, [r, ...list]);
  return r;
}

// ---- Analytics aggregations ----
export function getSentimentBreakdown() {
  const pulses = getPulses();
  const total = pulses.length || 1;
  const pos = pulses.filter((p) => p.sentiment === "positive").length;
  const neu = pulses.filter((p) => p.sentiment === "neutral").length;
  const neg = pulses.filter((p) => p.sentiment === "negative").length;
  return {
    positive: Math.round((pos / total) * 100),
    neutral: Math.round((neu / total) * 100),
    negative: Math.round((neg / total) * 100),
    total
  };
}

export function getWeeklySentimentTrend(): { week: string; score: number }[] {
  // 8 weeks mocked
  return [
    { week: "S-7", score: 62 },
    { week: "S-6", score: 58 },
    { week: "S-5", score: 65 },
    { week: "S-4", score: 71 },
    { week: "S-3", score: 68 },
    { week: "S-2", score: 74 },
    { week: "S-1", score: 79 },
    { week: "Hoje", score: 82 }
  ];
}

export function getTagDistribution(): { tag: string; count: number }[] {
  const vibes = getVibes();
  const map = new Map<string, number>();
  vibes.forEach((v) => v.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getLeaderboard(): { user: MockTeamUser; points: number }[] {
  return [...TEAM]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map((u) => ({ user: u, points: u.points }));
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;
  return new Date(iso).toLocaleDateString("pt-PT");
}