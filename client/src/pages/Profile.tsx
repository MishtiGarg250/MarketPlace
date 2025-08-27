
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Heart, Settings, MapPin, Calendar, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import api, { getFavorites, removeFavorite } from "../api/api"
import { Card as ProductCard, CardContent as ProductCardContent, CardTitle as ProductCardTitle, CardDescription as ProductCardDescription } from "@/components/ui/card";


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  })
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useState<any[]>([]);

  // Fetch favorites when tab is loaded
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
        setOrders(res.data.purchases || [])
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
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
                <p className="text-muted-foreground mb-2">{user?.email}</p>
                <Badge className="mb-4 bg-primary text-primary-foreground">{user?.type || "Member"}</Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{user?.location}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{user?.totalOrders ?? 0}</div>
                    <div className="text-sm text-muted-foreground">Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">${user?.totalSpent ?? 0}</div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your recent orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div>No orders found.</div>
                      ) : orders.map((order) => (
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
                              {order.items && order.items.length > 0 ? order.items.map((item:any) => (
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
                                    <div className="text-xs text-muted-foreground">Seller: {item.seller?.name || item.seller}</div>
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

            

              <TabsContent value="favorites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorites</CardTitle>
                    <CardDescription>Your favorite products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.length === 0 ? (
                        <div className="text-muted-foreground col-span-full">No favorite products yet.</div>
                      ) : favorites.map((product) => (
                        <ProductCard key={product._id} className="group hover:shadow-lg transition-shadow">
                          <ProductCardContent className="p-4">
                            <div className="relative">
                              <a href={`/products/${product._id}`}>
                                <img
                                  src={product.images?.[0]?.url || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-40 object-cover rounded-lg mb-2"
                                />
                                <ProductCardTitle className="text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                  {product.name}
                                </ProductCardTitle>
                              </a>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                                onClick={() => handleRemoveFavorite(product._id)}
                                aria-label="Remove from favorites"
                              >
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              </Button>
                            </div>
                            <ProductCardDescription className="mb-2">{product.category}</ProductCardDescription>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xl font-bold text-primary">${product.price}</span>
                              <span className="text-sm text-muted-foreground">{product.condition}</span>
                            </div>
                          </ProductCardContent>
                        </ProductCard>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Update your personal information</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
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