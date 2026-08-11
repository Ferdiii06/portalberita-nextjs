import { useEffect, useState } from 'react';

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Cek apakah browser mendukung service worker & push manager
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // Cek status izin
        if (Notification.permission === 'default') {
          // Tunda sedikit agar tidak mengganggu pembaca langsung
          setTimeout(() => setShowPrompt(true), 5000);
        } else if (Notification.permission === 'granted') {
          setSubscribed(true);
        }
      }).catch(err => console.error('SW Reg Error:', err));
    }
  }, []);

  const handleSubscribe = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setShowPrompt(false);
      setSubscribed(true);
      
      // Simulasi pendaftaran ke backend
      console.log('User subscribed to Push Notifications.');
      
      // Simulasi tes push notifikasi (hanya bekerja jika disimulasikan dari DevTools
      // atau kita panggil API notifikasi lokal menggunakan registration.showNotification)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('Berhasil Berlangganan!', {
            body: 'Anda akan menerima Breaking News langsung ke layar Anda.',
            icon: '/images/news-placeholder.svg',
          });
        });
      }
    } else {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900 text-white p-5 rounded-xl shadow-2xl z-50 animate-fade-in-up border border-gray-700">
      <div className="flex items-start gap-4">
        <div className="text-3xl">🔔</div>
        <div>
          <h4 className="font-serif font-bold text-lg mb-1">Dapatkan Breaking News!</h4>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed font-sans">
            Izinkan notifikasi agar Anda tidak tertinggal isu-isu terkini langsung di layar kunci (Lock Screen) perangkat Anda.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleSubscribe}
              className="bg-white text-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
            >
              Izinkan
            </button>
            <button 
              onClick={() => setShowPrompt(false)}
              className="bg-transparent border border-gray-600 text-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
