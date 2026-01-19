<?php
/**
 * The template to display Admin notices
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.98.0
 */

$pets_grooming_skins_url   = get_admin_url( null, 'admin.php?page=trx_addons_theme_panel#trx_addons_theme_panel_section_skins' );
$pets_grooming_active_skin = pets_grooming_skins_get_active_skin_name();
?>
<div class="pets_grooming_admin_notice pets_grooming_skins_notice notice notice-error">
	<?php
	// Theme image
	$pets_grooming_theme_img = pets_grooming_get_file_url( 'screenshot.jpg' );
	if ( '' != $pets_grooming_theme_img ) {
		?>
		<div class="pets_grooming_notice_image"><img src="<?php echo esc_url( $pets_grooming_theme_img ); ?>" alt="<?php esc_attr_e( 'Theme screenshot', 'pets-grooming' ); ?>"></div>
		<?php
	}

	// Title
	?>
	<h3 class="pets_grooming_notice_title">
		<?php esc_html_e( 'Active skin is missing!', 'pets-grooming' ); ?>
	</h3>
	<div class="pets_grooming_notice_text">
		<p>
			<?php
			// Translators: Add a current skin name to the message
			echo wp_kses_data( sprintf( __( "Your active skin <b>'%s'</b> is missing. Usually this happens when the theme is updated directly through the server or FTP.", 'pets-grooming' ), ucfirst( $pets_grooming_active_skin ) ) );
			?>
		</p>
		<p>
			<?php
			echo wp_kses_data( __( "Please use only <b>'ThemeREX Updater v.1.6.0+'</b> plugin for your future updates.", 'pets-grooming' ) );
			?>
		</p>
		<p>
			<?php
			echo wp_kses_data( __( "But no worries! You can re-download the skin via 'Skins Manager' ( Theme Panel - Theme Dashboard - Skins ).", 'pets-grooming' ) );
			?>
		</p>
	</div>
	<?php

	// Buttons
	?>
	<div class="pets_grooming_notice_buttons">
		<?php
		// Link to the theme dashboard page
		?>
		<a href="<?php echo esc_url( $pets_grooming_skins_url ); ?>" class="button button-primary"><i class="dashicons dashicons-update"></i> 
			<?php
			// Translators: Add theme name
			esc_html_e( 'Go to Skins manager', 'pets-grooming' );
			?>
		</a>
	</div>
</div>
