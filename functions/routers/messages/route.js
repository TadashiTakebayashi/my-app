// const { request } = require('express');
const express = require("express");
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test3-b16d5.firebaseio.com"
});

const router = express.Router();

const endPoint = "/messages";

const db = admin.firestore(); 

router
    .route(endPoint)
    .get(async (req, res) => {
        const messages = [];
        try {
            const querySnapshot = await db
                .collection("messages")
                .orderBy("createdAt", "asc")
                .get();
            querySnapshot.forEach(doc => {
                messages.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        } catch (error) {
            console.error(error, '00000000000');
        }
      res.json({
        message: "Called by GET method",
        messages
      });
    })
    .post(async (req, res) => {
      const { name, body } = req.body;
      const createdAt = new Date().toISOString();
      
      try {
        const docRef = await db
            .collection("messages")
            .add({
                name,
                body,
                createdAt
            });
        
        const docSnapshot = await docRef.get();
        const createdMessage = {
            id: docSnapshot.id,
            ...docSnapshot.data()
        };

        res.json({
            message: "Called by POST method",
            data: createdMessage
        });
      } catch (error) {

      }
    });

// /messages/1
router
    .route(`${endPoint}/:id`)
    .put((req, res) => {
      res.json({
        message: `Called by PUT method. ID: ${req.params.id}`,
      });
    })
    .delete((req, res) => {
      res.json({
        message: `Called by DELETE method. ID: ${req.params.id}`,
      });
    });
module.exports = router;
