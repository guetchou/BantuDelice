import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image, 
  Search, 
  X, 
  Copy, 
  Download, 
  Trash2, 
  Grid3X3,
  List,
  Filter,
  Plus,
  Globe,
  FolderOpen,
  Camera
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types pour les médias
interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  width?: number;
  height?: number;
  uploadedAt: Date;
  tags: string[];
  source: 'local' | 'unsplash' | 'upload';
  category?: string;
}

// Données mockées pour les images locales
const localImages: MediaItem[] = [
  {
    id: '1',
    name: 'poulet-moambe.jpg',
    url: '/images/poulet-moambe.jpg',
    type: 'image',
    size: 138000,
    width: 800,
    height: 600,
    uploadedAt: new Date('2024-01-15'),
    tags: ['cuisine', 'congolais', 'poulet'],
    source: 'local',
    category: 'cuisine'
  },
  {
    id: '2',
    name: 'taxi-brazzaville.png',
    url: '/images/taxi-brazzaville.png',
    type: 'image',
    size: 153000,
    width: 1200,
    height: 800,
    uploadedAt: new Date('2024-01-14'),
    tags: ['transport', 'taxi', 'brazzaville'],
    source: 'local',
    category: 'transport'
  },
  {
    id: '3',
    name: 'sandwich-feast-2x.png',
    url: '/images/sandwich-feast-2x.png',
    type: 'image',
    size: 3000000,
    width: 1600,
    height: 1200,
    uploadedAt: new Date('2024-01-13'),
    tags: ['sandwich', 'food', 'restaurant'],
    source: 'local',
    category: 'food'
  },
  {
    id: '4',
    name: 'avatar1.jpeg',
    url: '/images/avatar1.jpeg',
    type: 'image',
    size: 12000,
    width: 400,
    height: 400,
    uploadedAt: new Date('2024-01-12'),
    tags: ['avatar', 'profile', 'user'],
    source: 'local',
    category: 'profile'
  },
  {
    id: '5',
    name: 'avatar2.jpeg',
    url: '/images/avatar2.jpeg',
    type: 'image',
    size: 9200,
    width: 400,
    height: 400,
    uploadedAt: new Date('2024-01-11'),
    tags: ['avatar', 'profile', 'user'],
    source: 'local',
    category: 'profile'
  },
  {
    id: '6',
    name: 'avatar3.jpeg',
    url: '/images/avatar3.jpeg',
    type: 'image',
    size: 5500,
    width: 400,
    height: 400,
    uploadedAt: new Date('2024-01-10'),
    tags: ['avatar', 'profile', 'user'],
    source: 'local',
    category: 'profile'
  }
];

// Images Unsplash mockées
const unsplashImages: MediaItem[] = [
  {
    id: 'unsplash-1',
    name: 'African Cuisine',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    type: 'image',
    size: 250000,
    width: 800,
    height: 600,
    uploadedAt: new Date(),
    tags: ['african', 'cuisine', 'food', 'traditional'],
    source: 'unsplash',
    category: 'cuisine'
  },
  {
    id: 'unsplash-2',
    name: 'Restaurant Interior',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    type: 'image',
    size: 300000,
    width: 800,
    height: 600,
    uploadedAt: new Date(),
    tags: ['restaurant', 'interior', 'dining'],
    source: 'unsplash',
    category: 'restaurant'
  },
  {
    id: 'unsplash-3',
    name: 'Street Food',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    type: 'image',
    size: 280000,
    width: 800,
    height: 600,
    uploadedAt: new Date(),
    tags: ['street', 'food', 'african'],
    source: 'unsplash',
    category: 'food'
  },
  {
    id: 'unsplash-4',
    name: 'Modern Restaurant',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    type: 'image',
    size: 320000,
    width: 800,
    height: 600,
    uploadedAt: new Date(),
    tags: ['modern', 'restaurant', 'dining'],
    source: 'unsplash',
    category: 'restaurant'
  }
];

