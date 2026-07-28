import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-primary/20 w-full">
      <div className="max-w-container mx-auto px-4 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg ring-1 ring-accent">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-black text-white text-lg tracking-tight">SIPIL BAUBAU</h3>
                <p className="text-xs text-accent font-bold uppercase tracking-wider">Pemerintah Kota Baubau</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem Pengaduan Infrastruktur Kota Terintegrasi. Inovasi digital Pemerintah Kota Baubau untuk pelayanan publik yang prima dan transparan.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-accent uppercase tracking-wider">Tautan Cepat</h6>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Beranda</Link></li>
              <li><Link to="/stats" className="hover:text-accent transition-colors">Statistik Publik</Link></li>
              <li><Link to="/map" className="hover:text-accent transition-colors">Peta Interaktif</Link></li>
              <li><Link to="/submit" className="hover:text-accent transition-colors">Buat Pengaduan</Link></li>
              <li><Link to="/track" className="hover:text-accent transition-colors">Lacak Status</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">Tentang</Link></li>
              <li><Link to="/login" className="hover:text-accent transition-colors">Portal Login</Link></li>
            </ul>
          </div>

          {/* Subdistricts */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-accent uppercase tracking-wider">8 Kecamatan Baubau</h6>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Wolio', 'Betoambari', 'Murhum', 'Kokalukuna', 'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro'].map((k) => (
                <span key={k} className="text-slate-400">• {k}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-accent uppercase tracking-wider">Hubungi Kami</h6>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Gedung Pusat Pemerintahan, Palagimata, Kota Baubau</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>Call Center: (0402) 2821100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>pengaduan@baubaukota.go.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-secondary shrink-0" />
                <a href="https://baubaukota.go.id" target="_blank" rel="noreferrer" className="hover:text-accent flex items-center gap-1.5">
                  baubaukota.go.id <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Pemerintah Kota Baubau. Sistem Pengaduan Infrastruktur Kota.</p>
          <p className="text-xs text-accent/80 font-mono">GovTech Kota Baubau v1.0.0</p>
        </div>
      </div>
    </footer>
  );
};
