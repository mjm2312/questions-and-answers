// 'use strict';
require("dotenv").config();
const db = require('./db/models');
//install body parser
var bodyParser = require('body-parser')

const express = require('express');
const cors = require('cors');
const path = require('path');

// Constants
const PORT = 3001;
//const HOST = 'localhost';

// App
const app = express();
app.use(bodyParser.json())
app.use(cors())

const config = require('./config');

const StatsD = require('node-statsd');
const client = new StatsD({
	"prefix":"HackReactor_"
});

app.get('/', (req, res) => {
  client.increment('root_request_received')
  res.send('Hello World!!!');
});
         
app.get('/loaderio-f018a49ad3f496cd28662c73c7051824', (req, res) => {
  console.log('hi by loader io');
  res.sendFile(path.join(__dirname, '/secrets/token.txt'));
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.params['question_id'];
  const body = req.body['body'];
  const name = req.body['name'];
  const email = req.body['email'];
  const photos = req.body['photos'];


  //db.listQuestions(Number(questionId));
  //disassemble the req body for params
  //console.log('request body', req.body, req.params['question_id'])

  db.addAnswer(questionId, body, name, email, photos, res);

  //res.send(req.query);
});

app.post('/qa/questions/', (req, res) => {
  const body = req.body['body'];
  const name = req.body['name'];
  const email = req.body['email'];
  const productId = req.body['product_id'];

  //
  //db.listQuestions(Number(questionId));
  //disassemble the req body for params
  //console.log('request body', req.body, req.params['question_id'])

  //db.addAnswer(questionId, body, name, email, photos);
  db.addQuestion(productId, body, name, email, res);

  //res.send(req.query);
});



app.get('/qa/questions', (req, res) => {
  const productId = req.query["product_id"]
  db.listQuestions(Number(productId), res);
});

//prob need to pus something else in place of :question_id in route
app.get('/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.params["question_id"]
  console.log('rquest params', req.params);
  db.listAnswers(Number(questionId), res);

  //res.send(req.query);
  //res.send('hi')
});


app.listen(config.apiPort);
console.log(`Running on ${config.apiPort}`);
//console.log(db.query());
