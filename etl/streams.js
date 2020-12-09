const csv = require("csv-parser");
const fs = require('fs');
// const Transform = require("stream").Transform;

const {TransformAnswersPhotos, csvStringifierAnswersPhotos} = require('./transformers/answersPhotos')
const {TransformAnswers, csvStringifierAnswers} = require('./transformers/answers')
const {TransformQuestions, csvStringifierQuestions} = require('./transformers/questions')



let streamer = (inputFile, outputFile, transformClass, csvStringifier) => {
  let readStream = fs.createReadStream(`/Users/mattmartin/Downloads/${inputFile}`);
  let writeStream = fs.createWriteStream(`/Users/mattmartin/HackReactor/questions-and-answers/csv/${outputFile}`);

  const transformer = new transformClass({ writableObjectMode: true });

  //write header
  writeStream.write(csvStringifier.getHeaderString());

  readStream
    .pipe(csv())
    .pipe(transformer)
    .pipe(writeStream)
    .on("finish", () => {
      console.log(`finished writing ${outputFile}`);
    });
}

streamer('answers_photos.csv', 'answers_photos_transformed.csv', TransformAnswersPhotos, csvStringifierAnswersPhotos);
streamer('answers.csv', 'answers_transformed.csv', TransformAnswers, csvStringifierAnswers);
streamer('questions.csv', 'questions_transformed.csv', TransformQuestions, csvStringifierQuestions);