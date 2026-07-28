import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-sky-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white font-black text-lg shadow-lg ring-1 ring-amber-400">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight">SIPIL BAUBAU</h3>
                <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Pemerintah Kota Baubau</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem Pengaduan Infrastruktur Berbasis Web dengan Pemetaan Lokasi GIS dan Monitoring Penanganan Laporan Real-time di Kota Baubau, Sulawesi Tenggara.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Beranda</Link></li>
              <li><Link to="/map" className="hover:text-amber-300 transition-colors">Peta GIS Pengaduan</Link></li>
              <li><Link to="/submit" className="hover:text-amber-300 transition-colors">Buat Laporan Infrastruktur</Link></li>
              <li><Link to="/track" className="hover:text-amber-300 transition-colors">Cek Status Laporan</Link></li>
              <li><Link to="/stats" className="hover:text-amber-300 transition-colors">Statistik & Analisis OPD</Link></li>
            </ul>
          </div>

          {/* Subdistricts list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Cakupan Wilayah Kecamatan</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span className="hover:text-white">• Wolio</span>
              <span className="hover:text-white">• Betoambari</span>
              <span className="hover:text-white">• Murhum</span>
              <span className="hover:text-white">• Kokalukuna</span>
              <span className="hover:text-white">• Lea-Lea</span>
              <span className="hover:text-white">• Sorawolio</span>
              <span className="hover:text-white">• Bungi</span>
              <span className="hover:text-white">• Batupoaro</span>
            </div>
          </div>

          {/* Contact & Government Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Kontak Resmi Pemkot</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Kawasan Palagimata, Jl. Palagimata, Kota Baubau, Sulawesi Tenggara 93724</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Call Center: (0402) 2821100</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>pengaduan@baubaukota.go.id</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="https://baubaukota.go.id" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">
                  baubaukota.go.id <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pemerintah Kota Baubau. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-amber-400/80">SIPIL BAUBAU v1.0.0 • GovTech Baubau</p>
        </div>
      </div>
    </footer>
  );
};
