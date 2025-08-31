import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Plus,
  ShoppingCart,
  Star,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Shield,
  DollarSign,
  ShoppingBag,
  Mail,
} from "lucide-react"

import { uploadProductImage } from "../api/api";

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: "",
    location: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [user, setUser] = useState<any>(null)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [reviews,setReviews] = useState<any[]>([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [soldCounts, setSoldCounts] = useState<{ [productId: string]: number }>({});
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
      
    
      if (user?._id) {
        const res = await api.get(`/products?sellerId=${user._id}&limit=100`);
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error)
      setUploadingImage(false);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    setError("");
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.log(err)
      setError("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    try {
      const res = await api.put(`/products/${productId}/feature`);
      // Update the product in the local state
      setProducts(products.map(p => 
        p._id === productId 
          ? { ...p, isFeatured: res.data.product.isFeatured }
          : p
      ));
    } catch (err) {
      console.error("Failed to toggle featured status", err);
      setError("Failed to update featured status");
    }
  };
  function getStatusColor(status: string) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
     
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
  

  const handleOpenEditProfile = () => {
    setEditProfileData({
      name: sellerProfile?.name || "",
      location: sellerProfile?.location || "",
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setError("");
    try {
      await api.put(`/users/seller/${sellerProfile._id}`, {
        name: editProfileData.name,
        location: editProfileData.location,
      });
      setShowEditProfile(false);
      await api.get(`/users/seller/${sellerProfile._id}`);
    } catch (err) {
      console.log(err)
      setError("Failed to update seller profile");
    } finally {
      setSavingProfile(false);
    }
  };
  
 
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      let userRes;
      try {
        userRes = await api.get("/users/me");
      } catch (err) {
        console.error("Failed to fetch /users/me", err);
        setError("Failed to fetch user info");
        setLoading(false);
        return;
      }
      setUser(userRes.data.user);
      const sellerId = userRes.data.user?._id;
      if (sellerId) {
        let prodRes, profRes, anaRes, ordRes, revRes;
        try {
          [prodRes, profRes, anaRes, ordRes, revRes] = await Promise.all([
            api.get(`/products?sellerId=${sellerId}&limit=100`),
            api.get(`/users/seller/${sellerId}`),
            api.get(`/products/seller/${sellerId}/analytics`),
            api.get(`/products/seller/${sellerId}/orders`),
            api.get(`/users/seller/${sellerId}/reviews`),
          ]);
        } catch (err) {
          console.error("Failed to fetch one of the seller endpoints", err);
          setError("Failed to fetch seller details");
          setLoading(false);
          return;
        }
        setProducts(prodRes.data.products);
        setSellerProfile(profRes.data);
        setAnalytics(anaRes.data);
        setOrders(ordRes.data);
        setReviews(revRes.data);
        if (typeof setEditProfileData === 'function') {
          setEditProfileData({
            name: profRes.data.name || "",
            location: profRes.data.location || "",
          });
        }

        const reviewsObj: { [productId: string]: any[] } = {};
        await Promise.all(
          prodRes.data.products.map(async (product: any) => {
            try {
              const res = await api.get(`/reviews/product/${product._id}`);
              reviewsObj[product._id] = res.data;
            } catch (err) {
              console.error(`Failed to fetch reviews for product ${product._id}`, err);
              reviewsObj[product._id] = [];
            }
          })
        );
     
  
        const soldMap: { [productId: string]: number } = {};
        ordRes.data.forEach((order: any) => {
          order.items.forEach((item: any) => {
            const pid = item.productId && item.productId._id ? item.productId._id : item.productId;
            if (pid) {
              soldMap[pid] = (soldMap[pid] || 0) + (item.quantity || 0);
            }
          });
        });
        setSoldCounts(soldMap);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Unknown error in fetchAll", err);
      setError("Failed to fetch seller data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Auto-refresh every 30 seconds to show updated stock level
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?._id) {
        fetchAll();
      }
    }, 30000); 

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="container mx-auto py-8 px-2 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div>
          <Card className="rounded-2xl shadow-xl border-0 overflow-hidden font-poppins">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-300 p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white shadow-lg">
                <AvatarImage src={sellerProfile?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl bg-white text-yellow-600 font-bold">
                  {sellerProfile?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-black mb-1">{sellerProfile?.name}</h2>
              <p className="text-black/80 text-sm">{sellerProfile?.email}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-600" />
                <span className="font-medium text-black">{sellerProfile?.rating || "-"}</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full uppercase tracking-wide border-0">
                {sellerProfile?.location || "Location"}
              </Badge>
              <Button
                variant="outline"
                className="w-full mt-4 border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400"
                onClick={handleOpenEditProfile}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <CardContent className="p-6">
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-black/70">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Since {sellerProfile?.joinDate ? new Date(sellerProfile.joinDate).getFullYear() : "-"}</span>
                </div>
              </div>
              <Separator className="my-6 bg-yellow-100" />
              <div className="space-y-4">
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-lg font-bold text-black">${analytics?.totalRevenue?.toLocaleString() || 0}</span>
                  </div>
                  <div className="text-xs text-black/70">Total Revenue</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <div className="flex items-center justify-center mb-1">
                    <ShoppingBag className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-lg font-bold text-black">{analytics?.totalSales || 0}</span>
                  </div>
                  <div className="text-xs text-black/70">Total Sales</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <div className="flex items-center justify-center mb-1">
                    <Package className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-lg font-bold text-black">{analytics?.productCount || 0}</span>
                  </div>
                  <div className="text-xs text-black/70">Active Listings</div>
                </div>
              </div>
            </CardContent>
          </Card>

        
          {showEditProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowEditProfile(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-yellow-700">Edit Seller Profile</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seller-name" className="text-gray-700 font-medium">Name</Label>
                    <Input
                      id="seller-name"
                      value={editProfileData.name}
                      onChange={e => setEditProfileData({ ...editProfileData, name: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-yellow-400 text-gray-900"
                      placeholder="Enter seller name"
                    />
                  </div>
                 
                  <div>
                    <Label htmlFor="seller-location" className="text-gray-700 font-medium">Location</Label>
                    <Input
                      id="seller-location"
                      value={editProfileData.location}
                      onChange={e => setEditProfileData({ ...editProfileData, location: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-yellow-400 text-gray-900"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-yellow-500 text-white font-semibold hover:bg-yellow-600 px-6"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditProfile(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                  >
                    Cancel
                  </Button>
                </div>
                {error && <div className="text-red-500 mt-3">{error}</div>}
              </div>
            </div>
          )}
        </div>
        {/* Main Dashboard Content */}
        <div className="lg:col-span-3">
          <div>
            <Tabs defaultValue="products" className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                <TabsList className="grid w-full grid-cols-4 rounded-xl overflow-hidden bg-gray-100 p-1 h-16">
                  <TabsTrigger 
                    value="inbox" 
                    className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group cursor-pointer"
                    onClick={() => navigate('/seller-chat')}
                  >
                    <Mail className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:inline">Messages</span>
                  </TabsTrigger>
              {/* Messages Tab: Redirect to Dedicated Chat */}
              <TabsContent value="inbox" className="space-y-6">
                <Card className="rounded-2xl border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl border-b border-green-100 px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">Customer Messages</CardTitle>
                        <CardDescription className="text-gray-600">Access your dedicated chat interface</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <Mail className="h-16 w-16 text-green-500 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Chat with Your Customers</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Use our dedicated chat interface to communicate with customers about your products in real-time.
                      </p>
                      <Button 
                        onClick={() => navigate('/seller-chat')}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Open Chat Interface
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
                  <TabsTrigger 
                    value="products" 
                    className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group"
                  >
                    <Package className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" /> 
                    <span className="hidden sm:inline">Products</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group"
                  >
                    <ShoppingCart className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" /> 
                    <span className="hidden sm:inline">Orders</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group"
                  >
                    <BarChart3 className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" /> 
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <Card className="rounded-2xl border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-2xl border-b border-yellow-100 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Package className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">My Products</CardTitle>
                          <CardDescription className="text-gray-600 mt-1">Manage your product listings</CardDescription>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setShowAddProduct(true)} 
                        size="sm" 
                        className="bg-yellow-500 text-white font-semibold hover:bg-yellow-600 px-5 py-2 shadow-sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your products...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-fit">
                          <Shield className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-red-500 text-lg">{error}</p>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
                        <p className="text-gray-600">Start by adding your first product to your store.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Image</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Featured</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Stock</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Sold</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product: any) => (
                              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <img
                                    src={product.images && product.images[0] ? product.images[0].url : "/placeholder.svg"}
                                    alt={product.images && product.images[0] ? product.images[0].alt || product.name : product.name}
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                                  />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                <td className="px-6 py-4">
                                  <Badge className={`${getStatusColor(product.status || (product.quantity === 0 ? "Out of Stock" : "Active"))} rounded-full px-3 py-1 font-semibold text-xs border`}>
                                    {product.status || (product.quantity === 0 ? "Out of Stock" : "Active")}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <Button
                                    variant={product.isFeatured ? "default" : "outline"}
                                    size="sm"
                                    className={`${product.isFeatured 
                                      ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                                      : "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                                    } px-3 py-1 text-xs font-semibold`}
                                    onClick={() => handleToggleFeatured(product._id)}
                                  >
                                    {product.isFeatured ? "Featured" : "Feature"}
                                  </Button>
                                </td>
                                <td className="px-6 py-4 text-yellow-600 font-semibold">${product.price}</td>
                                <td className="px-6 py-4 text-gray-600">{product.quantity}</td>
                                <td className="px-6 py-4 text-gray-600">{soldCounts[product._id] ?? 0}</td>
                                <td className="px-6 py-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    onClick={() => handleDeleteProduct(product._id)}
                                    disabled={false}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab: Seller's Orders */}
              <TabsContent value="orders" className="space-y-6">
                <Card className="rounded-2xl border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-2xl border-b border-yellow-100 px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">Manage customer orders and fulfillment</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600">Orders from your customers will appear here.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Order ID</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Buyer</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Items</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order: any) => (
                              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-gray-900">{order._id?.slice(-8)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.buyer?.name || order.buyer}</td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-2">
                                    {order.items && order.items.length > 0 ? order.items.map((item: any) => (
                                      <div key={item._id} className="flex items-center gap-2">
                                        <img
                                          src={item.productId && item.productId.images && item.productId.images[0] ? item.productId.images[0].url : "/placeholder.svg"}
                                          alt={item.productId && item.productId.name ? item.productId.name : "Product"}
                                          className="w-8 h-8 object-cover rounded-lg border border-gray-200"
                                        />
                                        <span className="font-medium text-gray-900">{item.productId && item.productId.name ? item.productId.name : (item.name || "Product")}</span>
                                        <span className="text-xs text-gray-600">x{item.quantity}</span>
                                        {item.productId && typeof item.productId.rating !== 'undefined' && (
                                          <span className="text-xs text-yellow-600 ml-2 flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {item.productId.rating}/5
                                          </span>
                                        )}
                                        {item.productId && item.productId.reviews && (
                                          <span className="text-xs text-gray-500 ml-2">{item.productId.reviews.length} reviews</span>
                                        )}
                                      </div>
                                                                          )) : <span className="text-gray-600">No items</span>}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge className={`${getStatusColor(order.status || "Delivered")} rounded-full px-3 py-1 font-semibold text-xs border`}>
                                      {order.status || "Delivered"}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold text-yellow-600">${order.total || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

                             {/* Analytics Tab */}
               <TabsContent value="analytics" className="space-y-6">
                 {/* Key Metrics Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <Card className="bg-yellow-50 border-yellow-200">
                     <CardContent className="p-6">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-yellow-700 mb-1">Total Revenue</p>
                           <p className="text-2xl font-bold text-black">${analytics?.totalRevenue?.toLocaleString() || 0}</p>
                         </div>
                         <div className="p-3 bg-yellow-100 rounded-full">
                           <DollarSign className="h-6 w-6 text-yellow-600" />
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                   <Card className="bg-yellow-50 border-yellow-200">
                     <CardContent className="p-6">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-yellow-700 mb-1">Total Sales</p>
                           <p className="text-2xl font-bold text-black">{analytics?.totalSales || 0}</p>
                         </div>
                         <div className="p-3 bg-yellow-100 rounded-full">
                           <ShoppingBag className="h-6 w-6 text-yellow-600" />
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                   <Card className="bg-yellow-50 border-yellow-200">
                     <CardContent className="p-6">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-yellow-700 mb-1">Active Listings</p>
                           <p className="text-2xl font-bold text-black">{analytics?.productCount || 0}</p>
                         </div>
                         <div className="p-3 bg-yellow-100 rounded-full">
                           <Package className="h-6 w-6 text-yellow-600" />
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                   <Card className="bg-yellow-50 border-yellow-200">
                     <CardContent className="p-6">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-yellow-700 mb-1">Avg. Rating</p>
                           <div className="flex items-center gap-1">
                             <p className="text-2xl font-bold text-black">{sellerProfile?.rating || 0}</p>
                             <Star className="h-5 w-5 fill-yellow-400 text-yellow-600" />
                           </div>
                           <p className="text-xs text-yellow-700 mt-1">Based on {reviews.length} reviews</p>
                         </div>
                         <div className="p-3 bg-yellow-100 rounded-full">
                           <Star className="h-6 w-6 text-yellow-600" />
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>

                 

                 
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



            </Tabs>
          </div >
        </div >

  {
    showAddProduct && (
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
                  placeholder="Add a feature (e.g. Long battery life)"
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
    )
  }
      </div >
    </div >
  )
}
