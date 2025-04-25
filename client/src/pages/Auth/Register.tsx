import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {  Check, ChevronsUpDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label" // Import the regular Label component

// Product categories for buyers
const productCategories = [
  "Textiles",
  "Electronics",
  "Furniture",
  "Food & Beverages",
  "Cosmetics",
  "Toys",
  "Automotive",
  "Pharmaceuticals",
  "Jewelry",
  "Stationery",
]

// Expertise categories for agents
const expertiseCategories = [
  "Textiles",
  "Electronics",
  "Furniture",
  "Food & Beverages",
  "Cosmetics",
  "Toys",
  "Automotive",
  "Pharmaceuticals",
  "Jewelry",
  "Stationery",
]

// Certifications
const certifications = ["ISO 9001", "ISO 14001", "SEDEX", "GOTS", "Fair Trade", "Organic", "GMP", "HACCP", "CE", "RoHS"]

// Languages
const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
]

// Sourcing volumes
const sourcingVolumes = [
  "Less than $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $500,000",
  "More than $500,000",
]

// Experience ranges
const experienceRanges = ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"]

// Combined form schema with conditional validation
const formSchema = z.discriminatedUnion("userType", [
  z.object({
    userType: z.literal("buyer"),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number with country code." }),
    country: z.string().min(2, { message: "Country must be at least 2 characters." }),
    website: z.string().optional(),
    productCategories: z.array(z.string()).min(1, { message: "Please select at least one product category." }),
    sourcingVolume: z.string().min(1, { message: "Please select a sourcing volume." }),
    certificationPreferences: z.array(z.string()).optional(),
  }),
  z.object({
    userType: z.literal("agent"),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    agencyName: z.string().min(2, { message: "Agency name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }),
    location: z.string().min(2, { message: "State & City must be at least 2 characters." }),
    expertiseCategories: z.array(z.string()).min(1, { message: "Please select at least one expertise category." }),
    experience: z.string().min(1, { message: "Please select your experience level." }),
    languages: z.array(z.string()).min(1, { message: "Please select at least one language." }),
    certificationsFamiliarity: z.array(z.string()).optional(),
    portfolio: z.string().optional(),
  }),
])

type FormValues = z.infer<typeof formSchema>

export default function Register() {
  const [userType, setUserType] = useState<"buyer" | "agent">("buyer")
  const navigate = useNavigate()
  // Initialize a single form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "buyer",
      name: "",
      email: "",
      phone: "",
      // Buyer specific defaults
      companyName: "",
      country: "",
      website: "",
      productCategories: [],
      sourcingVolume: "",
      certificationPreferences: [],
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
   let result = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/register`, data)
   console.log(result.data)
   navigate('/login')
  }

  // Handle user type change
  const handleUserTypeChange = (value: "buyer" | "agent") => {
    setUserType(value)

    // Reset the form with new defaults based on user type
    if (value === "buyer") {
      form.reset({
        userType: "buyer",
        name: form.getValues("name"),
        email: form.getValues("email"),
        phone: form.getValues("phone"),
        companyName: "",
        country: "",
        website: "",
        productCategories: [],
        sourcingVolume: "",
        certificationPreferences: [],
      })
    } else {
      form.reset({
        userType: "agent",
        name: form.getValues("name"),
        email: form.getValues("email"),
        phone: form.getValues("phone"),
        agencyName: "",
        location: "",
        expertiseCategories: [],
        experience: "",
        languages: [],
        certificationsFamiliarity: [],
        portfolio: "",
      })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-10">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Properly wrap the RadioGroup in a FormField */}
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleUserTypeChange(value as "buyer" | "agent");
                      }}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer" className="font-normal cursor-pointer">
                          Buyer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="agent" id="agent" />
                        <Label htmlFor="agent" className="font-normal cursor-pointer">
                          Agent
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Common fields for both user types */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userType === "buyer" ? (
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency / Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your agency name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {userType === "buyer" ? "Phone (with country code)" : "Phone Number (India-based)"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={userType === "buyer" ? "+1 123 456 7890" : "+91 123 456 7890"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buyer specific fields */}
            {userType === "buyer" && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Website (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="productCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Categories Interested In</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground",
                                )}
                              >
                                {field.value?.length > 0
                                  ? `${field.value.length} categories selected`
                                  : "Select categories"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {productCategories.map((category) => (
                                    <CommandItem
                                      key={category}
                                      value={category}
                                      onSelect={() => {
                                        const current = field.value || []
                                        const updated = current.includes(category)
                                          ? current.filter((c) => c !== category)
                                          : [...current, category]
                                        form.setValue("productCategories", updated, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(category) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {category}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourcingVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sourcing Volume (approximate monthly/quarterly)</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value || "Select sourcing volume"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search volumes..." />
                              <CommandList>
                                <CommandEmpty>No volume found.</CommandEmpty>
                                <CommandGroup>
                                  {sourcingVolumes.map((volume) => (
                                    <CommandItem
                                      key={volume}
                                      value={volume}
                                      onSelect={() => {
                                        form.setValue("sourcingVolume", volume, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === volume ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {volume}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificationPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Preferences</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground",
                                )}
                              >
                                {field.value?.length && field.value.length > 0
                                  ? `${field.value.length} certifications selected`
                                  : "Select certifications"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search certifications..." />
                              <CommandList>
                                <CommandEmpty>No certification found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {certifications.map((cert) => (
                                    <CommandItem
                                      key={cert}
                                      value={cert}
                                      onSelect={() => {
                                        const current = field.value || []
                                        const updated = current.includes(cert)
                                          ? current.filter((c) => c !== cert)
                                          : [...current, cert]
                                        form.setValue("certificationPreferences", updated, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(cert) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {cert}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Agent specific fields */}
            {userType === "agent" && (
              <>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State & City</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra, Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expertiseCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories of Expertise</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground",
                                )}
                              >
                                {field.value?.length > 0
                                  ? `${field.value.length} categories selected`
                                  : "Select categories"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {expertiseCategories.map((category) => (
                                    <CommandItem
                                      key={category}
                                      value={category}
                                      onSelect={() => {
                                        const current = field.value || []
                                        const updated = current.includes(category)
                                          ? current.filter((c) => c !== category)
                                          : [...current, category]
                                        form.setValue("expertiseCategories", updated, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(category) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {category}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years)</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value || "Select experience"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search experience..." />
                              <CommandList>
                                <CommandEmpty>No experience range found.</CommandEmpty>
                                <CommandGroup>
                                  {experienceRanges.map((range) => (
                                    <CommandItem
                                      key={range}
                                      value={range}
                                      onSelect={() => {
                                        form.setValue("experience", range, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === range ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {range}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground",
                                )}
                              >
                                {field.value?.length > 0
                                  ? `${field.value.length} languages selected`
                                  : "Select languages"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search languages..." />
                              <CommandList>
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {languages.map((language) => (
                                    <CommandItem
                                      key={language}
                                      value={language}
                                      onSelect={() => {
                                        const current = field.value || []
                                        const updated = current.includes(language)
                                          ? current.filter((l) => l !== language)
                                          : [...current, language]
                                        form.setValue("languages", updated, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(language) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {language}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificationsFamiliarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications Familiarity</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground",
                                )}
                              >
                                {field.value?.length && field.value.length > 0
                                  ? `${field.value.length} certifications selected`
                                  : "Select certifications"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search certifications..." />
                              <CommandList>
                                <CommandEmpty>No certification found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {certifications.map((cert) => (
                                    <CommandItem
                                      key={cert}
                                      value={cert}
                                      onSelect={() => {
                                        const current = field.value || []
                                        const updated = current.includes(cert)
                                          ? current.filter((c) => c !== cert)
                                          : [...current, cert]
                                        form.setValue("certificationsFamiliarity", updated, {
                                          shouldValidate: true,
                                        })
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(cert) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {cert}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Projects / Portfolio Upload</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              field.onChange(e.target.files[0].name)
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>Upload your portfolio or past project details</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-muted-foreground">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  )
}