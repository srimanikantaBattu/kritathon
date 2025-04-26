"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, MessageSquare, Eye, Download } from "lucide-react"
import { format } from "date-fns"
import { Toaster } from "@/components/ui/sonner"
import * as XLSX from "xlsx"
import { useNavigate } from "react-router-dom"

interface Request {
  _id: string
  agentName: string
  category: string
  email: string
  expectedDeliveryDate: string
  itemName: string
  quantity: string
  status: string
  createdAt?: string
}

export default function BuyerAcceptedRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      if (!userId) return

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/buyer/accepted-requests/${userId}`,
        )
        setRequests(response.data.acceptedRequests)
        console.log(response.data.acceptedRequests)
      } catch (error) {
        toast.error("Failed to fetch accepted requests")
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAcceptedRequests()

    // For demo purposes, add the sample data
    const sampleData: Request = {
      _id: "sample-id-1",
      agentName: "Koushik",
      category: "Electronics",
      email: "rebbakoushik004@gmail.com",
      expectedDeliveryDate: "2025-04-30",
      itemName: "TV",
      quantity: "20",
      status: "Accepted",
    }

    setRequests([sampleData])
    setLoading(false)
  }, [userId])

  const handleChat = (request: any) => {
    console.log(request)
    toast.success(`Chat initiated with ${request.email}`, {
      action: {
        label: "Open Chat",
        onClick: () => navigate(`/buyer-chat/${request.agentId}`,{state:request}),
      },
    })
  }

  const handleViewDetails = (requestId: string) => {
    toast.info(`Showing details for request ${requestId}`, {
      description: "Request details will appear here",
    })
  }

  const exportToExcel = () => {
    // Prepare the data for export
    const dataForExport = requests.map((request) => ({
      "Agent Name": request.agentName,
      Category: request.category,
      Email: request.email,
      "Expected Delivery": request.expectedDeliveryDate,
      "Item Name": request.itemName,
      Quantity: request.quantity,
      Status: request.status,
      Date: request.createdAt ? format(new Date(request.createdAt), "MMM dd, yyyy") : "-",
    }))

    // Create a new workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataForExport)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Accepted Requests")

    // Generate the Excel file and trigger download
    XLSX.writeFile(wb, `accepted_requests_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Accepted Requests</CardTitle>
            <CardDescription>Manage your accepted product requests</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={requests.length === 0}
            onClick={() => {
              toast.promise(
                new Promise((resolve) => {
                  exportToExcel()
                  setTimeout(resolve, 1000)
                }),
                {
                  loading: "Preparing export...",
                  success: "Excel file downloaded successfully!",
                  error: "Export failed",
                },
              )
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {userId ? "No accepted requests found" : "User not authenticated"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => (
                <Card key={request._id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">{request.itemName}</CardTitle>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                    <CardDescription>Agent: {request.agentName}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{request.category}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{request.quantity}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span className="font-medium">{request.expectedDeliveryDate}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium truncate" title={request.email}>
                          {request.email}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/30 pt-2">
                    <Button variant="secondary" size="sm" onClick={() => handleChat(request)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(request._id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{requests.length}</strong> accepted requests
          </div>
        </CardFooter>
      </Card>
    </>
  )
}