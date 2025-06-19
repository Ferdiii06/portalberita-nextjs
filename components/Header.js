import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handle = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'Arsip', href: '/arsip' },
    { label: 'Input Berita', href: '/input' },
    { label: 'Tentang', href: '/about' },
  ];

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-6">
        <div className="flex items-center">
          <Link href="/" className="text-2xl text-white font-bold hover:text-black">
            Portal Berita
          </Link>
        </div>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center text-white focus:outline-none"
            aria-label="Menu"
          >
            <span className="text-3xl leading-none">&#x2807;</span>
          </button>
          {open && (
            <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg py-2 z-20">
              {menu.map(item => (
                <li key={item.href} className="hover:bg-gray-100">
                  <Link href={item.href} className="block px-4 py-2">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

