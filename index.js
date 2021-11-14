const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

//initialization
const app = express()

app.use(express.json())
app.use(cors())


//monogdb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@noyonecommerce.qnayd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

app.get('/', (req, res) => {
  res.send('Running my CRUD Server')
})

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)




const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const drone = client.db('droneMenia')
    const droneCollection = drone.collection('drones')
    const usersCollection = drone.collection('users')
    const orderCollection = drone.collection('orders')
    const reviewCollection = drone.collection('reviews')

    //get all drones collection
    app.get('/drones', async (req, res) => {
      const drones = await droneCollection.find().toArray()
      res.json(drones)
    })
    //create drone information
    app.post('/drones', async (req, res) => {
      const drone = req.body
      const newDrone = await droneCollection.insertOne(drone)
      res.json(newDrone)
    })
    //get single drone information
    app.get('/drones/:id', async (req, res) => {
      const id = req.params.id
      const drone = await droneCollection.findOne({ _id: ObjectId(id) })
      res.json(drone)
    })

    //post order information
    app.post('/orders', async (req, res) => {
      const order = req.body
      const newOrder = await orderCollection.insertOne(order)
      res.json(newOrder)
    })

    // my Orders
    app.get('/myOrder/:email', async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray()
      res.json(result)
    })

    // delete myOrder
    app.delete('/myOrder/:id', async (req, res) => {
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      })
      res.json(result)
    })

    //post review information
    app.post('/reviews', async (req, res) => {
      const review = req.body
      const newReview = await reviewCollection.insertOne(review)
      res.json(newReview)
    })

    //get all reviews
    app.get('/reviews', async (req, res) => {
      const reviews = await reviewCollection.find().toArray()
      res.json(reviews)
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir)

