
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Share2,
  MessageCircle,
  Heart,
  ChevronRight
} from 'lucide-react';

const SocialSection = () => {
  const socialPosts = [
    {
      id: 'post1',
      platform: 'instagram',
      icon: <Instagram className="h-4 w-4" />,
      username: '@buntudelice',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop',
      caption: 'Découvrez notre nouvelle sélection de restaurants de saison 🍽️ #gastronomie #brazzaville',
      likes: 432,
      comments: 28,
      date: 'il y a 2 jours'
    },
    {
      id: 'post2',
      platform: 'facebook',
      icon: <Facebook className="h-4 w-4" />,
      username: 'Buntudelice',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop',
      caption: 'Promotion exclusive ce weekend: -20% sur toutes vos courses en taxi! 🚕 Utilisez le code WEEKEND20',
      likes: 215,
      comments: 42,
      date: 'il y a 3 jours'
    },
    {
      id: 'post3',
      platform: 'twitter',
      icon: <Twitter className="h-4 w-4" />,
      username: '@buntudelice',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop',
      caption: 'Nous sommes fiers d\'avoir livré notre 10 000ème commande aujourd\'hui! Merci pour votre confiance 🎉',
      likes: 189,
      comments: 15,
      date: 'il y a 5 jours'
    }
  ];

  const socialLinks = [
    { 
      platform: 'Facebook', 
      icon: <Facebook className="h-5 w-5" />, 
      username: '@buntudelice', 
      url: 'https://facebook.com',
      color: 'bg-blue-600'
    },
    { 
      platform: 'Instagram', 
      icon: <Instagram className="h-5 w-5" />, 
      username: '@buntudelice', 
      url: 'https://instagram.com',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    { 
      platform: 'Twitter', 
      icon: <Twitter className="h-5 w-5" />, 
      username: '@buntudelice', 
      url: 'https://twitter.com',
      color: 'bg-blue-400'
    },
    { 
      platform: 'Youtube', 
      icon: <Youtube className="h-5 w-5" />, 
      username: 'Buntudelice', 
      url: 'https://youtube.com',
      color: 'bg-red-600'
    }
  ];

  const platformColors = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    facebook: 'bg-blue-600',
    twitter: 'bg-blue-400'
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-4">
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Réseaux Sociaux
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Rejoignez notre communauté</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Suivez-nous sur les réseaux sociaux pour découvrir nos dernières actualités, 
            promotions exclusives et partager vos expériences avec nous
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {socialPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <div className={`${platformColors[post.platform as keyof typeof platformColors]} text-white rounded-full py-1 px-3 flex items-center text-xs font-medium`}>
                    {post.icon}
                    <span className="ml-1">{post.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  {post.caption}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-gray-400 text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-400 text-sm">{post.comments}</span>
                    </div>
                  </div>
                  
                  <span className="text-gray-500 text-xs">
                    {post.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:w-1/3"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Suivez-nous</h3>
              <p className="text-gray-300 mb-6">
                Restez connecté avec notre communauté et ne manquez aucune mise à jour
              </p>
              
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                    viewport={{ once: true }}
                    className={`flex items-center p-3 rounded-lg ${link.color} text-white transition-transform transform hover:translate-x-1`}
                  >
                    <div className="mr-3">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{link.platform}</div>
                      <div className="text-xs opacity-80">{link.username}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-60" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:w-2/3"
          >
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:w-3/5">
                  <h3 className="text-xl font-bold text-white mb-2">Partagez votre expérience</h3>
                  <p className="text-gray-300 mb-4">
                    Utilisez le hashtag <span className="text-indigo-400 font-semibold">#BuntudeliceExperience</span> 
                    pour partager vos moments avec nous et avoir une chance d'être mis en avant sur nos réseaux sociaux
                  </p>
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager maintenant
                  </Button>
                </div>
                
                <div className="md:w-2/5 grid grid-cols-3 gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2080&auto=format&fit=crop" 
                    alt="User shared content" 
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=2065&auto=format&fit=crop" 
                    alt="User shared content" 
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2010&auto=format&fit=crop" 
                    alt="User shared content" 
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop" 
                    alt="User shared content" 
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop" 
                    alt="User shared content" 
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <div className="w-full h-20 bg-indigo-600/60 rounded-lg flex items-center justify-center text-white font-bold">
                    +143
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                  <Instagram className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Instagram Live</div>
                  <div className="text-sm text-gray-400">Tous les vendredis à 18h</div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                  <Youtube className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Chaîne Youtube</div>
                  <div className="text-sm text-gray-400">Tutoriels & recettes</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
