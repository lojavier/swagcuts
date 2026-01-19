#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/install.env"

if [[ $(id -u) -ne 0 ]]; then
  echo "Run as root: sudo ./install_wordpress.sh"
  exit 1
fi

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
fi

DOMAIN="${DOMAIN:-swagcuts.com}"
WP_URL="${WP_URL:-http://${DOMAIN}}"
WP_URL="${WP_URL%/}"
DEV_HOSTS="${DEV_HOSTS:-}"
NGINX_CLIENT_MAX_BODY_SIZE="${NGINX_CLIENT_MAX_BODY_SIZE:-64M}"
SITE_ROOT="${SITE_ROOT:-/var/www/swagcuts}"
DB_NAME="${DB_NAME:-swagcuts_wp}"
DB_USER="${DB_USER:-swagcuts}"
DB_PASS="${DB_PASS:-}"
WP_TITLE="${WP_TITLE:-Swag Cuts Grooming}"
WP_ADMIN_USER="${WP_ADMIN_USER:-}"
WP_ADMIN_PASS="${WP_ADMIN_PASS:-}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-}"
WP_MEMORY_LIMIT="${WP_MEMORY_LIMIT:-256M}"
WP_MAX_MEMORY_LIMIT="${WP_MAX_MEMORY_LIMIT:-512M}"
DISALLOW_FILE_EDIT="${DISALLOW_FILE_EDIT:-true}"
WP_FS_METHOD="${WP_FS_METHOD:-}"
ENABLE_SSL="${ENABLE_SSL:-yes}"
LE_EMAIL="${LE_EMAIL:-}"
THEME_ZIP_PATH="${THEME_ZIP_PATH:-}"
CHILD_THEME_ZIP_PATH="${CHILD_THEME_ZIP_PATH:-}"
TRX_ADDONS_ZIP_PATH="${TRX_ADDONS_ZIP_PATH:-}"
THEMEREX_UPDATER_ZIP_PATH="${THEMEREX_UPDATER_ZIP_PATH:-}"
INSTALL_TRX_ADDONS="${INSTALL_TRX_ADDONS:-no}"
PLUGINS_TO_INSTALL="${PLUGINS_TO_INSTALL:-}"
PHP_MAX_EXECUTION_TIME="${PHP_MAX_EXECUTION_TIME:-600}"
PHP_MAX_INPUT_TIME="${PHP_MAX_INPUT_TIME:-600}"
PHP_MEMORY_LIMIT="${PHP_MEMORY_LIMIT:-256M}"
PHP_POST_MAX_SIZE="${PHP_POST_MAX_SIZE:-32M}"
PHP_UPLOAD_MAX_FILESIZE="${PHP_UPLOAD_MAX_FILESIZE:-32M}"
PHP_MAX_INPUT_VARS="${PHP_MAX_INPUT_VARS:-3000}"

prompt_if_empty() {
  local var_name="$1"
  local prompt_text="$2"
  local is_secret="${3:-no}"
  local current_value="${!var_name:-}"

  if [[ -n "$current_value" ]]; then
    return
  fi

  if [[ "$is_secret" == "yes" ]]; then
    read -r -s -p "${prompt_text}: " current_value
    echo
  else
    read -r -p "${prompt_text}: " current_value
  fi

  export "$var_name=$current_value"
}

prompt_if_empty DB_PASS "Enter MariaDB password for ${DB_USER}" yes
prompt_if_empty WP_ADMIN_USER "Enter WP admin username" no
prompt_if_empty WP_ADMIN_PASS "Enter WP admin password" yes
prompt_if_empty WP_ADMIN_EMAIL "Enter WP admin email" no

if [[ "$ENABLE_SSL" == "yes" ]]; then
  prompt_if_empty LE_EMAIL "Enter Let's Encrypt email" no
fi

apt update && apt upgrade -y
apt install -y nginx mariadb-server php-fpm php-cli php-mysql php-xml php-gd php-curl php-zip php-mbstring php-intl php-opcache php-bcmath unzip curl rsync

