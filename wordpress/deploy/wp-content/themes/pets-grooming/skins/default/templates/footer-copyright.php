<?php
/**
 * The template to display the copyright info in the footer
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.10
 */

// Copyright area
?> 
<div class="footer_copyright_wrap">
	<div class="footer_copyright_inner">
		<div class="content_wrap">
			<div class="copyright_text">
				<?php
					$pets_grooming_copyright = pets_grooming_get_theme_option( 'copyright' );
					if ( ! empty( $pets_grooming_copyright ) ) {
						// Replace {{Y}} or {Y} with the current year
						$pets_grooming_copyright = str_replace( array( '{{Y}}', '{Y}' ), date( 'Y' ), $pets_grooming_copyright );
						// Replace {{...}} and ((...)) on the <i>...</i> and <b>...</b>
						$pets_grooming_copyright = pets_grooming_prepare_macros( $pets_grooming_copyright );
						// Display copyright
						echo wp_kses( nl2br( $pets_grooming_copyright ), 'pets_grooming_kses_content' );
					}
				?>
			</div>
		</div>
	</div>
</div>