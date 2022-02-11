const functions = require("firebase-functions");
const admin = require('firebase-admin');


admin.initializeApp();
const db = admin.firestore()

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));

async function linker(req) {
  const linkID = req.originalUrl.replace("/l/","");
  var url;
  var fullUrl = req.protocol + '://' + req.get('host');
  await db.collection("link").doc(linkID).get()
    .then((doc) => {
      if (doc.exists) {
      rawUrl = doc.data();
      url = rawUrl.url;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        url = fullUrl + "/404";
    }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);

    });
  // linkID = `${req.originalUrl}`.replace("/l/","")
  return url;
}

// build multiple CRUD interfaces:
app.get('/l/**', (req, res) => {linker(req).then((data) => res.redirect(data))});
exports.linker = functions.https.onRequest(app);
