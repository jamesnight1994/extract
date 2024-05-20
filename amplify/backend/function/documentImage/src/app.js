/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

class DetectionPipeline {
  static task = 'document-question-answering';
  static model = 'Xenova/donut-base-finetuned-docvqa';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Dynamically import the Transformers.js library
      let { pipeline, env } = await import('@xenova/transformers');

      // path to local model
      // env.localModelPath = `./models`;
      // Disable the loading of remote models from the Hugging Face Hub:
      // env.allowRemoteModels = false;
      env.allowLocalModels = false;

      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }

}


const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/qa', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

app.get('/qa/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
* Example post method *
****************************/

app.post('/qa', async function (req, res) {
  // Add your code here
  const detector = await DetectionPipeline.getInstance();
  let output = await detector("data:image/avif;base64,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",'What is the invoice number');
  res.json({ success: 'post call succeed!', output})
});

app.post('/qa/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example put method *
****************************/

app.put('/qa', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/qa/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/qa', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/qa/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
