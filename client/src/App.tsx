import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./root";
import GetImages from "./pages/GetImages";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import LocationTracker from "./pages/LocationTrack";
import AddPhoto from "./pages/Agent/AddPhotos";
import AgentAccepted from "./pages/Agent/AgentAccepted";
import BuyerAccepted from "./pages/Agent/BuyerAccepted";
import Requests from "./pages/Agent/Request";
import ProfilePage from "./pages/Agent/ProfilePage";
import SourcingAgentsPage from "./pages/Agent/SourcingAgent";
import BuyerRequests from "./pages/Agent/BuyerRequests";
import BuyerChat from "./pages/Agent/BuyerChat";
import AgentChat from "./pages/Agent/AgentChat";
import StaticTracker from "./pages/StaticTracker";
import Rating from "./pages/Ratings";
function App() {
  const router = createBrowserRouter([
    {
      path:"/register",
      element:<Register/>
    },
    {
      path:"/login",
      element:<Login/>
    }
    ,{
      path:"/landing-page",
      element:<LandingPage></LandingPage>
    },
    {
      path: "/",
      element: <RootLayout></RootLayout>,
      children: [
        {
          index: true,
          element: <Dashboard />
        },{
          path:"/location-track",
          element:<LocationTracker/>
        },{
          path:"/add-photos",
          element:<AddPhoto/>
        },{
          path:"/getimages",
          element:<GetImages/>
        },{
          path:"/agent-accepted",
          element:<AgentAccepted/>
        },{
          path:"/buyer-accepted",
          element:<BuyerAccepted/>
        },{
          path:"/requests",
          element:<Requests/>
        },{
          path:"/sourcing-agents",
          element:<SourcingAgentsPage/>
        },{
          path:"/agent/:id",
          element:<ProfilePage/>
        },
        {
          path:"/buyer-requests",
          element:<BuyerRequests/>
        },{
          path:"buyer-chat/:id",
          element:<BuyerChat/>
        },{
          path:"agent-chat/:id",
          element:<AgentChat/>
        },{
          path:"/static-tracker",
          element:<StaticTracker/>
        },{
          path:"/ratings",
          element:<Rating/>
        }
      ]
    }
  ])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </ThemeProvider>
  )
}

export default App
