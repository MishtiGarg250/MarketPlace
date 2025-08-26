
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingBag, Users, TrendingUp, Shield, Truck, CreditCard } from "lucide-react"
import { generateProductChecksum, ASSIGNMENT_SEED } from "@/utils/seedUtils"

export default function HomePage() {
  // Mock data for featured products with checksums
  const featuredProducts = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: 99.99,
      image: "/wireless-headphones.png",
      rating: 4.5,
      seller: "TechStore",
      category: "Electronics",
      checksum: generateProductChecksum(1, ASSIGNMENT_SEED),
    },
    {
      id: 2,
      title: "Vintage Leather Jacket",
      price: 149.99,
      image: "/vintage-leather-jacket.png",
      rating: 4.8,
      seller: "FashionHub",
      category: "Fashion",
      checksum: generateProductChecksum(2, ASSIGNMENT_SEED),
    },
    {
      id: 3,
      title: "Smart Home Speaker",
      price: 79.99,
      image: "/smart-home-speaker.png",
      rating: 4.3,
      seller: "SmartTech",
      category: "Electronics",
      checksum: generateProductChecksum(3, ASSIGNMENT_SEED),
    },
    {
      id: 4,
      title: "Artisan Coffee Beans",
      price: 24.99,
      image: "/artisan-coffee-beans.png",
      rating: 4.9,
      seller: "CoffeeCraft",
      category: "Food",
      checksum: generateProductChecksum(4, ASSIGNMENT_SEED),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section with 3D-inspired design */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-24 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse float-animation"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000 float-animation"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary/15 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-secondary/15 rounded-full blur-lg animate-pulse delay-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="font-sans text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            The Future Looks
            <span className="block text-primary glow-animation">Bright</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover cutting-edge products and innovative solutions in our next-generation marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/products">
              <Button
                size="lg"
                className="text-lg px-10 py-4 shadow-2xl hover:shadow-primary/25 transition-all transform hover:scale-105 glow-animation"
              >
                <ShoppingBag className="mr-3 h-6 w-6" />
                Explore Products
              </Button>
            </a>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl hover:shadow-secondary/25 transition-all transform hover:scale-105"
            >
              <Users className="mr-3 h-6 w-6" />
              Join Sellers
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators with modern card design */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-2xl bg-gradient-to-br from-background to-primary/5 hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-3 float-animation">
              <CardContent className="py-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sans text-xl font-bold mb-3 text-foreground">100% Secure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced encryption protects your data and transactions
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-secondary/10 transition-all duration-500 transform hover:-translate-y-3 float-animation delay-200">
              <CardContent className="py-10">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-sans text-xl font-bold mb-3 text-foreground">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">Next-day delivery powered by AI logistics</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-2xl bg-gradient-to-br from-background to-primary/5 hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-3 float-animation delay-400">
              <CardContent className="py-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sans text-xl font-bold mb-3 text-foreground">Smart Returns</h3>
                <p className="text-muted-foreground leading-relaxed">AI-powered return process in just one click</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="transform hover:scale-110 transition-all duration-300 float-animation">
              <div className="text-6xl font-bold text-primary mb-4 glow-animation">16</div>
              <div className="text-lg text-muted-foreground font-medium">New Arrivals</div>
              <div className="text-sm text-muted-foreground/70 mt-1">This Week</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 float-animation delay-200">
              <div className="text-6xl font-bold text-secondary mb-4">5K+</div>
              <div className="text-lg text-muted-foreground font-medium">Happy Customers</div>
              <div className="text-sm text-muted-foreground/70 mt-1">And Growing</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 float-animation delay-400">
              <div className="text-6xl font-bold text-primary mb-4 glow-animation">1K+</div>
              <div className="text-lg text-muted-foreground font-medium">Trusted Sellers</div>
              <div className="text-sm text-muted-foreground/70 mt-1">Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products with enhanced 3D cards */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-sans text-4xl font-bold text-foreground">Featured Products</h2>
            <a href="/products">
              <Button
                variant="secondary"
                className="shadow-xl hover:shadow-secondary/25 transition-all transform hover:scale-105 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                View All Products
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 float-animation ${
                  index % 2 === 0
                    ? "bg-gradient-to-br from-background via-primary/5 to-primary/10 hover:shadow-primary/20"
                    : "bg-gradient-to-br from-background via-secondary/5 to-secondary/10 hover:shadow-secondary/20"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <a href={`/products/${product.id}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge
                      className={`absolute top-3 left-3 shadow-lg backdrop-blur-sm ${
                        index % 2 === 0
                          ? "bg-primary/90 text-primary-foreground"
                          : "bg-secondary/90 text-secondary-foreground"
                      }`}
                    >
                      {product.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="absolute bottom-3 right-3 bg-background/95 text-xs backdrop-blur-sm"
                    >
                      #{product.id}-{product.checksum}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <a href={`/products/${product.id}`}>
                    <CardTitle className="text-lg mb-3 group-hover:text-primary transition-colors font-semibold">
                      {product.title}
                    </CardTitle>
                  </a>
                  <CardDescription className="mb-4 text-muted-foreground">by {product.seller}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm text-muted-foreground font-medium">{product.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Start Selling?</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Join the future of commerce and turn your innovations into success
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-4 shadow-2xl hover:shadow-primary/25 transition-all transform hover:scale-105 glow-animation"
              >
                Get Started Today
              </Button>
            </a>
            <a href="/products">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl hover:shadow-secondary/25 transition-all transform hover:scale-105"
              >
                Browse Products
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
