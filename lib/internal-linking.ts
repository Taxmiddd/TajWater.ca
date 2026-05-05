/**
 * Internal Linking Strategy
 * Creates strategic link patterns for better SEO and user navigation
 */

export const internalLinkingStrategy = {
  homepage: {
    description: 'Main entry point with links to all key sections',
    links: [
      { text: 'Order Now', href: '/shop', target: 'primary_cta' },
      { text: 'View All Cities', href: '/areas', target: 'city_hub' },
      { text: 'How It Works', href: '#how-it-works', target: 'process' },
      { text: 'Our Services', href: '/services', target: 'services' },
      { text: 'Contact Us', href: '/contact', target: 'footer' },
    ],
  },
  
  cityPages: {
    description: 'Each city page links to related cities and homepage',
    internalLinks: [
      { text: 'Back to All Areas', href: '/areas' },
      { text: 'Order Now', href: '/shop' },
      { text: 'View Our Pricing', href: '/#pricing' },
      { text: 'See How It Works', href: '/#how-it-works' },
    ],
    contextualLinks: {
      description: 'Links from description to nearby cities',
      pattern: 'When mentioning nearby cities in description, link to their pages',
    },
  },

  shopPages: {
    description: 'Product pages link back to city delivery info',
    crossLinks: [
      { text: 'Delivery Areas', href: '/areas' },
      { text: 'How It Works', href: '/#how-it-works' },
      { text: 'See Pricing', href: '/#pricing' },
      { text: 'Customer Reviews', href: '/#testimonials' },
    ],
  },

  strategicAnchors: [
    {
      placement: 'IntroContent component',
      links: [
        { text: 'Metro Vancouver delivery', href: '/areas' },
        { text: 'same-day delivery', href: '/#how-it-works' },
        { text: 'subscription plans', href: '/#pricing' },
        { text: 'water types', href: '/#water-guide' },
      ],
    },
    {
      placement: 'Comparison section',
      links: [
        { text: 'Order water delivery', href: '/shop' },
        { text: 'See our cities', href: '/areas' },
        { text: 'Check pricing', href: '/#pricing' },
      ],
    },
    {
      placement: 'Footer navigation',
      links: [
        { text: 'Service Areas', href: '/areas' },
        { text: 'Water Types', href: '/#water-guide' },
        { text: 'Shop', href: '/shop' },
        { text: 'Pricing', href: '/#pricing' },
        { text: 'Contact', href: '/contact' },
        { text: 'About', href: '/about' },
      ],
    },
  ],

  linkingFromBlog: {
    description: 'Blog posts link to relevant city pages and services',
    example: [
      {
        article: 'Benefits of Alkaline Water',
        links: [
          { text: 'Alkaline water delivery in Vancouver', href: '/areas/vancouver' },
          { text: 'Spring vs Alkaline water', href: '/#water-guide' },
          { text: 'Order alkaline water', href: '/shop' },
        ],
      },
      {
        article: '5 Reasons to Skip Big Box Water',
        links: [
          { text: 'TajWater vs competitors', href: '/#comparison' },
          { text: 'Our pricing', href: '/#pricing' },
          { text: 'Check delivery in your area', href: '/areas' },
        ],
      },
    ],
  },

  breadcrumbStrategy: {
    description: 'Breadcrumbs for navigation and schema',
    examples: [
      {
        page: 'City Page',
        breadcrumb: 'Home > Service Areas > [City Name]',
        markup: 'BreadcrumbList schema included',
      },
      {
        page: 'Product Page',
        breadcrumb: 'Home > Shop > [Product Name]',
        markup: 'BreadcrumbList schema included',
      },
      {
        page: 'Blog Post',
        breadcrumb: 'Home > Blog > [Category] > [Post Title]',
        markup: 'BreadcrumbList schema included',
      },
    ],
  },

  silotingStrategy: {
    description: 'Organize content into topic clusters for topical authority',
    clusters: [
      {
        pillar: 'Water Delivery in Metro Vancouver',
        related: [
          'Vancouver water delivery',
          'Burnaby water delivery',
          'Surrey water delivery',
          'Coquitlam water delivery',
          // ... all 21 cities
        ],
      },
      {
        pillar: 'Water Types & Quality',
        related: [
          'Spring water benefits',
          'Alkaline water delivery',
          'Distilled water uses',
          'Water filtration methods',
        ],
      },
      {
        pillar: 'Business & Pricing',
        related: [
          'Water delivery pricing',
          'Commercial water supply',
          'Subscription discounts',
          'Bulk water orders',
        ],
      },
    ],
  },

  keywordTargetingByPage: {
    homepage: ['water delivery vancouver', 'best water jug delivery', '5 gallon water delivery'],
    cityPages: ['water delivery [city]', '[city] water jug delivery', 'water delivery near me [city]'],
    shopPages: ['buy water jugs online', 'order water delivery', 'spring water jug'],
    servicesPage: ['water filter installation', 'commercial water supply', 'water testing'],
  },
}

/**
 * Internal Link Recommendations for Next.js Components
 * Add these to existing components for better linking
 */

export const componentLinkingGuide = {
  Hero: 'Add secondary CTA to /areas for city selection',
  
  IntroContent: 'Add contextual links to /areas for each mentioned city group',
  
  ComparisonShowcase: 'Add link to /shop in CTA section, link to /areas for "21 service cities"',
  
  PricingTable: 'Add links to city pages for regional pricing context',
  
  SavingsCalculator: 'Add "Order Now" link to /shop at end of calculator',
  
  HowItWorks: 'Add link to /areas in description for delivery area clarification',
  
  EnhancedTestimonials: 'Add city page links where testimonials mention specific cities',
  
  ExpandedFAQ: 'Add contextual links in FAQ answers (e.g., link to /areas in delivery questions)',
  
  Newsletter: 'Add link to referral page after signup',
}

/**
 * Recommended changes to existing components:
 * 1. IntroContent: Add links to /areas when listing service areas
 * 2. HowItWorks: Add link to delivery checker or /areas
 * 3. TrustSignals: Add link to testimonials/reviews section
 * 4. Footer: Create comprehensive footer with city links (optional for space)
 */
