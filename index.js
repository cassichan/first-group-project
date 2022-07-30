import express from "express";
import cors from "cors";
import { getFirestore } from "firebase-admin/firestore";
import { credentials } from "./credentials.js";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 4000;

if (getApps().length === 0) {
  initializeApp({
    credential: cert(credentials),
  });
}

//Connect to FireStore database
const db = getFirestore();

app.listen(PORT, () => {
  console.log(`Now listening on http://localhost:${PORT}`);
});

//Routes

//Test
// app.get("/", (req, res) => {
//   res.status(200).send("Hello World");
// });

//get celebrity collection
app.get("/getallcelebs", (req, res) => {
  // const dbConnect = dbconnect();
  db.collection('celebrities').get()
  .then(collection => {
    const celebrities = collection.docs.map(doc => doc.data());
  res.send((celebrities)); 
  })
  .catch(err => console.log(err));
});

//Add a new celebrity to firestore database
app.post("/add-celebrity", (req, res) => {
  const celebrity = req.body;
  db.collection("celebrities")
    .add(celebrity)
    .then((doc) => res.status(201).send({ id: doc.id }))
    .catch((err) => res.status(500).json(err));
});
