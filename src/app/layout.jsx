import './globals.css';
import Toaster from '@/components/Toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata = { title: 'বাজার দর | BazarDor', description: 'প্রয়োজনীয় পণ্যের দাম এক নজরে দেখুন।' };
export default function RootLayout({ children }) { return <html lang="bn"><body><Header/><main>{children}</main><Footer/><Toaster/></body></html>; }
