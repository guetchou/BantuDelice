import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EssentialServices from "@/components/home/EssentialServices";
import AdditionalServices from "@/components/home/AdditionalServices";
import CulturalServices from "@/components/home/CulturalServices";
import ServiceList from "@/components/services/ServiceList";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587620962725-abab7fe55159')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Services Professionnels
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez notre gamme complète de services conçus pour répondre à tous vos besoins
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="essential">Services Essentiels</SelectItem>
                  <SelectItem value="additional">Services Additionnels</SelectItem>
                  <SelectItem value="cultural">Services Culturels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {(selectedCategory === "all" || selectedCategory === "essential") && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Services Essentiels</h2>
              <EssentialServices />
            </div>
          )}

          {(selectedCategory === "all" || selectedCategory === "additional") && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Services Additionnels</h2>
              <AdditionalServices />
            </div>
          )}

          {(selectedCategory === "all" || selectedCategory === "cultural") && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Services Culturels</h2>
              <CulturalServices />
            </div>
          )}
        </motion.div>

        {/* Liste des prestataires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-semibold mb-8 text-center">Nos Prestataires de Services</h2>
          <ServiceList />
        </motion.div>
      </div>
    </div>
  );
}