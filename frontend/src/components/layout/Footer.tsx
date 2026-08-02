import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Globe, ExternalLink, Heart, Code2 } from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../config/constants';

const quickLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Statistik Publik', path: '/stats' },
  { label: 'Peta Interaktif', path: '/map' },
  { label: 'Buat Pengaduan', path: '/submit' },
  { label: 'Lacak Status', path: '/track' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Tentang', path: '/about' },
  { label: 'Portal Login', path: '/login' },
];

const subdistricts = ['Wolio', 'Betoambari', 'Murhum', 'Kokalukuna', 'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro'];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-slate-300 border-t-2 border-golden/30 w-full">
      <div className="max-w-container mx-auto px-4 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-navy-light flex items-center justify-center shadow-lg ring-1 ring-golden/40">
                <ShieldCheck className="w-6 h-6 text-golden" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading font-black text-white text-lg tracking-tight">{APP_NAME}</h3>
                <p className="text-xs text-golden font-bold uppercase tracking-wider">Pemerintah Kota Baubau</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem Pengaduan Infrastruktur Kota Terintegrasi. Inovasi digital Pemerintah Kota Baubau untuk pelayanan publik yang prima, cepat, dan transparan.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-golden uppercase tracking-wider">Tautan Cepat</h6>
            <ul className="grid grid-cols-1 gap-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-300 hover:text-golden transition-colors duration-150 inline-flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-golden/60" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subdistricts */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-golden uppercase tracking-wider">8 Kecamatan Baubau</h6>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {subdistricts.map((k) => (
                <span key={k} className="text-slate-400 inline-flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-primary" aria-hidden="true" />
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-golden uppercase tracking-wider">Hubungi Kami</h6>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Gedung Pusat Pemerintahan, Palagimata, Kota Baubau</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>Call Center: (0402) 2821100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>pengaduan@baubaukota.go.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <a href="https://baubaukota.go.id" target="_blank" rel="noreferrer" className="hover:text-golden flex items-center gap-1.5 transition-colors">
                  baubaukota.go.id <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p className="flex items-center gap-1.5">
            © {new Date().getFullYear()} Pemerintah Kota Baubau. Dibuat dengan
            <Heart className="w-3.5 h-3.5 text-danger fill-current" aria-hidden="true" />
            untuk warga Baubau.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-golden/90 font-mono">
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              GovTech Kota Baubau v{APP_VERSION}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
