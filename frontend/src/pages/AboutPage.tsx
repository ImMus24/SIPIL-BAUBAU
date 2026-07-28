import React from 'react';
import { Card } from '../components/ui/Card';
import { PageBreadcrumb } from '../components/ui/Breadcrumb';
import { ShieldCheck, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Apa itu SIPIL BAUBAU?', a: 'SIPIL BAUBAU adalah Sistem Pengaduan Infrastruktur Berbasis Web milik Pemerintah Kota Baubau yang memungkinkan warga melaporkan kerusakan fasilitas publik secara cepat, transparan, dan terpantau.' },
  { q: 'Bagaimana cara membuat laporan?', a: 'Cukup klik tombol "Buat Laporan Sekarang", isi data diri, pilih kategori, tentukan lokasi di peta, dan kirim. Laporan Anda akan langsung masuk ke OPD terkait.' },
  { q: 'Berapa lama laporan diproses?', a: 'Setiap laporan akan diverifikasi dalam 1x24 jam. Proses penanganan tergantung tingkat urgensi dan jenis kerusakan, dengan target maksimal 7 hari kerja.' },
  { q: 'Apakah data saya aman?', a: 'Tentu. SIPIL BAUBAU menggunakan enkripsi data dan sistem keamanan berstandar tinggi. Data pribadi Anda hanya digunakan untuk keperluan pelaporan.' },
  { q: 'Bisakah saya melacak laporan?', a: 'Ya! Setiap laporan mendapat kode tiket unik. Anda bisa melacak status laporan kapan saja melalui halaman "Cek Status" atau dashboard pribadi Anda.' },
  { q: 'Bagaimana jika laporan saya ditolak?', a: 'Jika laporan ditolak, Anda akan menerima notifikasi beserta alasan penolakan. Anda dapat memperbaiki dan mengirim ulang laporan sesuai saran yang diberikan.' },
];

export const AboutPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
        <PageBreadcrumb items={[{ label: 'FAQ & Tentang' }]} />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">Tentang SIPIL BAUBAU</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sistem Pengaduan Infrastruktur Berbasis Web dengan Pemetaan Lokasi dan Monitoring Penanganan Laporan
          </p>
        </div>

        {/* About */}
        <Card>
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground">Latar Belakang</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SIPIL BAUBAU merupakan inovasi digital Pemerintah Kota Baubau dalam meningkatkan kualitas pelayanan publik, 
              khususnya dalam penanganan kerusakan infrastruktur kota. Dengan memanfaatkan teknologi informasi geografis (GIS), 
              masyarakat dapat melaporkan kerusakan secara langsung dan memantau progress penanganan secara real-time.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sistem ini dikembangkan sebagai bagian dari transformasi digital menuju Smart City Baubau, 
              sejalan dengan visi Pemerintah Kota Baubau untuk mewujudkan pelayanan publik yang prima, transparan, dan akuntabel.
            </p>
          </div>
        </Card>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Card>
          <div className="text-center space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground">Hubungi Kami</h2>
            <p className="text-sm text-muted-foreground">Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi:</p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Phone, label: '(0402) 2821100', sub: 'Call Center' },
                { icon: Mail, label: 'pengaduan@baubaukota.go.id', sub: 'Email' },
                { icon: MapPin, label: 'Gedung Pusat Pemerintahan, Palagimata', sub: 'Kantor' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.sub} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
