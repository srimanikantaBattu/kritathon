const exp = require("express");
const app = exp();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(exp.json())

const DB_URL = process.env.DB_URL;

// Connect to MongoDB
MongoClient.connect(DB_URL)
  .then(async (client) => {
    const dbObj = client.db("krithoathon3");
    const usersCollection = dbObj.collection("usersCollection");
    const productsCollection = dbObj.collection("productsCollection");
    const chatCollection = dbObj.collection("chatCollection");
    app.set("usersCollection", usersCollection);
    app.set("productsCollection", productsCollection);
    app.set("chatCollection", chatCollection);
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
  
app.get("/", (req, res) => {
    res.send("Hello from the WebSigmas server!");
});

// Import routes
const userApp = require("./APIs/user-api");
const productApp = require("./APIs/product-api");

app.use("/user-api", userApp);
app.use("/product-api", productApp);


// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: "error", payload: err.message });
});


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
