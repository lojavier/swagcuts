# Swag Cuts WordPress VM Setup (Ubuntu + Nginx + MariaDB)

This folder contains a one-shot installer for a Linux VM running Ubuntu 24.x.

What it does
- Installs Nginx, MariaDB, PHP-FPM, and required PHP extensions
- Creates a WordPress database and user
- Downloads WordPress to the default install path
- Configures Nginx for the site
- Installs WP-CLI and performs a full WP install
- Applies PHP limits recommended by the theme (configurable in install.env)
- (Optional) Installs the Pets Grooming theme + child theme
- (Optional) Installs ThemeREX Addons and ThemeREX Updater
- (Optional) Requests a Let's Encrypt SSL certificate

Quick start
1) Copy this folder to your VM
   - Example (from Windows PowerShell):
     scp -r wordpress/server-setup user@<vm-ip>:/home/user/

2) Create an install.env file (copy the example and edit values)
   - On the VM:
     cd /home/user/server-setup
     cp install.env.example install.env
     nano install.env

3) Upload the theme zip files to the VM (optional)
   - pets-grooming.zip
   - pets-grooming-child.zip
   - Put them somewhere on the VM and set THEME_ZIP_PATH/CHILD_THEME_ZIP_PATH
   - If you have bundled plugin zips, set TRX_ADDONS_ZIP_PATH/THEMEREX_UPDATER_ZIP_PATH

4) Run the installer as root
   sudo ./install_wordpress.sh

After install
- Visit your WP URL (WP_URL) in a browser
- Login to /wp-admin and activate the theme license (Theme Panel > Theme Dashboard > General)
- Install/activate any recommended plugins from the theme panel
- Import demo content (Theme Panel > Theme Dashboard > Demo Data)
- Configure WooCommerce, booking plugin, and notifications

Cleanup (fresh install)
- This removes the site files, database, and Nginx config.
- Run as root:
  sudo ./cleanup_wordpress.sh
- You can control what gets removed by setting:
  REMOVE_SITE=yes|no, REMOVE_DB=yes|no, REMOVE_NGINX=yes|no
- Optional cleanup overrides:
  DB_ROOT_USER, DB_ROOT_PASS, DRY_RUN
- Optional backups before cleanup:
  BACKUP_BEFORE_CLEANUP=yes, BACKUP_DIR=/var/backups/swagcuts
  BACKUP_DB=yes|no, BACKUP_SITE=yes|no, BACKUP_SITE_PATH=/var/www/swagcuts/wp-content

Static IP (optional)
- Set values in install.env:
  STATIC_CONN, STATIC_IFACE, STATIC_IP, STATIC_PREFIX, STATIC_GATEWAY, STATIC_DNS
- Run as root:
  sudo ./set_static_ip.sh

Notes
- SSL will fail if swagcuts.com does not point to your VM yet. Keep ENABLE_SSL=no for local dev.
- For local dev, set WP_URL to your VM IP (example: http://192.168.68.2) and set DEV_HOSTS to include the IP and localhost.
- If the site redirects to 127.0.0.1, update WP_URL and re-run the installer.
- To auto-install extra plugins, set PLUGINS_TO_INSTALL to space-separated WP.org slugs in install.env.
- ThemeREX Addons is not on WP.org; use TRX_ADDONS_ZIP_PATH or AUTO_FIND_BUNDLED_PLUGINS=yes.
- If WP asks for FTP credentials, set WP_FS_METHOD=direct and re-run the installer.
- This script is idempotent: re-running it will not destroy existing data.
- Optional baseline setup is controlled by:
  SET_TIMEZONE, ENABLE_UFW, UFW_SSH_PORT, ENABLE_FAIL2BAN, ENABLE_UNATTENDED_UPGRADES, SWAP_SIZE, RUN_MYSQL_SECURE_INSTALLATION
- Additional installer options:
  DB_ROOT_USER, DB_ROOT_PASS, SKIP_APT_UPGRADE, INSTALL_GUEST_ADDITIONS_DEPS, GUEST_ADDITIONS_INSTALLER_PATH
  GUEST_ADDITIONS_INSTALLER_ARGS, PLUGIN_INSTALL_RETRIES
  NGINX_FASTCGI_READ_TIMEOUT, NGINX_FASTCGI_SEND_TIMEOUT
  PHP_OPCACHE_ENABLE, PHP_OPCACHE_MEMORY_CONSUMPTION, PHP_OPCACHE_MAX_ACCELERATED_FILES
  UPDATE_THEME_ON_INSTALL
