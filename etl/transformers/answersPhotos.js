const Transform = require("stream").Transform;
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

const csvStringifierAnswersPhotos = createCsvStringifier({
  header: [
    { id: "id", title: "id" },
    { id: "answer_id", title: "answer_id" },
    { id: "url", title: "url" },
  ],
});

class TransformAnswersPhotos extends Transform {
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

    chunk = csvStringifierAnswersPhotos.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

module.exports = {TransformAnswersPhotos, csvStringifierAnswersPhotos}