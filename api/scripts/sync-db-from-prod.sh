#!/usr/bin/env bash
# Syncs the production database down to the local development database.
# Usage: bash scripts/sync-db-from-prod.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

PROD_URL="$(grep '^DATABASE_URL=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')"

if [ -z "$PROD_URL" ]; then
  echo "Error: DATABASE_URL not found in $ENV_FILE"
  exit 1
fi

LOCAL_URL="postgresql://postgres:localdev@localhost:5432/gym_dev"

echo "Dumping production database..."
pg_dump "$PROD_URL" --no-owner --no-acl -Fc -f /tmp/gym_prod_dump.dump

echo "Restoring to local database..."
pg_restore --no-owner --no-acl --clean --if-exists -d "$LOCAL_URL" /tmp/gym_prod_dump.dump || true

rm /tmp/gym_prod_dump.dump

echo "Done. Local DB is now in sync with production."
