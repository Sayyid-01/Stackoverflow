import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { AuthProvider } from "@/lib/AuthContext";
import { Search } from "lucide-react";
import { SearchProvider } from "@/context/SearchContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Code-Quest</title>
      </Head>
      <AuthProvider>
        <SearchProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </SearchProvider>
      </AuthProvider>
    </>
  );
}


