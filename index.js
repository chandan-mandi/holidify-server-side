const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.islim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('database is Connected !');
        const database = client.db("holidify");
        const touristPlaces = database.collection("tourist-places");
        const hotelsCollection = database.collection("hotels");
        const orderCollection = database.collection("orders");
        
        // GET ALL Place DATA
        app.get('/places', async(req, res) =>{
            const cursor = touristPlaces.find({});
            const places = await cursor.toArray();
            res.send(places);
        } )
        // GET ALL Hotels DATA
        app.get('/hotels', async(req, res) =>{
            const cursor = hotelsCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        } )
        // GET SINGLE HOTEL DATA
        app.get('/hotels/:id', async(req, res)=> {
            const id = req.params.id;
            console.log('geeting specific Hotel', id);
            const query = {_id: ObjectId(id)}
            const hotel = await hotelsCollection.findOne(query);
            res.json(hotel)
        })
        // POST API / POST ORDER API
        app.post('/order', async(req, res) => {
            const order = req.body;
            console.log('hit the post api', order);
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })

    }
    finally {
        
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello ! Server is Running.....')
})

app.listen(port, () => {
    console.log('Running Server on Port', port);
})