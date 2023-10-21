const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfohvfe.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const carCollection = client.db('carDB').collection('cars');
    const orderCollection = client.db('carDB').collection('order');

    app.get('/cars', async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    //brand
    app.get('/cars/:brand', async (req, res) => {

      const brand_in_param = req.params.brand;
      console.log(brand_in_param);
      const result = await carCollection.find({ brand: brand_in_param }).toArray();
      console.log(result);
      res.send(result);

    })
    //id
    app.get('/carDetail/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carCollection.findOne(query);
      res.send(result)
    })
    //order get

    app.get('/order', async (req, res) => {
      const cursor = orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //order post
    app.post('/order', async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send(result)
    })
    //order update
    app.get('/updateCart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carCollection.findOne(query)
      res.send(result)
    })
    //order put

    app.put('/updateCart/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCar = req.body;
      const car = {
        $set: {
          photo: updatedCar.photo,
          name: updatedCar.name,
          brand: updatedCar.brand,
          carType: updatedCar.carType,
          price: updatedCar.price,
          description: updatedCar.description,
          rating: updatedCar.rating
        }
      }
      const result = await carCollection.updateOne(filter, car, options);
      res.send(result)

    })
    //order delete

    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await orderCollection.deleteOne(query);
      res.send(result)
    })

    app.post('/cars', async (req, res) => {
      const newCar = req.body;
      console.log(newCar)
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('automotive server running')
});

app.listen(port, () => {
  console.log(`server port: ${port}`)
})