import { useState } from "react";
import FloatingPager from "@/components/ui/floating-pager";
import MenuFilters from "./MenuFilters";
import MenuGrid from "./MenuGrid";
import { useMenuItems } from "./useMenuItems";

const ITEMS_PER_PAGE = 6;

const MenuList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "" as "price_asc" | "price_desc" | "popularity" | "",
  });

  const { menuItems, isLoading, addToFavorites, addRating } = useMenuItems(filters);

  if (isLoading) {
    return <div>Chargement des plats...</div>;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = menuItems?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen">
      <MenuFilters
        categories={Array.from(new Set(menuItems?.map(item => item.category).filter(Boolean) || []))}
        onFilterChange={setFilters}
      />

      <MenuGrid 
        items={paginatedItems || []}
        onFavorite={addToFavorites}
        onRate={(itemId, rating) => addRating({ itemId, rating })}
      />

      {menuItems && menuItems.length > ITEMS_PER_PAGE && (
        <FloatingPager
          totalItems={menuItems.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MenuList;