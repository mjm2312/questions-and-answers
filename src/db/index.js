const { response } = require('express');
const { Pool } = require('pg');

var config = {
    user: 'postgres', 
    database: 'matttest', 
    password: 'postgres', 
    //host: 'localhost',
    
    //host: 'host.docker.internal', //will not work outside of docker desktop.map
    //host: 'postgres://db:5432',
    host: 'db',
    port: 5432, 
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000
    
};
const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

module.exports = { 

  //by default setting helpfulness, reported to 0.
  addQuestion: function(productId, body, name, email, response) {
    pool.query(
    ` INSERT INTO sdc.questions 
    (id, 
    product_id, 
    body, 
    date_written, 
    asker_name, 
    asker_email, 
    reported, 
    helpful)
    VALUES ((SELECT MAX(id) FROM sdc.questions)+1, 
    ${productId}, 
    '${body}', 
    CURRENT_DATE, 
    '${name}', 
    '${email}', 
    '0', 
    '0');`, 
    function(err, res) {
        
        if(err) {
            return console.error('error running query', err);
          } 
        console.log('res addQuestion', res);

    })
    response.send('post ok')
  },

  addAnswer: function(questionId, body, name, email, photos, response) {
    pool.query(
      `(SELECT
       MAX(id)+1 FROM sdc.answers)`,
      
      function(err, res) {
        if(err) {
          return console.error('error running query', err);
        } 
        //storeAnswerID in event of inserting mutiple photso
        console.log('answerId', res.rows[0]['?column?'])
        var answerID = Number(res.rows[0]['?column?']);

        //reported, helpful 0 by default
      
        pool.query(
          `INSERT INTO sdc.answers 
          (id, 
          question_id, 
          body, 
          date_written, 
          answerer_name, 
          answerer_email, 
          reported, 
          helpful)
          VALUES( 
          ${answerID}, 
          ${questionId}, 
          '${body}', 
          CURRENT_DATE, 
          '${name}', 
          '${email}', 
          0, 
          0);`,
          
          function(err, res) {
            if(err) {
              return console.error('error running query', err);
            } 
            
            //console.log('passed the first insert')
            //only want to execute if there's atleast one photo
            if (photos.length > 0) {
              var makeTemplate = (photoURL) => (`
              INSERT INTO sdc.answers_photos (id, answer_id, photo_url)
              VALUES ((SELECT MAX(id) FROM sdc.answers_photos)+1, 
              ${answerID}, 
              '${photoURL}');`);

              //make an array of queries;
              var insertStatements = photos.map((photo)=> (makeTemplate(photo)));
              var insertStatement = insertStatements.join('');
              pool.query(insertStatement, function(err, res) {
                if(err) {
                  return console.error('error running query', err);
                } 
                console.log('res after inserting', res);
              })
            }
          })
          response.send('post ok')
        })
  },
  listAnswers: function(questionId, response) {
    // var template = `	SELECT
    // a.id answer_id,
    // a.body body, 
    // a.date_written date,
    // a.answerer_name answerer_name,
    // a.helpful helpfulness,
    // ap.id ap_photo_id, 
    // ap.answer_id ap_answer_id, 
    // ap.photo_url ap_photo_url
    // FROM sdc.answers a
	  // LEFT OUTER JOIN sdc.answers_photos ap on a.id = ap.answer_id
    // WHERE a.question_id = ${questionId} AND a.reported IN (0)`
    //console.log(questionId, template);

    pool.query(
    `	SELECT
    a.id answer_id,
    a.body body, 
    a.date_written date,
    a.answerer_name answerer_name,
    a.helpful helpfulness,
    ap.id ap_photo_id, 
    ap.answer_id ap_answer_id, 
    ap.photo_url ap_photo_url
    FROM sdc.answers a
	  LEFT OUTER JOIN sdc.answers_photos ap on a.id = ap.answer_id
    WHERE a.question_id = ${questionId} AND a.reported IN (0)`, 
    
    function(err, res) {
      if(err) {
        return console.error('error running query', err);
      }

      obj = {};

      res.rows.forEach((x) => {

        if(obj[x.answer_id] === undefined) {
          obj[x.answer_id] = {
            answer_id: x.answer_id,
            body: x.body,
            date: x.date,
            answerer_name: x.answerer_name,
            helpfulness: x.helpfulness,
            photos: []
          }

          if (x.ap_photo_id !== null && 
            x.ap_answer_id !== null &&
            x.ap_photo_url !== null) {  
              obj[x.answer_id].photos.push({
                id: x.ap_photo_id, 
                url: x.ap_photo_url
              })
            }
        } else { //will only see a repeat answer in this case because there are photos;
          if (x.ap_photo_id !== null && 
            x.ap_answer_id !== null &&
            x.ap_photo_url !== null) {  
              obj[x.answer_id].photos.push({
                id: x.ap_photo_id, 
                url: x.ap_photo_url
              })
            }
        }

      })
      //console.log('the obj', obj);
      var resultsArr = [];
      var resultObj = {};

      for (var i in obj) {
        resultsArr.push(obj[i]);
      }
      //don't forget about parge, count query params
      resultObj['question'] = questionId;
      resultObj['results'] = resultsArr;

     // console.log('this is result Obj', resultObj)
      response.send(resultObj);

  })
  }, //
  listQuestions: function(productId, response) {
    pool.query(`SELECT 
    q.product_id product_id,
    q.id question_id, 
    q.body question_body,
    q.date_written question_date,
    q.asker_name asker_name, 
    --q.asker_email, 
    q.helpful question_helpfulness,
    q.reported reported,
    a.id answer_id,
    a.body body, 
    a.date_written date,
    a.answerer_name answerer_name,
    a.helpful helpfulness,
    ap.id ap_photo_id, 
    ap.answer_id ap_answer_id, 
    ap.photo_url ap_photo_url
    FROM sdc.questions q
    INNER JOIN sdc.answers a on q.id = a.question_id
	  LEFT OUTER JOIN sdc.answers_photos ap on a.id = ap.answer_id
    WHERE q.product_id = ${productId} AND q.reported IN (0)`, 
    
    function(err, res) {
      if(err) {
        return console.error('error running query', err);
      }
    
    obj = {};

    res.rows.forEach(x => {
      //another answer for a particular question
      //when there
      if (obj[x.question_id] !== undefined && 
        obj[x.question_id].answers[x.answer_id] === undefined ) {  
        obj[x.question_id].answers[x.answer_id] = {
          id: x.answer_id,
          body: x.body,
          date: x.date,
          answerer_name: x.answerer_name,
          helpfulness: x.helpfulness,
          photos: []
          //photos
       } //deal w photos later    

       if (x.ap_photo_id !== null && 
        x.ap_answer_id !== null &&
        x.ap_photo_url !== null) {  
          obj[x.question_id].answers[x.answer_id].photos.push({
            id: x.ap_photo_id, 
            url: x.ap_photo_url
          })
        }
      
      //if theres already a question and answer that exists, 
      //a second answer with same id indicates a photo
      } else if (obj[x.question_id] !== undefined && 
        obj[x.question_id].answers[x.answer_id] !== undefined ) { 

          if (x.ap_photo_id !== null && 
            x.ap_answer_id !== null &&
            x.ap_photo_url !== null) {  
              obj[x.question_id].answers[x.answer_id].photos.push({
                id: x.ap_photo_id, 
                url: x.ap_photo_url
              })
            }
      //new question and new answer
      } else {

          obj[x.question_id] = {
            question_id: x.question_id,
            question_body: x.question_body,
            question_date: x.question_date,
            asker_name: x.asker_name,
            question_helpfulness: x.question_helpfulness,
            reported: x.reported,
            answers : {}
          }

          obj[x.question_id].answers[x.answer_id] = {
              id: x.answer_id,
              body: x.body,
              date: x.date,
              answerer_name: x.answerer_name,
              helpfulness: x.helpfulness,
              photos: []
            }
          
            if (x.ap_photo_id !== null && 
                x.ap_answer_id !== null &&
                x.ap_photo_url !== null) {  
                  obj[x.question_id].answers[x.answer_id].photos.push({
                    id: x.ap_photo_id, 
                    url: x.ap_photo_url
                  })
                }
      }

    })
    var resultsValues = [];
    for (var i in obj) {
      resultsValues.push(obj[i]);
    }

    var resultObj = {
      product_id : productId,
      results: resultsValues
    }

   // console.log('resultObj', resultObj)
    response.send(resultObj);


    })
  }
}
//
