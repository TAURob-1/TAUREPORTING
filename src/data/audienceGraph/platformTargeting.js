/**
 * Platform Targeting Capabilities — Maps audience attributes to ad platform features.
 *
 * Covers major platforms: Google (Search, Display, YouTube, DV360),
 * Meta (Facebook, Instagram), TikTok, Amazon (DSP, Prime Video),
 * Snapchat, Pinterest, LinkedIn.
 *
 * Each entry includes:
 * - ease: 'native' (built-in targeting), 'custom' (needs audience list/setup), 'limited' (partial support)
 * - segment: the actual targeting option name on the platform
 * - notes: practical activation guidance
 */

export const PLATFORMS = {
  google:   { label: 'Google Ads',    color: '#4285f4', icon: 'G' },
  meta:     { label: 'Meta',          color: '#0668e1', icon: 'M' },
  tiktok:   { label: 'TikTok',        color: '#010101', icon: 'T' },
  amazon:   { label: 'Amazon DSP',    color: '#ff9900', icon: 'A' },
  snapchat: { label: 'Snapchat',      color: '#fffc00', icon: 'S' },
  pinterest:{ label: 'Pinterest',     color: '#e60023', icon: 'P' },
  linkedin: { label: 'LinkedIn',      color: '#0a66c2', icon: 'L' },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

/**
 * Class-level defaults — every attribute in that class gets at least these.
 */
export const PLATFORM_CLASS_DEFAULTS = {
  DEMO: {
    google:   { ease: 'native', segment: 'Demographics > Age & Gender', notes: 'Direct age/gender targeting in Search, Display, YouTube. Also available in DV360.' },
    meta:     { ease: 'native', segment: 'Demographics > Age & Gender', notes: 'Core demographic targeting. Very precise due to declared user data.' },
    tiktok:   { ease: 'native', segment: 'Demographics > Age & Gender', notes: 'Standard demographic targeting. Age bands match platform registration data.' },
    amazon:   { ease: 'native', segment: 'Amazon Audiences > Demographics', notes: 'Age/gender segments available via Amazon DSP. Based on purchase and browsing signals.' },
    snapchat: { ease: 'native', segment: 'Demographics > Age & Gender', notes: 'Standard demo targeting. Skews younger (13-34 core audience).' },
    pinterest:{ ease: 'native', segment: 'Demographics > Age & Gender', notes: 'Basic demographic targeting available.' },
    linkedin: { ease: 'native', segment: 'Demographics > Age & Gender', notes: 'Age targeting via age ranges. Gender available. Professional context adds value.' },
  },
  SOCIO: {
    google:   { ease: 'native', segment: 'Demographics > Household Income', notes: 'Top 10%-50% household income tiers available in Search/Display. UK postcode-based.' },
    meta:     { ease: 'limited', segment: 'Behaviors > Financial', notes: 'No direct income targeting in UK. Use interests in luxury/budget brands as proxy.' },
    tiktok:   { ease: 'limited', segment: 'Interest > Finance', notes: 'No direct socioeconomic targeting. Use interest and behavioral signals as proxy.' },
    amazon:   { ease: 'native', segment: 'Lifestyle > Income Segments', notes: 'Purchase-based income inference. Amazon knows spending patterns well.' },
    linkedin: { ease: 'native', segment: 'Demographics > Job Seniority + Company Size', notes: 'Best platform for socioeconomic targeting via professional data. Seniority = income proxy.' },
  },
  GEO: {
    google:   { ease: 'native', segment: 'Locations > UK Regions & Postcodes', notes: 'Granular geo targeting down to postcode. Radius targeting available. Best-in-class geo.' },
    meta:     { ease: 'native', segment: 'Locations > UK Regions & Postcodes', notes: 'Location targeting by region, city, postcode. Living-in vs recently-in distinction.' },
    tiktok:   { ease: 'native', segment: 'Location > UK Regions', notes: 'Country and region-level targeting. Less granular than Google/Meta.' },
    amazon:   { ease: 'native', segment: 'Location > UK Regions', notes: 'Region and city-level geo targeting via DSP.' },
    snapchat: { ease: 'native', segment: 'Locations > UK Regions', notes: 'Geo targeting available. Radius and predefined regions.' },
    pinterest:{ ease: 'native', segment: 'Locations > UK Regions', notes: 'Region and city-level geo targeting.' },
    linkedin: { ease: 'native', segment: 'Locations > UK Regions & Cities', notes: 'Location by country, region, city. Based on profile and IP data.' },
  },
  BEHAV: {
    google:   { ease: 'native', segment: 'Audiences > In-Market & Affinity', notes: 'Rich behavioral targeting via In-Market (active purchase intent) and Affinity (lifestyle) audiences.' },
    meta:     { ease: 'native', segment: 'Detailed Targeting > Interests & Behaviors', notes: 'Extensive interest/behavior targeting. Based on engagement, page likes, and activity signals.' },
    tiktok:   { ease: 'native', segment: 'Interest & Behavior Targeting', notes: 'Interest categories and video interaction behaviors. Growing taxonomy.' },
    amazon:   { ease: 'native', segment: 'In-Market & Lifestyle Audiences', notes: 'Purchase-based behavioral data is very strong. In-market audiences based on actual shopping behavior.' },
    snapchat: { ease: 'native', segment: 'Interests > Lifestyle Categories', notes: 'Snap Lifestyle Categories cover key behavioral segments.' },
    pinterest:{ ease: 'native', segment: 'Interests > Categories', notes: 'Strong intent signals from Pin engagement. Users actively planning purchases.' },
  },
  PSYCH: {
    google:   { ease: 'native', segment: 'Audiences > Affinity Segments', notes: 'Affinity audiences map well to psychographic profiles. Custom Affinity for niche segments.' },
    meta:     { ease: 'native', segment: 'Detailed Targeting > Interests', notes: 'Interest targeting maps closely to psychographic profiles. Combine multiple interests for precision.' },
    tiktok:   { ease: 'native', segment: 'Interest Targeting', notes: 'Interest categories available. Hashtag targeting adds psychographic signal.' },
    amazon:   { ease: 'native', segment: 'Lifestyle Audiences', notes: 'Lifestyle segments like "Health Enthusiast" or "Luxury Shopper" based on purchase patterns.' },
    pinterest:{ ease: 'native', segment: 'Interests + Keyword Targeting', notes: 'Very strong for psychographic targeting. Users self-select via boards and pins.' },
  },
  PURCH: {
    google:   { ease: 'native', segment: 'Audiences > In-Market Segments', notes: 'In-Market audiences track active purchase research. Very strong for auto, fashion, electronics.' },
    meta:     { ease: 'native', segment: 'Behaviors > Purchase Behavior', notes: 'Purchase behavior categories available. Combine with Lookalikes of purchasers for scale.' },
    tiktok:   { ease: 'custom', segment: 'Custom Audiences + Interest', notes: 'Upload CRM purchaser lists. Use interest targeting as proxy for purchase intent.' },
    amazon:   { ease: 'native', segment: 'In-Market & Purchase Audiences', notes: 'Best platform for purchase targeting. Actual transaction data, no proxies needed.' },
    pinterest:{ ease: 'native', segment: 'Shopping & Product Audiences', notes: 'High-intent platform. Users actively researching purchases. Shopping ads + catalogs.' },
  },
  CONTEXT: {
    google:   { ease: 'native', segment: 'Content Targeting > Topics & Placements', notes: 'Contextual targeting via topics, placements, and keywords on Display/YouTube.' },
    meta:     { ease: 'limited', segment: 'Topic Exclusions / Inventory Filters', notes: 'Limited contextual control. Brand safety filters and topic exclusions available.' },
    tiktok:   { ease: 'limited', segment: 'Content Themes (Pulse)', notes: 'TikTok Pulse places ads next to top content in categories. Limited but growing.' },
    amazon:   { ease: 'native', segment: 'Contextual > Product & Category Targeting', notes: 'Target by product category, ASIN, or content theme on Amazon properties.' },
  },
  MEDIA: {
    google:   { ease: 'native', segment: 'Placements > Channels & Apps', notes: 'Direct channel/app targeting on YouTube and Display. DV360 for programmatic.' },
    meta:     { ease: 'native', segment: 'Placements > Facebook, Instagram, Messenger, Audience Network', notes: 'Placement-level control across Meta properties.' },
    tiktok:   { ease: 'native', segment: 'Placements > TikTok, Pangle', notes: 'In-feed, TopView, Branded effects. Pangle for app network.' },
    amazon:   { ease: 'native', segment: 'Placements > Prime Video, Twitch, Fire TV, IMDb', notes: 'Access to Prime Video ads, Twitch, Fire TV, IMDb, and Amazon.com inventory.' },
    snapchat: { ease: 'native', segment: 'Placements > Snap, Stories, Spotlight, Discover', notes: 'Snap Ads, Story Ads, Spotlight, and Discover placements.' },
  },
};

/**
 * Attribute-specific overrides — more precise targeting info for specific attributes.
 * Falls back to class default if no entry here.
 */
export const PLATFORM_TARGETING = {
  // BEHAV specifics
  'BEHAV.tech_enthusiast': {
    google:   { ease: 'native', segment: 'Affinity: Technology > Technophiles; In-Market: Electronics', notes: 'Strong affinity and in-market segments. Custom intent with tech product keywords.' },
    meta:     { ease: 'native', segment: 'Interests: Technology, Early Adopters, Gadgets', notes: 'Layer tech interests with device targeting (latest devices = tech enthusiasts).' },
    tiktok:   { ease: 'native', segment: 'Interest: Technology & Electronics', notes: 'Tech content is huge on TikTok. Hashtag targeting: #tech, #gadgets, #unboxing.' },
    amazon:   { ease: 'native', segment: 'In-Market: Electronics, Computers & Accessories', notes: 'Target active electronics shoppers. Product category and ASIN targeting very effective.' },
  },
  'BEHAV.fitness_active': {
    google:   { ease: 'native', segment: 'Affinity: Health & Fitness Buffs; In-Market: Sports & Fitness', notes: 'YouTube fitness content targeting is very strong. Combine with app targeting (Strava, MyFitnessPal).' },
    meta:     { ease: 'native', segment: 'Interests: Fitness, Gym, Running, Yoga, CrossFit', notes: 'Very detailed fitness sub-interests. Target gym check-ins and fitness app users.' },
    tiktok:   { ease: 'native', segment: 'Interest: Sports & Outdoors > Fitness', notes: 'FitTok is massive. Hashtag targeting very effective for fitness audiences.' },
    amazon:   { ease: 'native', segment: 'In-Market: Sports & Outdoors; Lifestyle: Fitness Enthusiasts', notes: 'Target supplement buyers, gym equipment shoppers. Strong purchase-based signal.' },
  },
  'BEHAV.frequent_traveller': {
    google:   { ease: 'native', segment: 'In-Market: Travel > Flights, Hotels, Packages', notes: 'Google Travel data gives excellent in-market signals. Search + Display combo very strong.' },
    meta:     { ease: 'native', segment: 'Behaviors: Frequent Travellers; Interests: Travel', notes: 'Frequent traveller behavior segment available. Combine with travel-related page engagement.' },
    tiktok:   { ease: 'native', segment: 'Interest: Travel', notes: 'Travel content trending. Hashtag targeting: #traveltok, #uktravel.' },
    amazon:   { ease: 'native', segment: 'In-Market: Travel Luggage & Accessories', notes: 'Target travel gear buyers. Cross-reference with Prime Video travel content viewers.' },
  },
  'BEHAV.skiing_winter_sports': {
    google:   { ease: 'native', segment: 'Affinity: Winter Sports Enthusiasts; In-Market: Ski & Snowboard', notes: 'Seasonal ramp-up Oct-Feb. Custom intent with ski resort and equipment keywords.' },
    meta:     { ease: 'native', segment: 'Interests: Skiing, Snowboarding, Ski Resorts', notes: 'Detailed winter sports interests. Target users who engaged with ski resort pages.' },
    tiktok:   { ease: 'native', segment: 'Interest: Sports & Outdoors > Winter Sports', notes: 'SkiTok community. Hashtag targeting in-season very effective.' },
    amazon:   { ease: 'native', segment: 'In-Market: Winter Sports Equipment', notes: 'Ski equipment shoppers, base layer clothing, goggles, etc.' },
  },
  'BEHAV.gaming': {
    google:   { ease: 'native', segment: 'Affinity: Avid Gamers; In-Market: Gaming Consoles & PCs', notes: 'YouTube gaming is huge. Target gaming channels, apps, and in-market segments.' },
    meta:     { ease: 'native', segment: 'Interests: Video Games, Gaming, Esports', notes: 'Detailed game-specific and platform-specific interest targeting.' },
    tiktok:   { ease: 'native', segment: 'Interest: Games > Mobile Games, Console Games', notes: 'GamingTok massive. Hashtag and creator targeting very effective.' },
    amazon:   { ease: 'native', segment: 'In-Market: Video Games; Prime Video: Twitch Audiences', notes: 'Amazon owns Twitch. Cross-platform gaming audience targeting is uniquely strong.' },
    snapchat: { ease: 'native', segment: 'Interests: Gaming', notes: 'Snap Games ecosystem. Strong reach with 13-24 gamers.' },
  },
  'BEHAV.grocery_frequent': {
    google:   { ease: 'native', segment: 'In-Market: Groceries & Food; Affinity: Cooking Enthusiasts', notes: 'Local search targeting (near me) + display on recipe sites.' },
    meta:     { ease: 'native', segment: 'Behaviors: Grocery Shoppers; Interests: Cooking, Recipes', notes: 'Facebook Marketplace and grocery delivery app users targetable.' },
    amazon:   { ease: 'native', segment: 'Amazon Fresh & Whole Foods Audiences', notes: 'Best platform — actual grocery purchase data. Amazon Fresh/Whole Foods shoppers.' },
  },

  // PSYCH specifics
  'PSYCH.luxury_oriented': {
    google:   { ease: 'native', segment: 'Affinity: Luxury Shoppers; Demographics: Top 10% Income', notes: 'Combine income targeting with luxury affinity. YouTube luxury content targeting.' },
    meta:     { ease: 'native', segment: 'Interests: Luxury Goods, Designer Brands, Fine Dining', notes: 'Detailed luxury brand interests. Instagram is the premium surface here.' },
    amazon:   { ease: 'native', segment: 'Lifestyle: Luxury Shoppers', notes: 'Target buyers of premium brands. Price-point targeting via product categories.' },
    pinterest:{ ease: 'native', segment: 'Interests: Luxury, High-End Fashion, Interior Design', notes: 'Pinterest over-indexes on luxury aspiration and planning. Very strong platform for this.' },
    linkedin: { ease: 'native', segment: 'Demographics: Senior + C-Suite + High-Revenue Companies', notes: 'Target by seniority and company size as luxury income proxy.' },
  },
  'PSYCH.eco_conscious': {
    google:   { ease: 'native', segment: 'Affinity: Green Living Enthusiasts', notes: 'Custom affinity with sustainability terms. YouTube eco-content targeting.' },
    meta:     { ease: 'native', segment: 'Interests: Sustainability, Eco-Friendly, Climate Change', notes: 'Environmental interest targeting. Pages/groups engagement signals.' },
    pinterest:{ ease: 'native', segment: 'Interests: Sustainability, Zero Waste, Eco Living', notes: 'Strong eco-lifestyle community on Pinterest. Boards signal genuine interest.' },
  },
  'PSYCH.price_sensitive_psych': {
    google:   { ease: 'native', segment: 'In-Market: Deals & Coupons; Demographics: Lower Income Tiers', notes: 'Target deal-seeking search behavior. Combine with income demographics.' },
    meta:     { ease: 'native', segment: 'Interests: Coupons, Deals, Discount Shopping', notes: 'Target users engaging with deal pages and cashback apps.' },
    amazon:   { ease: 'native', segment: 'Audiences: Bargain Shoppers, Deal Seekers', notes: 'Target users who primarily buy during deals/sales, use Subscribe & Save, or clip coupons.' },
  },

  // PURCH specifics
  'PURCH.auto_intender': {
    google:   { ease: 'native', segment: 'In-Market: Vehicles > Cars (New & Used)', notes: 'Very strong. Google Automotive Ads. Search intent is the #1 signal for auto purchase.' },
    meta:     { ease: 'native', segment: 'Behaviors: New Vehicle Shoppers; Interests: Car Brands', notes: 'Marketplace vehicle listings engagement. Brand-specific interest targeting.' },
    tiktok:   { ease: 'native', segment: 'Interest: Vehicles & Transportation', notes: 'CarTok growing. Hashtag and creator partnerships effective for brand awareness.' },
    amazon:   { ease: 'native', segment: 'In-Market: Automotive Parts & Accessories', notes: 'Accessories and maintenance products. Less effective for vehicle purchase intent.' },
  },
  'PURCH.fashion_buyer': {
    google:   { ease: 'native', segment: 'In-Market: Apparel & Accessories; Shopping Ads', notes: 'Google Shopping is key channel. In-market segments by clothing category.' },
    meta:     { ease: 'native', segment: 'Interests: Fashion, Shopping, Specific Brands', notes: 'Instagram is the primary fashion discovery platform. Shop feature integration.' },
    tiktok:   { ease: 'native', segment: 'Interest: Apparel & Accessories', notes: 'TikTok Shop integration. #FashionTok drives major purchase influence.' },
    pinterest:{ ease: 'native', segment: 'Interests: Fashion, Style, Shopping', notes: 'Top platform for fashion discovery and planning. Shopping Pins + catalogs.' },
    snapchat: { ease: 'native', segment: 'Interests: Fashion & Style', notes: 'AR try-on features for fashion. Strong with younger fashion audiences.' },
  },
  'PURCH.premium_buyer': {
    google:   { ease: 'native', segment: 'Demographics: Top 10% Income; Affinity: Luxury Shoppers', notes: 'Combine income tier with affinity. YouTube premium content targeting.' },
    meta:     { ease: 'native', segment: 'Interests: Premium Brands, Luxury', notes: 'Instagram premium surface. Value-based Lookalikes from high-LTV customers.' },
    amazon:   { ease: 'native', segment: 'Lifestyle: Premium Shoppers', notes: 'Target buyers in premium product categories. Amazon knows actual purchase prices.' },
  },

  // DEMO specifics
  'DEMO.age_18_24': {
    snapchat: { ease: 'native', segment: 'Demographics: Age 18-24', notes: 'Snapchat core demo. 75%+ of 18-24s on platform. Best reach for this age group after Meta.' },
    tiktok:   { ease: 'native', segment: 'Demographics: Age 18-24', notes: 'TikTok over-indexes massively with 18-24. Highest engagement rates for this demo.' },
  },
  'DEMO.age_65_plus': {
    google:   { ease: 'native', segment: 'Demographics: Age 65+', notes: 'Google Search is the primary digital channel for 65+. YouTube also has strong reach.' },
    meta:     { ease: 'native', segment: 'Demographics: Age 65+', notes: 'Facebook (not Instagram) is the key surface. Fastest-growing demo on Facebook.' },
  },

  // SOCIO specifics
  'SOCIO.income_high': {
    google:   { ease: 'native', segment: 'Demographics: Household Income Top 10%', notes: 'Direct income targeting in UK. Postcode-inferred. Very effective for premium products.' },
    linkedin: { ease: 'native', segment: 'Job Seniority: Director/VP/C-Suite; Company Size: 500+', notes: 'Best platform for high-income targeting via professional signals.' },
    amazon:   { ease: 'native', segment: 'Lifestyle: High Spenders', notes: 'Amazon can target by actual purchase value patterns. No proxy needed.' },
  },

  // CONTEXT specifics
  'CONTEXT.seasonal_summer': {
    google:   { ease: 'native', segment: 'Seasonal Events > Summer; In-Market: Summer Travel, BBQ, Outdoor', notes: 'Seasonal search surge. Automated seasonal campaigns via Performance Max.' },
    meta:     { ease: 'native', segment: 'Interests: Summer Activities, Beach, Festivals', notes: 'Summer lifestyle interest targeting. Story/Reel ads for summer content.' },
    amazon:   { ease: 'native', segment: 'Seasonal: Summer Essentials, Outdoor & Garden', notes: 'Summer product category targeting. Amazon seasonal storefronts.' },
  },
  'CONTEXT.seasonal_winter': {
    google:   { ease: 'native', segment: 'Seasonal Events > Christmas, Winter; Shopping Ads', notes: 'Critical for Christmas. Google Shopping + seasonal search intent.' },
    meta:     { ease: 'native', segment: 'Behaviors: Christmas Shoppers; Interests: Winter Activities', notes: 'Holiday shopping behaviors. Advantage+ Shopping campaigns for gifting.' },
    amazon:   { ease: 'native', segment: 'Seasonal: Christmas, Black Friday, Winter Essentials', notes: 'Amazon dominates winter/Christmas gift shopping. Seasonal deal events (Black Friday, Prime Day).' },
  },
};

/**
 * Get platform targeting for a specific attribute.
 * Falls back to class-level defaults, merging specific overrides on top.
 */
export function getPlatformTargeting(classKey, attrKey) {
  const key = `${classKey}.${attrKey}`;
  const classDefaults = PLATFORM_CLASS_DEFAULTS[classKey] || {};
  const specific = PLATFORM_TARGETING[key] || {};

  // Merge: specific overrides class defaults
  const merged = { ...classDefaults };
  for (const [platform, data] of Object.entries(specific)) {
    merged[platform] = data;
  }

  return merged;
}

/**
 * Get aggregated platform targeting across multiple attributes.
 * Returns Map<platformKey, { platform, entries: [{classKey, attrKey, label, ...targeting}] }>
 */
export function getAggregatedPlatformTargeting(selectedAttributes = []) {
  const byPlatform = {};

  for (const { classKey, attrKey, label } of selectedAttributes) {
    const targeting = getPlatformTargeting(classKey, attrKey);

    for (const [platformKey, data] of Object.entries(targeting)) {
      if (!byPlatform[platformKey]) {
        byPlatform[platformKey] = {
          ...PLATFORMS[platformKey],
          platformKey,
          entries: [],
        };
      }
      byPlatform[platformKey].entries.push({
        classKey,
        attrKey,
        label: label || `${classKey}.${attrKey}`,
        ...data,
      });
    }
  }

  // Sort platforms by number of native entries (most capable first)
  return Object.values(byPlatform).sort((a, b) => {
    const aNative = a.entries.filter((e) => e.ease === 'native').length;
    const bNative = b.entries.filter((e) => e.ease === 'native').length;
    return bNative - aNative;
  });
}
