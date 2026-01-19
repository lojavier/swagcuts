# Server Hardening Checklist (VM)

Network + access
- Use SSH keys, disable password auth in /etc/ssh/sshd_config
- Change the SSH port if desired
- Enable UFW firewall: allow 22/tcp, 80/tcp, 443/tcp

System updates
- Enable unattended upgrades or schedule regular patching
- Reboot after kernel updates

Nginx + PHP
- Disable server tokens in Nginx
- Set client_max_body_size to match WP upload needs
- Ensure php-fpm is up to date

WordPress security
- Install a security plugin (Wordfence or similar)
- Use strong admin credentials and unique DB password
- Disable file editing in wp-config.php: define('DISALLOW_FILE_EDIT', true);

Backups
- Schedule DB dumps + wp-content backups
- Verify restore procedures before go-live

Monitoring
- Enable basic uptime checks
- Review Nginx and auth logs periodically
