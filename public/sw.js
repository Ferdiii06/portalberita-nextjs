self.addEventListener('push', function(event) {
  let data = {
    title: 'Berita Terkini - Insight Berita',
    body: 'Ada pembaruan berita terbaru untuk Anda.',
    url: '/'
  };
  
  if (event.data) {
    try {
      const parsedData = event.data.json();
      data = { ...data, ...parsedData };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/images/news-placeholder.svg',
    badge: '/images/news-placeholder.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      url: data.url
    },
    actions: [
      { action: 'explore', title: 'Baca Sekarang' },
      { action: 'close', title: 'Tutup' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action !== 'close') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
