import React from "react";
import { Award, Users, Rocket, Heart, Star, ArrowRight, Briefcase, Smile, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const values = [
  {
    icon: <Award className="h-8 w-8 text-orange-500" />, title: 'Excellence',
    desc: "Nous visons l'excellence dans tout ce que nous entreprenons."
  },
  {
    icon: <Rocket className="h-8 w-8 text-orange-500" />, title: 'Innovation',
    desc: "Nous innovons chaque jour pour transformer la mobilité et la livraison."
  },
  {
    icon: <Heart className="h-8 w-8 text-orange-500" />, title: 'Impact',
    desc: "Nous créons un impact positif et durable pour nos clients et la société."
  },
  {
    icon: <Users className="h-8 w-8 text-orange-500" />, title: 'Diversité',
    desc: "Nous valorisons la diversité et l'esprit d'équipe."
  },
];

const testimonials = [
  {
    name: 'Fatou',
    role: 'Développeuse',
    text: "Bantudelice m'a permis de grandir professionnellement dans une équipe bienveillante et ambitieuse.",
    img: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Jean',
    role: 'Livreur',
    text: "Ici, on se sent utile et soutenu. L'ambiance est top et les opportunités réelles !",
    img: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Aminata',
    role: 'Product Manager',
    text: "Une aventure humaine et technologique, où chaque idée compte.",
    img: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
];

export default function Careers() {
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
            <img src="https://images.unsplash.com/photo-1515168833906-d2a3b82b1e1c?q=80&w=1200&auto=format&fit=crop" alt="Carrières Bantudelice" className="w-full h-full object-cover object-center scale-110 opacity-30 transition-transform duration-1000" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop" alt="Équipe Bantudelice" className="w-full h-full object-cover object-center scale-110 opacity-30 transition-transform duration-1000" />
          </SwiperSlide>
        </Swiper>
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4 drop-shadow-lg">Rejoignez l’aventure Bantudelice</h1>
          <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl mb-6 drop-shadow">Participez à la révolution de la mobilité, de la livraison et des services en Afrique centrale. Ensemble, créons l’impact de demain !</p>
          <Button asChild size="lg" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow hover:bg-orange-100 transition">
            <a href="#recrutement">Voir les offres</a>
          </Button>
        </div>
      </section>

      {/* Valeurs */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center text-orange-600">Nos valeurs</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {values.map((v, i) => (
            <div key={i} className="flex flex-col items-center bg-white rounded-xl shadow p-8 w-56 mb-2 hover:scale-105 transition-transform duration-300">
              {v.icon}
              <h3 className="font-bold mt-2 mb-1 text-orange-600">{v.title}</h3>
              <p className="text-gray-500 text-sm text-center">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-3 gap-10 items-center">
          <div className="flex flex-col items-center text-center">
            <Star className="h-10 w-10 text-yellow-400 mb-2" />
            <h3 className="font-bold text-lg mb-2">Ambiance unique</h3>
            <p className="text-gray-600">Travaillez dans une équipe soudée, bienveillante et passionnée.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Briefcase className="h-10 w-10 text-orange-500 mb-2" />
            <h3 className="font-bold text-lg mb-2">Opportunités réelles</h3>
            <p className="text-gray-600">Développez vos compétences et évoluez rapidement avec nous.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Globe className="h-10 w-10 text-blue-500 mb-2" />
            <h3 className="font-bold text-lg mb-2">Impact local & continental</h3>
            <p className="text-gray-600">Contribuez à des projets qui changent la vie de milliers de personnes.</p>
          </div>
        </div>
      </section>

      {/* Campagne de recrutement */}
      <section id="recrutement" className="w-full bg-gradient-to-r from-orange-500 to-orange-400 py-14 px-4 text-center rounded-t-3xl shadow-xl mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Campagne de recrutement 2024</h2>
        <p className="mb-6 max-w-2xl mx-auto text-white/90">Nous recrutons des talents passionnés : développeurs, livreurs, marketing, support, produit… Prêt(e) à relever le défi ? Rejoignez-nous et façonnez l’avenir de la tech et des services en Afrique !</p>
        <Button asChild size="lg" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full shadow hover:bg-orange-100 transition">
          <a href="mailto:jobs@bantudelice.com">Postuler maintenant</a>
        </Button>
      </section>

      {/* Témoignages */}
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
                <p className="text-primary mb-2">{t.role}</p>
                <p className="text-gray-600 text-base">{t.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
} 