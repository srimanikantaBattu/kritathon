const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const e = require("express");
const { ObjectId } = require("mongodb");
require("dotenv").config();
let usersCollection;

userApp.use((req, res, next) => {
    usersCollection = req.app.get("usersCollection");
    next();
});

// Register new user
userApp.post("/register", expressAsyncHandler(async (req, res) => {
    const data = req.body;
    const result = await usersCollection.insertOne(data);
    res.send(result);
}));

userApp.post("/buyer-request", expressAsyncHandler(async (req, res) => {
  console.log("came here");
  console.log(req.body.agentId)
    const agentId = req.body.agentId;
    const buyerData = req.body.buyerData;
    const requests = req.body.requests;

    console.log("Agent ID:", agentId);

    await usersCollection.updateOne(
        { _id: new ObjectId(buyerData.buyerId) },
        { $push: { requests: buyerData } }
    );

     // Initialize requests array if it doesn't exist
     

     // Update the user document with the new requests array
     const result = await usersCollection.updateOne(
         { _id: new ObjectId(agentId) },
         { $push: { requests: requests } },
     );

}));

userApp.post("/login", expressAsyncHandler(async (req, res) => {
  const { email } = req.body
  
  if (!email) {
      return res.status(400).send({ 
          success: false,
          message: "Email and userType are required" 
      });
  }

  const user = await usersCollection.findOne({ email });
  
  if (!user) {
      return res.status(401).send({ 
          success: false,
          message: "Invalid email or user type" 
      });
  }
  return res.send({ 
      success: true,
      message: "Login successful",
      user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          companyName: user.companyName,
          phone: user.phone,
          country: user.country,
          location: user.location,
          agencyName: user.agencyName,
      }
  });
}));

userApp.get("/requests/:email", expressAsyncHandler(async (req, res) => {
  const { email } = req.params;


  const user = await usersCollection.findOne({ email });

  if (!user) {
      return res.status(404).send({
          success: false,
          message: "User not found"
      });
  }

  res.send({
      success: true,
      requests: user.requests || []  // return empty array if no requests
  });
}));

userApp.put("/accept-requests/:requestId", expressAsyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const email = req.body.email

  // console.log(email)

  const doc = await usersCollection.findOne(
      { email: email },
  );

  let acceptedOne=[] ;

  // console.log(doc)

  for(let i = 0; i < doc.requests.length; i++) {
      // console.log(doc.requests[i].requestId)
      if(doc.requests[i].requestId == requestId) {
          doc.requests[i].status = "Accepted"
          acceptedOne = doc.requests[i]
      }
  }

  // console.log("here",doc)


  await usersCollection.updateOne(
      { email: email },
      { $set: { requests: doc.requests } }
  );

  await usersCollection.updateOne(
      { email: email },
      { $push: { acceptedRequests: acceptedOne } }
  );

  /////////////////////

  console.log("buyer ID",requestId)
  console.log("buyer email",email)

  let doc2 = await usersCollection.findOne({
      _id: new ObjectId(requestId)
  });
  console.log(doc2)

  let newAcceptedOne;

  for (let i = 0; i < doc2.requests.length; i++) {
      if (doc2.requests[i].email == email) {
          doc2.requests[i].status = "Accepted";
          newAcceptedOne = doc2.requests[i];
          break;
      }
  }
  
  // console.log("accepted hereeeeeeeeeeee",newAcceptedOne)

  // console.log("final",doc2.requests,doc2._id,new ObjectID(doc2._id))

  await usersCollection.updateOne(
      {_id: new ObjectId(requestId)},
      {
        $set: { requests: doc2.requests },
        $push: { acceptedRequests: newAcceptedOne }
      }
    );


  //////////////////////





  res.send(
      {
          success: true,
          message: "Request accepted successfully"
      }

  )
}))
  

userApp.put("/reject-requests/:requestId", expressAsyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const email = req.body.email

  console.log(email)

  const doc = await usersCollection.findOne(
      { email: email },
  );

  let acceptedOne=[] ;

  console.log(doc)

  for(let i = 0; i < doc.requests.length; i++) {
      // console.log(doc.requests[i].requestId)
      if(doc.requests[i].requestId == requestId) {
          console.log("first",doc.requests[i].status)
          doc.requests[i].status = "Rejected"
          acceptedOne = doc.requests[i]
          console.log(doc.requests[i].status)
      }
  }

  // console.log("here",doc)


  await usersCollection.updateOne(
      { email: email },
      { $set: { requests: doc.requests } }
  );


  res.send(
      {
          success: true,
          message: "Request rejected successfully"
      }

  )
}))

// Add this route to fetch accepted requests for agents
userApp.get(
  "/agent/accepted-requests/:agentId",
  expressAsyncHandler(async (req, res) => {
    const agentId = req.params.agentId
    // console.log(new ObjectId(agentId))
    const id=new ObjectId(agentId);

    try {
      // Find the agent by ID
      console.log("Finding agent...")
      const agent = await usersCollection.findOne({ _id: id, userType: "agent" });
      // console.log(agent)

      if (!agent) {
        return res.status(404).send({
          success: false,
          message: "Agent not found",
        });
      }

      // Return the acceptedRequests array from the agent's document
      res.send({
        success: true,
        acceptedRequests: agent.acceptedRequests || [],
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  })
);

userApp.get(
  "/buyer/accepted-requests/:buyerId",
  expressAsyncHandler(async (req, res) => {
    const buyerId = req.params.buyerId;
    // console.log(new ObjectId(buyerId))
    const id = new ObjectId(buyerId);

    try {
      // Find the buyer by ID
      console.log("Finding buyer...")
      const buyer = await usersCollection.findOne({ _id: id, userType: "buyer" });
      // console.log(buyer)

      if (!buyer) {
        return res.status(404).send({
          success: false,
          message: "Buyer not found",
        });
      }

      // Return the acceptedRequests array from the agent's document
      res.send({
        success: true,
        acceptedRequests: buyer.acceptedRequests || [],
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  })
);


// Get all users - will be used to fetch agents on the frontend
userApp.get("/allusers", expressAsyncHandler(async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await usersCollection.find().toArray();
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Failed to fetch users", error: error.message });
    }
}));

// Get user by ID
userApp.get("/:id", expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        res.status(200).send(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send({ message: "Failed to fetch user", error: error.message });
    }
}));

module.exports = userApp;