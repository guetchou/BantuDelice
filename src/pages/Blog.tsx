import React from "react";
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const articles = [
  {
    title: "Lancement de la nouvelle app Bantudelice",
    date: "2024-06-01",
    excerpt: "Découvrez les nouveautés de notre application et comment elle révolutionne la livraison et la mobilité à Brazzaville.",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Nos partenaires s'engagent pour la qualité",
    date: "2024-05-15",
    excerpt: "Rencontrez nos partenaires et découvrez comment nous garantissons un service premium à chaque étape.",
    image: "https://images.unsplash.com/photo-1515169067865-5387a5b0a3a6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Innovation et impact local : notre mission",
    date: "2024-04-20",
    excerpt: "Comment Bantudelice transforme le quotidien grâce à la tech et à l'innovation locale.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center min-h-[420px] md:min-h-[520px] bg-gradient-to-br from-orange-500 to-orange-300 overflow-hidden mb-16 pt-[72px]">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className="absolute inset-0 w-full h-full z-0"
        >
          <SwiperSlide>
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop" alt="Blog Bantudelice" className="w-full h-full object-cover object-center scale-110 opacity-30 transition-transform duration-1000" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://images.unsplash.com/photo-1515169067865-5387a5b0a3a6?q=80&w=1200&auto=format&fit=crop" alt="Actualités Bantudelice" className="w-full h-full object-cover object-center scale-110 opacity-30 transition-transform duration-1000" />
          </SwiperSlide>
        </Swiper>
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4 drop-shadow-lg">Le Blog Bantudelice</h1>
          <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl mb-6 drop-shadow">Actus, coulisses, innovations et conseils pour mieux vivre la mobilité et la livraison au quotidien.</p>
          <Button asChild size="lg" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow hover:bg-orange-100 transition">
            <a href="#newsletter">S'abonner à la newsletter</a>
          </Button>
        </div>
      </section>

      {/* Articles récents */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center text-orange-600">À la une</h2>
        <div className="grid gap-8 max-w-4xl w-full grid-cols-1 md:grid-cols-2">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-4 flex flex-col hover:scale-105 transition-transform duration-300">
              <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h2 className="text-xl font-bold mb-2">{a.title}</h2>
              <p className="text-gray-500 text-sm mb-2">{a.date}</p>
              <p className="text-gray-700 mb-4">{a.excerpt}</p>
              <Button className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-orange-600 transition self-start">Lire l'article</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Campagne newsletter */}
      <section id="newsletter" className="w-full bg-gradient-to-r from-orange-500 to-orange-400 py-14 px-4 text-center rounded-t-3xl shadow-xl mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Restez informé</h2>
        <p className="mb-6 max-w-2xl mx-auto text-white/90">Recevez nos dernières actus, conseils et offres exclusives directement dans votre boîte mail. Ne manquez rien de la révolution Bantudelice !</p>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input type="email" placeholder="Votre email" className="px-4 py-3 rounded-full border-none shadow text-gray-700 focus:outline-none w-full sm:w-auto" required />
          <Button type="submit" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow hover:bg-orange-100 transition">S'abonner</Button>
        </form>
      </section>
    </div>
  );
} 