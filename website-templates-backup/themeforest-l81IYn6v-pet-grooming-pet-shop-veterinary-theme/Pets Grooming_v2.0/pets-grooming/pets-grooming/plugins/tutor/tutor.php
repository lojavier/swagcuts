<?php
/* Tutor LMS support functions
------------------------------------------------------------------------------- */

// Theme init priorities:
// 1 - register filters, that add/remove lists items for the Theme Options
if ( ! function_exists( 'pets_grooming_tutor_theme_setup1' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_tutor_theme_setup1', 1 );
	function pets_grooming_tutor_theme_setup1() {
		add_filter( 'pets_grooming_filter_list_sidebars', 'pets_grooming_tutor_list_sidebars' );
	}
}

// Theme init priorities:
// 3 - add/remove Theme Options elements
if ( ! function_exists( 'pets_grooming_tutor_theme_setup3' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_tutor_theme_setup3', 3 );
	function pets_grooming_tutor_theme_setup3() {
		if ( pets_grooming_exists_tutor() ) {
			// Section 'Tutor'
			pets_grooming_storage_merge_array(
				'options', '', array_merge(
					array(
						'tutor' => array(
							"title" => esc_html__( 'Tutor LMS', 'pets-grooming' ),
							"desc" => wp_kses_data( __( 'Select parameters to display the Tutor LMS pages', 'pets-grooming' ) ),
							'icon'  => 'icon-courses',
							"type" => "section"
							),
					),
					pets_grooming_options_get_list_cpt_options( 'tutor' )
				)
			);
		}
	}
}


// Theme init priorities:
// 9 - register other filters (for installer, etc.)
if ( ! function_exists( 'pets_grooming_tutor_theme_setup9' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_tutor_theme_setup9', 9 );
	function pets_grooming_tutor_theme_setup9() {
		if ( pets_grooming_exists_tutor() ) {
			add_action( 'wp_enqueue_scripts', 'pets_grooming_tutor_frontend_scripts', 1100 );
			add_action( 'trx_addons_action_load_scripts_front_tutor', 'pets_grooming_tutor_frontend_scripts', 10, 1 );
			add_action( 'wp_enqueue_scripts', 'pets_grooming_tutor_frontend_scripts_responsive', 2000 );
			add_action( 'trx_addons_action_load_scripts_front_tutor', 'pets_grooming_tutor_frontend_scripts_responsive', 10, 1 );
			add_filter( 'pets_grooming_filter_merge_styles', 'pets_grooming_tutor_merge_styles' );
			add_filter( 'pets_grooming_filter_merge_styles_responsive', 'pets_grooming_tutor_merge_styles_responsive' );
			add_filter( 'pets_grooming_filter_post_type_taxonomy', 'pets_grooming_tutor_post_type_taxonomy', 10, 2 );
			add_action( 'pets_grooming_action_override_theme_options', 'pets_grooming_tutor_override_theme_options' );
			add_filter( 'pets_grooming_filter_list_posts_types', 'pets_grooming_tutor_list_post_types');
			add_filter( 'pets_grooming_filter_detect_blog_mode', 'pets_grooming_tutor_detect_blog_mode' );
			add_filter( 'trx_addons_filter_get_blog_title', 'pets_grooming_tutor_get_blog_title' );
			add_filter( 'pets_grooming_filter_get_post_categories', 'pets_grooming_tutor_get_post_categories', 10, 2 );
			add_filter( 'tutor_course_thumbnail_size', 'pets_grooming_tutor_course_thumbnail_size', 10, 2 );
			// Redirect templates to the skin
			add_filter( 'tutor_get_template_path', 'pets_grooming_tutor_get_template_path', 10000, 2 );
			add_filter( 'tutor_get_template_part_path', 'pets_grooming_tutor_get_template_part_path', 10000, 2 );
		}
		if ( is_admin() ) {
			add_filter( 'pets_grooming_filter_tgmpa_required_plugins', 'pets_grooming_tutor_tgmpa_required_plugins' );
			add_filter( 'pets_grooming_filter_theme_plugins', 'pets_grooming_tutor_theme_plugins' );
		}
	}
}


// Filter to add in the required plugins list
if ( !function_exists( 'pets_grooming_tutor_tgmpa_required_plugins' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_tgmpa_required_plugins', 'pets_grooming_tutor_tgmpa_required_plugins' );
	function pets_grooming_tutor_tgmpa_required_plugins( $list = array() ) {
		if ( pets_grooming_storage_isset( 'required_plugins', 'tutor' ) && pets_grooming_storage_get_array( 'required_plugins', 'tutor', 'install' ) !== false ) {
			$list[] = array(
					'name' 		=> pets_grooming_storage_get_array( 'required_plugins', 'tutor', 'title' ),
					'slug' 		=> 'tutor',
					'required' 	=> false
				);
		}
		if ( pets_grooming_storage_isset( 'required_plugins', 'tutor-lms-elementor-addons' ) && pets_grooming_storage_get_array( 'required_plugins', 'tutor-lms-elementor-addons', 'install' ) !== false ) {
			$list[] = array(
					'name' 		=> pets_grooming_storage_get_array( 'required_plugins', 'tutor-lms-elementor-addons', 'title' ),
					'slug' 		=> 'tutor-lms-elementor-addons',
					'required' 	=> false
				);
		}
		return $list;
	}
}


// Filter theme-supported plugins list
if ( ! function_exists( 'pets_grooming_tutor_theme_plugins' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_theme_plugins', 'pets_grooming_tutor_theme_plugins' );
	function pets_grooming_tutor_theme_plugins( $list = array() ) {
		return pets_grooming_add_group_and_logo_to_slave( $list, 'tutor', 'tutor-' );
	}
}


// Check if Tutor LMS installed and activated
if ( ! function_exists( 'pets_grooming_exists_tutor' ) ) {
	function pets_grooming_exists_tutor() {
		return function_exists('tutor_utils');
	}
}

// Return a list of option names for Tutor LMS pages
if ( ! function_exists( 'pets_grooming_tutor_get_options_page_ids' ) ) {
	function pets_grooming_tutor_get_options_page_ids() {
		return apply_filters( 'pets_grooming_filter_tutor_pages', array(
			'tutor_dashboard_page_id',
			'tutor_toc_page_id',
			'tutor_cart_page_id',
			'tutor_checkout_page_id',
			'course_archive_page',
			'instructor_register_page',
			'student_register_page'
		) );
	}
}

// Return true, if current page is any tutor page
if ( ! function_exists( 'pets_grooming_is_tutor_page' ) ) {
	function pets_grooming_is_tutor_page() {
		$rez = false;
		if ( pets_grooming_exists_tutor() && ! is_search() && ! is_admin() ) {
			$rez = tutor_utils()->is_tutor_frontend_dashboard()
					|| tutor_utils()->get_course_builder_screen()
					|| is_post_type_archive( tutor()->course_post_type )
					|| is_tax( 'course-category' )
					|| is_tax( 'course-tag' )
					|| is_singular( array(
							tutor()->course_post_type,
							tutor()->lesson_post_type,
							tutor()->quiz_post_type,
							tutor()->assignment_post_type,
							tutor()->zoom_post_type,
							tutor()->meet_post_type,
						) )
					|| ( pets_grooming_check_url( '/profile/' ) && pets_grooming_check_url( 'view=student' ) )
					|| ( pets_grooming_check_url( '/profile/' ) && pets_grooming_check_url( 'view=instructor' ) );
			if ( ! $rez ) {
				$id = get_the_ID();
				if ( $id > 0 ) {
					foreach( pets_grooming_tutor_get_options_page_ids() as $page ) {
						$page_id = (int)tutor_utils()->get_option( $page );
						if ( $page_id > 0 && is_page() && $id == $page_id ) {
							$rez = true;
							break;
						}
					}
				}
			}
		}
		return $rez;
	}
}

// Detect current blog mode
if ( ! function_exists( 'pets_grooming_tutor_detect_blog_mode' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_detect_blog_mode', 'pets_grooming_tutor_detect_blog_mode' );
	function pets_grooming_tutor_detect_blog_mode( $mode = '' ) {
		if ( pets_grooming_is_tutor_page() ) {
			$mode = 'tutor';
		}
		return $mode;
	}
}


// Return taxonomy for current post type
if ( ! function_exists( 'pets_grooming_tutor_post_type_taxonomy' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_post_type_taxonomy', 'pets_grooming_tutor_post_type_taxonomy', 10, 2 );
	function pets_grooming_tutor_post_type_taxonomy( $tax = '', $post_type = '' ) {
		if ( pets_grooming_exists_tutor() ) {
			if ( $post_type == tutor()->course_post_type ) {
				$tax = 'course-category';
			}
		}
		return $tax;
	}
}

// Show categories of the current course
if ( ! function_exists( 'pets_grooming_tutor_get_post_categories' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_get_post_categories', 'pets_grooming_tutor_get_post_categories', 10, 2 );
	function pets_grooming_tutor_get_post_categories( $cats = '', $args = array() ) {
		if ( pets_grooming_exists_tutor() && get_post_type() == tutor()->course_post_type ) {
			$cat_sep = apply_filters(
									'pets_grooming_filter_post_meta_cat_separator',
									'<span class="post_meta_item_cat_separator">' . ( ! isset( $args['cat_sep'] ) || ! empty( $args['cat_sep'] ) ? ', ' : ' ' ) . '</span>',
									$args
									);
			$cats = pets_grooming_get_post_terms( $cat_sep, get_the_ID(), 'course-category' );
		}
		return $cats;
	}
}

// Enqueue styles for frontend
if ( ! function_exists( 'pets_grooming_tutor_frontend_scripts' ) ) {
	//Handler of the add_action( 'wp_enqueue_scripts', 'pets_grooming_tutor_frontend_scripts', 1100 );
	//Handler of the add_action( 'trx_addons_action_load_scripts_front_tutor', 'pets_grooming_tutor_frontend_scripts', 10, 1 );
	function pets_grooming_tutor_frontend_scripts( $force = false ) {
		pets_grooming_enqueue_optimized( 'tutor', $force, array(
			'css' => array(
				'pets-grooming-tutor' => array( 'src' => 'plugins/tutor/tutor.css' ),
			)
		) );
	}
}

// Enqueue responsive styles for frontend
if ( ! function_exists( 'pets_grooming_tutor_frontend_scripts_responsive' ) ) {
	//Handler of the add_action( 'wp_enqueue_scripts', 'pets_grooming_tutor_frontend_scripts_responsive', 2000 );
	//Handler of the add_action( 'trx_addons_action_load_scripts_front_tutor', 'pets_grooming_tutor_frontend_scripts_responsive', 10, 1 );
	function pets_grooming_tutor_frontend_scripts_responsive( $force = false ) {
		pets_grooming_enqueue_optimized_responsive( 'tutor', $force, array(
			'css' => array(
				'pets-grooming-tutor-responsive' => array( 'src' => 'plugins/tutor/tutor-responsive.css', 'media' => 'all' ),
			)
		) );
	}
}


// Merge custom styles
if ( ! function_exists( 'pets_grooming_tutor_merge_styles' ) ) {
	//Handler of the add_filter('pets_grooming_filter_merge_styles', 'pets_grooming_tutor_merge_styles');
	function pets_grooming_tutor_merge_styles( $list ) {
		$list[ 'plugins/tutor/tutor.css' ] = false;
		return $list;
	}
}

// Merge responsive styles
if ( ! function_exists( 'pets_grooming_tutor_merge_styles_responsive' ) ) {
	//Handler of the add_filter('pets_grooming_filter_merge_styles_responsive', 'pets_grooming_tutor_merge_styles_responsive');
	function pets_grooming_tutor_merge_styles_responsive( $list ) {
		$list[ 'plugins/tutor/tutor-responsive.css' ] = false;
		return $list;
	}
}


// Override options with stored page meta on 'tutor' pages
if ( ! function_exists( 'pets_grooming_tutor_override_theme_options' ) ) {
	//Handler of the add_action( 'pets_grooming_action_override_theme_options', 'pets_grooming_tutor_override_theme_options' );
	function pets_grooming_tutor_override_theme_options() {
		if ( pets_grooming_is_tutor_page() ) {
			$id = (int)tutor_utils()->get_option( 'course_archive_page' );
			if ( 0 < $id ) {
				// Get Theme Options from the courses page
				$courses_meta = get_post_meta( $id, 'pets_grooming_options', true );
				// Add (override) with current post (course) options
				if ( is_array( $courses_meta ) && count( $courses_meta ) > 0 ) {
					// Get Theme Options from the current post/page
					$options_meta = pets_grooming_storage_get( 'options_meta' );
					if ( is_array( $options_meta ) ) {
						$courses_meta = array_merge( $courses_meta, $options_meta );
					}
					pets_grooming_storage_set( 'options_meta', $courses_meta );
				}
			}
		}
	}
}


// Check if meta box is allowed
if ( ! function_exists( 'pets_grooming_tutor_allow_override_options' ) ) {
	if ( ! PETS_GROOMING_THEME_FREE ) {
		add_filter( 'pets_grooming_filter_allow_override_options', 'pets_grooming_tutor_allow_override_options', 10, 2);
	}
	function pets_grooming_tutor_allow_override_options( $allow, $post_type ) {
		return $allow || ( pets_grooming_exists_tutor() && tutor()->course_post_type == $post_type );
	}
}


// Return current page title
if ( !function_exists( 'pets_grooming_tutor_get_blog_title' ) ) {
	//Handler of the add_filter( 'trx_addons_filter_get_blog_title', 'pets_grooming_tutor_get_blog_title' );
	function pets_grooming_tutor_get_blog_title( $title = '' ) {
		if ( ! pets_grooming_exists_trx_addons() && pets_grooming_exists_tutor() && is_post_type_archive( tutor()->course_post_type ) ) {
			$id = (int)tutor_utils()->get_option( 'course_archive_page' );
			$title = $id ? get_the_title( $id ) : esc_html__( 'Tutor LMS', 'pets-grooming' );
		}
		return $title;
	}
}


// Add 'course' to the list of the supported post-types
if ( ! function_exists( 'pets_grooming_tutor_list_post_types' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_list_posts_types', 'pets_grooming_tutor_list_post_types');
	function pets_grooming_tutor_list_post_types( $list = array() ) {
		if ( pets_grooming_exists_tutor() ) {
			$list[ tutor()->course_post_type ] = esc_html__( 'Courses', 'pets-grooming' );
		}
		return $list;
	}
}



// Redirect Tutor templates to the skin
//------------------------------------------------------------------------

// Search theme-specific template's part in the skin dir (if exists)
if ( ! function_exists( 'pets_grooming_tutor_get_template_part_path' ) ) {
	//Handler of the add_filter( 'tutor_get_template_part_path', 'pets_grooming_tutor_get_template_part_path', 10000, 2 );
	function pets_grooming_tutor_get_template_part_path( $path, $template ) {
		$theme_dir = apply_filters( 'pets_grooming_filter_get_theme_file_dir', '', "tutor/template.php" );
		if ( '' != $theme_dir ) {
			$path = $theme_dir;
		}
		return $path;
	}
}

// Search theme-specific template in the skin dir (if exists)
if ( ! function_exists( 'pets_grooming_tutor_get_template_path' ) ) {
	//Handler of the add_filter( 'tutor_get_template_path', 'pets_grooming_tutor_get_template_path', 10000, 5 );
	function pets_grooming_tutor_get_template_path( $path, $template ) {
		$theme_dir = apply_filters( 'pets_grooming_filter_get_theme_file_dir', '', "tutor/{$template}.php" );
		if ( '' != $theme_dir ) {
			$path = $theme_dir;
		}
		return $path;
	}
}



// Add Tutor specific items into lists
//------------------------------------------------------------------------

// Add sidebar
if ( ! function_exists( 'pets_grooming_tutor_list_sidebars' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_list_sidebars', 'pets_grooming_tutor_list_sidebars' );
	function pets_grooming_tutor_list_sidebars( $list = array() ) {
		$list['tutor_widgets'] = array(
			'name'        => esc_html__( 'Tutor Widgets', 'pets-grooming' ),
			'description' => esc_html__( 'Widgets to be shown on the Tutor LMS pages', 'pets-grooming' ),
		);
		return $list;
	}
}



// Decorate courses
//------------------------------------------------------------------------

// Replace a Tutor thumbsize with a theme-specific one
if ( ! function_exists( 'pets_grooming_tutor_course_thumbnail_size' ) ) {
	//Handler of the add_filter( 'tutor_course_thumbnail_size', 'pets_grooming_tutor_course_thumbnail_size', 10, 2 );
	function pets_grooming_tutor_course_thumbnail_size( $thumb_size ) {
		$thumb_size = pets_grooming_get_thumb_size( 'big' );
		return $thumb_size;
	}
}

// Add plugin-specific colors and fonts to the custom CSS
if ( pets_grooming_exists_tutor() ) {
	$pets_grooming_fdir = pets_grooming_get_file_dir( 'plugins/tutor/tutor-style.php' );
	if ( ! empty( $pets_grooming_fdir ) ) {
		require_once $pets_grooming_fdir;
	}
}
