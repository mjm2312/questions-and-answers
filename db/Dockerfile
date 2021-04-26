FROM postgres:13
RUN mkdir db

ENV POSTGRES_HOST_AUTH_METHOD=trust
#ENV POSTGRES_PASSWORD = ${POSTGRES_PASSWORD}

#custom initialization scripts
COPY ./create_db.sh /docker-entrypoint-initdb.d/create_db.sh
COPY schema.sql db/schema.sql

RUN chmod +x /docker-entrypoint-initdb.d/create_db.sh