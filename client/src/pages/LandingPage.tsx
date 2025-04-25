"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {
  Globe,
  Search,
  Users,
  CheckCircle,
  MessageSquare,
  FileText,
  Star,
  ArrowRight,
  Menu,
  X,
  ShoppingBag,
  Factory,
  TrendingUp,
  Shield,
} from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Bharat Vyaapar
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-amber-500 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-amber-500 transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="text-gray-300 hover:text-amber-500 transition-colors">
              Benefits
            </a>
            <a href="#contact" className="text-gray-300 hover:text-amber-500 transition-colors">
              Contact
            </a>
            <Button onClick={() => navigate("/login")} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-none shadow-[0_0_15px_rgba(251,146,60,0.5)]">
              Get Started
            </Button>
          </nav>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-amber-500 transition-colors py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-amber-500 transition-colors py-2">
                How It Works
              </a>
              <a href="#benefits" className="text-gray-300 hover:text-amber-500 transition-colors py-2">
                Benefits
              </a>
              <a href="#contact" className="text-gray-300 hover:text-amber-500 transition-colors py-2">
                Contact
              </a>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-none shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-neutral-500/20 rounded-full blur-[80px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                Connecting Global Buyers
              </span>
              <br />
              with Verified Indian Sourcing Agents
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Streamline your procurement process with our digital marketplace that bridges international buyers with
              expert sourcing agents across India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate("/register")} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(251,146,60,0.5)]">
                Post Your Sourcing Needs
              </Button>
              <Button
              onClick={() => navigate("/register")}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-950/30 text-lg py-6 px-8 rounded-xl"
              >
                Become a Sourcing Agent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent mb-2">
                1000+
              </p>
              <p className="text-gray-400">Verified Agents</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent mb-2">
                50+
              </p>
              <p className="text-gray-400">Product Categories</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent mb-2">
                28
              </p>
              <p className="text-gray-400">Indian States Covered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent mb-2">
                95%
              </p>
              <p className="text-gray-400">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform offers everything you need to streamline your sourcing process in India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 hover:border-orange-500/50 transition-all group hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <Users className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Verified Agent Profiles</h3>
              <p className="text-gray-400">
                Detailed profiles including experience, industries served, languages, and sample work to help you find
                the perfect match.
              </p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 hover:border-orange-500/50 transition-all group hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <FileText className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Request & Proposal System</h3>
              <p className="text-gray-400">
                Streamlined system for posting sourcing needs and receiving detailed proposals from qualified agents.
              </p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 hover:border-orange-500/50 transition-all group hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <MessageSquare className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Integrated Communication</h3>
              <p className="text-gray-400">
                Internal chat, file sharing, and milestone tracking for complete transparency throughout the process.
              </p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 hover:border-orange-500/50 transition-all group hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <Search className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Advanced Search Filters</h3>
              <p className="text-gray-400">
                Find agents by region, product category, certifications, or factory size to match your specific
                requirements.
              </p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 hover:border-orange-500/50 transition-all group hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <Star className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Rating & Review System</h3>
              <p className="text-gray-400">
                Transparent agent rating and review system based on past performance to ensure quality service.
              </p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 hover:border-orange-500/50 transition-all group hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <CheckCircle className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Document Management</h3>
              <p className="text-gray-400">
                Integrated system for product specs, quality checklists, compliance documents, and contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neutral-600/15 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A simple, streamlined process to connect you with the right sourcing agents in India.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/80 to-orange-500/20 transform md:translate-x-[-0.5px]"></div>

              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start mb-12 md:mb-24">
                <div className="flex md:flex-1 md:justify-end mb-8 md:mb-0 md:pr-12">
                  <div className="bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 max-w-md">
                    <h3 className="text-xl font-semibold mb-3 text-white">Create a Sourcing Request</h3>
                    <p className="text-gray-400">
                      Sign up and post your sourcing needs, including product specifications, quantity, quality
                      standards, and delivery expectations.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold z-10 absolute md:left-1/2 transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                  1
                </div>
                <div className="md:flex-1 md:pl-12 hidden md:block"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start mb-12 md:mb-24">
                <div className="md:flex-1 md:justify-end mb-8 md:mb-0 md:pr-12 hidden md:block"></div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold z-10 absolute md:left-1/2 transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                  2
                </div>
                <div className="flex md:flex-1 md:pl-12">
                  <div className="bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 max-w-md">
                    <h3 className="text-xl font-semibold mb-3 text-white">Get Matched with Agents</h3>
                    <p className="text-gray-400">
                      Our platform matches your request with suitable agents based on category, geography, or
                      specialization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start mb-12 md:mb-24">
                <div className="flex md:flex-1 md:justify-end mb-8 md:mb-0 md:pr-12">
                  <div className="bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 max-w-md">
                    <h3 className="text-xl font-semibold mb-3 text-white">Select Your Agent</h3>
                    <p className="text-gray-400">
                      Review agent profiles, past projects, and ratings to select the best match for your sourcing
                      needs.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold z-10 absolute md:left-1/2 transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                  3
                </div>
                <div className="md:flex-1 md:pl-12 hidden md:block"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start mb-12 md:mb-24">
                <div className="md:flex-1 md:justify-end mb-8 md:mb-0 md:pr-12 hidden md:block"></div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold z-10 absolute md:left-1/2 transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                  4
                </div>
                <div className="flex md:flex-1 md:pl-12">
                  <div className="bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 max-w-md">
                    <h3 className="text-xl font-semibold mb-3 text-white">Track Progress</h3>
                    <p className="text-gray-400">
                      Your agent manages the procurement process locally, updating you through the platform dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex flex-col md:flex-row items-center md:items-start">
                <div className="flex md:flex-1 md:justify-end mb-8 md:mb-0 md:pr-12">
                  <div className="bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl border border-stone-700 max-w-md">
                    <h3 className="text-xl font-semibold mb-3 text-white">Receive Your Products</h3>
                    <p className="text-gray-400">
                      Final output (manufactured goods or samples) is prepared for international shipping to your
                      destination.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold z-10 absolute md:left-1/2 transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                  5
                </div>
                <div className="md:flex-1 md:pl-12 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                Platform Benefits
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover how Bharat Vyaapar transforms your sourcing experience in India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 flex gap-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Globe className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Reduced Cultural Friction</h3>
                <p className="text-gray-400">
                  Minimize miscommunication and cultural friction between international buyers and Indian suppliers
                  through expert intermediaries.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 flex gap-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Factory className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Localized Expertise</h3>
                <p className="text-gray-400">
                  Access localized expertise without building in-house India teams, saving time and resources.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 flex gap-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Cross-Sector Support</h3>
                <p className="text-gray-400">
                  Flexible sourcing support across sectors such as textiles, electronics, home goods, and industrial
                  components.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 flex gap-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Supply Chain Visibility</h3>
                <p className="text-gray-400">
                  Greater accountability and visibility into the supply chain process with real-time updates and
                  tracking.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 flex gap-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Quality Assurance</h3>
                <p className="text-gray-400">
                  Agents perform quality checks and ensure compliance with your standards throughout the manufacturing
                  process.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700 flex gap-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Diverse Manufacturing Access</h3>
                <p className="text-gray-400">
                  Tap into India's vast and varied manufacturing ecosystem more effectively with expert guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/15 to-neutral-700/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-neutral-800/80 to-stone-900/80 backdrop-blur-sm p-10 md:p-16 rounded-3xl border border-neutral-700 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                Ready to Transform Your Sourcing Process?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join Bharat Vyaapar today and connect with verified sourcing agents who can help you navigate India's
              manufacturing landscape.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate("/register")} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(251,146,60,0.5)]">
                Get Started Now <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-950/30 text-lg py-6 px-8 rounded-xl"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                Stay Updated
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our newsletter for the latest updates on Indian manufacturing and sourcing opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-neutral-800 border-stone-700 focus:border-orange-500 text-white h-12"
              />
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Bharat Vyaapar
              </div>
              <p className="text-gray-400 mb-4">
                Connecting international buyers with verified Indian sourcing agents for seamless procurement.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-aedin"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick as</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-orange-500 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Benefits
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">For Buyers</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Post a Request
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Find an Agent
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Buyer Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">For Agents</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Join as an Agent
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Agent Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Agent Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} Bharat Vyaapar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}