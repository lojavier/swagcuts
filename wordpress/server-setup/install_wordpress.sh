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
DB_ROOT_USER="${DB_ROOT_USER:-root}"
DB_ROOT_PASS="${DB_ROOT_PASS:-}"
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
THEME_SLUG="${THEME_SLUG:-pets-grooming}"
CHILD_THEME_SLUG="${CHILD_THEME_SLUG:-pets-grooming-child}"
TRX_ADDONS_ZIP_PATH="${TRX_ADDONS_ZIP_PATH:-}"
THEMEREX_UPDATER_ZIP_PATH="${THEMEREX_UPDATER_ZIP_PATH:-}"
INSTALL_TRX_ADDONS="${INSTALL_TRX_ADDONS:-no}"
AUTO_FIND_BUNDLED_PLUGINS="${AUTO_FIND_BUNDLED_PLUGINS:-yes}"
PLUGINS_TO_INSTALL="${PLUGINS_TO_INSTALL:-}"
PHP_MAX_EXECUTION_TIME="${PHP_MAX_EXECUTION_TIME:-600}"
PHP_MAX_INPUT_TIME="${PHP_MAX_INPUT_TIME:-600}"
PHP_MEMORY_LIMIT="${PHP_MEMORY_LIMIT:-256M}"
PHP_POST_MAX_SIZE="${PHP_POST_MAX_SIZE:-32M}"
PHP_UPLOAD_MAX_FILESIZE="${PHP_UPLOAD_MAX_FILESIZE:-32M}"
PHP_MAX_INPUT_VARS="${PHP_MAX_INPUT_VARS:-3000}"
PHP_OPCACHE_ENABLE="${PHP_OPCACHE_ENABLE:-1}"
PHP_OPCACHE_MEMORY_CONSUMPTION="${PHP_OPCACHE_MEMORY_CONSUMPTION:-128}"
PHP_OPCACHE_MAX_ACCELERATED_FILES="${PHP_OPCACHE_MAX_ACCELERATED_FILES:-10000}"
PHP_OPCACHE_VALIDATE_TIMESTAMPS="${PHP_OPCACHE_VALIDATE_TIMESTAMPS:-1}"
PHP_OPCACHE_REVALIDATE_FREQ="${PHP_OPCACHE_REVALIDATE_FREQ:-2}"
SET_TIMEZONE="${SET_TIMEZONE:-}"
ENABLE_UFW="${ENABLE_UFW:-no}"
UFW_SSH_PORT="${UFW_SSH_PORT:-22}"
ENABLE_FAIL2BAN="${ENABLE_FAIL2BAN:-no}"
ENABLE_UNATTENDED_UPGRADES="${ENABLE_UNATTENDED_UPGRADES:-no}"
SWAP_SIZE="${SWAP_SIZE:-}"
SWAP_PATH="${SWAP_PATH:-/swapfile}"
RUN_MYSQL_SECURE_INSTALLATION="${RUN_MYSQL_SECURE_INSTALLATION:-no}"
SKIP_APT_UPGRADE="${SKIP_APT_UPGRADE:-no}"
NGINX_FASTCGI_READ_TIMEOUT="${NGINX_FASTCGI_READ_TIMEOUT:-300}"
NGINX_FASTCGI_SEND_TIMEOUT="${NGINX_FASTCGI_SEND_TIMEOUT:-300}"
PLUGIN_INSTALL_RETRIES="${PLUGIN_INSTALL_RETRIES:-2}"
BUNDLED_TMP_DIR=""

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

log() {
  echo "==> $*"
}

warn() {
  echo "Warning: $*" >&2
}

run_mysql() {
  local sql="$1"
  if [[ -n "${DB_ROOT_PASS}" ]]; then
    MYSQL_PWD="${DB_ROOT_PASS}" mysql -u "${DB_ROOT_USER}" <<<"${sql}"
  else
    mysql -u "${DB_ROOT_USER}" <<<"${sql}"
  fi
}

install_plugin_with_retries() {
  local plugin_ref="$1"
  local attempts="${PLUGIN_INSTALL_RETRIES}"
  local attempt=1

  while true; do
    if wp plugin install "${plugin_ref}" --activate --path="${SITE_ROOT}" --allow-root; then
      return 0
    fi
    if (( attempt >= attempts )); then
      warn "Plugin install failed: ${plugin_ref}"
      return 1
    fi
    warn "Retrying plugin install (${attempt}/${attempts}): ${plugin_ref}"
    attempt=$((attempt + 1))
    sleep 2
  done
}

