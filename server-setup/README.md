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
     scp -r server-setup user@<vm-ip>:/home/user/

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

Notes
- SSL will fail if swagcuts.com does not point to your VM yet. Keep ENABLE_SSL=no for local dev.
- For local dev, set WP_URL to your VM IP (example: http://192.168.68.2) and set DEV_HOSTS to include the IP and localhost.
- If the site redirects to 127.0.0.1, update WP_URL and re-run the installer.
- To auto-install extra plugins, set PLUGINS_TO_INSTALL to space-separated WP.org slugs in install.env.
- If WP asks for FTP credentials, set WP_FS_METHOD=direct and re-run the installer.
- This script is idempotent: re-running it will not destroy existing data.
