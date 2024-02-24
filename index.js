const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.EDUBUZZ_USERNAME}:${process.env.EDUBUZZ_USERPASSWORD}@cluster0.2xcsswz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    // await client.connect();

    const featuresCollections = client.db("EdubuzzDB").collection("features");
    const createAssainmentCollections = client
      .db("EdubuzzDB")
      .collection("createassainment");

    app.get("/features", async (req, res) => {
      const cursor = await featuresCollections.find().toArray();
      res.send(cursor);
    });

    app.post("/createassainment", async (req, res) => {
      const newAssainment = req.body;
      const result = await createAssainmentCollections.insertOne(newAssainment);
      res.send(result);
    });

    app.get("/getassainment", async (req, res) => {
      const cursor = await createAssainmentCollections.find().toArray();
      res.send(cursor);
    });

    app.put("/updateassainment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAssainment = req.body;
      const updateForm = {
        $set: {
          name: updateAssainment.name,
          email: updateAssainment.email,
          marks: updateAssainment.marks,
          img: updateAssainment.img,
          date: updateAssainment.date,
          details: updateAssainment.details,
        },
      };
      const result = await createAssainmentCollections.updateOne(
        filter,
        updateForm,
        options
      );
      res.send(result);
    });

    app.get("/updateassainment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await createAssainmentCollections.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(uri);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EduBuzz Server is Running Now !!!!!");
});

app.listen(port, () => {
  console.log(`EduBuzz Server is Running on :- ${port}`);
});

// edubuzz-studies
// scpMyNFlrSRGFYgt
