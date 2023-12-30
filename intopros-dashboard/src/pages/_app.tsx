import "../styles/globals.css";
import "antd/dist/antd.css";

import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";

import AppLayout from "../components/App/Layout";
import GlobalProvider from "../context/GlobalContext";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);

  return (
    <GlobalProvider>
      <Head>
        <title>{"Intopros's Admin portal"}</title>
        <meta name="description" content="Admin portal for Intopros" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {getLayout(<Component {...pageProps} />)}
    </GlobalProvider>
  );
}

export default MyApp;
