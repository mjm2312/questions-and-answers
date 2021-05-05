const request = require('supertest');
const api_url = 'http://localhost:3001'

describe('Testing post qa add a question endpoint', () => {
  const req = request(api_url)
  const products_id = 111
  let data = {
      "body": "Do the shoes fit true to size?",
      "name": "matt",
      "email": "mm@gmail.com",
      "product_id": products_id
  }

  test('Should post a question and respond with a 201 created', async (done) => {
      const response = await req.post('/qa/questions').send(data);
      expect(response.status).toBe(201);
      expect(response.text).toBe('post ok');


      //confirm the question has been posted
      const questions = await request(api_url)
          .get('/qa/questions')
          .query(`product_id=${products_id}`)
      const { results } = questions.body
      const lastQuestion = results[results.length - 1]
      expect(data.body).toEqual(lastQuestion.question_body)
      expect(data.name).toEqual(lastQuestion.asker_name)
      done()
  }) 
});

describe('Testing post qa add an answer endpoint', () => {
  const req = request(api_url)
  let question_id = 35468
  let data = {
      "body": "Yes, it fits true to size",
      "name": "jenn Martinez",
      "email": "jmartinez@gmail.com",
      "photos": []
  }
  
  test('Should post an answer and respond with a 201 created', async (done) => {
      //post new answer to question id
      const response = await req.post(`/qa/questions/${question_id}/answers`).send(data);
      expect(response.status).toBe(201)

      // confirm that the answer has been posted
      const answers = await request(api_url).get(`/qa/questions/${question_id}/answers`)
      const { results } = answers.body
      const lastAnswer = results[results.length - 1]
      answerId = lastAnswer.answer_id
      expect(data.body).toEqual(lastAnswer.body)
      expect(data.name).toEqual(lastAnswer.answerer_name)
      expect(Array.isArray(lastAnswer.photos)).toBe(true);
      done()
  })

})