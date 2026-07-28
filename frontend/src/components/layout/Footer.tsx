import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#e1e2ed] border-t border-[#c3c6d7] w-full py-8 text-[#434655]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 sm:px-8 max-w-[1280px] mx-auto">
        
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="font-headline text-lg font-bold text-[#191b23]">SIPIL BAUBAU</div>
          <p className="text-xs text-[#434655] leading-relaxed pr-4">
            Sistem Pengaduan Infrastruktur Kota Terintegrasi. Inovasi digital Pemerintah Kota Baubau untuk pelayanan publik yang prima.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h6 className="font-semibold text-xs text-[#004ac6] uppercase tracking-wider">Tautan Cepat</h6>
          <ul className="space-y-1.5 text-xs">
            <li><Link className="hover:text-[#191b23] transition-colors" to="/">Beranda</Link></li>
            <li><Link className="hover:text-[#191b23] transition-colors" to="/stats">Statistik Publik</Link></li>
            <li><Link className="hover:text-[#191b23] transition-colors" to="/map">Peta Interaktif</Link></li>
            <li><Link className="hover:text-[#191b23] transition-colors" to="/submit">Daftar Pengaduan</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h6 className="font-semibold text-xs text-[#004ac6] uppercase tracking-wider">Dukungan</h6>
          <ul className="space-y-1.5 text-xs">
            <li><Link className="hover:text-[#191b23] transition-colors" to="/about">Tentang Kami</Link></li>
            <li><Link className="hover:text-[#191b23] transition-colors" to="/track">Panduan Penggunaan</Link></li>
            <li><Link className="hover:text-[#191b23] transition-colors" to="/about">Kebijakan Privasi</Link></li>
            <li><Link className="hover:text-[#191b23] transition-colors" to="/about">Kontak</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-3">
          <h6 className="font-semibold text-xs text-[#004ac6] uppercase tracking-wider">Hubungi Kami</h6>
          <p className="text-xs text-[#434655]">
            Gedung Pusat Pemerintahan Kota Baubau<br />
            Sulawesi Tenggara, Indonesia
          </p>
          <div className="flex gap-3 pt-1">
            <a href="https://baubaukota.go.id" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-[#c3c6d7] flex items-center justify-center hover:bg-[#004ac6] hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a href="mailto:pengaduan@baubaukota.go.id" className="w-8 h-8 rounded-full bg-white border border-[#c3c6d7] flex items-center justify-center hover:bg-[#004ac6] hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
            <a href="tel:04022821100" className="w-8 h-8 rounded-full bg-white border border-[#c3c6d7] flex items-center justify-center hover:bg-[#004ac6] hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">call</span>
            </a>
          </div>
        </div>

      </div>

      <div className="mt-8 pt-4 border-t border-[#c3c6d7]/40 text-center text-xs text-[#434655]">
        © {new Date().getFullYear()} Kota Baubau. Sistem Pengaduan Infrastruktur Kota.
      </div>
    </footer>
  );
};
