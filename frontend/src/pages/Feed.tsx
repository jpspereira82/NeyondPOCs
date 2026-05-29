import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Vibe,
  getVibes,
  getUserById,
  relativeTime,
  toggleReaction,
  addComment,
  REACTION_EMOJI,
  ReactionType,
  VALUE_TAGS
} from "../lib/mockData";
import { useAuth } from "../lib/auth";
import { Plus, Search, MessageCircle, Sparkles, Heart } from "lucide-react";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";

const PAGE_SIZE = 6;

export default function Feed() {
  const { user } = useAuth();
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const refresh = () => setVibes(getVibes());

  useEffect(() => {
    const t = setTimeout(() => {
      refresh();
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return vibes.filter((v) => {
      const matchesQuery =
        !query ||
        v.message.toLowerCase().includes(query.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesTag = !activeTag || v.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [vibes, query, activeTag]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > paginated.length;

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good Vibes Feed</h1>
          <p className="text-sm text-slate-600 mt-1">
            Reconhecimentos públicos entre colegas — celebra quem faz a diferença.
          </p>
        </div>
        <Link to="/feed/new">
          <Button>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Vibe</span>
          </Button>
        </Link>
      </div>

      {/* Search + filters */}
      <Card padding="sm" className="mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Procurar por mensagem ou tag..."
            className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !activeTag
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todas
          </button>
          {VALUE_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTag(t === activeTag ? null : t);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTag === t
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : paginated.length === 0 ? (
        <Card>
          <EmptyState
            icon={Heart}
            title="Sem Vibes ainda"
            description="Sê o primeiro a reconhecer um colega — basta um agradecimento."
            action={
              <Link to="/feed/new">
                <Button>
                  <Plus className="w-4 h-4" />
                  Enviar primeiro Vibe
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {paginated.map((v) => (
            <VibeCard
              key={v.id}
              vibe={v}
              currentUserId={user!.id}
              onChanged={refresh}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="secondary" onClick={() => setPage(page + 1)}>
                Carregar mais
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VibeCard({
  vibe,
  currentUserId,
  onChanged
}: {
  vibe: Vibe;
  currentUserId: string;
  onChanged: () => void;
}) {
  const sender = getUserById(vibe.senderId);
  const recipients = vibe.recipientIds.map(getUserById).filter(Boolean);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const reactions: ReactionType[] = ["HighFive", "Heart", "Fire", "Clap"];

  const handleReact = (type: ReactionType) => {
    toggleReaction(vibe.id, type, currentUserId);
    onChanged();
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    addComment(vibe.id, currentUserId, comment.trim());
    setComment("");
    onChanged();
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar name={sender?.name || "?"} color={sender?.avatarColor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap text-sm">
            <span className="font-semibold">{sender?.name}</span>
            <span className="text-slate-500">reconheceu</span>
            {recipients.map((r, idx) => (
              <span key={r!.id} className="font-semibold text-brand-700">
                {r!.name}{idx < recipients.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{relativeTime(vibe.createdAt)}</p>
        </div>
      </div>

      {/* Message */}
      <p className="text-slate-800 mt-4 leading-relaxed">{vibe.message}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {vibe.tags.map((t) => (
          <Badge key={t} variant="brand">
            <Sparkles className="w-3 h-3" />
            {t}
          </Badge>
        ))}
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        {reactions.map((type) => {
          const r = vibe.reactions.find((x) => x.type === type);
          const count = r?.userIds.length || 0;
          const reacted = r?.userIds.includes(currentUserId);
          return (
            <button
              key={type}
              onClick={() => handleReact(type)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                reacted
                  ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-base leading-none">{REACTION_EMOJI[type]}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
        <button
          onClick={() => setShowComments(!showComments)}
          className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {vibe.comments.length}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3">
          {vibe.comments.map((c) => {
            const author = getUserById(c.authorId);
            return (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar name={author?.name || "?"} color={author?.avatarColor} size="xs" />
                <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold">{author?.name}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{c.text}</p>
                </div>
              </div>
            );
          })}
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              maxLength={280}
              placeholder="Escreve um comentário..."
              className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            <Button size="sm" onClick={handleComment} disabled={!comment.trim()}>
              Enviar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}