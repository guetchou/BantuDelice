import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Données mockées pour les notifications
const notifications = [
  {
    id: 1,
    type: 'order',
    category: 'commandes',
    title: 'Commande confirmée #BANTU-2024-001',
    message: 'Votre repas "Poulet Moambé" arrive dans 25 minutes. Suivez votre livraison en temps réel.',
    time: '2 min',
    date: '2024-01-15',
    read: false,
    priority: 'high',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-green-600">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'green',
    actions: ['Suivre', 'Contacter'],
    orderId: 'BANTU-2024-001',
    restaurant: 'Restaurant Congo Authentique',
    deliveryTime: '25 min'
  },
  {
    id: 2,
    type: 'promo',
    category: 'promotions',
    title: 'Offre Flash : -30% sur les transports',
    message: 'Profitez de 30% de réduction sur tous vos trajets en taxi jusqu\'à 18h00. Code: FLASH30',
    time: '15 min',
    date: '2024-01-15',
    read: false,
    priority: 'high',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-orange-600">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      </svg>
    ),
    color: 'orange',
    actions: ['Utiliser', 'Partager'],
    promoCode: 'FLASH30',
    validUntil: '18h00'
  },
  {
    id: 3,
    type: 'system',
    category: 'systeme',
    title: 'Maintenance prévue ce soir',
    message: 'Nos services seront temporairement indisponibles de 23h00 à 02h00 pour maintenance.',
    time: '1h',
    date: '2024-01-15',
    read: true,
    priority: 'medium',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-blue-600">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'blue',
    actions: ['Plus d\'infos'],
    maintenanceTime: '23h00 - 02h00'
  },
  {
    id: 4,
    type: 'delivery',
    category: 'livraisons',
    title: 'Colis livré avec succès',
    message: 'Votre colis a été livré à l\'adresse indiquée. Merci de confirmer la réception.',
    time: '2h',
    date: '2024-01-15',
    read: false,
    priority: 'medium',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-green-600">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'green',
    actions: ['Confirmer', 'Évaluer'],
    trackingId: 'TRK-789456',
    deliveryAddress: '123 Rue de la Paix, Brazzaville'
  },
  {
    id: 5,
    type: 'reward',
    category: 'recompenses',
    title: 'Nouveau badge débloqué !',
    message: 'Félicitations ! Vous avez débloqué le badge "Client Premium" pour vos 50 commandes.',
    time: '3h',
    date: '2024-01-15',
    read: false,
    priority: 'low',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-purple-600">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'purple',
    actions: ['Voir badge', 'Partager'],
    badgeName: 'Client Premium',
    achievement: '50 commandes'
  },
  {
    id: 6,
    type: 'payment',
    category: 'paiements',
    title: 'Paiement reçu',
    message: 'Votre paiement de 12,500 FCFA a été confirmé pour la commande #BANTU-2024-002.',
    time: '4h',
    date: '2024-01-15',
    read: true,
    priority: 'medium',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-green-600">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'green',
    actions: ['Voir reçu'],
    amount: '12,500 FCFA',
    orderId: 'BANTU-2024-002'
  },
  {
    id: 7,
    type: 'social',
    category: 'social',
    title: 'Nouveau chauffeur disponible',
    message: 'Jean-Pierre est maintenant disponible pour vos trajets. Note: 4.9/5 (127 avis).',
    time: '5h',
    date: '2024-01-15',
    read: true,
    priority: 'low',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-blue-600">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'blue',
    actions: ['Réserver'],
    driverName: 'Jean-Pierre',
    rating: '4.9/5',
    reviews: 127
  },
  {
    id: 8,
    type: 'promo',
    category: 'promotions',
    title: 'Pack Famille : -25% sur 4 repas',
    message: 'Économisez 25% sur le pack famille de 4 repas traditionnels. Offre limitée !',
    time: '6h',
    date: '2024-01-15',
    read: true,
    priority: 'medium',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-orange-600">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: 'orange',
    actions: ['Commander', 'Partager'],
    discount: '25%',
    packSize: '4 repas'
  }
];

const categories = [
  { 
    id: 'all', 
    name: 'Toutes', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.length 
  },
  { 
    id: 'commandes', 
    name: 'Commandes', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'commandes').length 
  },
  { 
    id: 'promotions', 
    name: 'Promotions', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'promotions').length 
  },
  { 
    id: 'livraisons', 
    name: 'Livraisons', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'livraisons').length 
  },
  { 
    id: 'paiements', 
    name: 'Paiements', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'paiements').length 
  },
  { 
    id: 'recompenses', 
    name: 'Récompenses', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'recompenses').length 
  },
  { 
    id: 'systeme', 
    name: 'Système', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'systeme').length 
  },
  { 
    id: 'social', 
    name: 'Social', 
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-600">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    count: notifications.filter(n => n.category === 'social').length 
  }
];

const NotificationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesRead = showRead || !notification.read;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRead && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const markAsRead = (ids: number[]) => {
    // Simulation de mise à jour
    console.log('Marquer comme lu:', ids);
  };

  const deleteNotifications = (ids: number[]) => {
    // Simulation de suppression
    console.log('Supprimer notifications:', ids);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-orange-600 hover:text-orange-700">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {unreadCount} nouveau(x)
                </span>
              )}
            </div>
            
            {/* Actions en lot - Style Amazon */}
            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => markAsRead(selectedNotifications)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Marquer comme lu ({selectedNotifications.length})
                </button>
                <button 
                  onClick={() => deleteNotifications(selectedNotifications)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Supprimer ({selectedNotifications.length})
                </button>
                <button 
                  onClick={() => setSelectedNotifications([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* Barre de recherche - Style Apple */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans vos notifications..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
            />
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="absolute left-4 top-3.5 text-gray-400">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Filtres et contrôles - Style UberEats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showRead}
                  onChange={(e) => setShowRead(e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                Afficher les notifications lues
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => markAsRead(notifications.filter(n => !n.read).map(n => n.id))}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Tout marquer comme lu
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Catégories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-5 h-5">
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h3>
                  <p className="text-gray-600">Vous n'avez pas encore de notifications dans cette catégorie.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                        !notification.read ? 'bg-orange-50' : ''
                      } ${getPriorityColor(notification.priority)}`}
                      onClick={() => toggleNotificationSelection(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox de sélection */}
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleNotificationSelection(notification.id);
                          }}
                          className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />

                        {/* Icône */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(notification.color)}`}>
                            {notification.icon}
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                              
                              {/* Actions - Style Apple */}
                              <div className="flex items-center gap-3">
                                {notification.actions.map((action, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('Action:', action, 'pour notification:', notification.id);
                                    }}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Métadonnées */}
                            <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                              <span>{notification.time}</span>
                              <span>{notification.date}</span>
                            </div>
                          </div>

                          {/* Détails supplémentaires selon le type */}
                          {notification.type === 'order' && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span>Commande #{notification.orderId}</span>
                                <span>{notification.restaurant}</span>
                                <span>Livraison: {notification.deliveryTime}</span>
                              </div>
                            </div>
                          )}

                          {notification.type === 'promo' && (
                            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span>Code: {notification.promoCode}</span>
                                <span>Valide jusqu'à: {notification.validUntil}</span>
                              </div>
                            </div>
                          )}

                          {notification.type === 'reward' && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span>Badge: {notification.badgeName}</span>
                                <span>Achievement: {notification.achievement}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination - Style Amazon */}
            {filteredNotifications.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Affichage de {filteredNotifications.length} notification(s)
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Précédent
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">1 sur 3</span>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 