cleanup_tmp() {
  if [[ -n "${BUNDLED_TMP_DIR}" && -d "${BUNDLED_TMP_DIR}" ]]; then
    rm -rf "${BUNDLED_TMP_DIR}"
  fi
}

find_bundled_zip() {
  local name="$1"
  local found=""

  if [[ -n "${THEME_ZIP_PATH}" ]]; then
    local theme_dir
    theme_dir="$(dirname "${THEME_ZIP_PATH}")"
    if [[ -f "${theme_dir}/${name}.zip" ]]; then
      echo "${theme_dir}/${name}.zip"
      return 0
    fi
    if [[ -f "${theme_dir}/plugins.zip" ]]; then
      BUNDLED_TMP_DIR="${BUNDLED_TMP_DIR:-$(mktemp -d -t swagcuts-plugins-XXXXXX)}"
      unzip -q -j "${theme_dir}/plugins.zip" "*${name}*.zip" -d "${BUNDLED_TMP_DIR}" || true
      found="$(find "${BUNDLED_TMP_DIR}" -maxdepth 1 -type f -name "${name}*.zip" | head -n 1)"
      if [[ -n "${found}" ]]; then
        echo "${found}"
        return 0
      fi
    fi
  fi

  if [[ -d "${SITE_ROOT}/wp-content/themes/${THEME_SLUG}" ]]; then
    found="$(find "${SITE_ROOT}/wp-content/themes/${THEME_SLUG}" -maxdepth 4 -type f -name "${name}*.zip" | head -n 1)"
    if [[ -n "${found}" ]]; then
      echo "${found}"
      return 0
    fi
  fi

  return 1
}

trap cleanup_tmp EXIT

prompt_if_empty DB_PASS "Enter MariaDB password for ${DB_USER}" yes
prompt_if_empty WP_ADMIN_USER "Enter WP admin username" no
prompt_if_empty WP_ADMIN_PASS "Enter WP admin password" yes
prompt_if_empty WP_ADMIN_EMAIL "Enter WP admin email" no

if [[ "$ENABLE_SSL" == "yes" ]]; then
  prompt_if_empty LE_EMAIL "Enter Let's Encrypt email" no
fi

apt update
if [[ "${SKIP_APT_UPGRADE}" != "yes" ]]; then
  apt upgrade -y
fi
apt install -y nginx mariadb-server php-fpm php-cli php-mysql php-xml php-gd php-curl php-zip php-mbstring php-intl php-opcache php-bcmath unzip curl rsync git ufw fail2ban unattended-upgrades

if [[ -n "${SET_TIMEZONE}" ]] && command -v timedatectl >/dev/null 2>&1; then
  timedatectl set-timezone "${SET_TIMEZONE}"
fi

if [[ -n "${SWAP_SIZE}" && "${SWAP_SIZE}" != "0" ]]; then
  if ! swapon --show | grep -q "${SWAP_PATH}"; then
    fallocate -l "${SWAP_SIZE}" "${SWAP_PATH}"
    chmod 600 "${SWAP_PATH}"
    mkswap "${SWAP_PATH}"
    swapon "${SWAP_PATH}"
    if ! grep -q "${SWAP_PATH}" /etc/fstab; then
      echo "${SWAP_PATH} none swap sw 0 0" >> /etc/fstab
    fi
  fi
fi

if [[ "${ENABLE_UFW}" == "yes" ]]; then
  ufw allow "${UFW_SSH_PORT}/tcp"
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
fi

if [[ "${ENABLE_FAIL2BAN}" == "yes" ]]; then
  systemctl enable --now fail2ban
fi

if [[ "${ENABLE_UNATTENDED_UPGRADES}" == "yes" ]]; then
  cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
  if systemctl list-unit-files | grep -q "^unattended-upgrades.service"; then
    systemctl enable --now unattended-upgrades || true
  fi
fi

systemctl enable --now nginx
systemctl enable --now mariadb

if [[ "${RUN_MYSQL_SECURE_INSTALLATION}" == "yes" ]]; then
  mysql_secure_installation
fi

