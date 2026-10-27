// The design config only describes LOOK. Copy and images must come from somewhere else.
// Replace these with real data once the backend exposes it (or have the LLM generate copy too).
export const demoContent = (shopName = 'NexOra') => ({
  logo: shopName,
  hero: {
    title: 'New season, new standard',
    description: `Fresh drops from ${shopName}. Shop what is trending this week.`,
    cta: 'Shop the collection', cta2: 'View lookbook', image: null, chip: 'Just landed', chipSub: 'New this week',
  },
  categories: ['Phones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Accessories']
    .map((name, i) => ({ id: `c${i}`, name, count: 12 + i * 3, image: null })),
  promotion: { title: 'Built for everyday carry', description: 'Limited run pieces designed to last. Available while stock holds.', cta: 'Shop collection', image: null },
  banner: { title: 'Weekend sale: up to 40% off', description: 'Ends Sunday at midnight.', cta: 'Shop the sale', image: null },
  newsletter: { title: 'Get first access to new drops', description: 'One email a week. Unsubscribe any time.' },
  footer: {
    description: `${shopName} brings you quality products with fast delivery.`,
    columns: [
      { title: 'About', links: ['Our story', 'Careers', 'Press'] },
      { title: 'Customer service', links: ['Contact us', 'Shipping', 'Returns'] },
      { title: 'Shopping', links: ['New arrivals', 'Best sellers', 'Sale'] },
      { title: 'Support', links: ['Help centre', 'Track order', 'Warranty'] },
    ],
    email: 'hello@nexora.example', phone: '+94 77 942 1354', address: 'Negombo, Sri Lanka',
    social: ['Instagram', 'Facebook', 'TikTok', 'YouTube'], payments: ['Visa', 'Mastercard', 'PayPal', 'COD'],
  },
})

// Used only when the shop has no active products, so you can still see the design.
export const demoProducts = [
  ['Aero Hoodie', 59, 79, 4.6, 120, 'NEW'], ['Street Tee', 24, null, 4.2, 88, null],
  ['Cargo Pants', 69, 89, 4.8, 203, 'SALE'], ['Trail Sneakers', 99, 129, 4.5, 64, null],
  ['Utility Jacket', 129, null, 4.7, 41, 'LIMITED'], ['Daily Cap', 19, 25, 4.1, 77, null],
  ['Crossbody Bag', 45, null, 4.4, 52, 'NEW'], ['Wool Beanie', 22, 30, 4.3, 95, null],
].map(([name, price, original_price, rating, review_count, badge], i) => ({
  _id: `demo${i}`, name, price, original_price, rating, review_count, badge, images: [], status: true,
}))
