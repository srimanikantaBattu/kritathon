"use client"

import * as React from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Upload, X, Loader2 } from "lucide-react"
import { Toaster, toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define proper TypeScript interfaces
interface PhotoState {
  photo1: string | null;
  photo2: string | null;
  photo3: string | null;
}

interface FormValues {
  productName: string;
  location: string;
  category: string;
  photo1?: File;
  photo2?: File;
  photo3?: File;
}

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  photo1: z.instanceof(File).optional(),
  photo2: z.instanceof(File).optional(),
  photo3: z.instanceof(File).optional(),
})

export default function ProductForm() {

  const email = localStorage.getItem('email')

  const [photos, setPhotos] = React.useState<PhotoState>({
    photo1: null,
    photo2: null,
    photo3: null,
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const form = useForm<FormValues>({
    defaultValues: {
      productName: "",
      location: "",
      category: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("location", values.location);
      formData.append("category", values.category);
      formData.append("email", email as string);
      
      // Append available photos to the formData
      if (form.getValues("photo1")) {
        formData.append("photos", form.getValues("photo1") as File);
      }
      if (form.getValues("photo2")) {
        formData.append("photos", form.getValues("photo2") as File);
      }
      if (form.getValues("photo3")) {
        formData.append("photos", form.getValues("photo3") as File);
      }
      
      const result = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/product-api/upload`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      toast.success("Product submitted successfully!");
      form.reset();
      setPhotos({ photo1: null, photo2: null, photo3: null });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, photoKey: keyof PhotoState) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue(photoKey as any, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => ({
          ...prev,
          [photoKey]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = (photoKey: keyof PhotoState) => {
    form.setValue(photoKey as any, undefined)
    setPhotos((prev) => ({
      ...prev,
      [photoKey]: null,
    }))

    // Reset the file input
    const fileInput = document.getElementById(photoKey) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Product Details</CardTitle>
        <CardDescription>Enter your product information and upload photos</CardDescription>
      </CardHeader>
      <CardContent>
        <Toaster position="top-right" richColors />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormDescription>The name of your product as it will appear to buyers.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="home">Home & Kitchen</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the category that best describes your product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Enter location" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Where the product is manufactured or available.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Product Photos</h3>
                <p className="text-sm text-muted-foreground">Upload up to 3 high-quality photos of your product.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo Upload 1 */}
                <FormField
                  control={form.control}
                  name="photo1"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Main Photo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            id="photo1"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handlePhotoChange(e, "photo1")}
                            {...fieldProps}
                          />
                          <label
                            htmlFor="photo1"
                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer ${
                              photos.photo1
                                ? "border-primary/50 bg-primary/5"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            } transition-colors duration-200`}
                          >
                            {photos.photo1 ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={photos.photo1 || "/placeholder.svg"}
                                  alt="Product preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleRemovePhoto("photo1")
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Add Photo</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload 2 */}
                <FormField
                  control={form.control}
                  name="photo2"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Additional Photo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            id="photo2"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handlePhotoChange(e, "photo2")}
                            {...fieldProps}
                          />
                          <label
                            htmlFor="photo2"
                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer ${
                              photos.photo2
                                ? "border-primary/50 bg-primary/5"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            } transition-colors duration-200`}
                          >
                            {photos.photo2 ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={photos.photo2 || "/placeholder.svg"}
                                  alt="Product preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleRemovePhoto("photo2")
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Add Photo</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload 3 */}
                <FormField
                  control={form.control}
                  name="photo3"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Additional Photo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            id="photo3"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handlePhotoChange(e, "photo3")}
                            {...fieldProps}
                          />
                          <label
                            htmlFor="photo3"
                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer ${
                              photos.photo3
                                ? "border-primary/50 bg-primary/5"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            } transition-colors duration-200`}
                          >
                            {photos.photo3 ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={photos.photo3 || "/placeholder.svg"}
                                  alt="Product preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleRemovePhoto("photo3")
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Add Photo</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="flex justify-end px-0 pb-0">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Product"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}