import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-sky-900/60 w-full py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-8 max-w-[1280px] mx-auto">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 flex items-center justify-center text-white font-black text-lg shadow-lg ring-1 ring-amber-400">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-headline font-black text-white text-base tracking-tight">SIPIL BAUBAU</h3>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pemerintah Kota Baubau</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pr-2">
            Sistem Pengaduan Infrastruktur Kota Terintegrasi. Inovasi digital Pemerintah Kota Baubau untuk pelayanan publik yang prima.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h6 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Tautan Cepat</h6>
          <ul className="space-y-2 text-xs">
            <li><Link className="hover:text-amber-300 transition-colors" to="/">Beranda</Link></li>
            <li><Link className="hover:text-amber-300 transition-colors" to="/stats">Statistik Publik</Link></li>
            <li><Link className="hover:text-amber-300 transition-colors" to="/map">Peta Interaktif GIS</Link></li>
            <li><Link className="hover:text-amber-300 transition-colors" to="/submit">Daftar Pengaduan</Link></li>
          </ul>
        </div>

        {/* Subdistricts */}
        <div className="space-y-3">
          <h6 className="font-bold text-xs text-amber-400 uppercase tracking-wider">8 Kecamatan Baubau</h6>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
            <span>• Wolio</span>
            <span>• Betoambari</span>
            <span>• Murhum</span>
            <span>• Kokalukuna</span>
            <span>• Lea-Lea</span>
            <span>• Sorawolio</span>
            <span>• Bungi</span>
            <span>• Batupoaro</span>
          </div>
        </div>

        {/* Contact Us */}
        <div className="space-y-3">
          <h6 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Hubungi Kami</h6>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Gedung Pusat Pemerintahan, Palagimata, Kota Baubau</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Call Center: (0402) 2821100</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>pengaduan@baubaukota.go.id</span>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <Globe className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="https://baubaukota.go.id" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">
                baubaukota.go.id <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-[1280px] mx-auto px-4 sm:px-8">
        <p>© {new Date().getFullYear()} Pemerintah Kota Baubau. Sistem Pengaduan Infrastruktur Kota.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px] text-amber-400/90">GovTech Kota Baubau v1.0.0</p>
      </div>
    </footer>
  );
};
