import '../styles/globals.css';
import Header from '@/components/Header';
import { Inter } from 'next/font/google';
import Footer from "../components/Footer"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Планувальник подій',
  description: 'Календар подій з Firebase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className="h-full">
      <body className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}