
import React from 'react';

const SocialSection = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: '#',
      followers: '2.5K'
    },
    {
      name: 'Instagram',
      icon: '📷',
      url: '#',
      followers: '1.8K'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: '#',
      followers: '1.2K'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: '#',
      followers: '500+'
    }
  ];

  return (
    <section className="py-16 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Suivez-nous</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Restez connecté avec Buntudelice sur les réseaux sociaux
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group text-center"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {social.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{social.name}</h3>
              <p className="text-white/70 text-sm">{social.followers} abonnés</p>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Newsletter</h3>
            <p className="text-white/80 mb-6">
              Recevez nos dernières offres et nouveautés directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
