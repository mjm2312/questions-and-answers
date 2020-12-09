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

    // //filters out all non-number characters
    // let onlyNumbers = chunk.default_price.replace(/\D/g, "");
    // chunk.default_price = onlyNumbers;
    // //uses our csvStringifier to turn our chunk into a csv string

//skip if no id, question_id, product id;
    if (chunk.id === undefined || chunk.product_id === undefined || chunk.body === undefined) {
      next();
    }

    chunk = csvStringifierQuestions.stringifyRecords([chunk]);
    //console.log('after', chunk)





    this.push(chunk);
    next();
  }


}

module.exports = {TransformQuestions, csvStringifierQuestions}