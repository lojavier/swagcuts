<?php
/**
 * The template to display Admin notices
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.64
 */

$pets_grooming_skins_url  = get_admin_url( null, 'admin.php?page=trx_addons_theme_panel#trx_addons_theme_panel_section_skins' );
$pets_grooming_skins_args = get_query_var( 'pets_grooming_skins_notice_args' );
?>
<div class="pets_grooming_admin_notice pets_grooming_skins_notice notice notice-info is-dismissible" data-notice="skins">
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
		<?php esc_html_e( 'New skins are available', 'pets-grooming' ); ?>
	</h3>
	<?php

	// Description
	$pets_grooming_total      = $pets_grooming_skins_args['update'];	// Store value to the separate variable to avoid warnings from ThemeCheck plugin!
	$pets_grooming_skins_msg  = $pets_grooming_total > 0
							// Translators: Add new skins number
							? '<strong>' . sprintf( _n( '%d new version', '%d new versions', $pets_grooming_total, 'pets-grooming' ), $pets_grooming_total ) . '</strong>'
							: '';
	$pets_grooming_total      = $pets_grooming_skins_args['free'];
	$pets_grooming_skins_msg .= $pets_grooming_total > 0
							? ( ! empty( $pets_grooming_skins_msg ) ? ' ' . esc_html__( 'and', 'pets-grooming' ) . ' ' : '' )
								// Translators: Add new skins number
								. '<strong>' . sprintf( _n( '%d free skin', '%d free skins', $pets_grooming_total, 'pets-grooming' ), $pets_grooming_total ) . '</strong>'
							: '';
	$pets_grooming_total      = $pets_grooming_skins_args['pay'];
	$pets_grooming_skins_msg .= $pets_grooming_skins_args['pay'] > 0
							? ( ! empty( $pets_grooming_skins_msg ) ? ' ' . esc_html__( 'and', 'pets-grooming' ) . ' ' : '' )
								// Translators: Add new skins number
								. '<strong>' . sprintf( _n( '%d paid skin', '%d paid skins', $pets_grooming_total, 'pets-grooming' ), $pets_grooming_total ) . '</strong>'
							: '';
	?>
	<div class="pets_grooming_notice_text">
		<p>
			<?php
			// Translators: Add new skins info
			echo wp_kses_data( sprintf( __( "We are pleased to announce that %s are available for your theme", 'pets-grooming' ), $pets_grooming_skins_msg ) );
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
			esc_html_e( 'Go to Skins manager', 'pets-grooming' );
			?>
		</a>
		<?php
		// Dismiss notice for 7 days
		?>
		<a href="#" role="button" class="button button-secondary pets_grooming_notice_button_dismiss" data-notice="skins"><i class="dashicons dashicons-no-alt"></i> 
			<?php
			esc_html_e( 'Dismiss', 'pets-grooming' );
			?>
		</a>
		<?php
		// Hide notice forever
		?>
		<a href="#" role="button" class="button button-secondary pets_grooming_notice_button_hide" data-notice="skins"><i class="dashicons dashicons-no-alt"></i> 
			<?php
			esc_html_e( 'Never show again', 'pets-grooming' );
			?>
		</a>
	</div>
</div>
