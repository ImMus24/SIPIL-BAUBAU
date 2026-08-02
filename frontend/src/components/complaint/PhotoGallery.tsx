import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, ImageOff, Camera, FileText } from 'lucide-react';
import type { ComplaintFile, ComplaintFileCategory } from '../../types';
import { cn } from '../../lib/utils';

interface PhotoGalleryProps {
  files: ComplaintFile[];
  canUpload?: boolean;
  onUpload?: (category: ComplaintFileCategory, file: File) => void;
  uploading?: boolean;
}

const CATEGORIES: { key: ComplaintFileCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Semua', icon: Camera },
  { key: 'before', label: 'Sebelum', icon: Camera },
  { key: 'progress', label: 'Proses', icon: Camera },
  { key: 'after', label: 'Sesudah', icon: Camera },
  { key: 'support', label: 'Dokumen', icon: FileText },
];

const CATEGORY_LABEL: Record<ComplaintFileCategory, string> = {
  before: 'Sebelum',
  progress: 'Proses',
  after: 'Sesudah',
  support: 'Dokumen',
};

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ files, canUpload, onUpload, uploading }) => {
  const [activeCat, setActiveCat] = useState<ComplaintFileCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const images = files.filter((f) => f.file_type.startsWith('image/'));
  const filtered = activeCat === 'all' ? files : files.filter((f) => f.category === activeCat);

  useEffect(() => {
    setZoom(1);
  }, [lightboxIndex]);

  const countFor = (cat: ComplaintFileCategory | 'all') =>
    cat === 'all' ? files.length : files.filter((f) => f.category === cat).length;

  const handleLightboxNav = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + images.length) % images.length;
    setLightboxIndex(next);
  };

  const downloadFile = (file: ComplaintFile) => {
    const a = document.createElement('a');
    a.href = file.file_path;
    a.download = file.file_path.split('/').pop() ?? 'lampiran';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  if (files.length === 0 && !canUpload) {
    return (
      <Card variant="bordered">
        <Card.Header>
          <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" aria-hidden="true" /> Galeri Foto
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-8">
            <ImageOff className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Belum ada foto terlampir.</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" aria-hidden="true" /> Galeri Foto
          </h2>
          {canUpload && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              {uploading ? 'Mengunggah...' : 'Unggah Foto'}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Unggah foto"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && onUpload) onUpload(activeCat === 'all' ? 'support' : activeCat, f);
              e.target.value = '';
            }}
          />
        </div>
      </Card.Header>

      <div className="flex items-center gap-1.5 px-4 pt-3 overflow-x-auto">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCat(key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
              activeCat === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label} ({countFor(key)})
          </button>
        ))}
      </div>

      <Card.Body>
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <ImageOff className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Tidak ada berkas pada kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((file) => {
              const globalIdx = images.findIndex((i) => i.id === file.id);
              const isImage = file.file_type.startsWith('image/');
              return (
                <div
                  key={file.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted cursor-pointer"
                  onClick={() => isImage && setLightboxIndex(globalIdx)}
                  role={isImage ? 'button' : undefined}
                  tabIndex={isImage ? 0 : undefined}
                  onKeyDown={(e) => { if (isImage && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setLightboxIndex(globalIdx); } }}
                >
                  {isImage ? (
                    <img
                      src={file.file_path}
                      alt={`${CATEGORY_LABEL[file.category]} — ${file.file_path.split('/').pop()}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                      <FileText className="w-7 h-7" aria-hidden="true" />
                      <span className="text-[10px] font-medium px-2 truncate max-w-full">
                        {file.file_path.split('/').pop()}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-foreground/70 backdrop-blur text-background text-[9px] font-bold uppercase tracking-wider">
                    {CATEGORY_LABEL[file.category]}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                      className="p-1 rounded-md bg-white/20 text-white hover:bg-white/40 backdrop-blur transition-colors"
                      aria-label="Unduh berkas"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau foto"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(3, z + 0.5)); }}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Perbesar"
              >
                <ZoomIn className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.5, z - 0.5)); }}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Perkecil"
              >
                <ZoomOut className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); downloadFile(images[lightboxIndex]); }}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Unduh"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLightboxNav(-1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLightboxNav(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </button>
              </>
            )}

            <img
              src={images[lightboxIndex].file_path}
              alt={`Foto ${CATEGORY_LABEL[images[lightboxIndex].category]}`}
              className="max-w-[92vw] max-h-[85vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
              {lightboxIndex + 1} / {images.length} — {CATEGORY_LABEL[images[lightboxIndex].category]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

