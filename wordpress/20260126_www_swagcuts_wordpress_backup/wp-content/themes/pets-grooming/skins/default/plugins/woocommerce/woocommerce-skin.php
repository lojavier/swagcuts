<?php
/* WooCommerce skin-specific functions
------------------------------------------------------------------------------- */

// Theme init priorities:
// 3 - add/remove Theme Options elements

if ( ! function_exists( 'pets_grooming_woocommerce_skin_theme_setup3' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_woocommerce_skin_theme_setup3', 3 );
	function pets_grooming_woocommerce_skin_theme_setup3() {
		if ( pets_grooming_exists_woocommerce() ) {
			// Panel 'Shop' with skin-specific options
			pets_grooming_storage_set_array_after( 'options', 'shop_single', pets_grooming_options_get_list_cpt_options_body( 'shop', esc_html__( 'Product', 'pets-grooming' ), 'single' ) );
			// Hide 'shop_mode'
			pets_grooming_storage_set_array2( 'options', 'shop_mode', 'type', 'hidden' );
			// Hide 'single_product_gallery_thumbs'
			pets_grooming_storage_set_array2( 'options', 'single_product_gallery_thumbs', 'type', 'hidden' );
			// Hide 'shop_buttons'
			pets_grooming_storage_set_array2( 'options', 'shop_hover', 'std', 'none' );
			pets_grooming_storage_set_array2( 'options', 'shop_hover', 'type', 'hidden' );
			// Number of related products by default
			pets_grooming_storage_set_array2( 'options', 'related_posts_shop', 'std', 4);
			pets_grooming_storage_set_array2( 'options', 'related_columns_shop', 'std', 4);
		}
	}
}


// Remove\Register Action\filters
if ( ! function_exists( 'pets_grooming_woocommerce_skin_woocommerce_remove_action' ) ) {
	add_action( 'init', 'pets_grooming_woocommerce_skin_woocommerce_remove_action', 11 );
	function pets_grooming_woocommerce_skin_woocommerce_remove_action() {
		if ( pets_grooming_exists_woocommerce() ) {
			add_filter( 'pets_grooming_filter_woocommerce_sale_flash', 'pets_grooming_change_woocommerce_sale_flash', 10, 3 );
		}
	}
}


// Show/Hide product's tags before the title
if ( ! function_exists( 'pets_grooming_woocommerce_skin_show_title' ) ) {
	add_filter( 'pets_grooming_filter_show_woocommerce_title', 'pets_grooming_woocommerce_skin_show_title' );
	function pets_grooming_woocommerce_skin_show_title() {
		return false;
	}
}


// Add label "UP TO"
if ( ! function_exists( 'pets_grooming_change_woocommerce_sale_flash' ) ) {
	function pets_grooming_change_woocommerce_sale_flash($new_sale, $percent, $product) {
		if( 'variable' === $product->get_type() ){
			$new_sale = '<span class="onsale"><span class="onsale_up">'. esc_html__('Up to', 'pets-grooming') .'</span> - '. esc_html( $percent ) . '%</span>';
		}
		return $new_sale;
	}
}

// Image width for thumbnails gallery
if ( ! function_exists( 'pets_grooming_filter_woocommerce_skin_theme_support' ) ) {
	add_filter( 'pets_grooming_filter_woocommerce_theme_support', 'pets_grooming_filter_woocommerce_skin_theme_support' );
	function pets_grooming_filter_woocommerce_skin_theme_support( $arr ) {
		$arr['gallery_thumbnail_image_width'] = 300;
		return $arr;
	}
}