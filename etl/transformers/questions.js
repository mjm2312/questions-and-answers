const Transform = require("stream").Transform;
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

const csvStringifierQuestions = createCsvStringifier({
  header: [
    { id: "id", title: "id" },
    { id: "product_id", title: "product_id" },
    { id: "body", title: "body" },
    { id: "date_written", title: "date_written" },
    { id: "asker_name", title: "asker_name" },
    { id: "asker_email", title: "asker_email" },
    { id: "reported", title: "reported" },
    { id: "helpful", title: "helpful" },
  ],
});

class TransformQuestions extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    //console.log('before', chunk)
    
    for (let key in chunk) {
      //trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }

    if (chunk.id === undefined || chunk.product_id === undefined || chunk.body === undefined) {
      next();
    }

    chunk = csvStringifierQuestions.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

module.exports = {TransformQuestions, csvStringifierQuestions}