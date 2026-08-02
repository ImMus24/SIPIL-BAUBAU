import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const faqs = [
  {
    q: 'Apa itu SIPIL BAUBAU?',
    a: 'SIPIL BAUBAU adalah Sistem Pengaduan Infrastruktur Berbasis Web yang dikembangkan oleh Pemerintah Kota Baubau. Platform ini memungkinkan masyarakat melaporkan kerusakan infrastruktur seperti jalan rusak, lampu jalan mati, saluran air tersumbat, dan masalah fasilitas umum lainnya secara online.',
  },
  {
    q: 'Bagaimana cara melaporkan pengaduan?',
    a: 'Anda dapat melaporkan pengaduan melalui halaman "Buat Pengaduan". Cukup pilih kategori, isi detail laporan, unggah foto, dan tandai lokasi di peta. Setelah dikirim, Anda akan mendapatkan kode tiket untuk melacak status laporan.',
  },
  {
    q: 'Apakah saya perlu mendaftar untuk melaporkan?',
    a: 'Tidak wajib, namun sangat disarankan. Masyarakat yang terdaftar dapat memantau status pengaduan, melihat riwayat laporan, dan menerima notifikasi perkembangan terbaru.',
  },
  {
    q: 'Bagaimana cara melacak status pengaduan?',
    a: 'Masukkan kode tiket yang Anda terima setelah melaporkan di halaman "Lacak Pengaduan". Anda juga bisa login untuk melihat semua laporan yang pernah Anda buat.',
  },
  {
    q: 'Berapa lama proses penanganan pengaduan?',
    a: 'Waktu penanganan tergantung pada jenis dan tingkat urgensi laporan. Tim teknis OPD akan memproses sesuai prioritas. Anda akan mendapatkan notifikasi setiap ada perkembangan terbaru.',
  },
  {
    q: 'Kategori infrastruktur apa saja yang bisa dilaporkan?',
    a: 'Anda dapat melaporkan berbagai jenis kerusakan infrastruktur termasuk: jalan dan jembatan, drainase/saluran air, penerangan jalan umum, fasilitas umum, bangunan pemerintah, dan infrastruktur lainnya.',
  },
  {
    q: 'Bagaimana jika saya lupa kode tiket?',
    a: 'Jika Anda terdaftar sebagai pengguna, Anda dapat login dan melihat seluruh riwayat laporan Anda di dashboard. Jika tidak terdaftar, Anda dapat menghubungi helpdesk SIPIL BAUBAU untuk bantuan.',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. SIPIL BAUBAU menggunakan enkripsi data dan mengikuti standar keamanan informasi pemerintah. Data pribadi Anda hanya digunakan untuk keperluan penanganan laporan dan tidak akan disebarluaskan.',
  },
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-foreground font-medium">FAQ</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Pertanyaan Umum (FAQ)</h1>
      <p className="text-muted-foreground mb-10">
        Temukan jawaban atas pertanyaan yang sering diajukan tentang SIPIL BAUBAU.
      </p>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-sm leading-relaxed">{faq.q}</span>
                <ChevronDown className={cn(
                  'w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180'
                )} />
              </button>
              <div className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-96 pb-5 px-5' : 'max-h-0'
              )}>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Tidak menemukan jawaban? Hubungi kami
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
        >
          Hubungi Helpdesk
        </Link>
      </div>
    </div>
  );
}

export default FAQPage;
