import React from 'react';
import './globals.css';
import { WalletProvider } from '@/lib/wallet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/providers/ToastProvider';

export const metadata = {
  title: 'OCPR - On-Chain Patient Records',
  description: 'Privacy-preserving, consented medical records on-chain',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50">
        <WalletProvider>
          <ToastProvider />
          <Navbar />
          <main className="container-px mx-auto max-w-6xl py-8">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
