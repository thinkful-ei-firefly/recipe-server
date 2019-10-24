require('dotenv').config()
const express = require('express');
const uploadRoute = express.Router();
const jsonParser = express.json();

const AWS = require('aws-sdk');
//('aws-sdk/dist/aws-sdk-react-native');
//require('aws-sdk/clients/s3');

uploadRoute
  .route('/')
  .post((req, res, next) => {
    let file = req.files.file;

    const s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.body? req.body.filename : 'test.png',
      Body: file.data,
      ContentType: file.mimetype,
      ACL: "public-read"
    };

    s3bucket.upload(params, function(err, data) {
        if (err) {
          res.status(500).json({ error: true, message: err });
        } else {
          console.log('GOOD..');
          res.json(data);
        }
      });
    });

  module.exports = uploadRoute;
