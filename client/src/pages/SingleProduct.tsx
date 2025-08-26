
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Heart, Share2, ShoppingCart, MapPin, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

const mockProduct = {
  id: 1,
  title: "Wireless Headphones",
  price: 99.99,
  originalPrice: 129.99,
  images: [
    "/wireless-headphones.png",
    "/wireless-headphones-side.png",
    "/wireless-headphones-case.png",
    "/wireless-headphones-accessories.png",
  ],
  rating: 4.5,
  reviews: 128,
  seller: {
    name: "TechStore",
    avatar: "/tech-store-logo.png",
    rating: 4.8,
    totalSales: 1250,
    joinedDate: "2022-03-15",
  },
  category: "Electronics",
  condition: "New",
  location: "New York, NY",
  description:
    "Experience premium sound quality with these wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers, commuters, and professionals.",
  specifications: {
    Brand: "AudioTech",
    Model: "AT-WH500",
    "Battery Life": "30 hours",
    Connectivity: "Bluetooth 5.0",
    Weight: "250g",
    Warranty: "2 years",
  },
  features: [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Quick charge (5 min = 2 hours)",
    "Premium comfort padding",
    "Bluetooth 5.0 connectivity",
    "Built-in microphone",
  ],
  shipping: {
    cost: "Free",
    time: "2-3 business days",
    returns: "30-day return policy",
  },
  stock: 15,
}

const mockReviews = [
  {
    id: 1,
    user: "John D.",
    avatar: "/diverse-user-avatars.png",
    rating: 5,
    date: "2024-01-15",
    comment: "Excellent sound quality and comfort. The noise cancellation works great!",
  },
  {
    id: 2,
    user: "Sarah M.",
    avatar: "/female-user-avatar.png",
    rating: 4,
    date: "2024-01-10",
    comment: "Good headphones overall. Battery life is impressive as advertised.",
  },
  {
    id: 3,
    user: "Mike R.",
    avatar: "/male-user-avatar.png",
    rating: 5,
    date: "2024-01-05",
    comment: "Perfect for my daily commute. Highly recommend!",
  },
]

export default function ProductDetailPage() {
  const { addItem } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.images[0],
      seller: mockProduct.seller.name,
      category: mockProduct.category,
      stock: mockProduct.stock,
      quantity: quantity,
    })
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-primary">
              Products
            </a>
            <span>/</span>
            <span className="text-foreground">{mockProduct.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={mockProduct.images[selectedImage] || "/placeholder.svg"}
                alt={mockProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${mockProduct.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">{mockProduct.category}</Badge>
                <Badge variant="outline">{mockProduct.condition}</Badge>
              </div>
              <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-2">{mockProduct.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{mockProduct.rating}</span>
                  <span className="ml-1 text-muted-foreground">({mockProduct.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {mockProduct.location}
                </div>
              </div>
            </div>

            
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">${mockProduct.price}</span>
              {mockProduct.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">${mockProduct.originalPrice}</span>
              )}
              <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                Save ${(mockProduct.originalPrice! - mockProduct.price).toFixed(2)}
              </Badge>
            </div>

            
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{mockProduct.stock} in stock</span>
            </div>

            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                    className="px-3"
                  >
                    +
                  </Button>
                </div>
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                Buy Now
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={mockProduct.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockProduct.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{mockProduct.seller.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{mockProduct.seller.rating}</span>
                        <span>•</span>
                        <span>{mockProduct.seller.totalSales} sales</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Store
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">{mockProduct.shipping.cost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">{mockProduct.shipping.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Returns</span>
                    <span className="font-medium">{mockProduct.shipping.returns}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{mockProduct.description}</p>
            </CardContent>
          </Card>

        
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(mockProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                {mockProduct.reviews} reviews with an average rating of {mockProduct.rating} stars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground ml-11">{review.comment}</p>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
