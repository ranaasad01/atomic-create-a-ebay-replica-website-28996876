export const APP_NAME = "eBay";
export const APP_TAGLINE = "Buy. Sell. Discover.";

export const BRAND_COLORS = {
  red: "#E53238",
  yellow: "#F5AF02",
  green: "#86B817",
  blue: "#105CB6",
  white: "#FFFFFF",
  lightGray: "#F7F7F7",
  darkGray: "#333333",
} as const;

export interface NavLink {
  label: string;
  href: string;
  type: "route" | "anchor";
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", type: "route" },
  { label: "Search", href: "/search", type: "route" },
  { label: "My eBay", href: "/user-profile-my-ebay", type: "route" },
  { label: "Watchlist", href: "/watchlist", type: "route" },
  { label: "Sell", href: "/sell-list-item", type: "route" },
  { label: "Cart", href: "/cart", type: "route" },
];

export const footerLinks = {
  buy: [
    { label: "Registration", href: "/register" },
    { label: "eBay Money Back Guarantee", href: "/" },
    { label: "Bidding & Buying Help", href: "/" },
    { label: "Stores", href: "/" },
    { label: "Seasonal Sales", href: "/" },
  ],
  sell: [
    { label: "Start Selling", href: "/sell-list-item" },
    { label: "Seller Center", href: "/seller-dashboard" },
    { label: "Listing Tips", href: "/" },
    { label: "Seller Fees", href: "/" },
    { label: "Seller Dashboard", href: "/seller-dashboard" },
  ],
  tools: [
    { label: "My eBay", href: "/user-profile-my-ebay" },
    { label: "Watchlist", href: "/watchlist" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Sign In", href: "/sign-in" },
  ],
  company: [
    { label: "About eBay", href: "/" },
    { label: "Announcements", href: "/" },
    { label: "Careers", href: "/" },
    { label: "Policies", href: "/" },
    { label: "Contact Us", href: "/" },
  ],
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  href: string;
}

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "💻", color: "#105CB6", href: "/search?category=electronics" },
  { id: "fashion", name: "Fashion", icon: "👗", color: "#E53238", href: "/search?category=fashion" },
  { id: "home", name: "Home & Garden", icon: "🏡", color: "#86B817", href: "/search?category=home" },
  { id: "motors", name: "Motors", icon: "🚗", color: "#333333", href: "/search?category=motors" },
  { id: "sports", name: "Sports", icon: "⚽", color: "#F5AF02", href: "/search?category=sports" },
  { id: "toys", name: "Toys", icon: "🧸", color: "#E53238", href: "/search?category=toys" },
  { id: "collectibles", name: "Collectibles", icon: "🏆", color: "#86B817", href: "/search?category=collectibles" },
  { id: "books", name: "Books", icon: "📚", color: "#105CB6", href: "/search?category=books" },
];

export interface Product {
  id: string;
  title: string;
  price: number;
  buyNowPrice?: number;
  currentBid?: number;
  bidCount?: number;
  isAuction: boolean;
  isBuyNow: boolean;
  image: string;
  category: string;
  condition: "New" | "Used" | "Refurbished" | "For Parts";
  seller: string;
  sellerRating: number;
  location: string;
  timeRemaining?: string;
  shipping: number | "Free";
  watchCount: number;
  description: string;
  images: string[];
}

