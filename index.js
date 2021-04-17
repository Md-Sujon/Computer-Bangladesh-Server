const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7zutu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




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
  const addCourseCollection = client.db("computerBangladesh").collection("courseAdd");
  const reviewCollection = client.db("computerBangladesh").collection("Review");
 

  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    addCourseCollection.findOneAndDelete({_id: ObjectID(id)})
    .then((document) => res.send(document.deleteCount > 0))
  });
  app.get('/courses/:id', (req, res) =>{
    const id = req.params.id;
    addCourseCollection.find({_id:ObjectID(id)})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
})


  app.post('/review', (req, res)=>{
    const newCourse = req.body;
   reviewCollection.insertOne(newCourse)
    .then(result => {
      console.log('insert count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
})

app.get('/reviews', (req, res) => {
  reviewCollection.find()
  .toArray((err, documents) => {
    res.send(documents);
  })
})


  app.post('/course', (req, res)=>{
    const newCourse = req.body;
    addCourseCollection.insertOne(newCourse)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
})


app.get('/courses', (req, res) => {
  addCourseCollection.find()
  .toArray((err, documents) => {
    res.send(documents);
  })
})




app.post('/AddRegistration', (req, res) => {
     const registration = req.body;
      registrationCollection.insertOne(registration)
       .then(result =>{
          res.send(result.insertedCount > 0)
 })
})

app.get('/Registration', (req, res) => {
    registrationCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/Registrations', (req, res) => {
    registrationCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })







});



app.listen(process.env.PORT || port);
