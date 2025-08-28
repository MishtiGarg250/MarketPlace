
import { useState, useEffect } from "react"
import api from "../api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Plus,
  DollarSign,
  ShoppingCart,
  Star,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Users,
  Calendar,
} from "lucide-react"







import { uploadProductImage } from "../api/api";

export default function SellerDashboardPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [productReviews, setProductReviews] = useState<{ [productId: string]: any[] }>({});
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    condition: "New",
    location: "",
  })
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  // Features and specifications state
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [user, setUser] = useState<any>(null)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editProfileData, setEditProfileData] = useState({ name: "", description: "", avatar: "", location: "" })

  // Fetch seller profile, products, analytics, orders, reviews
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError("")
      try {
        const userRes = await api.get("/users/me")
        setUser(userRes.data.user)
        const sellerId = userRes.data.user?._id
        if (sellerId) {
          const [prodRes, profRes, anaRes, ordRes, revRes] = await Promise.all([
            api.get(`/products?sellerId=${sellerId}&limit=100`),
            api.get(`/users/seller/${sellerId}`),
            api.get(`/products/seller/${sellerId}/analytics`),
            api.get(`/products/seller/${sellerId}/orders`),
            api.get(`/users/seller/${sellerId}/reviews`),
          ])
          setProducts(prodRes.data.products)
          setSellerProfile(profRes.data)
          setAnalytics(anaRes.data)
          setOrders(ordRes.data)
          setReviews(revRes.data)
          setEditProfileData({
            name: profRes.data.name || "",
            description: profRes.data.description || "",
            avatar: profRes.data.avatar || "",
            location: profRes.data.location || "",
          })
          // Fetch reviews for each product
          const reviewsObj: { [productId: string]: any[] } = {};
          await Promise.all(
            prodRes.data.products.map(async (product: any) => {
              try {
                const res = await api.get(`/reviews/product/${product._id}`);
                reviewsObj[product._id] = res.data;
              } catch {
                reviewsObj[product._id] = [];
              }
            })
          );
          setProductReviews(reviewsObj);
        } else {
          setProducts([])
        }
      } catch (err) {
        console.log(err)
        setError("Failed to fetch seller data")
      }
      setLoading(false)
    }
    fetchAll()
  }, [])

  const handleEditProfile = async () => {
    if (!user?._id) return
    setError("")
    try {
      await api.put(`/users/seller/${user._id}`, editProfileData)
      setShowEditProfile(false)
      // Refresh seller profile
      const profRes = await api.get(`/users/seller/${user._id}`)
      setSellerProfile(profRes.data)
    } catch (err) {
      setError("Failed to update profile")
    }
  }

  const handleAddProduct = async () => {
    setError("");
    try {
      let imageArr: { url: string }[] = [];
      if (productImages.length > 0) {
        setUploadingImage(true);
        const uploadResults = await Promise.all(
          productImages.map(async (file) => {
            const uploadRes = await uploadProductImage(file);
            return uploadRes && uploadRes.url ? { url: uploadRes.url } : null;
          })
        );
        setUploadingImage(false);
        imageArr = uploadResults.filter(Boolean) as { url: string }[];
      }
      // Convert specifications array to object
      const specsObj: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key) specsObj[spec.key] = spec.value;
      });
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        category: newProduct.category,
        condition: newProduct.condition,
        location: newProduct.location,
        images: imageArr,
        features,
        specifications: specsObj,
      };
      await api.post("/products", payload);
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        condition: "New",
        location: "",
      });
      setProductImages([]);
      setProductImageUrls([]);
      setFeatures([]);
      setFeatureInput("");
      setSpecifications([]);
      setSpecKey("");
      setSpecValue("");
      // Refresh products for this seller
      if (user?._id) {
        const res = await api.get(`/products?sellerId=${user._id}&limit=100`);
        setProducts(res.data.products);
      }
    } catch (err: any) {
      setError("Failed to add product");
      setUploadingImage(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your store and track your performance</p>
          </div>
          <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>


        {/* Seller Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={sellerProfile?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{sellerProfile?.name?.[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-1">{sellerProfile?.name}</h2>
              <p className="text-muted-foreground mb-2">{sellerProfile?.email}</p>
              <div className="flex items-center justify-center gap-1 mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{sellerProfile?.rating || "-"}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{sellerProfile?.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Since {sellerProfile?.joinDate ? new Date(sellerProfile.joinDate).getFullYear() : "-"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Badge>{sellerProfile?.location}</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setShowEditProfile(true)}>
                Edit Store Profile
              </Button>
            </CardContent>
          </Card>
          {/* Analytics */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">${analytics?.totalRevenue?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-primary">{analytics?.totalSales || 0}</p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold text-primary">{analytics?.productCount || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Store Info Sidebar */}
          {/* Store Info Sidebar removed: Use real data when available */}

          {/* Main Dashboard Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>My Products</CardTitle>
                        <CardDescription>Manage your product listings</CardDescription>
                      </div>
                      <Button onClick={() => setShowAddProduct(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <div>Loading...</div>
                      ) : error ? (
                        <div className="text-red-500">{error}</div>
                      ) : products.length === 0 ? (
                        <div>No products found.</div>
                      ) : products.map((product) => (
                        <Card key={product._id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.images && product.images[0] ? product.images[0].url : "/placeholder.svg"}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                  </div>
                                  <Badge className={getStatusColor(product.status || (product.quantity === 0 ? "Out of Stock" : "Active"))}>{product.status || (product.quantity === 0 ? "Out of Stock" : "Active")}</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Price: </span>
                                    <span className="font-medium">${product.price}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Stock: </span>
                                    <span className="font-medium">{product.quantity}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Sold: </span>
                                    <span className="font-medium">{product.sold || 0}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Views: </span>
                                    <span className="font-medium">{product.views || 0}</span>
                                  </div>
                                </div>
                                {/* Product Reviews */}
                                <div className="mt-4">
                                  <div className="font-semibold mb-1">Reviews:</div>
                                  {productReviews[product._id] && productReviews[product._id].length > 0 ? (
                                    <div className="space-y-2">
                                      {productReviews[product._id].map((review: any) => (
                                        <div key={review._id} className="flex items-center gap-2 text-sm">
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage src={review.buyer?.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>{review.buyer?.name?.[0]}</AvatarFallback>
                                          </Avatar>
                                          <span className="font-medium">{review.buyer?.name || "User"}</span>
                                          <span className="text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                          <span className="flex ml-2">
                                            {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                            ))}
                                          </span>
                                          <span className="ml-2">{review.comment}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-muted-foreground">No reviews</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab: Seller's Orders */}
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Manage customer orders and fulfillment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div className="text-muted-foreground text-center">No orders found.</div>
                      ) : orders.map((order: any) => (
                        <Card key={order._id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold">Order {order._id}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(order.status || "Delivered")}>{order.status || "Delivered"}</Badge>
                                <p className="text-lg font-semibold text-primary mt-1">${order.total || 0}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items && order.items.length > 0 ? order.items.map((item: any) => (
                                <div key={item._id} className="flex items-center gap-4 border-b pb-2 last:border-b-0">
                                  <img
                                    src={item.productId?.images?.[0]?.url || "/placeholder.svg"}
                                    alt={item.productId?.name || "Product"}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium">{item.productId?.name || "Product"}</div>
                                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm">${item.price} each</div>
                                    <div className="text-xs text-muted-foreground">Buyer: {order.buyer?.name || order.buyer}</div>
                                    <div className="text-xs text-muted-foreground">User ID: {order.buyer?._id || order.buyer}</div>
                                  </div>
                                </div>
                              )) : <div className="text-muted-foreground">No items</div>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Analytics</CardTitle>
                    <CardDescription>Overview of your store's performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold text-primary">${analytics?.totalRevenue?.toLocaleString() || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-2xl font-bold text-primary">{analytics?.totalSales || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Active Listings</p>
                        <p className="text-2xl font-bold text-primary">{analytics?.productCount || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Reviews</CardTitle>
                    <CardDescription>What buyers say about your store</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <div>No reviews yet.</div>
                      ) : reviews.map((review: any) => (
                        <Card key={review._id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={review.buyer?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{review.buyer?.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium">{review.buyer?.name}</span>
                                <span className="ml-2 text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex ml-auto">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground ml-11">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
        {/* Edit Store Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit Store Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <div className="text-red-500">{error}</div>}
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={editProfileData.name}
                    onChange={e => setEditProfileData({ ...editProfileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editProfileData.description}
                    onChange={e => setEditProfileData({ ...editProfileData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={editProfileData.avatar}
                    onChange={e => setEditProfileData({ ...editProfileData, avatar: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editProfileData.location}
                    onChange={e => setEditProfileData({ ...editProfileData, location: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleEditProfile} className="flex-1">Save</Button>
                  <Button variant="outline" onClick={() => setShowEditProfile(false)} className="flex-1">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

              {/* Customers Tab */}
              <TabsContent value="customers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Insights</CardTitle>
                    <CardDescription>Understand your customer base</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Customer Analytics Coming Soon</h3>
                      <p className="text-muted-foreground">
                        Detailed customer insights and analytics will be available in a future update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product listing for your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <div className="text-red-500">{error}</div>}
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Describe your product"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Stock Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={newProduct.condition}
                      onValueChange={(value) => setNewProduct({ ...newProduct, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="product-images">Product Images (up to 5)</Label>
                  <Input
                    id="product-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        // Append to existing, but max 5
                        const combined = [...productImages, ...newFiles].slice(0, 5);
                        setProductImages(combined);
                        setProductImageUrls(combined.map(f => URL.createObjectURL(f)));
                      }
                    }}
                  />
                  {productImageUrls.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {productImageUrls.map((url, idx) => (
                        <img key={idx} src={url} alt={`Preview ${idx + 1}`} className="w-24 h-24 object-cover rounded" />
                      ))}
                    </div>
                  )}
                </div>
                {/* Features input */}
                <div>
                  <Label>Key Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInput}
                      onChange={e => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && featureInput.trim()) {
                          e.preventDefault();
                          setFeatures([...features, featureInput.trim()]);
                          setFeatureInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (featureInput.trim()) {
                          setFeatures([...features, featureInput.trim()]);
                          setFeatureInput("");
                        }
                      }}
                    >Add</Button>
                  </div>
                  {features.length > 0 && (
                    <ul className="list-disc ml-6 text-sm text-muted-foreground">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span>{f}</span>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}>Remove</Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Specifications input */}
                <div>
                  <Label>Specifications</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={specKey}
                      onChange={e => setSpecKey(e.target.value)}
                      placeholder="Key (e.g. Color)"
                    />
                    <Input
                      value={specValue}
                      onChange={e => setSpecValue(e.target.value)}
                      placeholder="Value (e.g. Red)"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (specKey.trim() && specValue.trim()) {
                          setSpecifications([...specifications, { key: specKey.trim(), value: specValue.trim() }]);
                          setSpecKey("");
                          setSpecValue("");
                        }
                      }}
                    >Add</Button>
                  </div>
                  {specifications.length > 0 && (
                    <ul className="ml-2 text-sm text-muted-foreground">
                      {specifications.map((spec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span>{spec.key}: {spec.value}</span>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setSpecifications(specifications.filter((_, idx) => idx !== i))}>Remove</Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddProduct} className="flex-1" disabled={uploadingImage}>
                    {uploadingImage ? "Uploading..." : "Add Product"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddProduct(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
