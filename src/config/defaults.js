// Safe fallbacks. Every section merges the LLM config over these, so a missing key never crashes the shop.
const btn = { style: 'filled', size: 'medium', shape: 'rounded', alignment: 'center', show_icon: false, icon_position: 'right' }
const border = { enabled: false, width: 'thin', style: 'solid', color: null, radius: 'medium' }
const anim = { enabled: true, type: 'fade', duration: 'normal', trigger: 'visible' }
const bpMap = (m, t, d, l) => ({ mobile: m, tablet: t, desktop: d, large_desktop: l })

export const DEFAULT_THEME = {
  primary_color: '#111827', secondary_color: '#374151', accent_color: '#000000',
  background_color: '#FFFFFF', surface_color: '#F9FAFB', text_color: '#111827',
  muted_text_color: '#6B7280', border_color: '#E5E7EB',
  success_color: '#16A34A', warning_color: '#F59E0B', error_color: '#DC2626',
  typography: { font_family: 'inter', heading_size: 'large', body_size: 'medium', heading_weight: 'semibold',
    body_weight: 'normal', text_alignment: 'left', heading_color: null, body_color: null },
  global_border_radius: 'medium', global_shadow: 'subtle',
}
export const DEFAULT_LAYOUT = {
  max_width: 'large', alignment: 'center', section_gap: 'large',
  page_padding: bpMap('small', 'medium', 'large', 'large'),
  background: { type: 'solid', color: null, secondary_color: null, gradient_direction: 'horizontal' },
}
export const DEFAULT_HEADER = {
  enabled: true, layout: 'logo-left-menu-center', sticky: true, transparent: false, height: 'medium',
  show_logo: true, show_search: true, show_cart: true, show_wishlist: true, show_account: true,
  show_categories: true, show_menu_button_mobile: true, background_color: null, text_color: null,
  border: border, shadow: { enabled: false, level: 'subtle' },
}
export const DEFAULT_NAV = { enabled: true, show_home: true, show_categories: true, show_featured: true,
  show_new_arrivals: true, show_sale: true, mobile_style: 'drawer' }
export const DEFAULT_MOBILE_NAV = { enabled: true, style: 'drawer', show_home: true, show_categories: true,
  show_search: true, show_cart: true, show_account: true, show_wishlist: true, fixed: true }
export const DEFAULT_SEARCH = { enabled: true, placeholder: 'Search products...', show_search_button: true }
export const DEFAULT_HERO = {
  enabled: true, layout: 'image-right', height: 'large', text_alignment: 'left', vertical_alignment: 'center',
  overlay: false, overlay_opacity: 0.3, show_title: true, show_description: true,
  show_primary_button: true, show_secondary_button: false,
  primary_button: btn, secondary_button: { ...btn, style: 'outline' }, animation: anim,
}
export const DEFAULT_CATEGORIES = {
  enabled: true, display_mode: 'horizontal_scroll', items_per_view: bpMap(2, 3, 4, 5), gap: 'medium',
  card: { style: 'rounded', image_shape: 'portrait', image_fit: 'cover', show_name: true, show_product_count: false,
    text_alignment: 'center', hover_effect: 'scale', border, shadow: { enabled: false, level: 'subtle' } },
  navigation: true, autoplay: false, autoplay_interval: 4000, show_title: true, title_alignment: 'left',
}
export const DEFAULT_CARD = {
  style: 'rounded', image_shape: 'portrait', image_fit: 'cover', image_ratio: '3:4',
  show_product_name: true, show_price: true, show_original_price: true, show_discount: true,
  show_rating: true, show_review_count: false, show_wishlist: true, show_quick_view: false,
  show_add_to_cart: true, show_stock_status: false, show_category: false, show_badge: true,
  button: btn, hover_effect: 'image_zoom', border, shadow: { enabled: false, level: 'subtle' },
  animation: anim, content_alignment: 'left', spacing: 'medium',
}
export const DEFAULT_PRODUCT_CONFIG = {
  display_mode: 'grid', columns: bpMap(2, 3, 4, 4), items_per_view: bpMap(2, 3, 4, 4), gap: 'medium',
  card: DEFAULT_CARD,
  navigation: { enabled: true, arrows: true, dots: false, drag: true, swipe: true, keyboard: true, infinite: true },
  autoplay: false, autoplay_interval: 4000, scroll_direction: 'right-to-left', infinite_scroll: false,
  show_title: true, title_alignment: 'left', show_view_all: false, view_all_button: { ...btn, style: 'outline' },
}
export const DEFAULT_NEWSLETTER = { enabled: true, layout: 'horizontal', title_alignment: 'center',
  show_title: true, show_description: true, input_style: 'outline', button: btn }
export const DEFAULT_FOOTER = { enabled: true, layout: 'columns', show_logo: true, show_description: true,
  show_contact: true, show_address: true, show_email: true, show_phone: true, show_social_media: true,
  show_newsletter: true, show_payment_methods: true, show_copyright: true, background_color: null, text_color: null }
export const DEFAULT_BEHAVIOUR = { enable_animations: true, enable_hover_effects: true, enable_smooth_scroll: true,
  show_scroll_to_top: true }
export const DEFAULT_ACCESSIBILITY = { high_contrast: false, reduce_motion: false, large_text: false }
