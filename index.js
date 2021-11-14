const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnsg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
        try{
            await client.connect();
            const database = client.db('luisianaBike');
            const bikesCollection = database.collection('bicycles')
            const usersCollection = database.collection('users')
            const ordersCollection = database.collection('orders')
          

          //GET PLACE ORDERS API
          app.get('/placeOrders', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const cursor = ordersCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings);
          }) 

          //POST PLACE ORDERS API
          app.post('/placeOrders', async(req, res)=>{
              const booking = req.body;
              const result = await ordersCollection.insertOne(booking);
              console.log(result);
              res.json(result);
          })

          // GET ALL ORDERS API
          app.get('/allOrders',async(req, res)=>{
            const result = await ordersCollection.find({}).toArray();
            res.json(result);
          })

          //DELETE ALL ORDERS API
          app.delete('/allOrders/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
            console.log(result);
          })

          //DELETE MY ORDER
          app.delete('/placeOrders/:id', async(req,res)=>{
              const id = req.params.id;
              const query = {_id: ObjectId(id)};
              const result = await ordersCollection.deleteOne(query);
              res.json(result);
              console.log(result);
          })

          //GET PRODUCT API
          app.get('/addProduct', async(req, res)=>{
            const cursor = bikesCollection.find({});
            const products = await cursor.toArray();
            console.log(products);
            res.json(products);
          })
          
           //DELETE Manage Product 
           app.delete('/addProduct/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bikesCollection.deleteOne(query);
            res.json(result);
            console.log(result);
        })

          //GET SINGLE PRODUCT
          app.get('/addProduct/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await bikesCollection.findOne(query);
            res.json(product);
        })
          //POST PRODUCT API
          app.post('/addProduct', async(req, res)=>{
            const add = req.body;
            const result = await bikesCollection.insertOne(add);
            console.log(result);
            res.json(result);
        })


          //GET ADMIN 
          app.get('/users/:email', async(req, res)=>{
              const email =req.params.email;
              const query = {email:email};
              const user = await usersCollection.findOne(query);
              let isAdmin = false;
              if(user?.role === 'admin'){
                  isAdmin = true;
              }
              res.json({admin: isAdmin});
          })

          //POST USERS API
          app.post('/users', async(req, res)=>{
              const user = req.body;
              const result = await usersCollection.insertOne(user);
              console.log(result);
              res.json(result);
          })

          app.put('/users', async(req,res)=>{
              const user = req.body;
              const filter = {email: user.email};
              const options = {upsert: true};
              const updateDoc = { $set: user };
              const result = await usersCollection.updateOne(filter, updateDoc, options);
              res.json(result);
          })

          app.put('/users/admin', async(req,res)=>{
              const user = req.body;
              const filter = {email: user.email};
              const updateDoc = { $set: {role: 'admin'}};
              const result = await usersCollection.updateOne(filter, updateDoc);
              res.json(result);
          })

        }
        finally{
            // await client.close();
        }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


{/* <Rating
  initialRating={2.5}
  readonly
  emptySymbol="fas fa-star"
  fullSymbol="fa fa-thumbs-up fa-2x"
/>


<i class="fas fa-star"></i> */}