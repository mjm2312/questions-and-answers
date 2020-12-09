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

    // //filters out all non-number characters
    // let onlyNumbers = chunk.default_price.replace(/\D/g, "");
    // chunk.default_price = onlyNumbers;
    // //uses our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifierAnswersPhotos.stringifyRecords([chunk]);
    //console.log('after', chunk)

    this.push(chunk);
    next();
  }


}

module.exports = {TransformAnswersPhotos, csvStringifierAnswersPhotos}