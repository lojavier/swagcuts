<?php
$pets_grooming_woocommerce_sc = pets_grooming_get_theme_option( 'front_page_woocommerce_products' );
if ( ! empty( $pets_grooming_woocommerce_sc ) ) {
	?><div class="front_page_section front_page_section_woocommerce<?php
		$pets_grooming_scheme = pets_grooming_get_theme_option( 'front_page_woocommerce_scheme' );
		if ( ! empty( $pets_grooming_scheme ) && ! pets_grooming_is_inherit( $pets_grooming_scheme ) ) {
			echo ' scheme_' . esc_attr( $pets_grooming_scheme );
		}
		echo ' front_page_section_paddings_' . esc_attr( pets_grooming_get_theme_option( 'front_page_woocommerce_paddings' ) );
		if ( pets_grooming_get_theme_option( 'front_page_woocommerce_stack' ) ) {
			echo ' sc_stack_section_on';
		}
	?>"
			<?php
			$pets_grooming_css      = '';
			$pets_grooming_bg_image = pets_grooming_get_theme_option( 'front_page_woocommerce_bg_image' );
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
		$pets_grooming_anchor_icon = pets_grooming_get_theme_option( 'front_page_woocommerce_anchor_icon' );
		$pets_grooming_anchor_text = pets_grooming_get_theme_option( 'front_page_woocommerce_anchor_text' );
		if ( ( ! empty( $pets_grooming_anchor_icon ) || ! empty( $pets_grooming_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
			echo do_shortcode(
				'[trx_sc_anchor id="front_page_section_woocommerce"'
											. ( ! empty( $pets_grooming_anchor_icon ) ? ' icon="' . esc_attr( $pets_grooming_anchor_icon ) . '"' : '' )
											. ( ! empty( $pets_grooming_anchor_text ) ? ' title="' . esc_attr( $pets_grooming_anchor_text ) . '"' : '' )
											. ']'
			);
		}
	?>
		<div class="front_page_section_inner front_page_section_woocommerce_inner
			<?php
			if ( pets_grooming_get_theme_option( 'front_page_woocommerce_fullheight' ) ) {
				echo ' pets-grooming-full-height sc_layouts_flex sc_layouts_columns_middle';
			}
			?>
				"
				<?php
				$pets_grooming_css      = '';
				$pets_grooming_bg_mask  = pets_grooming_get_theme_option( 'front_page_woocommerce_bg_mask' );
				$pets_grooming_bg_color_type = pets_grooming_get_theme_option( 'front_page_woocommerce_bg_color_type' );
				if ( 'custom' == $pets_grooming_bg_color_type ) {
					$pets_grooming_bg_color = pets_grooming_get_theme_option( 'front_page_woocommerce_bg_color' );
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
			<div class="front_page_section_content_wrap front_page_section_woocommerce_content_wrap content_wrap woocommerce">
				<?php
				// Content wrap with title and description
				$pets_grooming_caption     = pets_grooming_get_theme_option( 'front_page_woocommerce_caption' );
				$pets_grooming_description = pets_grooming_get_theme_option( 'front_page_woocommerce_description' );
				if ( ! empty( $pets_grooming_caption ) || ! empty( $pets_grooming_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					// Caption
					if ( ! empty( $pets_grooming_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
						?>
						<h2 class="front_page_section_caption front_page_section_woocommerce_caption front_page_block_<?php echo ! empty( $pets_grooming_caption ) ? 'filled' : 'empty'; ?>">
						<?php
							echo wp_kses( $pets_grooming_caption, 'pets_grooming_kses_content' );
						?>
						</h2>
						<?php
					}

					// Description (text)
					if ( ! empty( $pets_grooming_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
						?>
						<div class="front_page_section_description front_page_section_woocommerce_description front_page_block_<?php echo ! empty( $pets_grooming_description ) ? 'filled' : 'empty'; ?>">
						<?php
							echo wp_kses( wpautop( $pets_grooming_description ), 'pets_grooming_kses_content' );
						?>
						</div>
						<?php
					}
				}

				// Content (widgets)
				?>
				<div class="front_page_section_output front_page_section_woocommerce_output list_products shop_mode_thumbs">
					<?php
					if ( 'products' == $pets_grooming_woocommerce_sc ) {
						$pets_grooming_woocommerce_sc_ids      = pets_grooming_get_theme_option( 'front_page_woocommerce_products_per_page' );
						$pets_grooming_woocommerce_sc_per_page = count( explode( ',', $pets_grooming_woocommerce_sc_ids ) );
					} else {
						$pets_grooming_woocommerce_sc_per_page = max( 1, (int) pets_grooming_get_theme_option( 'front_page_woocommerce_products_per_page' ) );
					}
					$pets_grooming_woocommerce_sc_columns = max( 1, min( $pets_grooming_woocommerce_sc_per_page, (int) pets_grooming_get_theme_option( 'front_page_woocommerce_products_columns' ) ) );
					echo do_shortcode(
						"[{$pets_grooming_woocommerce_sc}"
										. ( 'products' == $pets_grooming_woocommerce_sc
												? ' ids="' . esc_attr( $pets_grooming_woocommerce_sc_ids ) . '"'
												: '' )
										. ( 'product_category' == $pets_grooming_woocommerce_sc
												? ' category="' . esc_attr( pets_grooming_get_theme_option( 'front_page_woocommerce_products_categories' ) ) . '"'
												: '' )
										. ( 'best_selling_products' != $pets_grooming_woocommerce_sc
												? ' orderby="' . esc_attr( pets_grooming_get_theme_option( 'front_page_woocommerce_products_orderby' ) ) . '"'
													. ' order="' . esc_attr( pets_grooming_get_theme_option( 'front_page_woocommerce_products_order' ) ) . '"'
												: '' )
										. ' per_page="' . esc_attr( $pets_grooming_woocommerce_sc_per_page ) . '"'
										. ' columns="' . esc_attr( $pets_grooming_woocommerce_sc_columns ) . '"'
						. ']'
					);
					?>
				</div>
			</div>
		</div>
	</div>
	<?php
}
