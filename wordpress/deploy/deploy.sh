#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/deploy.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy deploy.env.example to deploy.env and edit values."
  exit 1
fi

# shellcheck disable=SC1090
source "${ENV_FILE}"

LOCAL_WP_CONTENT="${SCRIPT_DIR}/wp-content"

if [[ ! -d "${LOCAL_WP_CONTENT}" ]]; then
  echo "Missing ${LOCAL_WP_CONTENT}. Create deploy/wp-content and add your files."
  exit 1
fi

if [[ -z "${REMOTE_USER:-}" || -z "${REMOTE_HOST:-}" || -z "${REMOTE_WP_CONTENT:-}" ]]; then
  echo "REMOTE_USER, REMOTE_HOST, and REMOTE_WP_CONTENT must be set in deploy.env."
  exit 1
fi

SSH_PORT="${SSH_PORT:-22}"
RSYNC_OPTS="${RSYNC_OPTS:--avz}"

rsync ${RSYNC_OPTS} \
  -e "ssh -p ${SSH_PORT}" \
  "${LOCAL_WP_CONTENT}/" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_WP_CONTENT}/"

echo "Deploy complete."
