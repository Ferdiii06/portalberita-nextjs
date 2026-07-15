// pages/_app.js
import { NewsProvider } from '../context/NewsContext';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <NewsProvider>
      <Head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </NewsProvider>
  );
}

export default MyApp;