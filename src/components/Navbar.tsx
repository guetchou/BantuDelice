const Navbar = () => {
  // ... (le reste du code reste inchangé jusqu'au return)

  return (
    <nav className="bg-background/80 border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link   
          to="/" 
          className="text-xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Buntudelice
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/70 hover:text-foreground hover:bg-background/50"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform hover:scale-110" />
            ) : (
              <Moon className="h-5 w-5 transition-transform hover:scale-110" />
            )}
          </Button>
          
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full hover:bg-background/50"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary/50 transition-all">
                    <AvatarImage src={avatarUrl || undefined} alt={user?.email || "Profile"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      {user?.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 rounded-lg border-border/50 shadow-lg" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Bon retour !
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/orders')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  Mes commandes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/favorites')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  Favoris
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/loyalty')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  Programme de fidélité
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="focus:bg-transparent">
                  <LoyaltyStatus />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  Déconnexion
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/auth" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/auth"
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm hover:shadow-primary/20"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;