export const featuredProducts: Product[] = [
  {
    id: "1",
    title: "Apple MacBook Pro 14-inch M3 Pro Chip 512GB SSD Space Gray",
    price: 1799.99,
    currentBid: 1650.00,
    bidCount: 23,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 1799.99,
    image: "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    images: ["https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg", "/images/macbook-pro-keyboard-closeup.jpg"],
    category: "electronics",
    condition: "New",
    seller: "tech_deals_pro",
    sellerRating: 99.8,
    location: "San Jose, CA",
    timeRemaining: "2d 4h",
    shipping: "Free",
    watchCount: 142,
    description: "Brand new sealed Apple MacBook Pro 14-inch with M3 Pro chip. 18GB unified memory, 512GB SSD. Space Gray finish. Includes all original accessories.",
  },
  {
    id: "2",
    title: "Sony PlayStation 5 Console Disc Edition Bundle with Extra Controller",
    price: 549.99,
    currentBid: 489.00,
    bidCount: 47,
    isAuction: true,
    isBuyNow: false,
    image: "https://i5.walmartimages.com/seo/Used-Sony-Playstation-5-Disc-Version-with-Extra-Controller-Bundle-with-Cleaning-Cloth-Starlight-Blue-Used_4eca79d7-bcc2-4522-a223-1309c5f67432.4e55d13d506bcbbfc24985624d511e0b.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    images: ["https://i5.walmartimages.com/seo/Used-Sony-Playstation-5-Disc-Version-with-Extra-Controller-Bundle-with-Cleaning-Cloth-Starlight-Blue-Used_4eca79d7-bcc2-4522-a223-1309c5f67432.4e55d13d506bcbbfc24985624d511e0b.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"],
    category: "electronics",
    condition: "New",
    seller: "gaming_warehouse",
    sellerRating: 98.5,
    location: "Austin, TX",
    timeRemaining: "1d 12h",
    shipping: 9.99,
    watchCount: 389,
    description: "PlayStation 5 Disc Edition with one extra DualSense controller. Ready to play. Ships same day.",
  },
  {
    id: "3",
    title: "Rolex Submariner Date 41mm Oystersteel Black Dial 2023",
    price: 12500.00,
    isAuction: false,
    isBuyNow: true,
    image: "https://watchesoff5th.com/cdn/shop/products/rolex-submariner-date-41mm-black-dial-new-release-2023-mkii-bezel-126610lv-455497_1280x.jpg?v=1693305086",
    images: ["https://watchesoff5th.com/cdn/shop/products/rolex-submariner-date-41mm-black-dial-new-release-2023-mkii-bezel-126610lv-455497_1280x.jpg?v=1693305086"],
    category: "collectibles",
    condition: "New",
    seller: "luxury_timepieces",
    sellerRating: 100,
    location: "New York, NY",
    shipping: "Free",
    watchCount: 521,
    description: "Authentic Rolex Submariner Date ref. 126610LN. Full set with box and papers. Purchased from authorized dealer.",
  },
  {
    id: "4",
    title: "Nike Air Jordan 1 Retro High OG Chicago Lost and Found Size 10",
    price: 320.00,
    currentBid: 285.00,
    bidCount: 18,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 320.00,
    image: "https://picsum.photos/seed/cb53363835ae/800/600",
    images: ["https://picsum.photos/seed/cb53363835ae/800/600"],
    category: "fashion",
    condition: "New",
    seller: "sneaker_vault",
    sellerRating: 99.1,
    location: "Chicago, IL",
    timeRemaining: "3d 8h",
    shipping: "Free",
    watchCount: 234,
    description: "DS Nike Air Jordan 1 Retro High OG Chicago Lost and Found. Size 10 US. Original box included.",
  },
  {
    id: "5",
    title: "DJI Mavic 3 Pro Drone with RC Controller Fly More Combo",
    price: 2199.00,
    isAuction: false,
    isBuyNow: true,
    image: "https://m.media-amazon.com/images/I/61NUtJBzofL.jpg",
    images: ["https://m.media-amazon.com/images/I/61NUtJBzofL.jpg"],
    category: "electronics",
    condition: "New",
    seller: "drone_world_usa",
    sellerRating: 97.9,
    location: "Los Angeles, CA",
    shipping: "Free",
    watchCount: 88,
    description: "DJI Mavic 3 Pro Fly More Combo with RC controller. Triple camera system, 43-min flight time. Sealed box.",
  },
  {
    id: "6",
    title: "Vintage Levi's 501 Denim Jacket 1980s Made in USA Size Large",
    price: 145.00,
    currentBid: 112.00,
    bidCount: 9,
    isAuction: true,
    isBuyNow: false,
    image: "https://media.vogue.co.uk/photos/60d098dee1390ff25b6805b2/2:3/w_2560%2Cc_limit/Imparfaite's%2520vintage%2520501%2520calculator%25202.jpeg",
    images: ["https://media.vogue.co.uk/photos/60d098dee1390ff25b6805b2/2:3/w_2560%2Cc_limit/Imparfaite's%2520vintage%2520501%2520calculator%25202.jpeg"],
    category: "fashion",
    condition: "Used",
    seller: "vintage_finds_co",
    sellerRating: 98.3,
    location: "Portland, OR",
    timeRemaining: "5d 2h",
    shipping: 8.50,
    watchCount: 67,
    description: "Authentic 1980s Levi's 501 denim jacket. Made in USA. Size Large. Minor fading consistent with age. Great vintage piece.",
  },
  {
    id: "7",
    title: "KitchenAid Artisan Stand Mixer 5-Qt Tilt-Head Empire Red",
    price: 379.99,
    isAuction: false,
    isBuyNow: true,
    image: "https://kitchenaidus.vtexassets.com/arquivos/ids/159110/hero-KSM150PSER.jpg?v=639007935384500000",
    images: ["https://kitchenaidus.vtexassets.com/arquivos/ids/159110/hero-KSM150PSER.jpg?v=639007935384500000"],
    category: "home",
    condition: "New",
    seller: "kitchen_essentials",
    sellerRating: 99.4,
    location: "Columbus, OH",
    shipping: "Free",
    watchCount: 156,
    description: "Brand new KitchenAid Artisan 5-Qt Stand Mixer in Empire Red. Includes flat beater, dough hook, and wire whip.",
  },
  {
    id: "8",
    title: "Pokemon Charizard Holo 1st Edition Base Set PSA 9 Mint",
    price: 8500.00,
    currentBid: 7200.00,
    bidCount: 34,
    isAuction: true,
    isBuyNow: false,
    image: "https://i.ebayimg.com/images/g/~5sAAeSwP8Zpj-0m/s-l400.jpg",
    images: ["https://i.ebayimg.com/images/g/~5sAAeSwP8Zpj-0m/s-l400.jpg"],
    category: "collectibles",
    condition: "Used",
    seller: "card_collector_elite",
    sellerRating: 100,
    location: "Seattle, WA",
    timeRemaining: "6h 45m",
    shipping: "Free",
    watchCount: 892,
    description: "PSA 9 Mint graded Pokemon Charizard Holo 1st Edition Base Set. Extremely rare. Certificate of authenticity included.",
  },
];

export type SortOption = "best-match" | "price-low" | "price-high" | "ending-soon" | "newly-listed" | "most-watched";

export interface FilterState {
  category: string;
  priceMin: string;
  priceMax: string;
  condition: string;
  location: string;
  sort: SortOption;
  listingType: string;
}