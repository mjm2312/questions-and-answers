const Transform = require("stream").Transform;
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

const csvStringifierAnswers = createCsvStringifier({
  header: [
    { id: "id", title: "id" },
    { id: "question_id", title: "question_id" },
    { id: "body", title: "body" },
    { id: "date_written", title: "date_written" },
    { id: "answerer_name", title: "answerer_name" },
    { id: "answerer_email", title: "answerer_email" },
    { id: "reported", title: "reported" },
    { id: "helpful", title: "helpful" },
  ],
});

class TransformAnswers extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    for (let key in chunk) {
      //trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }

    //skip if no id, question_id
    if (chunk.id === undefined || chunk.question_id === undefined) {
      next();
    }

    chunk = csvStringifierAnswers.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

module.exports = {TransformAnswers, csvStringifierAnswers}