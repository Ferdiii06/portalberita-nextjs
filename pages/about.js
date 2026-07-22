import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const headingRef = useRef(null);
  const sectionsRef = useRef(null);
  const devCardRef = useRef(null);

  // GSAP heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    let ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  // GSAP sections stagger on scroll
  useEffect(() => {
    if (!sectionsRef.current) return;
    let ctx = gsap.context(() => {
      const items = sectionsRef.current.querySelectorAll('.about-section');
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // GSAP dev card scroll reveal
  useEffect(() => {
    if (!devCardRef.current) return;
    let ctx = gsap.context(() => {
      gsap.from(devCardRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: devCardRef.current,
          start: 'top 88%',
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main className="bg-slate-50 dark:bg-slate-900 min-h-screen py-14 transition-colors duration-300">
        <div className="mx-auto max-w-5xl px-5">
          <section className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm transition-colors duration-300">
            <h1 ref={headingRef} className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Tentang Portal Berita</h1>
            <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
              Portal Berita adalah platform berita modern yang dirancang untuk menghadirkan informasi secara cepat, akurat, dan ringkas.
              Dibangun dengan Next.js, Tailwind CSS, dan arsitektur front-end ringan, portal ini mengutamakan performa, aksesibilitas, dan
              pengalaman membaca yang lancar di berbagai ukuran layar.
            </p>

            <div ref={sectionsRef} className="mt-10 space-y-8 text-slate-700 dark:text-slate-300">
              <div className="about-section">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Misi dan pendekatan</h2>
                <p className="mt-3 leading-7">
                  Kami bertujuan memberikan solusi publikasi berita yang terstruktur dan mudah diakses, sekaligus menjaga kesan profesional pada setiap artikel.
                  Portal ini mendukung pencarian cerdas, penyaringan kategori, dan konsumsi berita tanpa gangguan, sehingga pembaca dapat menemukan
                  konten relevan dengan cepat.
                </p>
              </div>

              <div className="about-section">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Fitur inti</h2>
                <ul className="mt-3 space-y-3 leading-7 text-slate-600 dark:text-slate-400">
                  <li>• Berita terupdate secara otomatis dengan tampilan ringkas dan mudah dinavigasi.</li>
                  <li>• Kategori berita yang jelas untuk memudahkan pembaca memilih topik sesuai minat.</li>
                  <li>• Sistem pencarian praktis untuk menemukan judul dan ringkasan artikel secara cepat.</li>
                  <li>• Struktur halaman yang responsif dan ringan, cocok untuk perangkat mobile maupun desktop.</li>
                </ul>
              </div>

              <div className="about-section">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Pendekatan teknis</h2>
                <p className="mt-3 leading-7">
                  Dengan mengandalkan Next.js, aplikasi ini memaksimalkan rendering sisi klien dan penggunaan API internal untuk
                  mengelola data berita. Tailwind CSS membantu menciptakan antarmuka yang konsisten tanpa menambah beban stylesheet besar.
                  Hasilnya adalah portal berita yang mudah dikembangkan, mudah disesuaikan, dan tetap responsif di kondisi koneksi yang beragam.
                </p>
              </div>

              <div className="about-section">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Nilai dan visi</h2>
                <p className="mt-3 leading-7">
                  Portal Berita bukan hanya sekadar tampilan; ini adalah wujud dukungan terhadap distribusi informasi yang cepat dan dapat dipercaya.
                  Visi kami adalah menyediakan pengalaman membaca berita yang profesional, namun tetap sederhana dan terfokus pada isi.
                </p>
              </div>
            </div>

            <div ref={devCardRef} className="mt-10 rounded-3xl bg-slate-50 dark:bg-slate-700/50 p-6 text-slate-700 dark:text-slate-300 shadow-inner transition-colors duration-300">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Dikembangkan oleh</p>
              <p className="mt-3 text-base leading-7">
                Ferdii06 · 2026 · Solusi front-end berita yang mengutamakan kecepatan, keterbacaan, dan fleksibilitas desain.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a href="https://www.linkedin.com/in/ferryferdiansyah51" target="_blank" rel="noreferrer" className="rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent dark:border-slate-600">
                  LinkedIn
                </a>
                <a href="https://github.com/Ferdiii06" target="_blank" rel="noreferrer" className="rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent dark:border-slate-600">
                  GitHub
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ferdiferdiansyah957@gmail.com" target="_blank" rel="noreferrer" className="rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent dark:border-slate-600">
                  Kirim Email
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

