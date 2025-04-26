import { useState, useEffect } from "react"
import axios from "axios";
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Request {
  agentId: string
  agentName: string
  email: string
  status: "Pending" | "Accepted" | "Rejected"
}

export default function BuyerRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const buyerId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      if (!buyerId) return;
      // console.log(userId)
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/test/requests/${buyerId}`
        );
        console.log(response.data)
        setRequests(response.data.requests);
      } catch (error) {
        toast.error("Failed to fetch accepted requests");
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequests();
  }, [buyerId]);
  const handleAction = async (agentId: string, action: "accept" | "reject") => {
    try {
      const userEmail = localStorage.getItem("email")
      if (!userEmail) {
        throw new Error("Session expired. Please login again")
      }

      toast.promise(
        fetch("/api/requests/action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerEmail: userEmail,
            agentId,
            action,
          }),
        }).then(async (response) => {
          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.message || "Action failed")
          }
          setRequests(prev =>
            prev.map(req =>
              req.agentId === agentId
                ? { ...req, status: action === "accept" ? "Accepted" : "Rejected" }
                : req
            )
          )
        }),
        {
          loading: "Processing request...",
          success: `Request ${action}ed successfully`,
          error: (error) => error.message || "Action failed",
        }
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Sourcing Agent Requests</h1>
      </div>

      <Table>
        <TableCaption>A list of your recent agent requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Agent Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.agentId}>
                <TableCell className="font-medium">{request.agentName}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      request.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}