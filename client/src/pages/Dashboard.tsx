import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TypographyH1, TypographyP } from "@/components/ui/typography";

export function Dashboard() {
  const [user, setUser] = useState("");
  
  useEffect(() => {
    // Get user from localStorage on client side
    setUser(localStorage.getItem('name') || 'User');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TypographyH1 className="mb-2">
          Hello, {user} 👋
        </TypographyH1>
        <TypographyP className="text-muted-foreground mb-8">
          Welcome back to your sourcing dashboard
        </TypographyP>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">Our Mission</h2>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                "A platform connecting international buyers with verified Indian sourcing agents
                to facilitate procurement, manufacturing coordination, and supplier discovery
                across India."
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">How We Help</h2>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                "The platform streamlines communication, ensures quality control,
                and allows agents to handle local logistics while keeping buyers informed."
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;