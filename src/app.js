// 'use strict';
const db = require('./db/index');
//install body parser
var bodyParser = require('body-parser')

const express = require('express');
const cors = require('cors');

// Constants
const PORT = 3001;
//const HOST = 'localhost';

// App
const app = express();
app.use(bodyParser.json())
app.use(cors())

const StatsD = require('node-statsd');
const client = new StatsD({
	"prefix":"HackReactor_"
});

app.get('/', (req, res) => {
  client.increment('root_request_received')
  res.send('Hello World!!!');
});



app.post('/qa/questions/:question_id/answers', (req, res) => {
  var questionId = req.params['question_id'];
  var body = req.body['body'];
  var name = req.body['name'];
  var email = req.body['email'];
  var photos = req.body['photos'];


  //db.listQuestions(Number(questionId));
  //disassemble the req body for params
  //console.log('request body', req.body, req.params['question_id'])

  db.addAnswer(questionId, body, name, email, photos, res);

  //res.send(req.query);
});

app.post('/qa/questions/', (req, res) => {
  var body = req.body['body'];
  var name = req.body['name'];
  var email = req.body['email'];
  var productId = req.body['product_id'];

  //
  //db.listQuestions(Number(questionId));
  //disassemble the req body for params
  //console.log('request body', req.body, req.params['question_id'])

  //db.addAnswer(questionId, body, name, email, photos);
  db.addQuestion(productId, body, name, email, res);

  //res.send(req.query);
});



app.get('/qa/questions', (req, res) => {
  var productId = req.query["product_id"]
  db.listQuestions(Number(productId), res);
});

//prob need to pus something else in place of :question_id in route
app.get('/qa/questions/:question_id/answers', (req, res) => {
  var questionId = req.params["question_id"]
  console.log('rquest params', req.params);
  db.listAnswers(Number(questionId), res);

  //res.send(req.query);
  //res.send('hi')
});


app.listen(PORT);
console.log(`Running on ${PORT}`);
//console.log(db.query());
