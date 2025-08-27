
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../api/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Heart, Share2, ShoppingCart, MapPin, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"




export default function ProductDetailPage() {
  const { addItem } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products?id=${id}`);
        setProduct(res.data.products[0]);
      } catch (err) {
        setError("Failed to load product");
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/product/${id}`);
        setReviews(res.data);
      } catch (err) {
        setReviews([]);
      }
    };
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product._id,
      title: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      seller: product.sellerId,
      category: product.category,
      stock: product.quantity,
      quantity: quantity,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setError("");
    try {
      await api.post("/reviews", {
        sellerId: product.sellerId,
        productId: product._id,
        rating: reviewRating,
        comment: reviewText,
      });
      setReviewText("");
      setReviewRating(5);
      // Refresh reviews
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data);
      console.log(reviews);
    } catch (err) {
      setError("Failed to submit review");
    }
    setReviewLoading(false);
  };

  if (!product) {
    return <div className="p-8 text-center">Loading...</div>;
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
            <span className="text-foreground">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.images?.[selectedImage]?.url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">{product.category}</Badge>
                <Badge variant="outline">{product.condition}</Badge>
              </div>
              <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{product.rating || "-"}</span>
                  <span className="ml-1 text-muted-foreground">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
              </div>
            </div>

            
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{product.quantity} in stock</span>
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
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
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
                      <AvatarImage src={product.seller?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{product.seller?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{product.seller?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.seller?.rating || "-"}</span>
                        <span>•</span>
                        <span>{product.seller?.totalSales || 0} sales</span>
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
                    <span className="font-medium text-green-600">{product.shipping?.cost || "Free"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">{product.shipping?.time || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Returns</span>
                    <span className="font-medium">{product.shipping?.returns || "-"}</span>
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
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

        
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features?.map((feature: string, index: number) => (
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
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
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
                {reviews.length} reviews with an average rating of {product.rating || "-"} stars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
          
                {reviews.length === 0 ? (
                  <div>No reviews yet.</div>
                ) : reviews.map((review: any) => (
                  <div key={review._id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.buyer?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{review.buyer?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.buyer?.name || "User"}</span>
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
                        <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground ml-11">{review.comment}</p>
                    <Separator />
                  </div>
                ))}
              </div>
              {/* Add Review Form */}
              <form className="mt-8 space-y-4" onSubmit={handleReviewSubmit}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Your Rating:</span>
                  {[1,2,3,4,5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`h-5 w-5 ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  required
                />
                <Button type="submit" disabled={reviewLoading}>
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </Button>
                {error && <div className="text-red-500">{error}</div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
