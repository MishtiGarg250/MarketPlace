import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ASSIGNMENT_SEED, generateColorFromSeed } from "@/utils/seedUtils"

export default function AboutPage() {
  const seedColor = generateColorFromSeed(ASSIGNMENT_SEED)

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-space-grotesk text-4xl font-bold text-foreground mb-4">About Our Marketplace</h1>
          <p className="text-xl text-muted-foreground">
            Connecting buyers and sellers in a vibrant digital marketplace
          </p>
        </div>

        
        <Card className="mb-8 border-2" style={{ borderColor: seedColor }}>
          <CardHeader className="text-center">
            <CardTitle className="font-space-grotesk text-2xl">Assignment Seed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Badge className="text-lg px-6 py-2 text-white font-mono" style={{ backgroundColor: seedColor }}>
              {ASSIGNMENT_SEED}
            </Badge>
            <p className="text-muted-foreground mt-4">
              This unique seed generates our dynamic color theme and platform features
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe in creating a seamless, secure, and enjoyable marketplace experience where anyone can buy and
                sell with confidence. Our platform combines modern design with powerful functionality to serve both
                buyers and sellers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Secure payment processing</li>
                <li>• Advanced search and filtering</li>
                <li>• Seller dashboard and analytics</li>
                <li>• Mobile-responsive design</li>
                <li>• Real-time notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">For Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover unique products from trusted sellers, enjoy secure checkout, and track your orders with ease.
                Our platform ensures every purchase is protected and every seller is verified.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">For Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start your business with powerful tools for inventory management, order processing, and customer
                communication. Our seller dashboard provides insights to help grow your business.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 text-center">
          <CardContent className="py-8">
            <h3 className="font-space-grotesk text-xl font-semibold mb-4">Dynamic Theme Color</h3>
            <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: seedColor }}></div>
            <p className="text-muted-foreground">
              Generated from our assignment seed: <code className="bg-muted px-2 py-1 rounded">{ASSIGNMENT_SEED}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
