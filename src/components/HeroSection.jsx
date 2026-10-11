import Image from 'next/image';
import { ArrowRight } from '@/components/Icons';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-date">সর্বশেষ আপডেট · {new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</span>
          <h1>আজকের বাজারের দাম এক নজরে</h1>
          <p>চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারদরভিত্তিক বিস্তারিত, দ্রুত, সর্বনিম্ন-সর্বাধিক এবং বাজার পরিবর্তন এক জায়গায়।</p>
          <a href="#সব-পণ্য" className="btn btn-primary">সব পণ্য দেখুন <ArrowRight size={16} /></a>
        </div>
        <div className="hero-art">
          <Image src="/images/bazar-hero.png" alt="তাজা বাজারের পণ্যে ভরা ঝুড়ি" width={315} height={263} priority />
        </div>
      </div>
    </section>
  );
}
