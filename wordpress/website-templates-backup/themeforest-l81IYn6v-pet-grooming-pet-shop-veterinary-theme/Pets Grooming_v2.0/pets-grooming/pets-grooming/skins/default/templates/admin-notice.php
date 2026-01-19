<?php
/**
 * The template to display Admin notices
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.1
 */

$pets_grooming_theme_slug = get_template();
$pets_grooming_theme_obj  = wp_get_theme( $pets_grooming_theme_slug );
?>
<div class="pets_grooming_admin_notice pets_grooming_welcome_notice notice notice-info is-dismissible" data-notice="admin">
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
		<?php
		echo esc_html(
			sprintf(
				// Translators: Add theme name and version to the 'Welcome' message
				__( 'Welcome to %1$s v.%2$s', 'pets-grooming' ),
				$pets_grooming_theme_obj->get( 'Name' ) . ( PETS_GROOMING_THEME_FREE ? ' ' . __( 'Free', 'pets-grooming' ) : '' ),
				$pets_grooming_theme_obj->get( 'Version' )
			)
		);
		?>
	</h3>
	<?php

	// Description
	?>
	<div class="pets_grooming_notice_text">
		<p class="pets_grooming_notice_text_description">
			<?php
			echo str_replace( '. ', '.<br>', wp_kses_data( $pets_grooming_theme_obj->description ) );
			?>
		</p>
		<p class="pets_grooming_notice_text_info">
			<?php
			echo wp_kses_data( __( 'Attention! Plugin "ThemeREX Addons" is required! Please, install and activate it!', 'pets-grooming' ) );
			?>
		</p>
	</div>
	<?php

	// Buttons
	?>
	<div class="pets_grooming_notice_buttons">
		<?php
		// Link to the page 'About Theme'
		?>
		<a href="<?php echo esc_url( admin_url() . 'themes.php?page=pets_grooming_about' ); ?>" class="button button-primary"><i class="dashicons dashicons-nametag"></i> 
			<?php
			echo esc_html__( 'Install plugin "ThemeREX Addons"', 'pets-grooming' );
			?>
		</a>
	</div>
</div>
