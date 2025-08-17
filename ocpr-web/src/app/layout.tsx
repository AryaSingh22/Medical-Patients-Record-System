import React from 'react';
import './globals.css';
import { WalletProvider } from '@/lib/wallet';

export const metadata = {
  title: 'OCPR - On-Chain Patient Records',
  description: 'Privacy-preserving, consented medical records on-chain',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
        <header style={{padding:'12px 16px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
          <div style={{fontWeight:700}}>OCPR</div>
          <nav style={{display:'flex', gap:12}}>
            <a href="/">Patient Dashboard</a>
            <a href="/clinician">Clinician Portal</a>
          </nav>
        </header>
        <main style={{maxWidth:980, margin:'24px auto', padding:'0 16px'}}>{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
