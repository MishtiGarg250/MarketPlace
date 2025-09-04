
import { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Badge } from "@/components/ui/badge";
export default function ProductDetailPage(){
  const { addItem } = useCart();
  const user = getAuthUser();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
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
        const prod = res.data.product;
        setProduct(prod);
      
        if (prod && prod.category) {
          const relatedRes = await api.get(`/products?limit=8&category=${encodeURIComponent(prod.category)}`);
          const related = (relatedRes.data.products || []).filter((p: any) => p._id !== prod._id);
          setRelatedProducts(related);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load product");
      }
    };
    const fetchReviews = async () => {
      try {
        console.log(id)
        const res = await api.get(`/reviews/product/${id}`);
        console.log("fetched reviews ")
        console.log(res);
        if (Array.isArray(res.data)) {
          setReviews(res.data);
        } else if (res.data && Array.isArray(res.data.reviews)) {
          setReviews(res.data.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.log(err)
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
    if (!user) {
      alert("Please login as a buyer to add products to cart.");
      return;
    }
    if (user.role === "seller") {
      alert("Please login as a buyer to add products to cart.");
      return;
    }
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
    
      const res = await api.get(`/reviews/product/${id}`);
      
      if (Array.isArray(res.data)) {
        console.log(res);
        setReviews(res.data);
      } else if (res.data && Array.isArray(res.data.reviews)) {
        setReviews(res.data.review);
      } else {
        setReviews([]);
      }
  
    } catch (err) {
      console.log(err)
      setError("Failed to submit review");
    }
    setReviewLoading(false);
  };

  const handleStartChat = async () => {
    alert("This feature is not available at this time. Please contact us for more information.")
     
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enhanced Product Gallery */}
          <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-2xl shadow-lg border-0 p-6">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6">
              <img
                src={product.images?.[selectedImage]?.url || "/placeholder.svg"}
                alt={product.name}
                className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex gap-3 w-full justify-center">
              {product.images?.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-xl border-2 p-1 transition-all duration-200 hover:scale-105 ${
                    selectedImage === idx 
                      ? "border-yellow-400 shadow-lg" 
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={`thumb-${idx}`}
                    className="object-contain w-16 h-16 rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Enhanced Product Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-5 w-5 ${i <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-gray-600 font-semibold">{(product.rating || 0).toFixed(2)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{reviews.length} Reviews</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{product.category}</span>
                </div>
              </div>
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold">
                    -{Math.round(100 * (1 - product.price / product.originalPrice))}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-gray-500 font-medium">SKU: <span className="text-gray-900 font-semibold">{product.sku || product._id?.slice(-8)}</span></div>
                <Badge className={`font-semibold ${
                  product.quantity > 0 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                }`}>
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>
            
            
            {/* Product Features */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="mb-2 text-gray-700">{product.description}</div>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {Array.isArray(product.features) && product.features.length > 0 ? (
                  product.features.map((feature: string, idx: number) => (
                    <li key={idx}>{feature}</li>
                  ))
                ) : (
                  <li className="text-gray-400">No key features listed.</li>
                )}
              </ul>
            </div>
          
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <div className="flex items-center border rounded-lg bg-white">
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
              <Button
                className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg shadow hover:bg-yellow-500 transition"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
              <Button
                className="bg-blue-500 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-600 transition"
                onClick={handleStartChat}
                disabled={!user || user._id === product.sellerId}
                style={{ minWidth: 150 }}
              >
                {!user ? 'Login to Chat' : user._id === product.sellerId ? 'Your Product' : 'Message Seller'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full p-0 w-10 h-10 flex items-center justify-center border border-yellow-400 bg-white hover:bg-yellow-100 ${isWishlisted ? "text-yellow-400" : ""}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? "fill-yellow-400 text-yellow-400" : "text-black/30"}`} />
              </Button>
            </div>
            {/* Related products carousel */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-900">Related Products</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {relatedProducts.length === 0 ? (
                  <div className="text-gray-400">No related products found.</div>
                ) : (
                  relatedProducts.map((relProd) => (
                    <Link
                      key={relProd._id}
                      to={`/products/${relProd._id}`}
                      className="min-w-[220px] bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition"
                    >
                      <img src={relProd.images?.[0]?.url || "/placeholder.svg"} alt={relProd.name} className="w-24 h-24 object-contain mb-2" />
                      <div className="font-semibold text-black mb-1 line-clamp-1">{relProd.name}</div>
                      <div className="text-yellow-400 font-bold">${relProd.price}</div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-6.5xl mt-10 bg-white rounded-xl shadow p-6  mx-auto">
  {/* Header */}
  <div className="flex gap-4 mb-6">
    <button className="px-6 py-2 rounded-lg font-semibold text-black bg-yellow-400">
      Reviews
    </button>
  </div>

  {/* Reviews Section */}
  <div className="space-y-12">
    <h2 className="text-2xl font-bold text-black mb-6">Customer Reviews</h2>

    {reviews.length === 0 ? (
      <div className="text-gray-500">No reviews yet.</div>
    ) : (
      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 flex gap-5 items-start"
          >
            {/* Avatar */}
            <Avatar className="w-14 h-14 mt-1 flex-shrink-0">
              <AvatarImage src={review.buyer?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{review.buyer?.name?.[0]}</AvatarFallback>
            </Avatar>

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex flex-row items-center gap-2 mb-1">
                <span className="font-semibold text-black text-lg">
                  {review.buyer?.name || "User"}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}/5
                </span>
              </div>

              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Add Review Form */}
    <div className="mt-12 p-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 shadow w-4xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="h-6 w-6 text-yellow-600" />
        Write a Review
      </h3>

      <form className="space-y-8" onSubmit={handleReviewSubmit}>
        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-700">
            Your Rating
          </Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewRating(star)}
                className="focus:outline-none hover:scale-110 transition-transform duration-200"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= reviewRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-base text-gray-600">
              {reviewRating > 0 && `${reviewRating} out of 5 stars`}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label
            htmlFor="review-text"
            className="text-base font-semibold text-gray-700"
          >
            Your Review
          </Label>
          <textarea
            id="review-text"
            className="w-full h-28 border border-gray-200 rounded-lg p-4 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-50 hover:bg-white transition-colors resize-none text-base"
            placeholder="Share your experience with this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700 text-base font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={reviewLoading}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {reviewLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting Review...
            </div>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  </div>
</div>

      </div>
    </div>
  </div>
  )
}
