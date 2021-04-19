#FROM postgres:11
# RUN mkdir /sql
# COPY ./schema.sql /sql/
# # RUN psql -f /sql/create_user.sql
# # RUN psql -U user -W 123 -f create_db.sql
# # RUN psql -U user -W 123 -d school_ats -f create_tables.sql

# #RUN export PGPASSWORD=postgres psql -U postgres -d -f /sql/schema.sqldoc
# #RUN PGPASSWORD=postgres psql -U postgres postgres -f /sql/schema.sql
# RUN psql -U postgres postgres

FROM postgres:11
RUN mkdir db

ENV POSTGRES_HOST_AUTH_METHOD=trust
# Custom initialization scripts
#COPY answers_photos_transformed.csv /answers_photos_transformed.csv
COPY ./create_db.sh /docker-entrypoint-initdb.d/20-create_db.sh
COPY schema.sql db/schema.sql

#COPY data.sql /data.sql

RUN chmod +x /docker-entrypoint-initdb.d/20-create_db.sh