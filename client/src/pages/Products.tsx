
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, Search,ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Link } from "react-router-dom";
import api, { addFavorite, removeFavorite, getFavorites } from "@/api/api"

function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth || !auth.user) return null;
    return auth.user;
  } catch {
    return null;
  }
}




const categories = ["Category", "Electronics", "Fashion", "Food", "Home", "Beauty"]
const conditions = ["Condition","New","Used"]
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
]


export default function ProductsPage() {
   const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

   useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavorites();
        setFavoriteIds(res.data.favorites.map((fav: any) => fav._id));
      } catch {
        setFavoriteIds([]);
      }
    };
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (productId: string) => {
    if (favoriteIds.includes(productId)) {
      await removeFavorite(productId);
      setFavoriteIds(favoriteIds.filter(id => id !== productId));
    } else {
      await addFavorite(productId);
      setFavoriteIds([...favoriteIds, productId]);
    }
  };
  const { addItem } = useCart()
  const user = getAuthUser();

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Category")
  const [selectedCondition, setSelectedCondition] = useState("Condition")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch all seller locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/users?role=seller&fields=location");
        const locations = (res.data.users || []).map((u: any) => u.location).filter(Boolean);
        setAllLocations(Array.from(new Set(locations)));
      } catch {
        setAllLocations([]);
      }
    };
    fetchLocations();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = "/products?limit=100";
        if (selectedLocation && selectedLocation !== "all") {
          url += `&location=${encodeURIComponent(selectedLocation)}`;
        }
        if (showFeaturedOnly) {
          url += "&featured=true";
        }
        const res = await api.get(url);
        setProducts(res.data.products || [])
      } catch (err) {
        console.error(err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedLocation, showFeaturedOnly])

  const filteredProducts = useMemo(() => {
    let filtered = products.map((product) => ({
      id: product._id,
      title: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      seller: product.sellerId?.name || product.sellerId || "",
      category: product.category || "",
      condition: product.condition || "New",
      location: product.location || "",
      description: product.description || "",
      stock: product.quantity || 0,
    }))

    filtered = filtered.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "Category" || product.category === selectedCategory
      const matchesCondition = selectedCondition === "Condition" || product.condition === selectedCondition
      return matchesSearch && matchesCategory && matchesCondition
    })

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // No sorting for newest
        break
    }
    return filtered
  }, [products, searchQuery, selectedCategory, selectedCondition, sortBy])

  const handleAddToCart = (product: any) => {
    if (!user) {
      alert("Please login as a buyer to add products to cart.");
      return;
    }
    if (user.role === "seller") {
      alert("Please login as a buyer to add products to cart.");
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      seller: product.seller,
      category: product.category,
      stock: product.quantity,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Marketplace</h1>
              <p className="text-lg text-gray-600">Discover amazing products from trusted sellers</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Enhanced Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 bg-white shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>

          {/* Enhanced Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Locations</SelectItem>
                {allLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Featured Products Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Products Only
              </label>
            </div>
          </div>

         
         
            
        </div>

        {/* Enhanced Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-gray-600 font-medium">
              Showing <span className="text-yellow-600 font-semibold">{filteredProducts.length}</span> of <span className="text-gray-900 font-semibold">{products.length}</span> products
            </p>
          </div>
          {filteredProducts.length > 0 && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
            </Badge>
          )}
        </div>

        {/* Enhanced Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading amazing products...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the best deals for you</p>
          </div>
        ) :  (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-stretch p-0 overflow-hidden relative"
              >
                {/* Enhanced Badge */}
                <div className="absolute left-4 top-4 z-10">
                  <Badge className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {product.category?.toUpperCase()}
                  </Badge>
                </div>
                
                {/* Stock Status Badge */}
                <div className="absolute right-4 top-4 z-10">
                  <Badge className={`text-xs font-bold px-2 py-1 rounded-full shadow-lg ${
                    product.stock > 0 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                {/* Enhanced Product Image */}
                <Link to={`/products/${product.id}`} className="block px-6 pt-6 pb-2">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center h-48 w-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="object-contain h-44 w-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Enhanced Card Content */}
                <div className="flex flex-col flex-1 px-6 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium tracking-wide">{product.category?.toUpperCase()}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{product.rating || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Seller</span>
                    <span className="text-xs text-gray-700 font-medium">{product.seller}</span>
                  </div>
                  
                  <Link to={`/products/${product.id}`} className="group">
                    <div className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {product.title}
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.condition && (
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                        {product.condition}
                      </Badge>
                    )}
                  </div>
                 
                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center justify-between mt-auto">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full p-2 w-10 h-10 flex items-center justify-center border border-gray-200 bg-white hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
                      onClick={() => handleToggleFavorite(product.id)}
                      aria-label={favoriteIds.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`h-5 w-5 transition-all duration-200 ${
                        favoriteIds.includes(product.id) 
                          ? "fill-red-500 text-red-500 scale-110" 
                          : "text-gray-400 hover:text-red-500"
                      }`} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) }

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
