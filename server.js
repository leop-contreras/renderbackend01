const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors()); // Allow requests from your GitHub Pages domain
app.use(express.json()); // Parse JSON requests

const uri = "mongodb+srv://<username>:<password>@cluster.mongodb.net/yourdatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.get('/api/data', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('yourdatabase').collection('yourcollection');
    const data = await collection.find().toArray();
    res.json(data); // Send data to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Error connecting to MongoDB');
  }
});

app.post('/api/data', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('yourdatabase').collection('yourcollection');
    await collection.insertOne(req.body); // Insert data from frontend
    res.status(201).send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data into MongoDB');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
