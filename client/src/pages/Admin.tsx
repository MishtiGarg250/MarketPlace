"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock admin data
const mockAdminStats = {
  totalUsers: 15420,
  totalSellers: 1250,
  totalProducts: 8930,
  totalOrders: 45670,
  totalRevenue: 2456789.5,
  pendingApprovals: 23,
  reportedItems: 8,
  activeDisputes: 5,
}

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/male-user-avatar.png",
    type: "Buyer",
    status: "Active",
    joinDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 1247.89,
  },
  {
    id: 2,
    name: "TechStore",
    email: "contact@techstore.com",
    avatar: "/tech-store-logo.png",
    type: "Seller",
    status: "Active",
    joinDate: "2022-03-15",
    totalOrders: 1250,
    totalSpent: 45678.9,
  },
  {
    id: 3,
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    avatar: "/female-user-avatar.png",
    type: "Buyer",
    status: "Suspended",
    joinDate: "2023-06-20",
    totalOrders: 3,
    totalSpent: 299.97,
  },
]

// Mock products for moderation
const mockPendingProducts = [
  {
    id: 1,
    title: "Wireless Gaming Headset",
    seller: "GameGear Pro",
    category: "Electronics",
    price: 159.99,
    image: "/placeholder.svg?key=gaming-headset",
    status: "Pending",
    submittedDate: "2024-01-20",
    description: "High-quality wireless gaming headset with 7.1 surround sound",
  },
  {
    id: 2,
    title: "Vintage Denim Jacket",
    seller: "RetroFashion",
    category: "Fashion",
    price: 89.99,
    image: "/placeholder.svg?key=denim-jacket",
    status: "Pending",
    submittedDate: "2024-01-19",
    description: "Authentic vintage denim jacket from the 1980s",
  },
  {
    id: 3,
    title: "Organic Honey Set",
    seller: "NaturalGoods",
    category: "Food",
    price: 34.99,
    image: "/placeholder.svg?key=honey-set",
    status: "Flagged",
    submittedDate: "2024-01-18",
    description: "Pure organic honey collection from local beekeepers",
  },
]

// Mock orders data
const mockRecentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    seller: "TechStore",
    product: "Wireless Headphones",
    amount: 99.99,
    status: "Completed",
    date: "2024-01-20",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    seller: "FashionHub",
    product: "Vintage Leather Jacket",
    amount: 149.99,
    status: "Disputed",
    date: "2024-01-19",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    seller: "SmartTech",
    product: "Smart Home Speaker",
    amount: 79.99,
    status: "Shipped",
    date: "2024-01-18",
  },
]

// Mock analytics data
const mockAnalytics = {
  dailySignups: [
    { date: "Jan 15", users: 45, sellers: 3 },
    { date: "Jan 16", users: 52, sellers: 5 },
    { date: "Jan 17", users: 38, sellers: 2 },
    { date: "Jan 18", users: 61, sellers: 4 },
    { date: "Jan 19", users: 49, sellers: 6 },
    { date: "Jan 20", users: 55, sellers: 3 },
  ],
  categoryBreakdown: [
    { category: "Electronics", percentage: 35, count: 3125 },
    { category: "Fashion", percentage: 25, count: 2232 },
    { category: "Home", percentage: 20, count: 1786 },
    { category: "Beauty", percentage: 12, count: 1072 },
    { category: "Food", percentage: 8, count: 715 },
  ],
}

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState("All")
  const [productFilter, setProductFilter] = useState("All")

  const handleUserAction = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`)
    // TODO: Implement user management actions
  }

  const handleProductAction = (productId: number, action: string) => {
    console.log(`${action} product ${productId}`)
    // TODO: Implement product moderation actions
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Completed":
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Suspended":
      case "Disputed":
      case "Flagged":
        return "bg-red-100 text-red-800"
      case "Pending":
      case "Shipped":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-space-grotesk text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your marketplace platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-primary">{mockAdminStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">${mockAdminStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Products</p>
                  <p className="text-2xl font-bold text-primary">{mockAdminStats.totalProducts.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Actions</p>
                  <p className="text-2xl font-bold text-destructive">{mockAdminStats.pendingApprovals}</p>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Pending Approvals</p>
                  <p className="text-sm text-yellow-600">{mockAdminStats.pendingApprovals} products awaiting review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Reported Items</p>
                  <p className="text-sm text-red-600">{mockAdminStats.reportedItems} items flagged by users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Active Disputes</p>
                  <p className="text-sm text-blue-600">{mockAdminStats.activeDisputes} orders need resolution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
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
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage buyers and sellers on your platform</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Buyer">Buyers</SelectItem>
                        <SelectItem value="Seller">Sellers</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <Card key={user.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                <Badge variant="outline">{user.type}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  Joined {new Date(user.joinDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <p className="font-medium">{user.totalOrders} orders</p>
                              <p className="text-muted-foreground">${user.totalSpent.toLocaleString()}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "suspend")}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  {user.status === "Active" ? "Suspend" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, "delete")}
                                  className="text-destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Delete Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Moderation Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Moderation</CardTitle>
                    <CardDescription>Review and approve product listings</CardDescription>
                  </div>
                  <Select value={productFilter} onValueChange={setProductFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Flagged">Flagged</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingProducts.map((product) => (
                    <Card key={product.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{product.title}</h3>
                                <p className="text-sm text-muted-foreground">by {product.seller}</p>
                                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                                <p className="text-lg font-semibold text-primary mt-1">${product.price}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{product.category}</span>
                                <span>Submitted {new Date(product.submittedDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleProductAction(product.id, "approve")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleProductAction(product.id, "reject")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleProductAction(product.id, "view")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Monitor and resolve order issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentOrders.map((order) => (
                    <Card key={order.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">Order {order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.customer} → {order.seller}
                            </p>
                            <p className="text-sm text-muted-foreground">{order.product}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <p className="text-lg font-semibold text-primary mt-1">${order.amount}</p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {order.status === "Disputed" && <Button size="sm">Resolve Dispute</Button>}
                            </div>
                          </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Signups</CardTitle>
                  <CardDescription>New user registrations over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {mockAnalytics.dailySignups.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="bg-primary rounded-t w-full"
                            style={{ height: `${(data.users / 70) * 150}px`, minHeight: "20px" }}
                          />
                          <div
                            className="bg-secondary rounded-t w-full"
                            style={{ height: `${(data.sellers / 10) * 50}px`, minHeight: "10px" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{data.date.split(" ")[1]}</p>
                        <p className="text-xs font-medium">{data.users + data.sellers}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded" />
                      <span className="text-sm">Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded" />
                      <span className="text-sm">Sellers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Product distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.percentage}% ({category.count})
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">23.5%</p>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">89.2%</p>
                  <p className="text-sm text-muted-foreground">User Retention</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">$156</p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure marketplace parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Platform Fee (%)</label>
                    <Input type="number" defaultValue="5" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Minimum Order Value ($)</label>
                    <Input type="number" defaultValue="10" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Auto-approve Products</label>
                    <Select defaultValue="false">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Monitor platform health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Gateway</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Service</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Storage</span>
                    <Badge className="bg-yellow-100 text-yellow-800">75% Used</Badge>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Run System Check
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
