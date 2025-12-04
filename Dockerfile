# Use official lightweight Alpine base
FROM postgres:17-alpine

# Labels
LABEL maintainer="your-email@example.com"
LABEL description="Custom PostgreSQL 17 for myapp"

# Install any additional extensions if needed (e.g., postgis, pgcrypto already included in most cases)
# RUN apk add --no-cache postgresql17-plpython3 postgresql17-pgvector etc.

# Copy custom configuration (optional)
# COPY postgresql.conf /etc/postgresql/postgresql.conf
# COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Copy initialization scripts (run once on first start)
# COPY init-db.sh /docker-entrypoint-initdb.d/01-init.sh
# RUN chmod +x /docker-entrypoint-initdb.d/01-init.sh

# Expose port (already done by base image)
EXPOSE 5452

# Default command from base image
CMD ["postgres"]