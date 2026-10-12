#!/usr/bin/env bash
set -euo pipefail

npm run check:env
npm run db:push
npm run seed:catalog
npm run seed:staff

echo "MYPOOLquote setup completed."
