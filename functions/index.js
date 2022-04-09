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
  try {
    const snapshot = await admin.firestore().collection("users")
        .where("email", "==", req.params.email).get();

    const users = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();

      users.push({id, ...data});
    });
    if (users.length > 0) {
      res.status(200).send(JSON.stringify(users));
    } else {
      res.send("Nenhum usuário encontrado");
    }
  } catch (error) {
    res.status(500).send("Nenhum usuário encontrado" + error.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const snapshot = await admin.firestore()
        .collection("users").doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send(JSON.stringify({id: userId, ...userData}));
  } catch (error) {
    res.status(500).send("Nenhum usuário encontrado" + error.message);
  }
});

app.post("/", async (req, res) => {
  const {usuario, email, tipo} = req.body;
  const user = {
    usuario,
    email,
    tipo,
  };
  try {
    await admin.firestore().collection("users").add(user);

    res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    res.send("Erro ao cadastrar usuário: " + error.message);
  }
});

app.put("/:id", async (req, res) => {
  const body = req.body;
  try {
    await admin.firestore().collection("users").doc(req.params.id).update(body);

    res.status(200).send("Usuário atualizado com sucesso!");
  } catch (error) {
    res.send("Erro ao atualizar usuário: " + error.message);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await admin.firestore().collection("users").doc(req.params.id).delete();

    res.status(200).send("Usuário deletado com sucesso!");
  } catch (error) {
    res.send("Erro ao atualizar usuário: " + error.message);
  }
});

exports.user = functions.https.onRequest(app);
// função teste do firebase
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
