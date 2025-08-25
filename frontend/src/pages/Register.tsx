
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link, useNavigate } from "react-router-dom"
import { api } from "@/api/api"

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      if (res.data && res.data.token) {
        localStorage.setItem("auth", JSON.stringify(res.data))
        navigate("/dashboard")
      }
    } catch (err) {
      console.log(err)
      alert("Registration failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background to-teal-50/20 dark:to-teal-950/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md glass-card border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          
          <div>
            <CardTitle className="font-bold text-3xl  bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent">
              <span className="bg-primary to-secondary text-transparent bg-clip-text group-hover:from-primary/80 group-hover:to-secondary/80 transition-all duration-300 font-bold">
                    CODE
                  </span>
                  <span className="text-foreground group-hover:text-foreground/80 transition-colors duration-300 font-bold">
                    {" "}
                    PERFECT
                  </span>
            </CardTitle>
            <CardDescription className="text-base mt-2">Create your account to explore problems</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 border-teal-200 focus:border-teal-400 focus:ring-teal-400 dark:border-teal-800 dark:focus:border-teal-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 border-teal-200 focus:border-teal-400 focus:ring-teal-400 dark:border-teal-800 dark:focus:border-teal-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-11 border-teal-200 focus:border-teal-400 focus:ring-teal-400 dark:border-teal-800 dark:focus:border-teal-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-11 border-teal-200 focus:border-teal-400 focus:ring-teal-400 dark:border-teal-800 dark:focus:border-teal-600"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 hover:text-teal-500 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}