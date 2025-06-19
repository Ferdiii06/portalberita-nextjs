import { FaFacebook, FaInstagram, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p>Email: info@portalberita.com</p>
          <p>Telepon: +62 812 3456 789</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p>Jl. Merdeka No.123, Jakarta Pusat</p>
          <p>DKI Jakarta, Indonesia</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us  </h3>
          <div className="flex space-x-4">
            <a className="text-white" href="https://facebook.com" target="_blank"  rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
            <a className="text-white" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
            <a className="text-white" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter size={24} />
            </a>
            <a className="text-white" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary mt-4 pt-4 text-center text-sm">
        <p>&copy; {year} Portal Berita. All rights reserved.</p>
      </div>
    </footer>
  );
}