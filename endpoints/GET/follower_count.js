var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoURL = process.env.MONGODB_URI;

module.exports = function (req, res) {
  if (req.user) {
    let query = {"user_id": req.user.profile.id};
    MongoClient.connect(mongoURL, function(err, db) {
      assert.equal(null, err);
      db.collection("twitter-stats", function (err, collection) {
        collection.findOne(query, function (err, doc) {
          if (doc) {
            console.log(doc.counts);
            status(doc.counts.followers);
            db.close();
          } else {
            throw ({
                status: 500,
                message: "User does not exist.",
                render: false
            })
          }
        })
      });  
    });

    function status (count) {
      return res.send({
        "status": 200,
        "message": "OK",
        "data": {
          "count": count
        }
      });
    }
  } else {
    res.end();
  }
};
