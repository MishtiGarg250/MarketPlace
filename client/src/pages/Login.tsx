

import type React from "react"
import { useState } from "react"
import api from "../api/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, ShoppingCart } from "lucide-react"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "buyer"
  })
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      const token = res.data.token;
    
      const user = res.data.user || {};
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token,
          user: {
            name: user.name || "",
            email: formData.email,
            role: user.role || ""
          }
        })
      );
      navigate("/");
    } catch (err:any) {
      console.log(err)
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-yellow-50 flex items-center justify-center p-4">
      
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-amber-50/20 opacity-50"></div>
      
      <div className="relative w-full max-w-md">
        

        {/* Login Card */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 px-8 py-8 text-center border-b border-yellow-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Lock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 pl-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-50 hover:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 pl-10 pr-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-50 hover:bg-white transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                  Login as
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="h-12 w-full border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-50 hover:bg-white transition-colors rounded-md px-3"
                  required
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <Separator className="my-6 bg-gray-200" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors underline-offset-2 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}