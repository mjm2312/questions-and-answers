CREATE SCHEMA IF NOT EXISTS sdc;

SET search_path TO sdc;


CREATE TABLE IF NOT EXISTS answers_photos (
  id integer, 
  answer_id integer,
  photo_url varchar
);

CREATE TABLE IF NOT EXISTS answers (
  id integer, 
  question_id integer,
  body varchar,
  date_written date,
  answerer_name varchar,
  answerer_email varchar,
  reported integer,
  helpful integer
);

CREATE TABLE IF NOT EXISTS questions (
  id integer, 
  product_id integer,
  body varchar,
  date_written date,
  asker_name varchar,
  asker_email varchar,
  reported integer,
  helpful integer
);

CREATE INDEX question_id on sdc.questions (id);
CREATE INDEX product_id on sdc.questions (product_id);

CREATE INDEX answers_photos_id on sdc.answers_photos (id);
CREATE INDEX answers_photos_answer_id on sdc.answers_photos (answer_id);

CREATE INDEX answer_id on sdc.answers (id);
-- you already have one called question_id CREATE INDEX question_id on sdc.answers (question_id);
CREATE INDEX answer_question_id on sdc.answers (question_id)


