
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Heart, Filter, Grid, List, Search } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

// Mock product data
const mockProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 99.99,
    image: "/wireless-headphones.png",
    rating: 4.5,
    reviews: 128,
    seller: "TechStore",
    category: "Electronics",
    condition: "New",
    location: "New York",
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: 2,
    title: "Vintage Leather Jacket",
    price: 149.99,
    image: "/vintage-leather-jacket.png",
    rating: 4.8,
    reviews: 89,
    seller: "FashionHub",
    category: "Fashion",
    condition: "Used",
    location: "California",
    description: "Authentic vintage leather jacket in excellent condition",
  },
  {
    id: 3,
    title: "Smart Home Speaker",
    price: 79.99,
    image: "/smart-home-speaker.png",
    rating: 4.3,
    reviews: 256,
    seller: "SmartTech",
    category: "Electronics",
    condition: "New",
    location: "Texas",
    description: "Voice-controlled smart speaker with premium sound",
  },
  {
    id: 4,
    title: "Artisan Coffee Beans",
    price: 24.99,
    image: "/artisan-coffee-beans.png",
    rating: 4.9,
    reviews: 67,
    seller: "CoffeeCraft",
    category: "Food",
    condition: "New",
    location: "Oregon",
    description: "Premium single-origin coffee beans, freshly roasted",
  },
  {
    id: 5,
    title: "Gaming Mechanical Keyboard",
    price: 129.99,
    image: "/gaming-mechanical-keyboard.png",
    rating: 4.6,
    reviews: 194,
    seller: "GameGear",
    category: "Electronics",
    condition: "New",
    location: "Washington",
    description: "RGB mechanical keyboard with custom switches",
  },
  {
    id: 6,
    title: "Handmade Ceramic Vase",
    price: 45.99,
    image: "/handmade-ceramic-vase.png",
    rating: 4.7,
    reviews: 34,
    seller: "ArtisanCrafts",
    category: "Home",
    condition: "New",
    location: "Colorado",
    description: "Beautiful handcrafted ceramic vase with unique glaze",
  },
  {
    id: 7,
    title: "Professional Camera Lens",
    price: 299.99,
    image: "/professional-camera-lens.png",
    rating: 4.4,
    reviews: 78,
    seller: "PhotoPro",
    category: "Electronics",
    condition: "Used",
    location: "Florida",
    description: "50mm f/1.8 lens in excellent working condition",
  },
  {
    id: 8,
    title: "Organic Skincare Set",
    price: 89.99,
    image: "/organic-skincare-set.png",
    rating: 4.8,
    reviews: 156,
    seller: "NaturalBeauty",
    category: "Beauty",
    condition: "New",
    location: "Vermont",
    description: "Complete organic skincare routine with natural ingredients",
  },
]

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
  const { addItem } = useCart()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesCondition = selectedCondition === "All" || product.condition === selectedCondition
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesCondition && matchesPrice
    })

    // Sort products
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
        // newest first (default order)
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedCondition, priceRange, sortBy])

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      seller: product.seller,
      category: product.category,
      stock: 50, // Default stock for demo
    })
  }

  return (
    <div className="min-h-screen bg-background">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-4">Marketplace</h1>
          <p className="text-muted-foreground">Discover amazing products from trusted sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
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

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {mockProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <a href={`/products/${product.id}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                      />
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      {product.category}
                    </Badge>
                    {product.condition === "Used" && (
                      <Badge variant="secondary" className="absolute bottom-2 left-2">
                        Used
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <a href={`/products/${product.id}`}>
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </CardTitle>
                  </a>
                  <CardDescription className="mb-3">by {product.seller}</CardDescription>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <Button className="w-full" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <a href={`/products/${product.id}`}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-32 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <a href={`/products/${product.id}`}>
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {product.title}
                            </h3>
                          </a>
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
