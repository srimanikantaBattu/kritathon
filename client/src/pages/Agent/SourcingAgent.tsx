import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiSearch,
  FiStar,
  FiAward,
  FiGlobe
} from "react-icons/fi";

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
};

export default function SourcingAgentsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/allusers`);
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        // Filter for agents only and ensure expertiseCategories exists
        const agentsData = data
          .filter((user: Agent) => user.userType === "agent")
          .map((agent: Agent) => ({
            ...agent,
            expertiseCategories: agent.expertiseCategories || [],
            languages: agent.languages || []
          }));
        setAgents(agentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(
    (agent) =>
      (selectedCategory === "all" ||
        (agent.expertiseCategories && agent.expertiseCategories.includes(selectedCategory))) &&
      (agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agencyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.location?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get all unique expertise categories for filter dropdown
  const allCategories = Array.from(
    new Set(agents.flatMap(agent => agent.expertiseCategories || []))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading sourcing agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center bg-zinc-800/50 p-8 rounded-lg border border-zinc-700/50 max-w-md">
          <div className="text-6xl mb-6 text-amber-500/50">⚠</div>
          <h3 className="text-2xl font-medium mb-2 text-zinc-100">Error loading agents</h3>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Button
            variant="outline"
            className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-4 sm:p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12 py-8 px-4 rounded-xl bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20 border border-amber-800/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge variant="outline" className="mb-4 bg-amber-900/20 text-amber-400 border-amber-800/50">
            <FiAward className="mr-2" /> Professional Network
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
            Verified Sourcing Agents
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Connect with professional sourcing agents from around the world
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search agents by name, agency or location..."
              className="pl-10 bg-zinc-800 border-zinc-700 focus:border-amber-500 focus:ring-amber-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setSelectedCategory} defaultValue="all">
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white hover:border-amber-500 focus:ring-amber-500/50">
                <SelectValue placeholder="Filter by expertise" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="all" className="hover:bg-zinc-700 focus:bg-zinc-700">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="hover:bg-zinc-700"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Agents Grid */}
        {!filteredAgents || filteredAgents.length === 0 ? (
          <motion.div
            className="text-center py-16 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6 text-amber-500/50">🔍</div>
            <h3 className="text-2xl font-medium mb-2 text-zinc-100">No agents found</h3>
            <p className="text-zinc-400 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent._id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-amber-500/30 hover:shadow-2xl transition-all h-full flex flex-col group backdrop-blur-sm">
                  <CardHeader className="pb-3 relative">
                    {agent.verified && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-emerald-900/50 text-emerald-400 border-emerald-800/50">
                          Verified
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold group-hover:text-amber-400 transition-colors">
                          {agent.name}
                        </CardTitle>
                        <CardDescription className="text-zinc-400 mt-1">
                          {agent.agencyName}
                        </CardDescription>
                        <CardDescription className="flex items-center text-zinc-400 mt-1">
                          <FiMapPin className="mr-1" size={14} />
                          {agent.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-zinc-400 mb-2">
                        <FiShoppingBag className="mr-2" />
                        <span className="font-medium">Expertise:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(agent.expertiseCategories || []).map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="bg-zinc-700/50 text-zinc-200 hover:bg-amber-900/30 hover:text-amber-200 transition-colors"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-zinc-400 mb-2">
                        <FiGlobe className="mr-2" />
                        <span className="font-medium">Languages:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(agent.languages || []).map((language) => (
                          <Badge
                            key={language}
                            variant="outline"
                            className="text-zinc-300 border-zinc-600 hover:bg-zinc-700/50"
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center text-zinc-400 hover:text-amber-400 transition-colors">
                        <FiMail className="mr-2" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                      <div className="flex items-center text-zinc-400 hover:text-amber-400 transition-colors">
                        <FiPhone className="mr-2" />
                        <span>{agent.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-4 border-t border-zinc-700/50">
                    <div className="flex items-center">
                      <FiStar className="text-amber-400 mr-1" />
                      <span className="text-sm font-medium text-amber-400 mr-2">
                        {agent.experience}+ years
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:border-amber-400 group-hover:bg-amber-500/10 transition-colors"
                      onClick={() => navigate(`/agent/${agent._id}`)}
                    >
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Section - Only show if we have agents */}
        {agents && agents.length > 0 && (
          <motion.div
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50">
              <div className="text-3xl font-bold text-amber-400 mb-2">{agents.length}+</div>
              <div className="text-zinc-400">Verified Agents</div>
            </div>
            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50">
              <div className="text-3xl font-bold text-amber-400 mb-2">{allCategories.length}+</div>
              <div className="text-zinc-400">Expertise Areas</div>
            </div>
            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {Array.from(new Set(agents.flatMap(agent => agent.languages || []))).length}+
              </div>
              <div className="text-zinc-400">Languages Supported</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}