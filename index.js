const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7zutu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.7zutu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



const app = express();
app.use(express.json());
app.use(cors());
const port =5000;


app.get('/', (req, res) =>{
    res.send("Hello Computer-Bangladesh")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const registrationCollection = client.db("computerBangladesh").collection("registration");
 
app.post('/AddRegistration', (req, res) => {
     const registration = req.body;
     console.log(registration);
      registrationCollection.insertOne(registration)
       .then(result =>{
          res.send(result.insertedCount > 0)
 })
})

app.get('/Registration', (req, res) => {
    // console.log(req.query.email);
    registrationCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/Registrations', (req, res) => {
    // console.log(req.query.email);
    registrationCollection.find()
    // {email: req.query.email}
    .toArray((err, documents) => {
      res.send(documents);
    })
  })





});



app.listen(process.env.PORT || port);
