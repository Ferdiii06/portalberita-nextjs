// pages/_app.js
import { NewsProvider } from '../context/NewsContext';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <NewsProvider>
        <Head>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </NewsProvider>
    </ThemeProvider>
  );
}

export default MyApp;