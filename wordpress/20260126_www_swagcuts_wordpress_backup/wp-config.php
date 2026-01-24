<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'swagcuts_wp' );

/** Database username */
define( 'DB_USER', 'admin' );

/** Database password */
define( 'DB_PASSWORD', 'q1w2e3r4' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '#^iRQC;oY:B5DM522{W y{p*U?WGEUCJD#cDw;^,-QsF9:<ZBnErq[MtW3vqqvw[' );
define( 'SECURE_AUTH_KEY',   'z*+9m7/b.J=CP@_$Wr@G:RZP^0~nMS0e-&dN}z`T79 RmW~y1HdvZ+tcu9ILfP<d' );
define( 'LOGGED_IN_KEY',     'PM&:#j?]1:Rkke7xo_qORl2QSk(O<PQx?)r-5(-HFOmktGotZ=jLI_;Vt*UOt|<h' );
define( 'NONCE_KEY',         'ite18]%%@(@hd)edqcl0s[@B5fkzz;@:XNdGl41O-Q~S3oWrFMU&9[FqW{nAnQ%1' );
define( 'AUTH_SALT',         'y2gyFry5Vwt}:zDTnn-A_`bdFU|Y>z/Mh3KL^F9hMG@Z0+O--8;gvNb$UO}Q>#61' );
define( 'SECURE_AUTH_SALT',  'g7o(nd&<F{$=)cdCY$&b2WK(H{go3a`2]#!LXOPs%GHw,Ne`eW5^W)jWnM:GDaH%' );
define( 'LOGGED_IN_SALT',    '(paN>d3(`a6e)Qkce}@o#hhIi+Y:z|a/@}M_cR-ST:(AjpM.(io5rj]aV,9r?6;K' );
define( 'NONCE_SALT',        '-h%:Kyx(.>1x_95akuU;fGNl+DFhHJ~OP^0gtyC,C)I1E1x dKcoU,NKcC2?4|.(' );
define( 'WP_CACHE_KEY_SALT', 'V});sBlJwcY{oh:~mjW$w<i&uYaL^s)@L@<Lh)K=y]oR7&unmtJ^#u6ohP7%HfEJ' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_MEMORY_LIMIT', '512M' );
define( 'WP_MAX_MEMORY_LIMIT', '512M' );
define( 'DISALLOW_FILE_EDIT', true );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
