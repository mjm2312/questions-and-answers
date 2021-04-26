set -e

DB_NAME='questions_answers'
POSTGRES="psql --username postgres"
echo "Creating database: $DB_NAME"

#why do you need {} around POSTGRES_USER?
$POSTGRES <<EOSQL
CREATE DATABASE questions_answers OWNER ${POSTGRES_USER}; 
EOSQL

psql -d $DB_NAME -a -U postgres -f ../db/schema.sql










# #!/bin/bash
# set -e

# DB_NAME='questions_answers'
# POSTGRES="set PGPASSWORD=postgres&& psql --username postgres"
# echo "Creating database: $DB_NAME"

# $POSTGRES&& echo "done------" <<EOSQL
# CREATE DATABASE questions_answers OWNER $POSTGRES_USER;
# GRANT ALL PRIVILEGES ON DATABASE questions_answers TO $POSTGRES_USER;
# EOSQL

# #psql -d $DB_NAME -a -U postgres -f ../db/schema.sql


