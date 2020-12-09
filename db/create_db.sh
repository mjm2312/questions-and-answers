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
echo "Creating schema...again"
psql -d matttest -a -U postgres -f /schema.sql





# echo "Copying answer_sphotos..."
# psql -d matttest -a -U postgres -f /schema.sql


#echo "Populating database..."
#psql -d ${DB_NAME} -a  -U${POSTGRES_USER} -f /data.sql