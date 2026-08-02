import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { MessageSquare, Send, User, ShieldCheck, HardHat, Landmark, Loader2 } from 'lucide-react';
import type { ComplaintComment } from '../../types';
import { formatDateTime, generateInitials } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface CommentSectionProps {
  comments: ComplaintComment[];
  onSubmit: (body: string) => Promise<void>;
  disabled?: boolean;
}

const ROLE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  citizen: { label: 'Warga', icon: User, color: 'bg-primary-light text-primary' },
  officer: { label: 'Petugas', icon: HardHat, color: 'bg-info-bg text-info' },
  admin: { label: 'Admin', icon: ShieldCheck, color: 'bg-warning-bg text-warning' },
  head_of_agency: { label: 'Kepala Dinas', icon: Landmark, color: 'bg-danger-bg text-danger' },
};

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onSubmit, disabled }) => {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const role = user?.role ?? 'citizen';
  const roleMeta = ROLE_META[role] ?? ROLE_META.citizen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || submitting || disabled) return;
    setSubmitting(true);
    try {
      await onSubmit(text);
      setBody('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-light text-primary">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-base font-bold text-foreground">Komentar</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {comments.length}
          </span>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Composer */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0', roleMeta.color)}>
              {user ? generateInitials(user.name) : <User className="w-4 h-4" aria-hidden="true" />}
            </div>
            <div className="flex-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={disabled}
                rows={2}
                placeholder={disabled ? 'Anda tidak memiliki akses komentar.' : 'Tulis komentar atau perkembangan terbaru...'}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 resize-none"
                aria-label="Isi komentar"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold', roleMeta.color)}>
                    <roleMeta.icon className="w-3 h-3" aria-hidden="true" />
                    {roleMeta.label}
                  </span>
                  {user?.name}
                </span>
                <button
                  type="submit"
                  disabled={!body.trim() || submitting || disabled}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Send className="w-3.5 h-3.5" aria-hidden="true" />}
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Belum ada komentar. Jadilah yang pertama memberi perkembangan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c, idx) => {
              const meta = ROLE_META[c.user?.role ?? 'citizen'] ?? ROLE_META.citizen;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex gap-3"
                >
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0', meta.color)}>
                    {c.user ? generateInitials(c.user.name) : <User className="w-4 h-4" aria-hidden="true" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-foreground">{c.user?.name ?? 'Pengguna'}</span>
                        <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold', meta.color)}>
                          <meta.icon className="w-3 h-3" aria-hidden="true" />
                          {meta.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground ml-auto">{formatDateTime(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
