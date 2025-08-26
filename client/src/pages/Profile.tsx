"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Package, Heart, Settings, MapPin, Calendar, Edit } from "lucide-react"

const mockUser = {
    id:1,
    name:"Mishti Garg",
    email:"gargmishti9@gmail.com",
    joinedDate: "2023-01-15",
    location:"Prayagraj, UP",
    phone:" +91 9350877840",
    totalOrders: 9,
    totalSpent: 3450.90,
    

}

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-20",
    status: "Delivered",
    total: 99.99,
    items: [
      {
        id: 1,
        title: "Wireless Headphones",
        image: "/wireless-headphones.png",
        price: 99.99,
        quantity: 1,
        seller: "TechStore",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-18",
    status: "Shipped",
    total: 149.99,
    items: [
      {
        id: 2,
        title: "Vintage Leather Jacket",
        image: "/vintage-leather-jacket.png",
        price: 149.99,
        quantity: 1,
        seller: "FashionHub",
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-15",
    status: "Processing",
    total: 79.99,
    items: [
      {
        id: 3,
        title: "Smart Home Speaker",
        image: "/smart-home-speaker.png",
        price: 79.99,
        quantity: 1,
        seller: "SmartTech",
      },
    ],
  },
]

// Mock favorites data
const mockFavorites = [
  {
    id: 4,
    title: "Gaming Mechanical Keyboard",
    image: "/gaming-mechanical-keyboard.png",
    price: 129.99,
    seller: "GameGear",
    rating: 4.6,
    category: "Electronics",
  },
  {
    id: 5,
    title: "Handmade Ceramic Vase",
    image: "/handmade-ceramic-vase.png",
    price: 45.99,
    seller: "ArtisanCrafts",
    rating: 4.7,
    category: "Home",
  },
]


export default function ProfilePage(){
     const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location,
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
    console.log("Saving user data:", formData)
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
    return(
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
                  <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{mockUser.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{mockUser.name}</h2>
                <p className="text-muted-foreground mb-2">{mockUser.email}</p>
                <Badge className="mb-4 bg-primary text-primary-foreground">Gold Member</Badge>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(mockUser.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{mockUser.location}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{mockUser.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">${mockUser.totalSpent}</div>
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
                      {mockOrders.map((order) => (
                        <Card key={order.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold">Order {order.id}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Placed on {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                <p className="text-lg font-semibold text-primary mt-1">${order.total}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      by {item.seller} • Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {order.status === "Delivered" && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
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
                    <CardTitle>Favorite Items</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockFavorites.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <a href={`/products/${item.id}`}>
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                />
                              </a>
                              <div className="flex-1">
                                <a href={`/products/${item.id}`}>
                                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                  </h3>
                                </a>
                                <p className="text-sm text-muted-foreground mb-2">by {item.seller}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">${item.price}</span>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="ml-1 text-sm">{item.rating}</span>
                                  </div>
                                </div>
                                <Button size="sm" className="w-full mt-2">
                                  Add to Cart
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