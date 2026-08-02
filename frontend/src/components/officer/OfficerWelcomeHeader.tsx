import React from 'react';
import { Calendar, Clock, Sun, Bell, Search } from 'lucide-react';
import type { WelcomeData } from '../../types';

interface OfficerWelcomeHeaderProps {
  welcome: WelcomeData;
  unreadNotifications: number;
  onSearch: (q: string) => void;
}

export const OfficerWelcomeHeader: React.FC<OfficerWelcomeHeaderProps> = ({
  welcome,
  unreadNotifications,
  onSearch,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Greeting */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-primary-foreground shadow-lg">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black text-foreground">
              {welcome.greeting}, {welcome.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Petugas Lapangan — Siap bekerja hari ini</p>
          </div>
        </div>

        {/* Right: Date, Time, Notif */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3.5 py-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">{welcome.date}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3.5 py-2">
            <Clock className="w-4 h-4 text-info" />
            <span className="text-sm font-semibold text-foreground">{welcome.time} WITA</span>
          </div>
          <button className="relative p-2.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-card">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mt-4 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari berdasarkan tiket, judul, pelapor, atau lokasi..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>
    </div>
  );
};

export default OfficerWelcomeHeader;
