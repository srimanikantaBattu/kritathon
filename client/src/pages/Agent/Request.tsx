import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import axios from 'axios'
import { useEffect } from "react"

// Define the Request type
type Request = {
  buyerName: string
  location: string
  quantity: number
  category: string
  itemName: string
  expectedDeliveryDate: string
  additionalSpecifications: string
  status: string
}

export default function Requests() {
 
  const email = localStorage.getItem('email')
  const [requests, setRequests] = useState<Request[]>([])


    useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/requests/${email}`)
        setRequests(response.data.requests)
      } catch (error) {
        console.error("Error fetching requests:", error)
      }
    }

    fetchRequests()
  }, [email])

  async function handleAccept(index: number) {
    const updatedRequests : any = [...requests]
    updatedRequests[index].status = "Accepted"
    const id = updatedRequests[index].requestId
    setRequests(updatedRequests)
    await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/accept-requests/${id}`,{email})
  }

  // Function to handle rejecting a request
 async function  handleReject (index: number) {
    const updatedRequests : any = [...requests]
    updatedRequests[index].status = "Rejected"
    const id = updatedRequests[index].requestId
    setRequests(updatedRequests)
    await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/reject-requests/${id}`,{email})
    console.log("Request Rejected:", updatedRequests[index])
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Buyer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Specifications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{request.buyerName}</TableCell>
                    <TableCell>{request.itemName}</TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>{request.expectedDeliveryDate}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={request.additionalSpecifications}>
                      {request.additionalSpecifications}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccept(index)}
                          disabled={request.status !== "Pending"}
                        >
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(index)}
                          disabled={request.status !== "Pending"}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}