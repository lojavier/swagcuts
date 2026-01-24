<?php
/**
 * The template to display the background video in the header
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.14
 */
$pets_grooming_header_video = pets_grooming_get_header_video();
$pets_grooming_embed_video  = '';
if ( ! empty( $pets_grooming_header_video ) && ! pets_grooming_is_from_uploads( $pets_grooming_header_video ) ) {
	if ( pets_grooming_is_youtube_url( $pets_grooming_header_video ) && preg_match( '/[=\/]([^=\/]*)$/', $pets_grooming_header_video, $matches ) && ! empty( $matches[1] ) ) {
		?><div id="background_video" data-youtube-code="<?php echo esc_attr( $matches[1] ); ?>"></div>
		<?php
	} else {
		?>
		<div id="background_video"><?php pets_grooming_show_layout( pets_grooming_get_embed_video( $pets_grooming_header_video ) ); ?></div>
		<?php
	}
}