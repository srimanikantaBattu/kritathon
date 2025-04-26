"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { format } from "date-fns"

// Shadcn components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"

// Icons
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarIcon,
  SlidersHorizontal,
  Tag,
  Clock,
  Heart,
  Share2,
  MessageSquare,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react"

// Types
interface Product {
  _id: string
  productName: string
  location: string
  photo1: string
  photo2: string
  photo3: string
  createdAt: string
}

function ProductGallery() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [sortOrder, setSortOrder] = useState("newest")
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined)
  const [favorites, setFavorites] = useState<string[]>([])
  const [requestSent, setRequestSent] = useState<Record<string, boolean>>({})
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState("")
  const [lightboxProductId, setLightboxProductId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)

  async function getImages() {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/product-api/files`)
      setProducts(res.data)
      setFilteredProducts(res.data)

      // Extract unique locations for filter
      const uniqueLocations = Array.from(new Set(res.data.map((product: Product) => product.location)))
      setLocations(uniqueLocations as string[])

      // Initialize active image index for each product
      const initialActiveImages: Record<string, number> = {}
      res.data.forEach((product: Product) => {
        initialActiveImages[product._id] = 0
      })
      setActiveImageIndex(initialActiveImages)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getImages()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter((product) => product.location === selectedLocation)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(query) || product.location.toLowerCase().includes(query),
      )
    }

    // Filter by date if selected
    if (dateRange) {
      const selectedDate = new Date(dateRange)
      filtered = filtered.filter((product) => {
        const productDate = new Date(product.createdAt)
        return productDate.toDateString() === selectedDate.toDateString()
      })
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortOrder === "name-asc") {
        return a.productName.localeCompare(b.productName)
      } else if (sortOrder === "name-desc") {
        return b.productName.localeCompare(a.productName)
      }
      return 0
    })

    setFilteredProducts(filtered)
  }, [selectedLocation, products, searchQuery, sortOrder, dateRange])

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
  }

  const getProductImages = (product: Product) => {
    return [product.photo1, product.photo2, product.photo3].filter(Boolean)
  }

  const handlePrevImage = (productId: string) => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[productId]
      const productImages = getProductImages(products.find((p) => p._id === productId) as Product)
      return {
        ...prev,
        [productId]: currentIndex > 0 ? currentIndex - 1 : productImages.length - 1,
      }
    })
  }

  const handleNextImage = (productId: string) => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[productId]
      const productImages = getProductImages(products.find((p) => p._id === productId) as Product)
      return {
        ...prev,
        [productId]: currentIndex < productImages.length - 1 ? currentIndex + 1 : 0,
      }
    })
  }

  const setActiveImage = (productId: string, index: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: index,
    }))
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const handleMakeRequest = (productId: string) => {
    // In a real app, you would send the request to the backend
    setRequestSent((prev) => ({
      ...prev,
      [productId]: true,
    }))

    // Reset after 3 seconds to show success message temporarily
    setTimeout(() => {
      setRequestSent((prev) => ({
        ...prev,
        [productId]: false,
      }))
    }, 3000)
  }

  const openLightbox = (imageUrl: string, productId: string) => {
    setLightboxImage(imageUrl)
    setLightboxProductId(productId)
    setLightboxOpen(true)
    setZoomLevel(1)
    setRotation(0)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxProductId(null)
    setZoomLevel(1)
    setRotation(0)
  }

  const handleLightboxPrev = () => {
    if (!lightboxProductId) return

    const product = products.find((p) => p._id === lightboxProductId)
    if (!product) return

    const productImages = getProductImages(product)
    const currentIndex = activeImageIndex[lightboxProductId] || 0
    const newIndex = currentIndex > 0 ? currentIndex - 1 : productImages.length - 1

    setActiveImage(lightboxProductId, newIndex)
    setLightboxImage(productImages[newIndex])
    setZoomLevel(1)
    setRotation(0)
  }

  const handleLightboxNext = () => {
    if (!lightboxProductId) return

    const product = products.find((p) => p._id === lightboxProductId)
    if (!product) return

    const productImages = getProductImages(product)
    const currentIndex = activeImageIndex[lightboxProductId] || 0
    const newIndex = currentIndex < productImages.length - 1 ? currentIndex + 1 : 0

    setActiveImage(lightboxProductId, newIndex)
    setLightboxImage(productImages[newIndex])
    setZoomLevel(1)
    setRotation(0)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const downloadImage = () => {
    if (!lightboxImage) return

    const link = document.createElement("a")
    link.href = lightboxImage
    link.download = `product-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFilters = () => {
    setSelectedLocation("all")
    setSearchQuery("")
    setSortOrder("newest")
    setDateRange(undefined)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Skeleton className="h-10 w-full md:w-80" />
            <div className="flex gap-2 ml-auto">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 rounded-lg border border-border overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 flex flex-col gap-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Product Showcase</h1>
          <p className="text-muted-foreground">Discover our exclusive collection of premium products</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name or location..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Location</h4>
                    <Select value={selectedLocation} onValueChange={handleLocationChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Date Added</h4>
                    <Calendar
                      mode="single"
                      selected={dateRange}
                      onSelect={setDateRange}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Sort By</h4>
                    <RadioGroup value={sortOrder} onValueChange={setSortOrder}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="newest" id="newest" />
                        <Label htmlFor="newest">Newest First</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oldest" id="oldest" />
                        <Label htmlFor="oldest">Oldest First</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name-asc" id="name-asc" />
                        <Label htmlFor="name-asc">Name (A-Z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name-desc" id="name-desc" />
                        <Label htmlFor="name-desc">Name (Z-A)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <Tabs defaultValue="grid" value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList className="grid w-auto grid-cols-2">
                <TabsTrigger value="grid" className="px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-grid-2x2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 12h18" />
                    <path d="M12 3v18" />
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-list"
                  >
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedLocation !== "all" || searchQuery || dateRange) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedLocation !== "all" && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                <MapPin className="h-3 w-3" />
                {selectedLocation}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSelectedLocation("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                <Search className="h-3 w-3" />
                {searchQuery}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {dateRange && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                <CalendarIcon className="h-3 w-3" />
                {format(dateRange, "MMM dd, yyyy")}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setDateRange(undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7">
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> of{" "}
            <span className="font-medium text-foreground">{products.length}</span> products
          </p>
        </div>

        {/* Product Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const productImages = getProductImages(product)
              const activeIndex = activeImageIndex[product._id] || 0
              const isFavorite = favorites.includes(product._id)

              return (
                <Card
                  key={product._id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative">
                      <AspectRatio ratio={4 / 3} className="bg-muted">
                        <img
                          src={productImages[activeIndex] || "/placeholder.svg"}
                          alt={product.productName}
                          className="object-cover rounded-t-lg w-full h-full cursor-pointer transition-transform hover:scale-105 duration-300"
                          onClick={() => openLightbox(productImages[activeIndex] || "/placeholder.svg", product._id)}
                        />
                      </AspectRatio>

                      {/* Favorite button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm ${
                          isFavorite ? "text-red-500" : "text-muted-foreground"
                        } hover:bg-background/90 transition-all duration-200`}
                        onClick={() => toggleFavorite(product._id)}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                      </Button>

                      {/* Image navigation buttons */}
                      {productImages.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-90 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePrevImage(product._id)
                            }}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-90 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNextImage(product._id)
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Image indicators */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {productImages.map((_, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="icon"
                              className={`w-2 h-2 rounded-full p-0 ${
                                activeIndex === index ? "bg-primary" : "bg-background/70"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveImage(product._id, index)
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 flex-grow">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl line-clamp-1">{product.productName}</CardTitle>
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm">{product.location}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="flex gap-1 items-center whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(product.createdAt), "MMM dd")}</span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-primary/10">
                          <Tag className="h-3 w-3 mr-1" />
                          {product.location}
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10">
                          ID: {product._id.substring(0, 6)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <Separator />

                  <CardFooter className="p-5 flex flex-col gap-4">
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-1">
                        {productImages.map((image, index) => (
                          <div
                            key={index}
                            className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                              activeIndex === index ? "border-primary" : "border-transparent hover:border-primary/50"
                            }`}
                            onClick={() => setActiveImage(product._id, index)}
                          >
                            <AspectRatio ratio={1} className="w-[70px]">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${product.productName} thumbnail ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </AspectRatio>
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <div className="flex gap-2 w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1">Make Request</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Product: {product.productName}</DialogTitle>
                            <DialogDescription>
                              Fill out this form to request this product. We'll get back to you as soon as possible.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Your Name</Label>
                              <Input id="name" placeholder="Enter your full name" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" placeholder="Enter your email" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="message">Message</Label>
                              <Textarea
                                id="message"
                                placeholder="Tell us more about your request..."
                                defaultValue={`I'm interested in the product "${product.productName}" located in ${product.location}.`}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch id="urgent" />
                              <Label htmlFor="urgent">Mark as urgent request</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" type="button">
                              Cancel
                            </Button>
                            <Button type="button" onClick={() => handleMakeRequest(product._id)}>
                              {requestSent[product._id] ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Request Sent
                                </>
                              ) : (
                                "Submit Request"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const productImages = getProductImages(product)
              const activeIndex = activeImageIndex[product._id] || 0
              const isFavorite = favorites.includes(product._id)

              return (
                <Card key={product._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3 lg:w-1/4">
                      <AspectRatio ratio={16 / 9} className="bg-muted md:h-full">
                        <img
                          src={productImages[activeIndex] || "/placeholder.svg"}
                          alt={product.productName}
                          className="object-cover w-full h-full cursor-pointer transition-transform hover:scale-105 duration-300"
                          onClick={() => openLightbox(productImages[activeIndex] || "/placeholder.svg", product._id)}
                        />
                      </AspectRatio>

                      {/* Favorite button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm ${
                          isFavorite ? "text-red-500" : "text-muted-foreground"
                        }`}
                        onClick={() => toggleFavorite(product._id)}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                      </Button>

                      {/* Image navigation */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {productImages.map((_, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="icon"
                              className={`w-2 h-2 rounded-full p-0 ${activeIndex === index ? "bg-primary" : "bg-background/70"}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveImage(product._id, index)
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex flex-col h-full justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <CardTitle className="text-xl">{product.productName}</CardTitle>
                              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">{product.location}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {format(new Date(product.createdAt), "MMM dd, yyyy")}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge variant="outline" className="bg-primary/10">
                              <Tag className="h-3 w-3 mr-1" />
                              {product.location}
                            </Badge>
                            <Badge variant="outline" className="bg-primary/10">
                              ID: {product._id.substring(0, 6)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-auto">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>Make Request</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Request Product: {product.productName}</DialogTitle>
                                <DialogDescription>
                                  Fill out this form to request this product. We'll get back to you as soon as possible.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor={`name-${product._id}`}>Your Name</Label>
                                  <Input id={`name-${product._id}`} placeholder="Enter your full name" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`email-${product._id}`}>Email</Label>
                                  <Input id={`email-${product._id}`} type="email" placeholder="Enter your email" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`message-${product._id}`}>Message</Label>
                                  <Textarea
                                    id={`message-${product._id}`}
                                    placeholder="Tell us more about your request..."
                                    defaultValue={`I'm interested in the product "${product.productName}" located in ${product.location}.`}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch id={`urgent-${product._id}`} />
                                  <Label htmlFor={`urgent-${product._id}`}>Mark as urgent request</Label>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" type="button">
                                  Cancel
                                </Button>
                                <Button type="button" onClick={() => handleMakeRequest(product._id)}>
                                  {requestSent[product._id] ? (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      Request Sent
                                    </>
                                  ) : (
                                    "Submit Request"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/20 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-12 w-12 text-muted-foreground/50" />
              <h2 className="text-2xl font-semibold">No products found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try adjusting your search criteria or
                browse all products.
              </p>
              <Button onClick={resetFilters} className="mt-4">
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Lightbox for full-size image viewing */}
        <Dialog open={lightboxOpen} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
            <div className="relative">
              <div className="flex items-center justify-center min-h-[200px] max-h-[80vh] overflow-hidden">
                <img
                  src={lightboxImage || "/placeholder.svg"}
                  alt="Full size view"
                  className="w-auto h-auto max-w-full max-h-[80vh] object-contain transition-all duration-300"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  }}
                />
              </div>

              {/* Lightbox controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-background/50 hover:bg-background/80"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-background/50 hover:bg-background/80"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-background/50 hover:bg-background/80"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-background/50 hover:bg-background/80"
                  onClick={downloadImage}
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-background/50 hover:bg-background/80"
                  onClick={closeLightbox}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation buttons */}
              {lightboxProductId && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                    onClick={handleLightboxPrev}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                    onClick={handleLightboxNext}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProductGallery