import { useParams } from "react-router-dom";
import axios from "axios";
import {
 Card,
 CardHeader,
 CardTitle,
 CardContent,
 CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
 FiMail,
 FiPhone,
 FiMapPin,
 FiShoppingBag,
 FiStar,
 FiAward,
 FiBriefcase,
 FiUserCheck,
 FiCheckCircle,
 FiGlobe,
 FiClock,
} from "react-icons/fi";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

type Agent = {
 _id: string;
 name: string;
 agencyName: string;
 email: string;
 phone: string;
 location: string;
 expertiseCategories: string[];
 experience: number;
 languages: string[];
 userType: string;
 verified: boolean;
 memberSince: string;
 description?: string;
 minOrder?: string;
 responseTime?: string;
 certifications?: string[];
};

export default function AgentProfilePage() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [agent, setAgent] = useState<Agent | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [isQuoteOpen, setIsQuoteOpen] = useState(false);
 const [isSuccessOpen, setIsSuccessOpen] = useState(false);
 const [formData, setFormData] = useState({
 quantity: "",
 category: "",
 itemName: "",
 additionalSpecifications: "",
 expectedDeliveryDate: "",
 });

 // Get today's date in YYYY-MM-DD format for the date input min attribute
 const today = new Date().toISOString().split("T")[0];

 useEffect(() => {
 const fetchAgent = async () => {
 try {
 const response = await axios.get(
 `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/${id}`
 );
 const data = response.data;
 if (data.userType !== "agent") {
 throw new Error("This profile is not a sourcing agent");
 }
 setAgent(data);
 } catch (err) {
 setError(
 err instanceof Error ? err.message : "An unknown error occurred"
 );
 } finally {
 setLoading(false);
 }
 };

 fetchAgent();
 }, [id]);

 const handleInputChange = (
 e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
 const { name, value } = e.target;
 setFormData((prev) => ({
 ...prev,
 [name]: value,
 }));
 };

 const handleClick = () => {
 // You can add form submission logic here
 alert("✅ Submission Successful!");
 };

 const handleSelectChange = (name: string, value: string) => {
 setFormData((prev) => ({
 ...prev,
 [name]: value,
 // Reset item name if category changes
 ...(name === "category" ? { itemName: "" } : {}),
 }));
 };


 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

 try {
 // Prepare the request data
 const requestData = {
 agentId: agent?._id,
 buyerData: {
 agentId: agent?._id,
 agentName: agent?.name,
 email: agent?.email,
 buyerId: localStorage.getItem("userId"),
 buyerName: localStorage.getItem("name"),
 status: "Pending",
 ...formData,
 },
 requests: {
 ...formData,
 status: "Pending",
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 buyerName: localStorage.getItem("name"),
 buyerId: localStorage.getItem("userId")
 },
 };

 // Send the request to your backend
 const response = await axios.post(
 `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/buyer-request`,
 requestData
 );

 if (response.status === 200) {
 setIsQuoteOpen(false);
 setIsSuccessOpen(true);
 // Reset form
 setFormData({
 quantity: "",
 category: "",
 itemName: "",
 additionalSpecifications: "",
 expectedDeliveryDate: "",
 });
 } else {
 throw new Error("Failed to submit request");
 }
 } catch (err) {
 setError(err instanceof Error ? err.message : "Failed to submit request");
 }
 };
 
 if (loading) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-4 sm:p-6 flex items-center justify-center">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
 <p className="text-zinc-300">Loading agent profile...</p>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-4 sm:p-6 flex items-center justify-center">
 <div className="text-center bg-zinc-800/50 p-8 rounded-lg border border-zinc-700/50 max-w-md">
 <div className="text-6xl mb-6 text-amber-500/50">⚠️</div>
 <h3 className="text-2xl font-medium mb-2 text-zinc-100">
 Profile Error
 </h3>
 <p className="text-zinc-400 mb-6">{error}</p>
 <div className="flex gap-3 justify-center">
 <Button
 variant="outline"
 className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
 onClick={() => window.location.reload()}
 >
 Try Again
 </Button>
 <Button
 variant="outline"
 className="border-zinc-500 text-zinc-300 hover:bg-zinc-700/50"
 onClick={() => navigate("/agents")}
 >
 Browse Agents
 </Button>
 </div>
 </div>
 </div>
 );
 }

 if (!agent) {
 return null;
 }

 // Calculate member since year from the memberSince date string
 const memberSinceYear = new Date(agent.memberSince).getFullYear();

 // Generate initials for avatar
 const initials = (
 agent.name
 .split(" ")
 .map((n) => n[0])
 .join("") || "AG"
 ).toUpperCase();

 // Sample items based on expertise categories
 const sampleItems = [
 "Custom orders available",
 "Bulk pricing discounts",
 "Quality inspection reports",
 "Logistics support",
 "Custom packaging",
 "Private labeling",
 ];

 return (
 <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-4 sm:p-6">
 <motion.div
 className="max-w-6xl mx-auto"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.5 }}
 >
 {/* Back button */}
 <Button
 variant="ghost"
 onClick={() => navigate(-1)}
 className="mb-6 text-zinc-400 hover:text-amber-400"
 >
 <FiArrowLeft className="mr-2" /> Back to Agents
 </Button>

 {/* Profile Header */}
 <motion.div
 className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8"
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 >
 <div className="flex items-center justify-center h-40 w-40 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-4xl font-bold">
 {initials}
 </div>

 <div className="flex-1 text-center md:text-left">
 <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
 <h1 className="text-3xl font-bold">{agent.name}</h1>
 {agent.verified && (
 <Badge
 variant="secondary"
 className="bg-emerald-900/30 text-emerald-400 border-emerald-800/50"
 >
 <FiUserCheck className="mr-1" /> Verified Partner
 </Badge>
 )}
 </div>

 <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
 <div className="flex items-center text-zinc-300">
 <FiMapPin className="mr-2 text-amber-400" />
 {agent.location}
 </div>
 <div className="flex items-center text-zinc-300">
 <FiStar className="mr-2 text-amber-400" />
 {agent.experience}+ years experience
 </div>
 </div>

 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
 {agent.expertiseCategories.map((category) => (
 <Badge
 key={category}
 variant="outline"
 className="bg-zinc-800/50 text-zinc-200 border-zinc-700 hover:bg-amber-900/30 hover:text-amber-200"
 >
 {category}
 </Badge>
 ))}
 </div>
 </div>
 </motion.div>

 {/* Main Content */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Left Column */}
 <div className="lg:col-span-2 space-y-6">
 {/* About Section */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.5, delay: 0.4 }}
 >
 <Card className="bg-zinc-800/50 border-zinc-700/50">
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <FiAward className="text-amber-400" /> Professional Profile
 </CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-zinc-300 mb-4">
 {agent.description ||
 `${agent.name} from ${
 agent.agencyName
 } is a professional sourcing agent with ${
 agent.experience
 }+ years of experience in ${agent.expertiseCategories.join(
 ", "
 )}. Based in ${
 agent.location
 }, they specialize in connecting international buyers with reliable suppliers.`}
 </p>
 <div className="space-y-3">
 <div className="flex items-center text-zinc-300">
 <FiClock className="mr-3 text-amber-400" />
 <span>
 Average response time:{" "}
 <strong>{agent.responseTime || "2-4 hours"}</strong>
 </span>
 </div>
 <div className="flex items-center text-zinc-300">
 <FiShoppingBag className="mr-3 text-amber-400" />
 <span>
 Minimum order quantity:{" "}
 <strong>{agent.minOrder || "Negotiable"}</strong>
 </span>
 </div>
 <div className="flex items-center text-zinc-300">
 <FiGlobe className="mr-3 text-amber-400" />
 <span>
 Languages: <strong>{agent.languages.join(", ")}</strong>
 </span>
 </div>
 </div>
 </CardContent>
 </Card>
 </motion.div>

 {/* Experience Section */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.5, delay: 0.6 }}
 >
 <Card className="bg-zinc-800/50 border-zinc-700/50">
 <CardHeader>
 <CardTitle className="text-xl">
 Professional Experience
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 <div className="border-l-2 border-amber-500/50 pl-4">
 <h3 className="font-medium text-zinc-100">
 {agent.agencyName || agent.name}
 </h3>
 <p className="text-sm text-zinc-400">{agent.location}</p>
 <p className="text-sm text-zinc-400 mt-1">
 {agent.experience}+ years in sourcing and procurement
 </p>
 </div>
 <div className="border-l-2 border-amber-500/50 pl-4">
 <h3 className="font-medium text-zinc-100">
 Specialized Industries
 </h3>
 <div className="flex flex-wrap gap-2 mt-2">
 {agent.expertiseCategories.map((category) => (
 <Badge
 key={category}
 variant="outline"
 className="bg-zinc-800/30 text-zinc-200 border-zinc-700"
 >
 {category}
 </Badge>
 ))}
 </div>
 </div>
 {agent.certifications &&
 agent.certifications.length > 0 && (
 <div className="border-l-2 border-amber-500/50 pl-4">
 <h3 className="font-medium text-zinc-100">
 Certifications
 </h3>
 <div className="flex flex-wrap gap-2 mt-2">
 {agent.certifications.map((cert) => (
 <Badge
 key={cert}
 variant="secondary"
 className="bg-emerald-900/20 text-emerald-300 border-emerald-800/50"
 >
 {cert}
 </Badge>
 ))}
 </div>
 </div>
 )}
 </div>
 </CardContent>
 </Card>
 </motion.div>

 {/* Services Section */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.5, delay: 0.8 }}
 >
 <Card className="bg-zinc-800/50 border-zinc-700/50">
 <CardHeader>
 <CardTitle className="text-xl">Services Offered</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {sampleItems.map((item, index) => (
 <div key={index} className="flex items-start gap-3">
 <div className="p-1.5 rounded-full bg-amber-900/20 mt-0.5">
 <FiCheckCircle className="h-4 w-4 text-amber-400" />
 </div>
 <p className="text-zinc-300">{item}</p>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </motion.div>
 </div>

 {/* Right Column */}
 <div className="space-y-6">
 {/* Contact Card */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.4 }}
 >
 <Card className="bg-zinc-800/50 border-zinc-700/50">
 <CardHeader>
 <CardTitle className="text-xl">Contact Information</CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-full bg-zinc-700/50">
 <FiMail className="text-amber-400" />
 </div>
 <div>
 <p className="text-sm text-zinc-400">Email</p>
 <a
 href={`mailto:${agent.email}`}
 className="text-zinc-100 hover:text-amber-400 transition-colors"
 >
 {agent.email}
 </a>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-full bg-zinc-700/50">
 <FiPhone className="text-amber-400" />
 </div>
 <div>
 <p className="text-sm text-zinc-400">Phone</p>
 <a
 href={`tel:${agent.phone.replace(/[^0-9+]/g, "")}`}
 className="text-zinc-100 hover:text-amber-400 transition-colors"
 >
 {agent.phone}
 </a>
 </div>
 </div>
 </CardContent>
 <CardFooter className="flex flex-col gap-3">
 <Button
 onClick={() => setIsQuoteOpen(true)}
 className="w-full bg-amber-600 hover:bg-amber-700 text-white"
 >
 Request Quote
 </Button>
 </CardFooter>
 </Card>
 </motion.div>

 {/* Verification Badge */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.6 }}
 >
 <Card className="bg-zinc-800/50 border-zinc-700/50">
 <CardHeader>
 <CardTitle className="text-xl">Verification Status</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-full bg-emerald-900/20">
 <FiUserCheck className="text-emerald-400" />
 </div>
 <div>
 <p className="text-zinc-100">Identity Verified</p>
 <p className="text-sm text-zinc-400">
 Government ID and business documents confirmed
 </p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-full bg-blue-900/20">
 <FiBriefcase className="text-blue-400" />
 </div>
 <div>
 <p className="text-zinc-100">Business Verified</p>
 <p className="text-sm text-zinc-400">
 Company registration and tax documents reviewed
 </p>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </motion.div>

 {/* Languages Card */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.8 }}
 >
 <Card className="bg-zinc-800/50 border-zinc-700/50">
 <CardHeader>
 <CardTitle className="text-xl">Languages</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex flex-wrap gap-2">
 {agent.languages.map((language) => (
 <Badge
 key={language}
 variant="outline"
 className="bg-zinc-800/30 text-zinc-200 border-zinc-700 hover:bg-amber-900/30 hover:text-amber-200"
 >
 {language}
 </Badge>
 ))}
 </div>
 </CardContent>
 </Card>
 </motion.div>
 </div>
 </div>
 </motion.div>

 {/* Quote Request Dialog */}
 <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
 <DialogContent className="sm:max-w-[650px] bg-zinc-800 border-zinc-700">
 <DialogHeader>
 <DialogTitle className="text-2xl flex items-center gap-2">
 <FiShoppingBag className="text-amber-400" />
 Request Quote from {agent.name}
 </DialogTitle>
 <DialogDescription className="text-zinc-400">
 Please provide details about your requirements. The agent will
 respond within 24 hours.
 </DialogDescription>
 </DialogHeader>

 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label htmlFor="quantity" className="text-zinc-300">
 Quantity
 </Label>
 <Input
 id="quantity"
 name="quantity"
 value={formData.quantity}
 onChange={handleInputChange}
 placeholder="e.g. 1000 units"
 className="bg-zinc-700 border-zinc-600 text-white"
 required
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="category" className="text-zinc-300">
 Category
 </Label>
 <Select
 value={formData.category}
 onValueChange={(value) =>
 handleSelectChange("category", value)
 }
 >
 <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
 <SelectValue placeholder="Select category" />
 </SelectTrigger>
 <SelectContent className="bg-zinc-700 border-zinc-600 text-white">
 {agent.expertiseCategories.map((category) => (
 <SelectItem key={category} value={category}>
 {category}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label htmlFor="itemName" className="text-zinc-300">
 Item Name
 </Label>
 <Input
 id="itemName"
 name="itemName"
 value={formData.itemName}
 onChange={handleInputChange}
 placeholder="Product name or description"
 className="bg-zinc-700 border-zinc-600 text-white"
 required
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="expectedDeliveryDate" className="text-zinc-300">
 Expected Delivery Date
 </Label>
 <Input
 id="expectedDeliveryDate"
 name="expectedDeliveryDate"
 type="date"
 min={today}
 value={formData.expectedDeliveryDate}
 onChange={handleInputChange}
 className="bg-zinc-700 border-zinc-600 text-white"
 required
 />
 </div>
 </div>

 <div className="space-y-2">
 <Label
 htmlFor="additionalSpecifications"
 className="text-zinc-300"
 >
 Additional Specifications
 </Label>
 <Textarea
 id="additionalSpecifications"
 name="additionalSpecifications"
 value={formData.additionalSpecifications}
 onChange={handleInputChange}
 placeholder="Any special requirements, colors, certifications needed, etc."
 className="bg-zinc-700 border-zinc-600 text-white min-h-[120px]"
 />
 </div>

 <div className="flex justify-end gap-3 pt-4">
 <Button
 type="button"
 variant="outline"
 onClick={() => setIsQuoteOpen(false)}
 className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
 >
 Cancel
 </Button>
 <Button type="submit" onClick={handleClick} className="bg-amber-600 hover:bg-amber-700">
 Submit Request
 </Button>
 </div>
 </form>
 </DialogContent>
 </Dialog>

 {/* Success Dialog */}
 <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
 <DialogContent className="sm:max-w-[450px] bg-zinc-800 border-zinc-700">
 <div className="flex flex-col items-center text-center p-6">
 <div className="p-3 rounded-full bg-emerald-900/20 mb-4">
 <FiCheckCircle className="h-8 w-8 text-emerald-400" />
 </div>
 <DialogTitle className="text-2xl mb-2">
 Request Submitted!
 </DialogTitle>
 <DialogDescription className="text-zinc-400 mb-6">
 Your quote request has been sent to {agent.name}. You'll receive a
 response within 24 hours.
 </DialogDescription>
 <Button
 onClick={() => setIsSuccessOpen(false)}
 className="bg-amber-600 hover:bg-amber-700"
 >
 Close
 </Button>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 );
}