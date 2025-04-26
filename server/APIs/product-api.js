require('dotenv').config();
const exp = require('express');
const productApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { type } = require('os');
const { ObjectId } = require('mongodb');

let productsCollection;
let chatCollection;
let usersCollection;
productApp.use((req, res, next) => {
    productsCollection = req.app.get("productsCollection");
    chatCollection = req.app.get("chatCollection");
    usersCollection = req.app.get("usersCollection");
    next();
});

const bucketName = process.env.BUCKET_NAME;
const awsAccessKey = process.env.MYAPP_AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS;
const bucketRegion = process.env.BUCKET_REGION;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

productApp.post('/upload', upload.array('photos', 3), expressAsyncHandler(async (req, res) => {
    try {
        const uploadedImages = [];
        
        // Process each uploaded file if available
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageName = randomImageName();
                const params = {
                    Bucket: bucketName,
                    Key: imageName,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };
                
                const command = new PutObjectCommand(params);
                await s3.send(command);
                uploadedImages.push(imageName);
            }
        }
        
        // Validate category
        if (!req.body.category) {
            return res.status(400).send({ error: 'Category is required' });
        }

        // Create the product document with form data including the new category field
        const product = await productsCollection.insertOne({
            productName: req.body.productName,
            email: req.body.email,
            location: req.body.location,
            category: req.body.category,
            photo1: uploadedImages[0] || null,
            photo2: uploadedImages[1] || null,
            photo3: uploadedImages[2] || null,
            createdAt: new Date()
        });
        
        res.status(200).send({ 
            message: 'Product uploaded successfully',
            productId: product.insertedId
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send({ error: 'Failed to upload product data' });
    }
}));

// Optional: Add a route to get products by category
productApp.get('/category/:categoryName', expressAsyncHandler(async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const products = await productsCollection.find({ category: categoryName }).toArray();
        
        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).send({ error: 'Failed to fetch products' });
    }
}));

productApp.get('/files', expressAsyncHandler(async (req, res) => {
    const files = await productsCollection.find().toArray();
    for(const file of files){
        const getObjParams1 = {
            Bucket: bucketName,
            Key: file.photo1,
        };
        const getObjParams2 = {
            Bucket: bucketName,
            Key: file.photo2,
        };
        const getObjParams3 = {
            Bucket: bucketName,
            Key: file.photo3,
        };
        const command1 = new GetObjectCommand(getObjParams1)
        const command2 = new GetObjectCommand(getObjParams2)
        const command3 = new GetObjectCommand(getObjParams3)
        const url1 = await getSignedUrl(s3, command1, { expiresIn: 3600 })
        const url2 = await getSignedUrl(s3, command2, { expiresIn: 3600 })
        const url3 = await getSignedUrl(s3, command3, { expiresIn: 3600 })
        file.photo1 = url1;
        file.photo2 = url2;
        file.photo3 = url3;
    }
    res.send(files);
}));

productApp.post('/chat', expressAsyncHandler(async (req, res) => {
    let agentId = req.body.agentId
    let buyerId = req.body.buyerId
    // console.log(agentId,buyerId)
    const chats = await chatCollection.findOne({ agentId: agentId, buyerId: buyerId });
    // console.log(chats)
    res.send(chats.messages);
}));

productApp.post('/update-chat', expressAsyncHandler(async (req, res) => {
    let agentId = req.body.agentId
    let buyerId = req.body.buyerId
    let userType = req.body.userType
    let message = req.body.message
    let obj = {
        type: userType,
        message: message
    }
    // console.log(agentId,buyerId,message)
    const chats = await chatCollection.findOne({ agentId: agentId, buyerId: buyerId });
    // console.log(chats)
    await chatCollection.updateOne({ agentId: agentId, buyerId: buyerId }, { $push: { messages: obj } });
    const messages = await chatCollection.findOne({ agentId: agentId, buyerId: buyerId });
    res.send(messages.messages);
}));

productApp.post('/get-name', expressAsyncHandler(async (req, res) => {
    let id = req.body.id
    console.log(id)
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    console.log(id)
    console.log(user)
    res.send(user.name);

}));

module.exports = productApp;