
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Heart, Filter, Grid, List, Search,ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

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

import { Link } from "react-router-dom";
import api, { addFavorite, removeFavorite, getFavorites } from "@/api/api"



const categories = ["All", "Electronics", "Fashion", "Food", "Home", "Beauty"]
const conditions = ["All","New","Used"]
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
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<string>("");
  const [allLocations, setAllLocations] = useState<string[]>([]);

  // Fetch user location from profile and all seller locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (user) {
        try {
          const res = await api.get("/users/me");
          setUserLocation(res.data.user.location || "");
        } catch {
          setUserLocation("");
        }
      }
      // Fetch all seller locations
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
  }, [selectedLocation])

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
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesCondition = selectedCondition === "All" || product.condition === selectedCondition
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice
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
        filtered.sort((a, b) => 0)
        break
    }
    return filtered
  }, [products, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy])

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
      stock: product.stock,
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
            {/* Location Filter */}
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
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="mt-2" />
                </div>
              </div>
            </Card>
          )}
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
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-stretch p-0 overflow-hidden relative"
              >
                {/* Enhanced Badge */}
                <div className="absolute left-4 top-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
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
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-32 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={() => handleToggleFavorite(product.id)}
                        aria-label={favoriteIds.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`h-4 w-4 ${favoriteIds.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/products/${product.id}`}>
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {product.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground">by {product.seller}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-primary text-primary-foreground">{product.category}</Badge>
                          {product.condition === "Used" && <Badge variant="secondary">Used</Badge>}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm text-muted-foreground">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">{product.location}</span>
                        </div>
                        <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
