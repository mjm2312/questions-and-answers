#!/bin/bash
set -e

#POSTGRES_USER = 'postgres'
#DB_NAME = 'matttest'

#POSTGRES="psql --username ${POSTGRES_USER}"
POSTGRES="psql --username postgres"

#echo "Creating database: ${DB_NAME}"
echo "Creating database: matttest"

#$POSTGRES <<EOSQL
#CREATE DATABASE ${DB_NAME} OWNER ${POSTGRES_USER};
#EOSQL

$POSTGRES <<EOSQL
CREATE DATABASE matttest OWNER ${POSTGRES_USER};
EOSQL

#echo "Creating schema..."
#psql -d ${DB_NAME} -a -U${POSTGRES_USER} -f /schema.sql

#echo "Creating schema..."
#psql -d matttest -a -U postgres -f /schema.sql
#changing to ./schema.sql because docker-compose said this is a directory (this worked uncomposed)


#supressing next two lines just to test kubernetes, may need to unsuppress later
#this was causing an error when running in K8s. it said it couldn't find this file.
#but when u suppressed it, looks like K8s picked up this script as part of docker entrypoint initdb.d/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/schema.sql
#echo "Creating schema...again"
#psql -d matttest -a -U postgres -f /schema.sql

#after making the above change, it created the schema in the public schema
#so gonna add a line in schema.sql to use the matttest database
echo "Testing if this uses matttest db when execetung schema.sql"
psql -d matttest -a -U postgres
echo "printing working dir"
echo "`pwd`"
for entry in "$search_dir"/*
do
  echo "$entry"
done

#echo "seeing if can create schema from other entrypoint ..."
#psql -d matttest -a -U postgres -f /schema.sql

echo "1.02: looks like schema.sql lives in db/"
psql -d matttest -a -U postgres -f ./db/schema.sql




# echo "Copying answer_sphotos..."
# psql -d matttest -a -U postgres -f /schema.sql


#echo "Populating database..."
#psql -d ${DB_NAME} -a  -U${POSTGRES_USER} -f /data.sql