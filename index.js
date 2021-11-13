const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;


// medal
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvdmb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('arBudgetCar')
    const productCollection = database.collection('products');
    const orderCollection = database.collection('orders');
    const reviewCollection = database.collection('reviews');
    const userCollection = database.collection('users');

    // add products 
    app.post('/addProducts', async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });

    //get all products
    app.get('/allProducts', async (req, res) => {
      const result = await productCollection.find({}).toArray();
      res.send(result);
    })

    //singleProducts
    app.get('/singleProducts/:id', async (req, res) => {
      const result = await productCollection.find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    })

    //product Delete method
    app.delete("/deleteProduct/:id", async (req, res) => {
      const result = await productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      res.send(result);
    })

    // order
    app.post('/addOrders', async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
    });

    //myOrder
    app.get('/myOrder/:email', async (req, res) => {
      const result = await orderCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    })

    //My Orders Delete method
    app.delete("/deleteOrder/:id", async (req, res) => {
      const result = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) })
      res.send(result);
      console.log(result);
    })

    //All Orders
    app.get("/allOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    })

    //All Orders Delete method
    app.delete("/deleteOrders/:id", async (req, res) => {
      const result = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) })
      res.send(result);
    })

    //addReview
    app.post('/addReview', async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    })

    // allReview 
    app.get('/allReview', async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    })

    // add user 
    app.post('/addUserInfo', async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    })

    // make admin
    app.put('/makeAdmin', async (req, res) => {
      const filter = { email: req.body.email };
      const result = await userCollection.find(filter).toArray();
      if (result) {
        const documents = await userCollection.updateOne(filter, {
          $set: { role: "admin" }
        });
        console.log(documents);
      }
      else {
        const role = "admin";
        const result = await userCollection.insertOne(req.body.email)
      }
    });

    // check admin or not 
    app.get('/checkAdmin/:email', async (req, res) => {
      const result = await userCollection.find({ email: req.params.email }).toArray();
      console.log(result);
      res.send(result);

    })

  }
  finally {
    // await client.close();
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Budget cars')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})