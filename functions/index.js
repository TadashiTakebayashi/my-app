const functions = require("firebase-functions");
const express = require("express");
const {request} = require("express");
const messagesRouter = require("./routers/messages/route");

const app = express();
app.use("/", messagesRouter);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.api = functions
    .region("asia-northeast1")
    .https
    .onRequest(app);
