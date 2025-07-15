import Index from "@/pages/Index";
import ColisServicePage from "@/pages/ColisServicePage";
import DeliveryPage from "@/pages/delivery";
import MapPage from "@/pages/delivery/MapPage";
import OrderPage from "@/pages/OrderPage";
import AuthPage from "@/pages/AuthPage";
import UserProfile from "@/components/UserProfile";
import UserOrders from "@/components/UserOrders";
import PaymentHistory from "@/components/payment/PaymentHistory";
import LocationPage from "@/pages/LocationPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import App from "@/App";
import Services from "@/pages/Services";
import Restaurants from "@/pages/Restaurants";
import Taxi from "@/pages/Taxi";
import TaxiBooking from "@/pages/taxi/Booking";
import TaxiHistory from "@/pages/taxi/History";
import TaxiLocations from "@/pages/taxi/Locations";
import TaxiSubscription from "@/pages/taxi/Subscription";
import TaxiBusiness from "@/pages/taxi/Business";
import Contact from "@/pages/Contact";
import Covoiturage from "@/pages/Covoiturage";
import CovoiturageBooking from "@/pages/covoiturage/Booking";
import CovoiturageDetails from "@/pages/covoiturage/Details";
import CovoiturageMyRides from "@/pages/covoiturage/MyRides";
import React from "react";
import InteractiveMap from "@/components/delivery/InteractiveMap";

const mainRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Index /> }, // Page d'accueil originale
      { path: "services/colis", element: <ColisServicePage /> },
      { path: "delivery", element: <DeliveryPage /> },
      { path: "delivery/map", element: <MapPage /> },
      { path: "services", element: <Services /> },
      { path: "restaurants", element: <Restaurants /> },
      { path: "taxi", element: <Taxi /> },
      { path: "taxi/booking", element: <TaxiBooking /> },
      { path: "taxi/history", element: <TaxiHistory /> },
      { path: "taxi/locations", element: <TaxiLocations /> },
      { path: "taxi/subscription", element: <TaxiSubscription /> },
      { path: "taxi/business", element: <TaxiBusiness /> },
      { path: "contact", element: <Contact /> },
      { 
        path: "order", 
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "auth", 
        element: (
          <ProtectedRoute requireAuth={false}>
            <AuthPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "orders", 
        element: (
          <ProtectedRoute>
            <UserOrders />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "payments", 
        element: (
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        ) 
      },
      {
        path: '/location',
        element: (
          <ProtectedRoute>
            <LocationPage />
          </ProtectedRoute>
        )
      },
      { path: "covoiturage", element: <Covoiturage /> },
      { path: "covoiturage/booking", element: <CovoiturageBooking /> },
      { path: "covoiturage/details/:id", element: <CovoiturageDetails /> },
      { path: "covoiturage/mes-trajets", element: <CovoiturageMyRides /> },
      { path: "about", element: (
        <div style={{padding:0, background: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)', minHeight: '100vh', fontFamily:'Inter, sans-serif', position:'relative'}}>
          {/* Image d'arrière-plan décorative */}
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Cuisine" style={{position:'absolute',top:0,left:0,width:'100%',height:'320px',objectFit:'cover',zIndex:0,opacity:0.18,filter:'blur(1px)'}} />
          {/* Bouton retour */}
          <div style={{position:'relative',zIndex:2,display:'flex',justifyContent:'flex-start',padding:'32px 0 0 32px'}}>
            <button onClick={()=>window.location.href='/'} style={{background:'linear-gradient(90deg,#ea580c,#fbbf24)',color:'#fff',fontWeight:700,padding:'12px 28px',border:'none',borderRadius:999,boxShadow:'0 2px 12px #ea580c33',fontSize:'1.1rem',cursor:'pointer',transition:'transform .2s',outline:'none'}} onMouseOver={e=>e.currentTarget.style.transform='scale(1.06)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>← Retour à l'accueil</button>
          </div>
          <div style={{maxWidth:900, margin:'0 auto', padding:'48px 24px', position:'relative',zIndex:2}}>
            <header className="fade-in" style={{textAlign:'center', marginBottom:40}}>
              <h1 style={{fontSize:'2.8rem', fontWeight:800, color:'#ea580c', marginBottom:12, letterSpacing:'-1px'}}>À propos de Buntudelice</h1>
              <p style={{fontSize:'1.25rem', color:'#ea580c', maxWidth:600, margin:'0 auto'}}>La plateforme qui révolutionne la livraison et les services au Congo, portée par la passion de la cuisine et de l'innovation locale.</p>
            </header>
            <section className="slide-up" style={{marginBottom:48, background:'#fff', borderRadius:24, boxShadow:'0 4px 24px #ea580c22', padding:32, transition:'box-shadow .3s,transform .3s'}}>
              <h2 style={{fontSize:'1.5rem', fontWeight:700, color:'#ea580c', marginBottom:16}}>Notre mission</h2>
              <p style={{fontSize:'1.1rem', color:'#444', lineHeight:1.7}}>
                Offrir à tous les Congolais un accès simple, rapide et sécurisé à la meilleure cuisine locale, tout en soutenant les restaurateurs, livreurs et entrepreneurs du pays. Nous croyons en une économie numérique inclusive, où chaque commande contribue à dynamiser l'écosystème local.
              </p>
            </section>
            <section className="slide-up about-card" style={{marginBottom:48, background:'#fff', borderRadius:24, boxShadow:'0 4px 24px #ea580c22', padding:32, transition:'box-shadow .3s,transform .3s'}}>
              <h2 style={{fontSize:'1.5rem', fontWeight:700, color:'#ea580c', marginBottom:16}}>Nos valeurs</h2>
              <ul style={{fontSize:'1.1rem', color:'#444', lineHeight:1.7, paddingLeft:24, display:'grid', gap:16}}>
                <li style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:22}}>🍲</span> <b>Authenticité</b> : Mettre en avant la richesse culinaire et culturelle du Congo.</li>
                <li style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:22}}>🔒</span> <b>Confiance</b> : Sécurité des paiements, fiabilité des livraisons, transparence.</li>
                <li style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:22}}>💡</span> <b>Innovation</b> : Plateforme moderne, expérience utilisateur intuitive, services évolutifs.</li>
                <li style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:22}}>🌍</span> <b>Impact local</b> : Soutien aux restaurateurs, livreurs, artisans et producteurs locaux.</li>
                <li style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:22}}>🌱</span> <b>Écologie</b> : Favoriser les circuits courts, la livraison responsable et le covoiturage.</li>
              </ul>
            </section>
            <section className="slide-up about-card" style={{marginBottom:48, background:'#fff', borderRadius:24, boxShadow:'0 4px 24px #ea580c22', padding:32, transition:'box-shadow .3s,transform .3s'}}>
              <h2 style={{fontSize:'1.5rem', fontWeight:700, color:'#ea580c', marginBottom:16}}>Notre équipe</h2>
              <div className="about-carousel">
                <div style={{textAlign:'center', flex:'1 1 180px', minWidth:180, maxWidth:220, background:'#fff7ed', borderRadius:16, boxShadow:'0 2px 8px #ea580c22', padding:20, transition:'box-shadow .3s,transform .3s'}}>
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="CEO" style={{width:90, height:90, borderRadius:'50%', marginBottom:12, boxShadow:'0 2px 8px #ea580c33'}} />
                  <div style={{fontWeight:700, color:'#ea580c'}}>Jean Mutombo</div>
                  <div style={{fontSize:'0.95rem', color:'#444'}}>Fondateur & CEO</div>
                </div>
                <div style={{textAlign:'center', flex:'1 1 180px', minWidth:180, maxWidth:220, background:'#fff7ed', borderRadius:16, boxShadow:'0 2px 8px #ea580c22', padding:20, transition:'box-shadow .3s,transform .3s'}}>
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="CTO" style={{width:90, height:90, borderRadius:'50%', marginBottom:12, boxShadow:'0 2px 8px #ea580c33'}} />
                  <div style={{fontWeight:700, color:'#ea580c'}}>Marie Loemba</div>
                  <div style={{fontSize:'0.95rem', color:'#444'}}>CTO & Tech Lead</div>
                </div>
                <div style={{textAlign:'center', flex:'1 1 180px', minWidth:180, maxWidth:220, background:'#fff7ed', borderRadius:16, boxShadow:'0 2px 8px #ea580c22', padding:20, transition:'box-shadow .3s,transform .3s'}}>
                  <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Opérations" style={{width:90, height:90, borderRadius:'50%', marginBottom:12, boxShadow:'0 2px 8px #ea580c33'}} />
                  <div style={{fontWeight:700, color:'#ea580c'}}>Thomas Ndolo</div>
                  <div style={{fontSize:'0.95rem', color:'#444'}}>Responsable Opérations</div>
                </div>
                <div style={{textAlign:'center', flex:'1 1 180px', minWidth:180, maxWidth:220, background:'#fff7ed', borderRadius:16, boxShadow:'0 2px 8px #ea580c22', padding:20, transition:'box-shadow .3s,transform .3s'}}>
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Support" style={{width:90, height:90, borderRadius:'50%', marginBottom:12, boxShadow:'0 2px 8px #ea580c33'}} />
                  <div style={{fontWeight:700, color:'#ea580c'}}>Amina Samba</div>
                  <div style={{fontSize:'0.95rem', color:'#444'}}>Support Client</div>
                </div>
              </div>
            </section>
            <section className="slide-up about-card" style={{marginBottom:48, background:'#fff', borderRadius:24, boxShadow:'0 4px 24px #ea580c22', padding:32, transition:'box-shadow .3s,transform .3s'}}>
              <h2 style={{fontSize:'1.5rem', fontWeight:700, color:'#ea580c', marginBottom:16}}>Ils nous font confiance</h2>
              <div style={{display:'flex',gap:32,flexWrap:'wrap',justifyContent:'center',alignItems:'center',marginBottom:24}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Airtel_logo.png" alt="Airtel" style={{height:40,objectFit:'contain',background:'#fff7ed',borderRadius:8,padding:8}} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/MTN_Logo.svg" alt="MTN" style={{height:40,objectFit:'contain',background:'#fff7ed',borderRadius:8,padding:8}} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Orange_logo.svg" alt="Orange" style={{height:40,objectFit:'contain',background:'#fff7ed',borderRadius:8,padding:8}} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/TotalEnergies_Logo.svg" alt="Total" style={{height:40,objectFit:'contain',background:'#fff7ed',borderRadius:8,padding:8}} />
              </div>
              <div style={{display:'flex',gap:32,flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
                <div style={{background:'#fff7ed',borderRadius:16,padding:'24px 32px',boxShadow:'0 2px 8px #ea580c22',maxWidth:320,minWidth:220}}>
                  <div style={{fontSize:'1.1rem',fontStyle:'italic',color:'#ea580c',marginBottom:8}}>&ldquo;Livraison rapide, équipe très pro et plats délicieux !&rdquo;</div>
                  <div style={{fontWeight:700,color:'#444'}}>— Chantal, cliente</div>
                </div>
                <div style={{background:'#fff7ed',borderRadius:16,padding:'24px 32px',boxShadow:'0 2px 8px #ea580c22',maxWidth:320,minWidth:220}}>
                  <div style={{fontSize:'1.1rem',fontStyle:'italic',color:'#ea580c',marginBottom:8}}>&ldquo;Grâce à Buntudelice, mon restaurant a gagné de nouveaux clients chaque semaine.&rdquo;</div>
                  <div style={{fontWeight:700,color:'#444'}}>— M. Okouba, restaurateur</div>
                </div>
              </div>
            </section>
            <section className="slide-up about-card" style={{marginBottom:48, background:'#fff', borderRadius:24, boxShadow:'0 4px 24px #ea580c22', padding:32, transition:'box-shadow .3s,transform .3s'}}>
              <h2 style={{fontSize:'1.5rem', fontWeight:700, color:'#ea580c', marginBottom:16}}>Nos chiffres clés</h2>
              <div style={{display:'flex',gap:32,flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
                <div style={{textAlign:'center',minWidth:120}}>
                  <div style={{fontSize:'2.2rem',fontWeight:800,color:'#ea580c'}}>+10 000</div>
                  <div style={{color:'#444'}}>Commandes livrées</div>
                </div>
                <div style={{textAlign:'center',minWidth:120}}>
                  <div style={{fontSize:'2.2rem',fontWeight:800,color:'#ea580c'}}>+150</div>
                  <div style={{color:'#444'}}>Restaurants partenaires</div>
                </div>
                <div style={{textAlign:'center',minWidth:120}}>
                  <div style={{fontSize:'2.2rem',fontWeight:800,color:'#ea580c'}}>98%</div>
                  <div style={{color:'#444'}}>Clients satisfaits</div>
                </div>
                <div style={{textAlign:'center',minWidth:120}}>
                  <div style={{fontSize:'2.2rem',fontWeight:800,color:'#ea580c'}}>24h/24</div>
                  <div style={{color:'#444'}}>Service disponible</div>
                </div>
              </div>
            </section>
            <section className="slide-up about-card" style={{marginBottom:0, background:'#fff', borderRadius:24, boxShadow:'0 4px 24px #ea580c22', padding:32, textAlign:'center', transition:'box-shadow .3s,transform .3s'}}>
              <h2 style={{fontSize:'1.5rem', fontWeight:700, color:'#ea580c', marginBottom:16}}>Envie de rejoindre l’aventure ?</h2>
              <p style={{fontSize:'1.1rem', color:'#444', marginBottom:24}}>Nous recrutons des talents passionnés par la tech, la logistique, la cuisine et l’expérience client. <br/> <a href="/careers" style={{color:'#ea580c', textDecoration:'underline'}}>Voir nos offres</a></p>
              <a href="/contact" style={{display:'inline-block', background:'linear-gradient(90deg,#ea580c,#f472b6)', color:'#fff', fontWeight:700, borderRadius:12, padding:'14px 36px', fontSize:'1.1rem', boxShadow:'0 2px 8px #ea580c33', textDecoration:'none', transition:'background 0.2s'}}>Contactez-nous</a>
            </section>
          </div>
        </div>
      ) },
      { path: "careers", element: <div style={{padding:40}}><h1>Carrières</h1><p>Rejoignez notre équipe !</p></div> },
      { path: "partners", element: <div style={{padding:40}}><h1>Partenaires</h1><p>Nos partenaires et collaborations.</p></div> },
      { path: "help", element: <div style={{padding:40}}><h1>Aide</h1><p>Centre d'aide et support.</p></div> },
      { path: "faq", element: <div style={{padding:40}}><h1>FAQ</h1><p>Questions fréquemment posées.</p></div> },
      { path: "terms", element: <div style={{padding:40}}><h1>Conditions d'utilisation</h1><p>Conditions générales du service.</p></div> },
      { path: "privacy", element: <div style={{padding:40}}><h1>Confidentialité</h1><p>Politique de confidentialité.</p></div> },
      { path: "map", element: (
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',background:'linear-gradient(120deg,#fbbf24 0%,#f472b6 100%)',fontFamily:'Inter,sans-serif',padding:'0 16px'}}>
          <div style={{width:'100%',maxWidth:900,margin:'32px auto 0',display:'flex',justifyContent:'flex-start'}}>
            <button onClick={()=>window.location.href='/'} style={{background:'linear-gradient(90deg,#ea580c,#fbbf24)',color:'#fff',fontWeight:700,padding:'12px 28px',border:'none',borderRadius:999,boxShadow:'0 2px 12px #ea580c33',fontSize:'1.1rem',cursor:'pointer',transition:'transform .2s',outline:'none'}} onMouseOver={e=>e.currentTarget.style.transform='scale(1.06)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>← Retour à l'accueil</button>
          </div>
          <div style={{width:'100%',maxWidth:900,margin:'32px auto'}}>
            <InteractiveMap height="500px" />
          </div>
        </div>
      ) }, 
    ],
  },
];

export default mainRoutes;
