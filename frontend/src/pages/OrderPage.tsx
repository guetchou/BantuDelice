import React from 'react';
import { useCart } from '@/hooks/useCart';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
// Animation Lottie (CDN)
const Lottie = (props: unknown) => <iframe src="https://lottie.host/embed/2e2e1b7b-2e2e-4e2e-8e2e-2e2e2e2e2e2e/2e2e2e2e.json" style={{border:0,width:120,height:120,background:'none'}} title="Lottie animation" />;
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import { usePushNotifications } from '../hooks/usePushNotifications';

const paymentMethods = [
  { label: 'Paiement à la livraison', value: 'cod' },
  { label: 'Mobile Money (Momo, Airtel Money)', value: 'mobile' },
  { label: 'Carte bancaire', value: 'card' },
];

const DELIVERY_FEE = 1000;
const ESTIMATED_TIME = 30; // minutes

function generateOrderCode() {
  return 'CMD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function getOrderStatusStep(step: number) {
  switch (step) {
    case 0: return 'Commande reçue';
    case 1: return 'En préparation';
    case 2: return 'En cours de livraison';
    case 3: return 'Livrée';
    default: return '';
  }
}

function getClientBadge(orderCount: number) {
  if (orderCount > 10) return { label: 'Client fidèle', color: 'bg-yellow-400' };
  if (orderCount > 1) return { label: 'Client régulier', color: 'bg-blue-400' };
  return { label: 'Nouveau client', color: 'bg-green-400' };
}

function generateReceipt(order: unknown) {
  const win = window.open('', '', 'width=600,height=800');
  win.document.write(`<h2>Reçu de commande Buntudelice</h2>`);
  win.document.write(`<p><b>Code :</b> ${order.code}</p>`);
  win.document.write(`<p><b>Nom :</b> ${order.name}</p>`);
  win.document.write(`<p><b>Adresse :</b> ${order.address}</p>`);
  win.document.write(`<p><b>Téléphone :</b> ${order.phone}</p>`);
  win.document.write(`<p><b>Total :</b> ${order.total} FCFA</p>`);
  win.document.write(`<ul>`);
  order.items.forEach(item => {
    win.document.write(`<li>${item.name} x${item.quantity} - ${item.total} FCFA</li>`);
  });
  win.document.write(`</ul>`);
  win.document.close();
  win.print();
}

const timelineIcons = [
  <svg key="0" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18" stroke="#f59e42" strokeWidth="2" strokeLinecap="round"/><rect x="8" y="8" width="8" height="8" rx="2" fill="#f59e42"/></svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17l6-6 4 4 6-6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
];

const driver = {
  name: 'Jean Livreur',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  rating: 4.9,
  vehicle: 'Moto',
};

function playDing() {
  const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae1b2.mp3');
  audio.play();
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    window.speechSynthesis.speak(utter);
  }
}

