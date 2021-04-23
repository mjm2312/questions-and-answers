const pool = require('./');

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
            console.error('error running query', err);
            response.sendStatus(500);
            return;
          }
        response.status(201).send('post ok')
    })  
  },

  addAnswer: function(questionId, body, name, email, photos, response) {
    pool.query(
      `(SELECT MAX(id)+1 
      FROM sdc.answers)`,  
      function(err, res) {
        if(err) {
          console.error('error finding id for new answer', err);
          response.sendStatus(500);
          return;
        } 
        //storeAnswerID in event of inserting mutiple photos
        const answerID = Number(res.rows[0]['?column?']);
        //reported, helpful are 0 by default      
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
              console.error('error inserting answer', err);
              response.sendStatus(500);
              return;
            } 
            
            //only want to execute if there's atleast one photo
            if (photos.length > 0) {
              let makeTemplate = (photoURL) => (`
              INSERT INTO sdc.answers_photos (id, answer_id, photo_url)
              VALUES ((SELECT MAX(id) FROM sdc.answers_photos)+1, 
              ${answerID}, 
              '${photoURL}');`);

              //make an array of queries;
              let insertStatements = photos.map((photo)=> (makeTemplate(photo)));
              const insertStatement = insertStatements.join('');
              pool.query(insertStatement, function(err, res) {
                if(err) {
                  console.error('error running query', err);
                  response.sendStatus(500);
                  return;
                } 

                response.status(201).send('post ok'); 
              })
            }
            //posted answer without photos
            response.status(201).send('post ok');
          })
        })
  },

  listAnswers: function(questionId, response) {
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
        console.error('error running query', err);
        response.sendStatus(500);
        return;
      }

      let obj = {};

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

      let resultsArr = [];
      let resultObj = {};

      for (let i in obj) {
        resultsArr.push(obj[i]);
      }

      resultObj['question'] = questionId;
      resultObj['results'] = resultsArr;
      response.send(resultObj); 
    })
  }, 

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
    LEFT OUTER JOIN sdc.answers a on q.id = a.question_id
	  LEFT OUTER JOIN sdc.answers_photos ap on a.id = ap.answer_id
    WHERE q.product_id = ${productId} AND q.reported IN (0)`, 
    
    function(err, res) {
      if(err) {
        console.error('error running query', err);
        response.sendStatus(500);
        return;
      }
    
      let obj = {};
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
        }  

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
      let resultsValues = [];
      for (let i in obj) {
        resultsValues.push(obj[i]);
      }

      let resultObj = {
        product_id : productId,
        results: resultsValues
      }

      response.send(resultObj);
      })
    }
}
