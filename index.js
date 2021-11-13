const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
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
          
          app.get('/placeOrders', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const cursor = bikesCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings);
          }) 

          app.post('/placeOrders', async(req, res)=>{
              const booking = req.body;
              const result = await bikesCollection.insertOne(booking);
              console.log(result);
              res.json(result);
          })

          //GET PRODUCT API
          app.get('/addProduct', async(req, res)=>{
            // const email = req.query.email;
            // const query = {email: email};
            const cursor = bikesCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
          }) 


          //POST PRODUCT API
          app.post('/addProduct', async(req, res)=>{
            const add = req.body;
            const result = await bikesCollection.insertOne(add);
            console.log(result);
            res.json(result);
        })



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