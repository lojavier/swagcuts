<div class="front_page_section front_page_section_googlemap<?php
	$pets_grooming_scheme = pets_grooming_get_theme_option( 'front_page_googlemap_scheme' );
	if ( ! empty( $pets_grooming_scheme ) && ! pets_grooming_is_inherit( $pets_grooming_scheme ) ) {
		echo ' scheme_' . esc_attr( $pets_grooming_scheme );
	}
	echo ' front_page_section_paddings_' . esc_attr( pets_grooming_get_theme_option( 'front_page_googlemap_paddings' ) );
	if ( pets_grooming_get_theme_option( 'front_page_googlemap_stack' ) ) {
		echo ' sc_stack_section_on';
	}
?>"
		<?php
		$pets_grooming_css      = '';
		$pets_grooming_bg_image = pets_grooming_get_theme_option( 'front_page_googlemap_bg_image' );
		if ( ! empty( $pets_grooming_bg_image ) ) {
			$pets_grooming_css .= 'background-image: url(' . esc_url( pets_grooming_get_attachment_url( $pets_grooming_bg_image ) ) . ');';
		}
		if ( ! empty( $pets_grooming_css ) ) {
			echo ' style="' . esc_attr( $pets_grooming_css ) . '"';
		}
		?>
>
<?php
	// Add anchor
	$pets_grooming_anchor_icon = pets_grooming_get_theme_option( 'front_page_googlemap_anchor_icon' );
	$pets_grooming_anchor_text = pets_grooming_get_theme_option( 'front_page_googlemap_anchor_text' );
if ( ( ! empty( $pets_grooming_anchor_icon ) || ! empty( $pets_grooming_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
	echo do_shortcode(
		'[trx_sc_anchor id="front_page_section_googlemap"'
									. ( ! empty( $pets_grooming_anchor_icon ) ? ' icon="' . esc_attr( $pets_grooming_anchor_icon ) . '"' : '' )
									. ( ! empty( $pets_grooming_anchor_text ) ? ' title="' . esc_attr( $pets_grooming_anchor_text ) . '"' : '' )
									. ']'
	);
}
?>
	<div class="front_page_section_inner front_page_section_googlemap_inner
		<?php
		$pets_grooming_layout = pets_grooming_get_theme_option( 'front_page_googlemap_layout' );
		echo ' front_page_section_layout_' . esc_attr( $pets_grooming_layout );
		if ( pets_grooming_get_theme_option( 'front_page_googlemap_fullheight' ) ) {
			echo ' pets-grooming-full-height sc_layouts_flex sc_layouts_columns_middle';
		}
		?>
		"
			<?php
			$pets_grooming_css      = '';
			$pets_grooming_bg_mask  = pets_grooming_get_theme_option( 'front_page_googlemap_bg_mask' );
			$pets_grooming_bg_color_type = pets_grooming_get_theme_option( 'front_page_googlemap_bg_color_type' );
			if ( 'custom' == $pets_grooming_bg_color_type ) {
				$pets_grooming_bg_color = pets_grooming_get_theme_option( 'front_page_googlemap_bg_color' );
			} elseif ( 'scheme_bg_color' == $pets_grooming_bg_color_type ) {
				$pets_grooming_bg_color = pets_grooming_get_scheme_color( 'bg_color', $pets_grooming_scheme );
			} else {
				$pets_grooming_bg_color = '';
			}
			if ( ! empty( $pets_grooming_bg_color ) && $pets_grooming_bg_mask > 0 ) {
				$pets_grooming_css .= 'background-color: ' . esc_attr(
					1 == $pets_grooming_bg_mask ? $pets_grooming_bg_color : pets_grooming_hex2rgba( $pets_grooming_bg_color, $pets_grooming_bg_mask )
				) . ';';
			}
			if ( ! empty( $pets_grooming_css ) ) {
				echo ' style="' . esc_attr( $pets_grooming_css ) . '"';
			}
			?>
	>
		<div class="front_page_section_content_wrap front_page_section_googlemap_content_wrap
		<?php
		if ( 'fullwidth' != $pets_grooming_layout ) {
			echo ' content_wrap';
		}
		?>
		">
			<?php
			// Content wrap with title and description
			$pets_grooming_caption     = pets_grooming_get_theme_option( 'front_page_googlemap_caption' );
			$pets_grooming_description = pets_grooming_get_theme_option( 'front_page_googlemap_description' );
			if ( ! empty( $pets_grooming_caption ) || ! empty( $pets_grooming_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				if ( 'fullwidth' == $pets_grooming_layout ) {
					?>
					<div class="content_wrap">
					<?php
				}
					// Caption
				if ( ! empty( $pets_grooming_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					?>
					<h2 class="front_page_section_caption front_page_section_googlemap_caption front_page_block_<?php echo ! empty( $pets_grooming_caption ) ? 'filled' : 'empty'; ?>">
					<?php
					echo wp_kses( $pets_grooming_caption, 'pets_grooming_kses_content' );
					?>
					</h2>
					<?php
				}

					// Description (text)
				if ( ! empty( $pets_grooming_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					?>
					<div class="front_page_section_description front_page_section_googlemap_description front_page_block_<?php echo ! empty( $pets_grooming_description ) ? 'filled' : 'empty'; ?>">
					<?php
					echo wp_kses( wpautop( $pets_grooming_description ), 'pets_grooming_kses_content' );
					?>
					</div>
					<?php
				}
				if ( 'fullwidth' == $pets_grooming_layout ) {
					?>
					</div>
					<?php
				}
			}

			// Content (text)
			$pets_grooming_content = pets_grooming_get_theme_option( 'front_page_googlemap_content' );
			if ( ! empty( $pets_grooming_content ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				if ( 'columns' == $pets_grooming_layout ) {
					?>
					<div class="front_page_section_columns front_page_section_googlemap_columns columns_wrap">
						<div class="column-1_3">
					<?php
				} elseif ( 'fullwidth' == $pets_grooming_layout ) {
					?>
					<div class="content_wrap">
					<?php
				}

				?>
				<div class="front_page_section_content front_page_section_googlemap_content front_page_block_<?php echo ! empty( $pets_grooming_content ) ? 'filled' : 'empty'; ?>">
				<?php
					echo wp_kses( $pets_grooming_content, 'pets_grooming_kses_content' );
				?>
				</div>
				<?php

				if ( 'columns' == $pets_grooming_layout ) {
					?>
					</div><div class="column-2_3">
					<?php
				} elseif ( 'fullwidth' == $pets_grooming_layout ) {
					?>
					</div>
					<?php
				}
			}

			// Widgets output
			?>
			<div class="front_page_section_output front_page_section_googlemap_output">
				<?php
				if ( is_active_sidebar( 'front_page_googlemap_widgets' ) ) {
					dynamic_sidebar( 'front_page_googlemap_widgets' );
				} elseif ( current_user_can( 'edit_theme_options' ) ) {
					if ( ! pets_grooming_exists_trx_addons() ) {
						pets_grooming_customizer_need_trx_addons_message();
					} else {
						pets_grooming_customizer_need_widgets_message( 'front_page_googlemap_caption', 'ThemeREX Addons - Google map' );
					}
				}
				?>
			</div>
			<?php

			if ( 'columns' == $pets_grooming_layout && ( ! empty( $pets_grooming_content ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) ) {
				?>
				</div></div>
				<?php
			}
			?>
		</div>
	</div>
</div>
