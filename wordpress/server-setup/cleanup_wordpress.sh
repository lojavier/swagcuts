#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/install.env"

if [[ $(id -u) -ne 0 ]]; then
  echo "Run as root: sudo ./cleanup_wordpress.sh"
  exit 1
fi

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
fi

SITE_ROOT="${SITE_ROOT:-/var/www/swagcuts}"
DB_NAME="${DB_NAME:-swagcuts_wp}"
DB_USER="${DB_USER:-admin}"
DB_ROOT_USER="${DB_ROOT_USER:-root}"
DB_ROOT_PASS="${DB_ROOT_PASS:-}"
NGINX_CONF="/etc/nginx/sites-available/swagcuts"
NGINX_ENABLED="/etc/nginx/sites-enabled/swagcuts"

REMOVE_SITE="${REMOVE_SITE:-yes}"
REMOVE_DB="${REMOVE_DB:-yes}"
REMOVE_NGINX="${REMOVE_NGINX:-yes}"
DRY_RUN="${DRY_RUN:-no}"
BACKUP_BEFORE_CLEANUP="${BACKUP_BEFORE_CLEANUP:-no}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/swagcuts}"
BACKUP_DB="${BACKUP_DB:-yes}"
BACKUP_SITE="${BACKUP_SITE:-yes}"
BACKUP_SITE_PATH="${BACKUP_SITE_PATH:-}"

if [[ "${SITE_ROOT}" != /* ]]; then
  echo "SITE_ROOT must be an absolute path. Got '${SITE_ROOT}'."
  exit 1
fi

SITE_ROOT_REAL="$(realpath -m "${SITE_ROOT}")"
if [[ -z "${SITE_ROOT_REAL}" || "${SITE_ROOT_REAL}" == "/" || "${SITE_ROOT_REAL}" == "/var" || "${SITE_ROOT_REAL}" == "/var/www" ]]; then
  echo "Refusing to remove SITE_ROOT='${SITE_ROOT}'. Set a safe SITE_ROOT in install.env."
  exit 1
fi

echo "Cleanup plan:"
echo "- SITE_ROOT: ${SITE_ROOT_REAL} (REMOVE_SITE=${REMOVE_SITE})"
echo "- DB_NAME:   ${DB_NAME} (REMOVE_DB=${REMOVE_DB})"
echo "- DB_USER:   ${DB_USER} (REMOVE_DB=${REMOVE_DB})"
echo "- Nginx:     ${NGINX_CONF} (REMOVE_NGINX=${REMOVE_NGINX})"
echo "- DRY_RUN:   ${DRY_RUN}"
echo "- BACKUP:    ${BACKUP_BEFORE_CLEANUP} (DIR=${BACKUP_DIR})"
echo
echo "This is destructive. Type DELETE to continue:"
read -r confirm
if [[ "${confirm}" != "DELETE" ]]; then
  echo "Aborted."
  exit 1
fi

if [[ "${BACKUP_BEFORE_CLEANUP}" == "yes" ]]; then
  if [[ "${BACKUP_DIR}" != /* ]]; then
    echo "BACKUP_DIR must be an absolute path. Got '${BACKUP_DIR}'."
    exit 1
  fi

  timestamp="$(date +%Y%m%d-%H%M%S)"
  if [[ "${DRY_RUN}" == "yes" ]]; then
    echo "DRY RUN: mkdir -p ${BACKUP_DIR}"
  else
    mkdir -p "${BACKUP_DIR}"
  fi

  if [[ "${BACKUP_DB}" == "yes" && -n "${DB_NAME}" ]]; then
    backup_db_path="${BACKUP_DIR}/db-${DB_NAME}-${timestamp}.sql.gz"
    if [[ "${DRY_RUN}" == "yes" ]]; then
      echo "DRY RUN: mysqldump ${DB_NAME} | gzip > ${backup_db_path}"
    else
      if command -v mysqldump >/dev/null 2>&1; then
        if [[ -n "${DB_ROOT_PASS}" ]]; then
          MYSQL_PWD="${DB_ROOT_PASS}" mysqldump -u "${DB_ROOT_USER}" "${DB_NAME}" | gzip > "${backup_db_path}" || echo "Warning: DB backup failed."
        else
          mysqldump -u "${DB_ROOT_USER}" "${DB_NAME}" | gzip > "${backup_db_path}" || echo "Warning: DB backup failed."
        fi
      else
        echo "Warning: mysqldump not found; skipping DB backup."
      fi
    fi
  fi

  if [[ "${BACKUP_SITE}" == "yes" ]]; then
    site_backup_path="${BACKUP_DIR}/site-${timestamp}.tar.gz"
    site_source="${BACKUP_SITE_PATH:-${SITE_ROOT_REAL}/wp-content}"
    if [[ "${DRY_RUN}" == "yes" ]]; then
      echo "DRY RUN: tar -czf ${site_backup_path} -C $(dirname "${site_source}") $(basename "${site_source}")"
    else
      if [[ -e "${site_source}" ]]; then
        tar -czf "${site_backup_path}" -C "$(dirname "${site_source}")" "$(basename "${site_source}")"
      else
        echo "Warning: backup source not found: ${site_source}"
      fi
    fi
  fi
fi

if [[ "${REMOVE_SITE}" == "yes" && -d "${SITE_ROOT_REAL}" ]]; then
  if [[ "${DRY_RUN}" == "yes" ]]; then
    echo "DRY RUN: rm -rf ${SITE_ROOT_REAL}"
  else
    rm -rf "${SITE_ROOT_REAL}"
  fi
fi

if [[ "${REMOVE_DB}" == "yes" && -n "${DB_NAME}" ]]; then
  if [[ "${DRY_RUN}" == "yes" ]]; then
    echo "DRY RUN: drop database ${DB_NAME} and user ${DB_USER}"
  else
    sql="DROP DATABASE IF EXISTS ${DB_NAME};"
    if [[ -n "${DB_USER}" ]]; then
      sql="${sql}
DROP USER IF EXISTS '${DB_USER}'@'localhost';"
    fi
    sql="${sql}
FLUSH PRIVILEGES;"

    if [[ -n "${DB_ROOT_PASS}" ]]; then
      MYSQL_PWD="${DB_ROOT_PASS}" mysql -u "${DB_ROOT_USER}" <<<"${sql}" || echo "Warning: DB cleanup failed."
    else
      mysql -u "${DB_ROOT_USER}" <<<"${sql}" || echo "Warning: DB cleanup failed."
    fi
  fi
fi

if [[ "${REMOVE_NGINX}" == "yes" ]]; then
  if [[ "${DRY_RUN}" == "yes" ]]; then
    echo "DRY RUN: rm -f ${NGINX_ENABLED} ${NGINX_CONF}"
  else
    rm -f "${NGINX_ENABLED}" "${NGINX_CONF}"
    if command -v nginx >/dev/null 2>&1; then
      if nginx -t; then
        systemctl reload nginx
      else
        echo "Warning: nginx config test failed; not reloading."
      fi
    fi
  fi
fi

echo "Cleanup complete."
