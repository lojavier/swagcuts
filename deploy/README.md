# Deploy Bundle (Option 2)

This folder is a deployable bundle for WordPress customizations. Keep only
your custom theme/child theme, custom plugins, and uploads here. WordPress
core stays installed on the VM.

## Structure

- deploy/wp-content/themes/
- deploy/wp-content/plugins/
- deploy/wp-content/uploads/

## Quick start

1) Copy `deploy/deploy.env.example` to `deploy/deploy.env` and edit values.
2) Place your theme/child theme and plugins into `deploy/wp-content/`.
3) Run the deploy script from a Linux shell (VM or WSL):

```bash
cd deploy
bash deploy.sh
```

## Notes

- This syncs only `wp-content`, so you can update site code without
  reinstalling WordPress.
- If you move content between environments, consider using WP-CLI
  `wp db export/import` and `wp search-replace` for URLs.
