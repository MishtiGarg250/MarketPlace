
type OrderItem = {
  productId?: { name?: string };
  seller?: { name?: string };
  quantity: number;
  price: number;
};
type Order = {
  _id: string;
  buyer?: { name?: string };
  items: OrderItem[];
  status: string;
  total: number;
  createdAt?: string;
};
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};
type Product = {
  _id: string;
  name: string;
  price: number;
  status: string;
  seller: { name: string };
};
type Stats = {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};

import { useState, useEffect } from "react"
import api from "../api/api"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Search
} from "lucide-react"



export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
          api.get("/admin/products"),
          api.get("/admin/orders"),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch {
        setError("Failed to load admin data");
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Completed":
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Suspended":
      case "Disputed":
      case "Flagged":
        return "bg-red-100 text-red-800";
      case "Pending":
      case "Shipped":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading admin dashboard...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">{error}</div>;
  }


  const totalUsers = stats?.totalUsers || 0;
  const totalProducts = stats?.totalProducts || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  return (
    <div className="min-h-screen bg-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your market place platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-primary">{totalUsers.toLocaleString()}</p>
                 
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
                  <p className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
                 
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
                  <p className="text-2xl font-bold text-primary">{totalProducts.toLocaleString()}</p>
                
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{totalOrders.toLocaleString()}</p>
                  
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
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
                        <SelectItem value="buyer">Buyers</SelectItem>
                        <SelectItem value="seller">Sellers</SelectItem>
                       
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(user =>
                        (!searchQuery || user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                        (userFilter === "All" || user.role === userFilter.toLowerCase() || user.status === userFilter)
                      )
                      .map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 font-medium">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </td>
                          <td className="px-4 py-2">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-xs text-muted-foreground">
                              Joined {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                </div>
              </CardHeader>
              <CardContent>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product =>
                        (!searchQuery || product.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map((product) => (
                        <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 font-medium">
                            <a href={`/products/${product._id}`} className="text-blue-600 hover:underline">{product.name}</a>
                          </td>
                          <td className="px-4 py-2">${product.price}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">No orders found.</td>
                      </tr>
                    ) : (
                      orders.map((order: Order) => (
                        <tr key={order._id} className="border-b">
                          <td className="px-4 py-2 font-mono text-xs">{order._id?.slice(-8)}</td>
                          <td className="px-4 py-2">{order.buyer?.name || "-"}</td>
                          <td className="px-4 py-2">
                            {order.items && order.items.map((item: OrderItem, idx: number) => (
                              <div key={idx}>
                                {item.productId?.name || "Product"} x{item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-2 font-semibold">${order.total}</td>
                          <td className="px-4 py-2">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>


          

         
        </Tabs>
      </div>
    </div>
  )
}