systemctl enable --now nginx
systemctl enable --now mariadb

mysql -u root <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

mkdir -p "${SITE_ROOT}"
if [[ ! -f "${SITE_ROOT}/wp-settings.php" ]]; then
  cd /tmp
  curl -LO https://wordpress.org/latest.tar.gz
  tar -xzf latest.tar.gz
  rsync -avP wordpress/ "${SITE_ROOT}/"
fi

chown -R www-data:www-data "${SITE_ROOT}"
find "${SITE_ROOT}" -type d -exec chmod 755 {} \;
find "${SITE_ROOT}" -type f -exec chmod 644 {} \;

if ! command -v wp >/dev/null 2>&1; then
  curl -sSLo /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
  chmod +x /usr/local/bin/wp
fi

if [[ ! -f "${SITE_ROOT}/wp-config.php" ]]; then
  wp config create \
    --path="${SITE_ROOT}" \
    --dbname="${DB_NAME}" \
    --dbuser="${DB_USER}" \
    --dbpass="${DB_PASS}" \
    --dbhost="localhost" \
    --skip-check \
    --allow-root

  wp config shuffle-salts --path="${SITE_ROOT}" --allow-root
fi

wp config set WP_MEMORY_LIMIT "${WP_MEMORY_LIMIT}" --type=constant --path="${SITE_ROOT}" --allow-root
wp config set WP_MAX_MEMORY_LIMIT "${WP_MAX_MEMORY_LIMIT}" --type=constant --path="${SITE_ROOT}" --allow-root
if [[ "${DISALLOW_FILE_EDIT}" == "true" ]]; then
  wp config set DISALLOW_FILE_EDIT true --type=constant --raw --path="${SITE_ROOT}" --allow-root
fi

if [[ -n "${WP_FS_METHOD}" ]]; then
  wp config set FS_METHOD "${WP_FS_METHOD}" --type=constant --path="${SITE_ROOT}" --allow-root
fi

if ! wp core is-installed --path="${SITE_ROOT}" --allow-root >/dev/null 2>&1; then
  wp core install \
    --path="${SITE_ROOT}" \
    --url="${WP_URL}" \
    --title="${WP_TITLE}" \
    --admin_user="${WP_ADMIN_USER}" \
    --admin_password="${WP_ADMIN_PASS}" \
    --admin_email="${WP_ADMIN_EMAIL}" \
    --skip-email \
    --allow-root
fi

if wp core is-installed --path="${SITE_ROOT}" --allow-root >/dev/null 2>&1; then
  wp option update home "${WP_URL}" --path="${SITE_ROOT}" --allow-root
  wp option update siteurl "${WP_URL}" --path="${SITE_ROOT}" --allow-root
fi

php_version=$(php -r 'echo PHP_MAJOR_VERSION . "." . PHP_MINOR_VERSION;')
php_sock="/run/php/php${php_version}-fpm.sock"
if [[ ! -S "$php_sock" ]]; then
  echo "PHP-FPM socket not found at $php_sock"
  exit 1
fi

php_ini_dir="/etc/php/${php_version}"
php_ini_fpm="${php_ini_dir}/fpm/conf.d/99-swagcuts.ini"
php_ini_cli="${php_ini_dir}/cli/conf.d/99-swagcuts.ini"

cat > "${php_ini_fpm}" <<EOF
; Swag Cuts tuning
max_execution_time = ${PHP_MAX_EXECUTION_TIME}
max_input_time = ${PHP_MAX_INPUT_TIME}
memory_limit = ${PHP_MEMORY_LIMIT}
post_max_size = ${PHP_POST_MAX_SIZE}
upload_max_filesize = ${PHP_UPLOAD_MAX_FILESIZE}
max_input_vars = ${PHP_MAX_INPUT_VARS}
EOF

