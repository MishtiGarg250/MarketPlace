import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockSeller = {
  id: 1,
  name: "TechStore",
  email: "contact@techstore.com",
  avatar: "/tech-store-logo.png",
  joinedDate: "2022-03-15",
  location: "San Francisco, CA",
  rating: 4.8,
  totalSales: 1250,
  totalRevenue: 45678.9,
  activeListings: 24,
  description: "Premium electronics and gadgets for tech enthusiasts",
}

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Wireless Headphones",
    amount: 99.99,
    status: "Shipped",
    date: "2024-01-20",
    quantity: 1,
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    product: "Gaming Mechanical Keyboard",
    amount: 129.99,
    status: "Processing",
    date: "2024-01-19",
    quantity: 1,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Professional Camera Lens",
    amount: 299.99,
    status: "Delivered",
    date: "2024-01-18",
    quantity: 1,
  },
]

const mockProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    image: "/wireless-headphones.png",
    price: 99.99,
    stock: 15,
    sold: 45,
    status: "Active",
    category: "Electronics",
    views: 1250,
    rating: 4.5,
    reviews: 28,
  },
  {
    id: 2,
    title: "Gaming Mechanical Keyboard",
    image: "/gaming-mechanical-keyboard.png",
    price: 129.99,
    stock: 8,
    sold: 23,
    status: "Active",
    category: "Electronics",
    views: 890,
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 3,
    title: "Professional Camera Lens",
    image: "/professional-camera-lens.png",
    price: 299.99,
    stock: 0,
    sold: 12,
    status: "Out of Stock",
    category: "Electronics",
    views: 567,
    rating: 4.4,
    reviews: 8,
  },
]

const mockAnalytics = {
  totalViews: 2707,
  totalSales: 80,
  conversionRate: 2.96,
  averageOrderValue: 176.65,
  monthlyRevenue: [
    { month: "Jan", revenue: 4500 },
    { month: "Feb", revenue: 5200 },
    { month: "Mar", revenue: 4800 },
    { month: "Apr", revenue: 6100 },
    { month: "May", revenue: 5900 },
    { month: "Jun", revenue: 7200 },
  ],
}


export default function SellerDashboard(){
    const 
}