// pages/_app.js
import { NewsProvider } from '../context/NewsContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <NewsProvider>
      <Component {...pageProps} />
    </NewsProvider>
  );
}

export default MyApp;