if [[ -d "${php_ini_dir}/cli/conf.d" ]]; then
  cp "${php_ini_fpm}" "${php_ini_cli}"
fi

systemctl reload "php${php_version}-fpm" || systemctl restart "php${php_version}-fpm"

nginx_template="${SCRIPT_DIR}/nginx-swagcuts.conf.template"
nginx_conf="/etc/nginx/sites-available/swagcuts"

sed \
  -e "s|{{DOMAIN}}|${DOMAIN}|g" \
  -e "s|{{SITE_ROOT}}|${SITE_ROOT}|g" \
  -e "s|{{PHP_FPM_SOCK}}|${php_sock}|g" \
  -e "s|{{DEV_HOSTS}}|${DEV_HOSTS}|g" \
  -e "s|{{CLIENT_MAX_BODY_SIZE}}|${NGINX_CLIENT_MAX_BODY_SIZE}|g" \
  "${nginx_template}" > "${nginx_conf}"

rm -f /etc/nginx/sites-enabled/default
ln -sf "${nginx_conf}" /etc/nginx/sites-enabled/swagcuts
nginx -t
systemctl reload nginx

if [[ -n "${THEME_ZIP_PATH}" && -f "${THEME_ZIP_PATH}" ]]; then
  unzip -o "${THEME_ZIP_PATH}" -d "${SITE_ROOT}/wp-content/themes"
fi

if [[ -n "${CHILD_THEME_ZIP_PATH}" && -f "${CHILD_THEME_ZIP_PATH}" ]]; then
  unzip -o "${CHILD_THEME_ZIP_PATH}" -d "${SITE_ROOT}/wp-content/themes"
fi

if [[ -d "${SITE_ROOT}/wp-content/themes/pets-grooming-child" ]]; then
  wp theme activate pets-grooming-child --path="${SITE_ROOT}" --allow-root || true
elif [[ -d "${SITE_ROOT}/wp-content/themes/pets-grooming" ]]; then
  wp theme activate pets-grooming --path="${SITE_ROOT}" --allow-root || true
fi

if [[ -n "${TRX_ADDONS_ZIP_PATH}" && -f "${TRX_ADDONS_ZIP_PATH}" ]]; then
  wp plugin install "${TRX_ADDONS_ZIP_PATH}" --activate --path="${SITE_ROOT}" --allow-root || true
elif [[ "${INSTALL_TRX_ADDONS}" == "yes" ]]; then
  wp plugin install trx_addons --activate --path="${SITE_ROOT}" --allow-root || true
fi

if [[ -n "${THEMEREX_UPDATER_ZIP_PATH}" && -f "${THEMEREX_UPDATER_ZIP_PATH}" ]]; then
  wp plugin install "${THEMEREX_UPDATER_ZIP_PATH}" --activate --path="${SITE_ROOT}" --allow-root || true
fi

if [[ -n "${PLUGINS_TO_INSTALL}" ]]; then
  for plugin in ${PLUGINS_TO_INSTALL}; do
    wp plugin install "${plugin}" --activate --path="${SITE_ROOT}" --allow-root || true
  done
fi

wp option update permalink_structure "/%postname%/" --path="${SITE_ROOT}" --allow-root
wp rewrite flush --path="${SITE_ROOT}" --allow-root

chown -R www-data:www-data "${SITE_ROOT}"

if [[ "${ENABLE_SSL}" == "yes" ]]; then
  apt install -y certbot python3-certbot-nginx
  certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" \
    --non-interactive --agree-tos -m "${LE_EMAIL}" --redirect || true
fi

cat <<EOF
Done. Visit ${WP_URL} and ${WP_URL}/wp-admin

Next steps:
- Activate the theme license in WP admin: Theme Panel > Theme Dashboard > General
- Install/activate required plugins (ThemeREX Addons, Elementor, WooCommerce, MetForm)
- Import demo content: Theme Panel > Theme Dashboard > Demo Data
- Set homepage: Settings > Reading
EOF