export default function OrderPage() {
  const { items, total, clearCart } = useCart();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [payment, setPayment] = React.useState('cod');
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [orderCode, setOrderCode] = React.useState('');
  const [orderStep, setOrderStep] = React.useState(0);
  const [showQR, setShowQR] = React.useState(false);
  const [orderCount, setOrderCount] = React.useState(0);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [eta, setEta] = React.useState(ESTIMATED_TIME * 60); // en secondes
  const [feedback, setFeedback] = React.useState<number|null>(null);
  const [feedbackComment, setFeedbackComment] = React.useState('');
  const [showMap, setShowMap] = React.useState(false);
  const [driverPos, setDriverPos] = React.useState(0); // 0=start, 1=arrivé
  const [showChat, setShowChat] = React.useState(false);
  // Chat temps réel
  const [chatMessages, setChatMessages] = React.useState<{from: string, text: string, time: string}[]>([]);
  const [chatInput, setChatInput] = React.useState('');
  const [socket, setSocket] = React.useState<unknown>(null);
  const userAvatar = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(name || 'Client');
  const [showSurprise, setShowSurprise] = React.useState(false);
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [isDriverTyping, setIsDriverTyping] = React.useState(false);
  const navigate = useNavigate();
  const { token, permission, askPermission, message } = usePushNotifications();

  React.useEffect(() => {
    if (submitted && orderStep < 3) {
      const timer = setTimeout(() => {
        setOrderStep(s => s + 1);
        const stepText = getOrderStatusStep(orderStep + 1);
        toast.info(stepText);
        speak(stepText);
        if (orderStep === 2) setDriverPos(1);
        if (orderStep === 3) setShowSurprise(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
    if (submitted && orderStep === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      playDing();
      speak("Votre commande a bien été enregistrée. Merci !");
    }
  }, [submitted, orderStep]);

  React.useEffect(() => {
    const count = parseInt(localStorage.getItem('order_count') || '0', 10);
    setOrderCount(count);
  }, []);

  React.useEffect(() => {
    if (submitted && eta > 0 && orderStep < 3) {
      const timer = setTimeout(() => setEta(e => e - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [submitted, eta, orderStep]);

  React.useEffect(() => {
    if (!showChat) return;
    const s = io('http://localhost:4000');
    setSocket(s);
    s.on('chat message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
    s.on('typing', (user) => {
      if (user === 'driver') setIsDriverTyping(true);
    });
    s.on('stop typing', (user) => {
      if (user === 'driver') setIsDriverTyping(false);
    });
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [showChat]);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderCode(generateOrderCode());
    setSubmitted(true);
    clearCart();
    toast.success('Commande validée !', {
      description: 'Votre commande a bien été enregistrée.',
    });
    const count = parseInt(localStorage.getItem('order_count') || '0', 10) + 1;
    localStorage.setItem('order_count', count.toString());
    setOrderCount(count);
  };

  const handleShare = () => {
    const url = `https://buntudelice.com/track/${orderCode}`;
    const text = `Ma commande ${orderCode} sur Buntudelice :\nNom: ${name}\nAdresse: ${address}\nTéléphone: ${phone}\nTotal: ${total + DELIVERY_FEE} FCFA\nSuivi : ${url}`;
    if (navigator.share) {
      navigator.share({ title: 'Ma commande Buntudelice', text, url });
    } else {
      navigator.clipboard.writeText(text);
      toast.info('Commande copiée dans le presse-papier !');
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=Suivi%20de%20ma%20commande%20Buntudelice%20${orderCode}%20:%20https://buntudelice.com/track/${orderCode}`;
    window.open(url, '_blank');
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    const msg = {
      from: 'client',
      text: chatInput,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    socket.emit('chat message', msg);
    setChatInput('');
    socket.emit('stop typing', 'client');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    if (socket) {
      if (e.target.value) {
        socket.emit('typing', 'client');
      } else {
        socket.emit('stop typing', 'client');
      }
    }
  };

  const handleEmojiClick = (emojiData: unknown) => {
    setChatInput(chatInput + emojiData.emoji);
    setShowEmoji(false);
    if (socket) socket.emit('typing', 'client');
  };

  const badge = getClientBadge(orderCount);
  const etaMin = Math.floor(eta / 60);
  const etaSec = eta % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] flex flex-col items-center justify-start pt-8 px-2">
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-green-100 text-green-700 font-semibold shadow transition">
            <span className="text-xl">🏠</span> Accueil
          </button>
          <button onClick={askPermission} className={`flex items-center gap-2 px-4 py-2 rounded-full ${permission==='granted' ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-700'} font-semibold shadow transition`}>
            <span className="text-xl">🔔</span> {permission==='granted' ? 'Notifications activées' : 'Activer les notifications'}
          </button>
        </div>
        {permission==='granted' && token && (
          <div className="text-xs text-gray-500 mb-2 break-all">Token push : {token}</div>
        )}
        {message && (
          <div className="bg-yellow-100 text-yellow-800 rounded px-3 py-2 mb-2 text-sm shadow">Notification reçue : {message.notification?.title} - {message.notification?.body}</div>
        )}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 backdrop-blur rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`}>{badge.label}</span>
            <span className="text-xs text-gray-400">Commande #{orderCount + (submitted ? 0 : 1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block text-xs text-gray-500">Code</span>
            <span className="font-mono text-lg font-bold tracking-widest text-green-700">{orderCode || 'À générer'}</span>
          </div>
        </div>
        {/* Timeline horizontale */}
        <div className="flex items-center justify-between mt-8 mb-8 px-2">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`rounded-full p-2 shadow-lg transition-all duration-300 ${orderStep >= i ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-110' : 'bg-gray-200 text-gray-400'}`}>{timelineIcons[i]}</div>
              <span className={`mt-2 text-xs font-semibold ${orderStep >= i ? 'text-green-700' : 'text-gray-400'}`}>{getOrderStatusStep(i)}</span>
              {i < 3 && <div className={`h-1 w-full ${orderStep > i ? 'bg-green-400' : 'bg-gray-200'} rounded transition-all duration-300`}></div>}
            </div>
          ))}
        </div>
      </div>
      {submitted ? (
        <>
          <Card className="max-w-lg w-full mx-auto p-8 text-center bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-extrabold text-gray-900 mb-2">Merci pour votre commande !</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">Livraison prévue :</span>
                <span className="font-bold text-lg text-green-700">{etaMin} min {etaSec.toString().padStart(2, '0')}s</span>
              </div>
              <div className="mb-4 flex items-center justify-center gap-4">
                <img src={driver.avatar} alt="Livreur" className="w-14 h-14 rounded-full border-2 border-green-400 shadow" />
                <div className="text-left">
                  <div className="font-semibold text-gray-800">{driver.name}</div>
                  <div className="text-xs text-gray-500">{driver.vehicle} • ⭐ {driver.rating}</div>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Adresse :</span> <span>{address}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Téléphone :</span> <span>{phone}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Mode de paiement :</span> <span>{paymentMethods.find(m => m.value === payment)?.label}</span>
              </div>
              {comment && (
                <div className="mb-2">
                  <span className="font-semibold">Commentaire :</span> <span>{comment}</span>
                </div>
              )}
              <div className="mt-6 flex flex-col md:flex-row items-center gap-2 justify-center">
                <Button variant="outline" onClick={handleShare} className="rounded-full px-6 py-2 text-base font-semibold shadow hover:bg-green-50 transition">Partager ma commande</Button>
                <Button variant="outline" onClick={() => generateReceipt({ code: orderCode, name, address, phone, total: total + DELIVERY_FEE, items })} className="rounded-full px-6 py-2 text-base font-semibold shadow hover:bg-blue-50 transition">Télécharger le reçu PDF</Button>
                <Button variant="ghost" onClick={() => setShowQR(q => !q)} className="rounded-full px-6 py-2 text-base font-semibold shadow hover:bg-gray-100 transition">{showQR ? 'Cacher' : 'Afficher'} le QR code de suivi</Button>
                <Button variant="ghost" onClick={() => setShowMap(m => !m)} className="rounded-full px-6 py-2 text-base font-semibold shadow hover:bg-gray-100 transition">{showMap ? 'Cacher' : 'Suivre le livreur'}</Button>
                <Button variant="ghost" onClick={handleWhatsApp} className="rounded-full px-6 py-2 text-base font-semibold shadow hover:bg-green-100 transition">Suivre sur WhatsApp</Button>
                <Button variant="ghost" onClick={() => setShowChat(c => !c)} className="rounded-full px-6 py-2 text-base font-semibold shadow hover:bg-blue-100 transition">{showChat ? 'Cacher' : 'Chat avec le livreur'}</Button>
              </div>
              {showQR && (
                <div className="mt-4 bg-white p-4 rounded-xl shadow inline-block border border-gray-200">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://buntudelice.com/track/${orderCode}`} alt="QR code de suivi" />
                  <div className="text-xs text-gray-500 mt-1">Scannez pour suivre la commande</div>
                </div>
              )}
              {showMap && (
                <div className="mt-6 w-full flex flex-col items-center">
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-200 shadow relative">
                    {/* Carte OSM simulée */}
                    <img src="https://static-maps.yandex.ru/1.x/?lang=fr_FR&ll=15.2429,-4.2634&z=13&l=map&size=450,200" alt="Carte" className="w-full h-full object-cover" />
                    <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000" style={{left: `${driverPos === 0 ? '25%' : '75%'}`}}>
                      <span className="text-3xl">🛵</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/80 rounded px-2 py-1 text-xs text-gray-700 shadow">Livreur : {driver.name}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Suivi du livreur (simulation)</div>
                </div>
              )}
              {showChat && (
                <div className="mt-6 w-full max-w-md mx-auto bg-white/90 rounded-xl shadow border border-gray-200 p-4 flex flex-col" style={{backdropFilter:'blur(8px)'}}>
                  <div className="font-semibold mb-2 text-green-700 flex items-center gap-2">
                    <img src={driver.avatar} alt="Livreur" className="w-8 h-8 rounded-full border-2 border-green-400 shadow" />
                    Chat avec {driver.name}
                  </div>
                  <div className="flex-1 flex flex-col gap-2 mb-2 overflow-y-auto max-h-60" style={{scrollBehavior:'smooth'}}>
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex items-end gap-2 ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}>
                        {msg.from === 'driver' && <img src={driver.avatar} alt="Livreur" className="w-7 h-7 rounded-full border border-green-300" />}
                        <div className={`px-3 py-2 rounded-2xl text-sm shadow ${msg.from === 'client' ? 'bg-green-100 text-gray-800' : 'bg-blue-100 text-gray-800'} max-w-[70%] break-words`}>
                          <span>{msg.text}</span>
                          <div className="text-[10px] text-gray-400 mt-1 text-right">{msg.time}</div>
                        </div>
                        {msg.from === 'client' && <img src={userAvatar} alt="Moi" className="w-7 h-7 rounded-full border border-gray-300" />}
                      </div>
                    ))}
                    {isDriverTyping && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <img src={driver.avatar} alt="Livreur" className="w-5 h-5 rounded-full border border-green-300" />
                        {driver.name} est en train d'écrire...
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-2 relative">
                    <button type="button" onClick={() => setShowEmoji(e => !e)} className="text-2xl px-2 focus:outline-none">😊</button>
                    {showEmoji && (
                      <div className="absolute bottom-12 left-0 z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" height={350} width={300} />
                      </div>
                    )}
                    <Input
                      value={chatInput}
                      onChange={handleInputChange}
                      placeholder="Écrire un message..."
                      className="flex-1"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                    />
                    <Button type="submit" className="rounded-full px-4 py-2">Envoyer</Button>
                  </form>
                </div>
              )}
              {/* Animation Lottie (remplace par une vraie anim si besoin) */}
              {orderStep === 2 && <div className="mt-6 flex justify-center"><Lottie /></div>}
              {/* Widget feedback à la fin */}
              {orderStep === 3 && (
                <>
                  {showSurprise && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-xl shadow text-lg font-bold text-center animate-pulse">🎁 Surprise ! Vous avez gagné un bon de réduction sur votre prochaine commande !</div>
                  )}
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <div className="font-semibold text-lg mb-2">Votre avis sur la livraison</div>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setFeedback(star)} className={`text-2xl ${feedback && feedback >= star ? 'text-yellow-400' : 'text-gray-300'} transition`} aria-label={`Note ${star}`}>★</button>
                      ))}
                    </div>
                    <textarea
                      className="w-full border rounded p-2 text-sm"
                      placeholder="Un commentaire ? (optionnel)"
                      value={feedbackComment}
                      onChange={e => setFeedbackComment(e.target.value)}
                      rows={2}
                    />
                    <Button className="mt-2" onClick={() => toast.success('Merci pour votre retour !')}>Envoyer</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="max-w-lg w-full mx-auto p-8 bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-gray-900 mb-2">Valider ma commande</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Résumé du panier</h2>
            {items.length === 0 ? (
              <p>Votre panier est vide.</p>
            ) : (
              <ul className="mb-4 divide-y divide-gray-200">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between py-2 items-center gap-2">
                    <div className="flex items-center gap-2">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      )}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.options && item.options.length > 0 && (
                          <ul className="text-xs text-gray-500 ml-2">
                            {item.options.map(opt => (
                              <li key={opt.id}>+ {opt.name}: {opt.value}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <span>{item.quantity} × {item.total} FCFA</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between mb-2">
              <span>Frais de livraison</span>
              <span>{DELIVERY_FEE} FCFA</span>
            </div>
            <div className="font-bold mb-6 text-right">Total à payer : {total + DELIVERY_FEE} FCFA</div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Estimation de livraison :</span>
              <span className="font-semibold text-green-700">{ESTIMATED_TIME} min</span>
            </div>
            <form onSubmit={handleOrder} className="space-y-4">
              <Input
                placeholder="Votre nom complet"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <Input
                placeholder="Téléphone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <Input
                placeholder="Adresse de livraison"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
              <textarea
                className="w-full border rounded p-2 text-sm"
                placeholder="Commentaire pour le livreur (optionnel)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={2}
              />
              <div>
                <label className="block mb-2 font-medium">Mode de paiement</label>
                <div className="flex flex-col gap-2">
                  {paymentMethods.map(method => (
                    <label key={method.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={payment === method.value}
                        onChange={() => setPayment(method.value)}
                        className="accent-green-500"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full py-3 text-lg shadow-lg hover:from-green-500 hover:to-green-700 transition">
                Confirmer la commande
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 