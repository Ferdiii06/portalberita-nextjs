// components/Comments.js
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Comments({ newsId }) {
  const { theme } = useTheme();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [isi, setIsi] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [total, setTotal] = useState(0);

  // Fetch komentar
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

  // Kirim komentar
  const submitComment = async (e) => {
    e.preventDefault();
    
    if (!nama.trim() || !isi.trim()) {
      setError('Nama dan komentar wajib diisi');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsId,
          nama: nama.trim(),
          email: email.trim(),
          isi: isi.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('✅ Komentar berhasil ditambahkan!');
        setIsi('');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Gagal menambahkan komentar');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
      } catch (err) {
        console.error('Error parsing comment stream:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE comment error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [newsId]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  const styles = getStyles(theme);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <i className="bx bx-comment-dots mr-2" aria-hidden="true" /> Diskusi ({total} komentar)
      </h3>

      {/* Form Komentar */}
      <form onSubmit={submitComment} style={styles.form}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama *</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda..."
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (opsional)"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Komentar *</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            placeholder="Tulis komentar Anda..."
            style={styles.textarea}
            rows={4}
            required
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <button 
          type="submit" 
          style={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? 'Mengirim...' : (<><i className="bx bx-comment-dots mr-2" aria-hidden="true" /> Kirim Komentar</>)}
        </button>
      </form>

      {/* Daftar Komentar */}
      {loading ? (
        <div style={styles.loading}>Memuat komentar...</div>
      ) : comments.length === 0 ? (
        <div style={styles.empty}>
          <p>Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div style={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} style={styles.commentItem}>
              <div style={styles.commentHeader}>
                <span style={styles.commentAuthor}>
                  <i className="bx bx-user mr-2" aria-hidden="true" /> {comment.nama}
                </span>
                <span style={styles.commentTime}>
                  {formatTime(comment.createdAt)}
                </span>
              </div>
              <p style={styles.commentText}>{comment.isi}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const getStyles = (theme) => ({
  container: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: `2px solid ${theme === 'dark' ? '#334155' : '#f1f5f9'}`
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
    marginBottom: '20px'
  },
  form: {
    background: theme === 'dark' ? '#1e293b' : '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: theme === 'dark' ? '#cbd5e1' : '#334155'
  },
  input: {
    padding: '10px 14px',
    border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
    background: theme === 'dark' ? '#334155' : 'white',
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
  },
  textarea: {
    padding: '10px 14px',
    border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
    resize: 'vertical',
    fontFamily: 'inherit',
    background: theme === 'dark' ? '#334155' : 'white',
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
  },
  submitButton: {
    padding: '10px 24px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    marginTop: '8px'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  success: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: theme === 'dark' ? '#64748b' : '#94a3b8'
  },
  empty: {
    textAlign: 'center',
    padding: '30px',
    color: theme === 'dark' ? '#64748b' : '#94a3b8',
    background: theme === 'dark' ? '#1e293b' : '#f8fafc',
    borderRadius: '12px'
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  commentItem: {
    background: theme === 'dark' ? '#1e293b' : 'white',
    padding: '16px',
    borderRadius: '12px',
    border: `1px solid ${theme === 'dark' ? '#334155' : '#f1f5f9'}`
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  commentAuthor: {
    fontWeight: 600,
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
    fontSize: '14px'
  },
  commentTime: {
    fontSize: '12px',
    color: theme === 'dark' ? '#64748b' : '#94a3b8'
  },
  commentText: {
    color: theme === 'dark' ? '#cbd5e1' : '#475569',
    fontSize: '15px',
    lineHeight: 1.6,
    marginBottom: '8px'
  }
});