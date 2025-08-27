
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Heart, Filter, Grid, List, Search } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

import api from "@/api/api"


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

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await api.get("/products?limit=100")
        // API returns { page, limit, products }
        setProducts(res.data.products || [])
      } catch (err) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">Loading products...</p>
          </div>
        ) : viewMode === "grid" ? (
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
