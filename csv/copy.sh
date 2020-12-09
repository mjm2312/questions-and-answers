echo "copying answers_photos..."
cat answers_photos_transformed.csv | psql -h localhost -U postgres -d matttest -c "COPY sdc.answers_photos FROM STDIN WITH DELIMITER ',' CSV HEADER";
echo "copying questions..."
cat questions_transformed.csv | psql -h localhost -U postgres -d matttest -c "COPY sdc.questions FROM STDIN WITH DELIMITER ',' CSV HEADER";
echo "copying answers..."
cat answers_transformed.csv | psql -h localhost -U postgres -d matttest -c "COPY sdc.answers FROM STDIN WITH DELIMITER ',' CSV HEADER";

#set chmod +x copy.sh from csv directory
#run with./copy.sh 