import { useState, useEffect } from 'react';

export default function Comments({ newsId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [isi, setIsi] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [total, setTotal] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchComments = async () => {
    if (!newsId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?newsId=${newsId}`);
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!nama.trim() || !isi.trim()) {
      setError('Nama dan komentar wajib diisi.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, nama: nama.trim(), email: email.trim(), isi: isi.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Komentar berhasil dikirim.');
        setIsi('');
        setTimeout(() => {
          setSuccess(null);
          setIsFormOpen(false);
        }, 3000);
      } else {
        setError(data.error || 'Gagal mengirim komentar.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!newsId) return;
    fetchComments();

    const eventSource = new EventSource('/api/stream');
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'comment:new' && parsed.data.newsId === newsId) {
          setComments((prev) => [parsed.data, ...prev]);
          setTotal((prev) => prev + 1);
        }
      } catch (err) {}
    };

    return () => eventSource.close();
  }, [newsId]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
          Komentar ({total})
        </h3>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
        >
          {isFormOpen ? 'Tutup Formulir' : 'Tulis Komentar'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={submitComment} className="mb-12 bg-gray-50 p-6 md:p-8 rounded-lg animate-fade-in-up border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Anda *"
                className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 font-serif text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (Opsional)"
                className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 font-serif text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="mb-6">
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Pendapat Anda mengenai artikel ini..."
              className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 font-serif text-gray-900 placeholder-gray-400 resize-none h-24"
              required
            />
          </div>

          {error && <div className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4">{error}</div>}
          {success && <div className="text-green-600 text-xs font-bold uppercase tracking-widest mb-4">{success}</div>}

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-gray-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-400 italic font-serif py-4">Memuat diskusi...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-400 italic font-serif py-4">Belum ada tanggapan. Jadilah yang pertama memberikan perspektif Anda.</div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="pb-8 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-gray-900">{comment.nama}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{formatTime(comment.createdAt)}</span>
              </div>
              <p className="font-serif text-gray-700 leading-relaxed text-lg">
                {comment.isi}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}