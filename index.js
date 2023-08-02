const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oyvr00h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("job-task").collection("tasks");

        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray();
            res.send(tasks);
        })

        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        app.delete('/task_delete', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);

        })

        app.put('/task_update', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const updatedTask = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updatedTask.title,
                    description: updatedTask.description
                }
            };
            const result = await taskCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        app.put('/status_update', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const updatedTask = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status:updatedTask.status
                }
            };
            const result = await taskCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This is homepage')
});



app.listen(port, () => {
    console.log('port is running')
})
