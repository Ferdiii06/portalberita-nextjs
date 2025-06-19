import '../styles/globals.css';
import { NewsProvider } from '../context/NewsContext';
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps }) {
  return (
    <NewsProvider>
      <Component {...pageProps} />
      <Footer />
    </NewsProvider>
  );
}