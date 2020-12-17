spinning up containers locally
echo "copying answers_photos..."
cat answers_photos_transformed.csv | psql -h localhost -U postgres -d matttest -c "COPY sdc.answers_photos FROM STDIN WITH DELIMITER ',' CSV HEADER";
echo "copying questions..."
cat questions_transformed.csv | psql -h localhost -U postgres -d matttest -c "COPY sdc.questions FROM STDIN WITH DELIMITER ',' CSV HEADER";
echo "copying answers..."
cat answers_transformed.csv | psql -h localhost -U postgres -d matttest -c "COPY sdc.answers FROM STDIN WITH DELIMITER ',' CSV HEADER";

#set chmod +x copy.sh from csv directory
#run with./copy.sh 

#spinning up containers on ec2
#echo "copying answers_photos..."
#cat answers_photos_transformed.csv | psql -h ec2-3-18-212-87.us-east-2.compute.amazonaws.com -U postgres -d matttest -c "COPY sdc.answers_photos FROM STDIN WITH DELIMITER ',' CSV HEADER";
#echo "copying questions..."
#cat questions_transformed.csv | psql -h ec2-3-18-212-87.us-east-2.compute.amazonaws.com -U postgres -d matttest -c "COPY sdc.questions FROM STDIN WITH DELIMITER ',' CSV HEADER";
#echo "copying answers..."
#cat answers_transformed.csv | psql -h ec2-18-220-103-44.us-east-2.compute.amazonaws.com -U postgres -d matttest -c "COPY sdc.answers FROM STDIN WITH DELIMITER ',' CSV HEADER";
