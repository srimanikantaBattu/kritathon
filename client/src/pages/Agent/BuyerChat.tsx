
import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

function BuyerChat() {
  const buyerId = localStorage.getItem("userId")
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<any>(null)
  const [agentName, setAgentName] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/product-api/chat`, {
          buyerId: buyerId,
          agentId: id,
        })
        // console.log(response.data);
        setMessages(response.data)
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    async function fetchName() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/product-api/get-name`, {
              id: id
            })
            // console.log(response.data);
            setAgentName(response.data)
          } catch (error) {
            console.error("Error fetching data:", error)
          }
        }
    
    fetchName()

    fetchData()
  }, [id])

  async function postData(data: any) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/product-api/update-chat`, {
        buyerId: buyerId,
        agentId: id,
        userType: localStorage.getItem("userType"),
        message: data,
      })
      // console.log(response.data);
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleSendMessage = (e:any) => {
    e.preventDefault()
    if (newMessage.trim()) {
      postData(newMessage)
      setNewMessage("")
    }
  }

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-center mb-4 border-b pb-3">
        <h1 className="text-2xl font-bold">Chat with Agent : </h1>
        <h2 className="text-2xl font-bold">{agentName}</h2>
      </div>

      <Card className="flex-1 mb-4 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col space-y-4">
            {messages.length > 0 ? (
              messages.map((msg:any, index) => (
                <div key={index} className={`flex ${msg.type === "buyer" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.type === "buyer"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default BuyerChat
