import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ShoppingBag, LogOut, Settings, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useSupabase";
import { toast } from "sonner";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Livraison de Colis", to: "/services/colis" },
  { label: "Restaurants", to: "/restaurants" },
  { label: "Contact", to: "/contact" },
  { label: "Panier", to: "/cart", icon: <ShoppingBag className="inline w-5 h-5 mb-1 mr-1" /> },
];

export default function NavbarGlassmorphism() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Cart Drawer (affiché si ouvert) */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setCartDrawerOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-black h-full shadow-xl" onClick={e => e.stopPropagation()}>
            {/* CartDrawer réel à remplacer par ton composant CartDrawer si besoin */}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Votre panier</h2>
              <button className="absolute top-4 right-4" onClick={() => setCartDrawerOpen(false)}><X /></button>
              {/* Tu peux ici importer et afficher <CartDrawer onClose={() => setCartDrawerOpen(false)} /> */}
              {/* ... */}
              <p>Contenu du panier ici...</p>
            </div>
          </div>
        </div>
      )}
      <nav
        className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-black/30 shadow-lg transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 min-h-[80px]">
            <img
              src="/images/logo/logo.png"
              alt="Buntudelice Logo"
              className="h-20 w-20 object-contain rounded-full shadow-lg border-2 border-white/60 bg-white/80 transition-all duration-300"
              style={{ minWidth: 80, minHeight: 80 }}
            />
            <span className="text-3xl font-extrabold text-orange-500 tracking-tight drop-shadow-lg hidden sm:inline-block align-middle leading-tight">
              {/* Buntudelice */}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.filter(link => link.label !== "Panier").map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-2 rounded-lg font-medium text-white dark:text-white hover:text-orange-400 transition group flex items-center"
              >
                {link.icon && link.icon}
                <span>{link.label}</span>
                <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:h-1 -translate-x-1/2"></span>
              </Link>
            ))}
            <button
              className="ml-4 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
              onClick={() => navigate("/order")}
            >
              Commander
            </button>
            {/* Icône panier seule, badge si articles */}
            <button
              className="ml-2 relative p-2 rounded-full bg-white/60 dark:bg-black/60 hover:bg-orange-100 dark:hover:bg-orange-900 transition"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Panier"
            >
              <ShoppingBag className="w-7 h-7 text-orange-500" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Actions (profile) */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {user ? (
              <div className="relative">
                <button
                  className="p-2 rounded-full bg-white/60 dark:bg-black/60 hover:bg-orange-100 dark:hover:bg-orange-900 transition"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Profil"
                >
                  <User className="w-5 h-5 text-orange-500" />
                </button>
                
                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.firstName || user.email}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </button>
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Mes commandes
                      </button>
                      <button
                        onClick={() => {
                          navigate("/payments");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Mes paiements
                      </button>
                      <button
                        onClick={() => {
                          navigate("/location");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <span className="text-xl">📍</span>
                        Géolocalisation
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 rounded-full bg-white/60 dark:bg-black/60 hover:bg-orange-100 dark:hover:bg-orange-900 transition text-orange-500 font-medium"
              >
                Se connecter
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-full bg-white/60 dark:bg-black/60 hover:bg-orange-100 dark:hover:bg-orange-900 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 bg-white/80 dark:bg-black/90 backdrop-blur-xl shadow-xl animate-fade-in-down">
            <div className="flex flex-col gap-2">
              {navLinks.filter(link => link.label !== "Panier").map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-400 transition flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon && link.icon}
                  {link.label}
                </Link>
              ))}
              <button
                className="mt-2 px-5 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/order");
                }}
              >
                Commander
              </button>
              {/* Icône panier seule, badge si articles */}
              <button
                className="mt-2 relative p-3 rounded-full bg-white/60 dark:bg-black/60 hover:bg-orange-100 dark:hover:bg-orange-900 transition"
                onClick={() => {
                  setMobileOpen(false);
                  setCartDrawerOpen(true);
                }}
                aria-label="Panier"
              >
                <ShoppingBag className="w-7 h-7 text-orange-500 mx-auto" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                    {totalItems}
                  </span>
                )}
              </button>
              
              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.firstName || user.email}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mon profil
                    </button>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Mes commandes
                    </button>
                    <button
                      onClick={() => {
                        navigate("/payments");
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Mes paiements
                    </button>
                    <button
                      onClick={() => {
                        navigate("/location");
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <span className="text-xl">📍</span>
                      Géolocalisation
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/auth");
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                  >
                    Se connecter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 