run_mysql "CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;"

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
opcache.enable = ${PHP_OPCACHE_ENABLE}
opcache.memory_consumption = ${PHP_OPCACHE_MEMORY_CONSUMPTION}
opcache.max_accelerated_files = ${PHP_OPCACHE_MAX_ACCELERATED_FILES}
opcache.validate_timestamps = ${PHP_OPCACHE_VALIDATE_TIMESTAMPS}
opcache.revalidate_freq = ${PHP_OPCACHE_REVALIDATE_FREQ}
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
  -e "s|{{FASTCGI_READ_TIMEOUT}}|${NGINX_FASTCGI_READ_TIMEOUT}|g" \
  -e "s|{{FASTCGI_SEND_TIMEOUT}}|${NGINX_FASTCGI_SEND_TIMEOUT}|g" \
  "${nginx_template}" > "${nginx_conf}"

rm -f /etc/nginx/sites-enabled/default
ln -sf "${nginx_conf}" /etc/nginx/sites-enabled/swagcuts
nginx -t
systemctl reload nginx

if [[ -n "${THEME_ZIP_PATH}" && -f "${THEME_ZIP_PATH}" ]]; then
  unzip -o "${THEME_ZIP_PATH}" -d "${SITE_ROOT}/wp-content/themes"
  if [[ ! -d "${SITE_ROOT}/wp-content/themes/${THEME_SLUG}" ]]; then
    warn "Theme folder '${THEME_SLUG}' not found after unzip. Check THEME_ZIP_PATH."
  fi
elif [[ -n "${THEME_ZIP_PATH}" ]]; then
  warn "THEME_ZIP_PATH is set but file not found: ${THEME_ZIP_PATH}"
fi

if [[ -n "${CHILD_THEME_ZIP_PATH}" && -f "${CHILD_THEME_ZIP_PATH}" ]]; then
  unzip -o "${CHILD_THEME_ZIP_PATH}" -d "${SITE_ROOT}/wp-content/themes"
  if [[ ! -d "${SITE_ROOT}/wp-content/themes/${CHILD_THEME_SLUG}" ]]; then
    warn "Child theme folder '${CHILD_THEME_SLUG}' not found after unzip. Check CHILD_THEME_ZIP_PATH."
  fi
elif [[ -n "${CHILD_THEME_ZIP_PATH}" ]]; then
  warn "CHILD_THEME_ZIP_PATH is set but file not found: ${CHILD_THEME_ZIP_PATH}"
fi

if [[ -d "${SITE_ROOT}/wp-content/themes/${CHILD_THEME_SLUG}" ]]; then
  wp theme activate "${CHILD_THEME_SLUG}" --path="${SITE_ROOT}" --allow-root || true
elif [[ -d "${SITE_ROOT}/wp-content/themes/${THEME_SLUG}" ]]; then
  wp theme activate "${THEME_SLUG}" --path="${SITE_ROOT}" --allow-root || true
fi

resolved_trx_zip="${TRX_ADDONS_ZIP_PATH}"
if [[ -z "${resolved_trx_zip}" && "${AUTO_FIND_BUNDLED_PLUGINS}" == "yes" ]]; then
  resolved_trx_zip="$(find_bundled_zip trx_addons || true)"
fi

if [[ -n "${resolved_trx_zip}" && -f "${resolved_trx_zip}" ]]; then
  install_plugin_with_retries "${resolved_trx_zip}" || true
elif [[ "${INSTALL_TRX_ADDONS}" == "yes" ]]; then
  warn "ThemeREX Addons zip not found. Set TRX_ADDONS_ZIP_PATH or use bundled plugins.zip."
fi

resolved_updater_zip="${THEMEREX_UPDATER_ZIP_PATH}"
if [[ -z "${resolved_updater_zip}" && "${AUTO_FIND_BUNDLED_PLUGINS}" == "yes" ]]; then
  resolved_updater_zip="$(find_bundled_zip themerex-updater || true)"
  if [[ -z "${resolved_updater_zip}" ]]; then
    resolved_updater_zip="$(find_bundled_zip trx_updater || true)"
  fi
fi

if [[ -n "${resolved_updater_zip}" && -f "${resolved_updater_zip}" ]]; then
  install_plugin_with_retries "${resolved_updater_zip}" || true
fi

if [[ -n "${PLUGINS_TO_INSTALL}" ]]; then
  for plugin in ${PLUGINS_TO_INSTALL}; do
    if [[ "${plugin}" == "trx_addons" || "${plugin}" == "themerex-updater" || "${plugin}" == "trx_updater" ]]; then
      warn "Skipping '${plugin}' from PLUGINS_TO_INSTALL. Use bundled zip paths instead."
      continue
    fi
    install_plugin_with_retries "${plugin}" || true
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
