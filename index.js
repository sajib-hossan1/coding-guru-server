const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId ;
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cowhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db("coding-guru-server");

        const courseCollection = database.collection("courses");
        const orderCollection = database.collection("orders");

        // get all courses
        app.get('/courses', async (req, res) => {
            const cursor = courseCollection.find({});
            const courses = await cursor.toArray();
            res.send(courses)
        })

        // get a single course
        app.get('/courseDetails/:id', async (req, res) => {
            const id = req.params.id ;
            console.log(id);
            const query = {_id : ObjectId(id)};
            const result = await courseCollection.findOne(query);
            res.send(result)
        })


        // add orders api
        app.post('/order', async (req,res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })


        // get orders for an user
        app.get('/orders', async (req,res) => {
            const email = req.query.email;
            const query = { email : email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })

        // delete an order for an user
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})