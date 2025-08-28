
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

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
        console.log(err)
        setError("Failed to load product");
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/product/${id}`);
        setReviews(res.data);
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
      setReviews(res.data);
    } catch (err) {
      console.log(err)
      setError("Failed to submit review");
    }
    setReviewLoading(false);
  };

  if (!product) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Simulated real-time visitor and countdown for demo
  const realTimeVisitors = 56;
  const countdown = { days: 399, hours: 6, minutes: 15, seconds: 0 };

  return (
    <div className="min-h-screen bg-[#f7fafd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Gallery */}
          <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-2xl shadow p-6">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f3f4f6] flex items-center justify-center mb-4">
              <img
                src={product.images?.[selectedImage]?.url || "/placeholder.svg"}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex gap-2 w-full justify-center">
              {product.images?.map((img, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-xl border-2 p-1 transition-all ${selectedImage === idx ? "border-yellow-400" : "border-transparent"}`}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={`thumb-${idx}`}
                    className="object-contain w-16 h-16"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-black leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-5 w-5 ${i <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
                <span className="text-gray-500 font-medium ml-2">{product.rating || "-"}</span>
                <span className="text-gray-400 ml-1">| {reviews.length} Ratings</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="text-3xl font-bold text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-400 line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="ml-2 text-blue-600 font-semibold">-{Math.round(100 * (1 - product.price / product.originalPrice))}%</span>
                )}
              </div>
              <div className="text-gray-500 font-medium">SKU#: <span className="text-black font-semibold">{product.sku || product._id}</span></div>
              <div className="text-green-600 font-semibold">{product.quantity > 0 ? "IN STOCK" : "OUT OF STOCK"}</div>
            </div>
            {/* Real time visitor and countdown */}
            <div className="bg-white rounded-xl shadow flex items-center gap-6 px-6 py-4 w-fit">
              <span className="text-gray-500 font-medium">Real time <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold mx-1">{realTimeVisitors}</span> visitor right now!</span>
              <span className="text-2xl font-bold text-black">{countdown.days} <span className="text-base font-normal">Days</span> {countdown.hours} : {countdown.minutes} : {countdown.seconds}</span>
              <span className="text-gray-400 ml-2">Time is Running Out!</span>
            </div>
            
            {/*Mock data for time being*/}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="mb-2 text-gray-700">{product.description}</div>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><span className="font-semibold">Closure :</span> Hook & Loop</li>
                <li><span className="font-semibold">Sole :</span> Polyvinyl Chloride</li>
                <li><span className="font-semibold">Width :</span> Medium</li>
                <li><span className="font-semibold">Outer Material :</span> A-Grade Standard Quality</li>
              </ul>
            </div>
          
            <div className="flex flex-wrap items-center gap-4">
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
                variant="ghost"
                size="icon"
                className={`rounded-full p-0 w-10 h-10 flex items-center justify-center border border-yellow-400 bg-white hover:bg-yellow-100 ${isWishlisted ? "text-yellow-400" : ""}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? "fill-yellow-400 text-yellow-400" : "text-black/30"}`} />
              </Button>
            </div>
            {/* Related products carousel placeholder */}
            <div className="mt-6">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1,2,3].map((_, idx) => (
                  <div key={idx} className="min-w-[220px] bg-white rounded-xl shadow p-4 flex flex-col items-center">
                    <img src={product.images?.[0]?.url || "/placeholder.svg"} alt="related" className="w-24 h-24 object-contain mb-2" />
                    <div className="font-semibold text-black mb-1">Related Product</div>
                    <div className="text-yellow-400 font-bold">$99.00</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Tabs for Detail, Specifications, Vendor, Reviews */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <div className="flex gap-4 mb-6">
            <button className="px-6 py-2 rounded-lg font-semibold text-black bg-yellow-400">Detail</button>
            <button className="px-6 py-2 rounded-lg font-semibold text-black bg-gray-100">Specifications</button>
            <button className="px-6 py-2 rounded-lg font-semibold text-black bg-gray-100">Vendor</button>
            <button className="px-6 py-2 rounded-lg font-semibold text-black bg-gray-100">Reviews</button>
          </div>
          {/* Reviews section */}
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <div>No reviews yet.</div>
            ) : reviews.map((review) => (
              <div key={review._id} className="flex gap-4 items-start">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.buyer?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{review.buyer?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-black">{review.buyer?.name || "User"}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              </div>
            ))}
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
                    <Star className={`h-5 w-5 ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
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
          </div>
        </div>
      </div>
    </div>
  );
}