const MediaManager: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('local');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combiner toutes les images
  const allImages = [...localImages, ...unsplashImages];

  // Filtrer les images
  const filteredImages = allImages.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSource = selectedTab === 'all' || image.source === selectedTab;
    
    return matchesSearch && matchesCategory && matchesSource;
  });

  // Catégories disponibles
  const categories = [
    { id: 'all', name: 'Toutes', count: allImages.length },
    { id: 'cuisine', name: 'Cuisine', count: allImages.filter(img => img.category === 'cuisine').length },
    { id: 'restaurant', name: 'Restaurant', count: allImages.filter(img => img.category === 'restaurant').length },
    { id: 'food', name: 'Nourriture', count: allImages.filter(img => img.category === 'food').length },
    { id: 'transport', name: 'Transport', count: allImages.filter(img => img.category === 'transport').length },
    { id: 'profile', name: 'Profils', count: allImages.filter(img => img.category === 'profile').length }
  ];

  // Gestion du drag & drop
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  // Gestion de l'upload
  const handleFileUpload = (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simuler l'upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  // Actions sur les images
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const downloadImage = (image: MediaItem) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteImages = () => {
    // Simulation de suppression
    console.log('Supprimer:', selectedItems);
    setSelectedItems([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Image className="h-4 w-4" />
          Gestionnaire de médias
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Gestionnaire de médias</DialogTitle>
          <DialogDescription>
            Gérez vos images et médias. Glissez-déposez pour uploader ou recherchez dans Unsplash.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Header avec actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Rechercher des images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80"
                icon={<Search className="h-4 w-4" />}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCategory === 'all' ? 'Toutes les catégories' : 
                     categories.find(c => c.id === selectedCategory)?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map(category => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs pour les sources */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="local">Locales</TabsTrigger>
              <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1">
              <MediaGrid 
                images={filteredImages}
                viewMode={viewMode}
                selectedItems={selectedItems}
                onToggleSelection={toggleItemSelection}
                onCopyUrl={copyImageUrl}
                onDownload={downloadImage}
              />
            </TabsContent>

            <TabsContent value="local" className="flex-1">
              <MediaGrid 
                images={filteredImages.filter(img => img.source === 'local')}
                viewMode={viewMode}
                selectedItems={selectedItems}
                onToggleSelection={toggleItemSelection}
                onCopyUrl={copyImageUrl}
                onDownload={downloadImage}
              />
            </TabsContent>

            <TabsContent value="unsplash" className="flex-1">
              <div className="mb-4">
                <Button 
                  onClick={() => {
                    // Intégration Unsplash API
                    console.log('Rechercher sur Unsplash');
                  }}
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Rechercher sur Unsplash
                </Button>
              </div>
              <MediaGrid 
                images={filteredImages.filter(img => img.source === 'unsplash')}
                viewMode={viewMode}
                selectedItems={selectedItems}
                onToggleSelection={toggleItemSelection}
                onCopyUrl={copyImageUrl}
                onDownload={downloadImage}
              />
            </TabsContent>

            <TabsContent value="upload" className="flex-1">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Glissez vos fichiers ici</h3>
                <p className="text-gray-600 mb-4">ou cliquez pour sélectionner des fichiers</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Sélectionner des fichiers
                </Button>

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Upload en cours... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions en lot */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mt-4">
              <span className="text-sm text-gray-600">
                {selectedItems.length} élément(s) sélectionné(s)
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const image = allImages.find(img => img.id === id);
                      if (image) copyImageUrl(image.url);
                    });
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier les URLs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const image = allImages.find(img => img.id === id);
                      if (image) downloadImage(image);
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={deleteImages}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour l'affichage des images
interface MediaGridProps {
  images: MediaItem[];
  viewMode: 'grid' | 'list';
  selectedItems: string[];
  onToggleSelection: (id: string) => void;
  onCopyUrl: (url: string) => void;
  onDownload: (image: MediaItem) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  images,
  viewMode,
  selectedItems,
  onToggleSelection,
  onCopyUrl,
  onDownload
}) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune image trouvée</h3>
        <p className="text-gray-600">Essayez de modifier vos filtres ou d'uploader de nouvelles images</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {images.map((image) => (
          <div 
            key={image.id}
            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedItems.includes(image.id) 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onToggleSelection(image.id)}
          >
            <img 
              src={image.url} 
              alt={image.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{image.name}</h4>
              <p className="text-sm text-gray-600">
                {image.width} × {image.height} • {formatFileSize(image.size)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {image.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyUrl(image.url);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {images.map((image) => (
        <div 
          key={image.id}
          className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            selectedItems.includes(image.id) 
              ? 'border-orange-500 ring-2 ring-orange-200' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onToggleSelection(image.id)}
        >
          <img 
            src={image.url} 
            alt={image.name}
            className="w-full h-32 object-cover"
          />
          
          {/* Overlay avec actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyUrl(image.url);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Badge de sélection */}
          {selectedItems.includes(image.id) && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Informations en bas */}
          <div className="p-2 bg-white">
            <h4 className="text-sm font-medium text-gray-900 truncate">{image.name}</h4>
            <p className="text-xs text-gray-600">{formatFileSize(image.size)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaManager; 