import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Phone, MessageSquare, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { Toaster } from '@/components/ui/sonner'

interface Request {
  _id: string
  productName: string
  category: string
  quantity: number
  budget: string
  requesterPhone?: string
  status: 'pending' | 'accepted' | 'completed'
  createdAt: string
}

export default function AgentAcceptedRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get userId from localStorage when component mounts
    const storedUserId = localStorage.getItem('userId')
    setUserId(storedUserId)
  }, [])

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      if (!userId) return // Don't fetch if userId isn't available

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/accepted-requests/${userId}`
        )
        setRequests(response.data.acceptedRequests)
      } catch (error) {
        toast.error('Failed to fetch accepted requests')
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAcceptedRequests()
  }, [userId]) // Add userId as dependency

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`)
  }

  const handleChat = (requestId: string) => {
    toast.success(`Chat initiated for request ${requestId}`, {
      action: {
        label: 'Open Chat',
        onClick: () => console.log('Open chat implementation'),
      },
    })
  }

  const handleViewDetails = (requestId: string) => {
    toast.info(`Showing details for request ${requestId}`, {
      description: 'Request details will appear here',
    })
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
        <CardHeader>
          <CardTitle>Accepted Requests</CardTitle>
          <CardDescription>
            Manage your accepted product requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {userId ? 'No accepted requests found' : 'User not authenticated'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {request.productName}
                    </TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.budget}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleChat(request._id)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </DropdownMenuItem>
                          {request.requesterPhone && (
                            <DropdownMenuItem
                              onClick={() => handleCall(request.requesterPhone)}
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(request._id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{requests.length}</strong> accepted requests
          </div>
          <Button 
            variant="outline" 
            disabled={requests.length === 0}
            onClick={() => toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: 'Exporting data...',
                success: 'Data exported successfully!',
                error: 'Export failed',
              }
            )}
          >
            Export
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}