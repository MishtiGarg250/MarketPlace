
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Heart, Settings, MapPin, Calendar, Edit, User, Shield, LogOut, Download, Star, ShoppingBag, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import api, { getFavorites, removeFavorite } from "../api/api"
import { Card as ProductCard, CardContent as ProductCardContent, CardDescription as ProductCardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("orders");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  })
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data.favorites || []);
    } catch {
      setFavorites([]);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    await removeFavorite(productId);
    setFavorites(favorites.filter((p) => p._id !== productId));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get("/users/me")
        setUser(res.data.user)
        // Remove duplicate orders by _id
        const uniqueOrders = (res.data.purchases || []).filter((order: any, idx: number, arr: any[]) =>
          arr.findIndex(o => o._id === order._id) === idx
        );
        setOrders(uniqueOrders);
        setTotalOrders(uniqueOrders.length);
        setTotalSpent(uniqueOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0));
        setFormData({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          phone: res.data.user.contact || "",
          location: res.data.user.location || "",
        })
      } catch (err) {
        console.log(err)
        setError("Failed to load profile")
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setError("")
    try {
      await api.put("/users/me", {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
        location: formData.location,
      })
      setIsEditing(false)
      // Refresh user info
      const res = await api.get("/users/me")
      setUser(res.data.user)
    } catch (err: any) {
      setError("Failed to update profile")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-fit">
          <Shield className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your account and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white shadow-lg">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-white text-yellow-600 font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
                <p className="text-yellow-100 text-sm">{user?.email}</p>
                <Badge className="mt-3 bg-white text-yellow-600 font-semibold px-3 py-1 rounded-full uppercase tracking-wide border-0">
                  {user?.type || "Member"}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Joined {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{user?.location || "Location not set"}</span>
                  </div>
                </div>

                <Separator className="my-6 bg-gray-100" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <ShoppingBag className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{totalOrders}</span>
                    </div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">${totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600">Spent</div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400"
                  onClick={() => {
                    setIsEditing(true);
                    setActiveTab("settings");
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
                         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                 <TabsList className="grid w-full grid-cols-3 rounded-xl overflow-hidden bg-gray-100 p-1 h-16">
                   <TabsTrigger 
                     value="orders" 
                     className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group relative"
                   >
                     <Package className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" /> 
                     <span className="hidden sm:inline">Orders</span>
                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                       {orders.length}
                     </div>
                   </TabsTrigger>
                   <TabsTrigger 
                     value="favorites" 
                     className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group relative"
                   >
                     <Heart className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" /> 
                     <span className="hidden sm:inline">Favorites</span>
                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                       {favorites.length}
                     </div>
                   </TabsTrigger>
                   <TabsTrigger 
                     value="settings" 
                     className="flex items-center justify-center gap-3 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 py-4 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=inactive]:hover:bg-gray-50 group"
                   >
                     <Settings className="h-5 w-5 group-data-[state=active]:scale-110 transition-transform duration-200" /> 
                     <span className="hidden sm:inline">Settings</span>
                   </TabsTrigger>
                 </TabsList>
               </div>

                             {/* Orders Tab */}
               <TabsContent value="orders" className="space-y-6">
                 <Card className="rounded-2xl border-0 shadow-lg bg-white">
                   <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-2xl border-b border-yellow-100 px-8 py-6">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-yellow-100 rounded-lg">
                           <Package className="h-5 w-5 text-yellow-600" />
                         </div>
                         <div>
                           <CardTitle className="text-xl font-bold text-gray-900">Order History</CardTitle>
                           <CardDescription className="text-gray-600">View and track your recent orders</CardDescription>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                           {orders.length} Orders
                         </Badge>
                       </div>
                     </div>
                   </CardHeader>
                  <CardContent className="p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600">Start shopping to see your order history here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order._id} className="border border-gray-100 rounded-xl bg-white hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900">Order #{order._id?.slice(-8)}</h3>
                                  <p className="text-sm text-gray-600">
                                    Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(order.status || "Delivered")} rounded-full px-3 py-1 font-semibold text-xs border`}>
                                    {order.status || "Delivered"}
                                  </Badge>
                                  <p className="text-lg font-bold text-yellow-600 mt-1">${order.total || 0}</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                {order.items && order.items.length > 0 ? order.items.map((item: any) => (
                                  <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <img
                                      src={item.productId?.images?.[0]?.url || "/placeholder.svg"}
                                      alt={item.productId?.name || "Product"}
                                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{item.productId?.name || "Product"}</div>
                                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">${item.price} each</div>
                                      <div className="text-xs text-gray-500">Seller: {item.seller?.name || item.seller}</div>
                                    </div>
                                  </div>
                                )) : (
                                  <div className="text-gray-600 text-center py-4">No items</div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

                             {/* Favorites Tab */}
               <TabsContent value="favorites" className="space-y-6">
                 <Card className="rounded-2xl border-0 shadow-lg bg-white">
                   <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-2xl border-b border-pink-100 px-8 py-6">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-pink-100 rounded-lg">
                           <Heart className="h-5 w-5 text-pink-600" />
                         </div>
                         <div>
                           <CardTitle className="text-xl font-bold text-gray-900">Favorites</CardTitle>
                           <CardDescription className="text-gray-600">Your favorite products</CardDescription>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                           {favorites.length} Items
                         </Badge>
                       </div>
                     </div>
                   </CardHeader>
                  <CardContent className="p-6">
                    {favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
                        <p className="text-gray-600">Start adding products to your favorites to see them here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((product) => (
                          <ProductCard key={product._id} className="group hover:shadow-lg transition-all duration-200 border border-gray-100 rounded-xl bg-white overflow-hidden">
                            <ProductCardContent className="p-0">
                              <div className="relative">
                                <a href={`/products/${product._id}`}>
                                  <img
                                    src={product.images?.[0]?.url || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                </a>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 border border-gray-200 hover:border-red-200"
                                  onClick={() => handleRemoveFavorite(product._id)}
                                  aria-label="Remove from favorites"
                                >
                                  <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                                </Button>
                                <ProductCardDescription className="mb-3 text-gray-600">{product.category}</ProductCardDescription>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xl font-bold text-yellow-600">${product.price}</span>
                                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">{product.condition}</Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-gray-600">{product.rating || 0}/5</span>
                                </div>
                              </div>
                            </ProductCardContent>
                          </ProductCard>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

                             {/* Settings Tab */}
               <TabsContent value="settings" className="space-y-6">
                 <Card className="rounded-2xl border-0 shadow-lg bg-white">
                   <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-blue-100 px-8 py-6">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-100 rounded-lg">
                           <Settings className="h-5 w-5 text-blue-600" />
                         </div>
                         <div>
                           <CardTitle className="text-xl font-bold text-gray-900">Account Settings</CardTitle>
                           <CardDescription className="text-gray-600">Update your personal information</CardDescription>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                           {isEditing ? "Editing" : "View Only"}
                         </Badge>
                       </div>
                     </div>
                   </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-yellow-400 text-gray-900 disabled:bg-gray-100"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-yellow-400 text-gray-900 disabled:bg-gray-100"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-yellow-400 text-gray-900 disabled:bg-gray-100"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 focus:border-yellow-400 text-gray-900 disabled:bg-gray-100"
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleSave} 
                          className="bg-yellow-500 text-white font-semibold hover:bg-yellow-600 px-6"
                        >
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)} 
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                                 <Card className="rounded-2xl border-0 shadow-lg bg-white">
                   <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl border-b border-gray-200 px-8 py-6">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-gray-100 rounded-lg">
                         <Shield className="h-5 w-5 text-gray-600" />
                       </div>
                       <div>
                         <CardTitle className="text-xl font-bold text-gray-900">Account Actions</CardTitle>
                         <CardDescription className="text-gray-600">Manage your account preferences</CardDescription>
                       </div>
                     </div>
                   </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      onClick={() => {
                        // Download order history as a log file
                        const log = orders.map(order => {
                          return `Order #${order._id?.slice(-8)} | Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"} | Total: $${order.total || 0} | Status: ${order.status || "-"}`;
                        }).join("\n");
                        const blob = new Blob([log], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `order-history-${user?.name || "user"}.log`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-4 w-4 mr-3" />
                      Download My Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      onClick={() => {
                        // Sign out: clear localStorage and reload
                        localStorage.removeItem("auth");
                        window.location.href = "/login";
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}