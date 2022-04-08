const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();
app.use(cors({origin: true}));

app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").get();

  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(users));
});

app.get("/:email", async (req, res) => {
  const snapshot = await admin.firestore().collection("users")
      .where("email", "==", req.params.email).get();

  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(users));
});

app.get("/:id", async (req, res) => {
  const snapshot = await admin.firestore()
      .collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({id: userId, ...userData}));
});

app.post("/", async (req, res) => {
  const user = req.body;

  await admin.firestore().collection("users").add(user);

  res.status(201).send();
});

app.put("/:id", async (req, res) => {
  const body = req.body;

  await admin.firestore().collection("users").doc(req.params.id).update(body);

  res.status(200).send();
});

app.delete("/:id", async (req, res) => {
  await admin.firestore().collection("users").doc(req.params.id).delete();

  res.status(200).send();
});

exports.user = functions.https.onRequest(app);
// função teste do firebase
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
