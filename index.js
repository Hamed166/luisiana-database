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