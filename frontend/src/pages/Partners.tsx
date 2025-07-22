import React from "react";
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const avantages = [
  {
    icon: '🤝',
    title: 'Visibilité accrue',
    desc: "Touchez une large clientèle locale et internationale grâce à notre plateforme."
  },
  {
    icon: '🛠️',
    title: 'Outils digitaux performants',
    desc: "Gérez vos offres, suivez vos performances et optimisez votre activité en temps réel."
  },
  {
    icon: '💡',
    title: 'Accompagnement personnalisé',
    desc: "Bénéficiez d’un support dédié et de conseils sur-mesure pour booster votre croissance."
  },
];

const testimonials = [
  {
    name: 'Le Gourmet Congolais',
    text: "Grâce à Bantudelice, notre restaurant a doublé sa clientèle en 6 mois !",
    img: 'https://images.unsplash.com/photo-1515169067865-5387a5b0a3a6?q=80&w=1200&auto=format&fit=crop'
  },
  {
    name: 'Saveurs d’Afrique',
    text: "Un accompagnement professionnel et une équipe à l’écoute.",
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop'
  },
];

export default function Partners() {
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
            <img src="https://images.unsplash.com/photo-1515169067865-5387a5b0a3a6?q=80&w=1200&auto=format&fit=crop" alt="Devenir partenaire Bantudelice" className="w-full h-full object-cover object-center scale-110 opacity-30 transition-transform duration-1000" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop" alt="Partenaires Bantudelice" className="w-full h-full object-cover object-center scale-110 opacity-30 transition-transform duration-1000" />
          </SwiperSlide>
        </Swiper>
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4 drop-shadow-lg">Devenir partenaire Bantudelice</h1>
          <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl mb-6 drop-shadow">Rejoignez notre réseau et bénéficiez d’une visibilité unique, d’outils digitaux performants et d’un accompagnement sur-mesure.</p>
          <Button asChild size="lg" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow hover:bg-orange-100 transition">
            <a href="#partenariat">Devenir partenaire</a>
          </Button>
        </div>
      </section>

      {/* Avantages */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center text-orange-600">Pourquoi devenir partenaire ?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {avantages.map((a, i) => (
            <div key={i} className="flex flex-col items-center bg-white rounded-xl shadow p-8 w-56 mb-2 hover:scale-105 transition-transform duration-300">
              <span className="text-4xl mb-2">{a.icon}</span>
              <h3 className="font-bold mt-2 mb-1 text-orange-600">{a.title}</h3>
              <p className="text-gray-500 text-sm text-center">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campagne partenariat */}
      <section id="partenariat" className="w-full bg-gradient-to-r from-orange-500 to-orange-400 py-14 px-4 text-center rounded-t-3xl shadow-xl mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Campagne partenaires 2025</h2>
        <p className="mb-6 max-w-2xl mx-auto text-white/90">Vous souhaitez booster votre activité ? Rejoignez Bantudelice et profitez d’un accompagnement premium, d’une clientèle fidèle et d’outils digitaux innovants. Ensemble, allons plus loin !</p>
        <Button asChild size="lg" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow hover:bg-orange-100 transition">
          <a href="mailto:partners@bantudelice.com">Devenir partenaire</a>
        </Button>
      </section>

      {/* Témoignages partenaires */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center text-orange-600">Ils témoignent</h2>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
          slidesPerView={1}
          className="max-w-2xl mx-auto"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center animate-fade-in">
                <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4 object-cover shadow" />
                <h3 className="text-xl font-bold mb-1 text-orange-600">{t.name}</h3>
                <p className="text-gray-600 text-base">{t.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
} 