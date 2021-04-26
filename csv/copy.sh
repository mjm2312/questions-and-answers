#AWS k8s
#PG_HOST=34.212.188.244
#PG_PORT=32706
#PG_USER=postgres
#PG_DB=questions_answers

#docker-compose
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_DB=questions_answers

echo "copying answers_photos..."
cat answers_photos_transformed.csv | psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DB -c "COPY sdc.answers_photos FROM STDIN WITH DELIMITER ',' CSV HEADER";
echo "copying questions..."
cat questions_transformed.csv | psql -h $PG_HOST -p $PG_PORT -U $PG_USER  -d $PG_DB -c "COPY sdc.questions FROM STDIN WITH DELIMITER ',' CSV HEADER";
echo "copying answers..."
cat answers_transformed.csv | psql -h $PG_HOST -p $PG_PORT -U $PG_USER  -d $PG_DB -c "COPY sdc.answers FROM STDIN WITH DELIMITER ',' CSV HEADER";



