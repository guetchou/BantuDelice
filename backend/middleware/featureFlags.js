
const { pool } = require('../config/database');

// In-memory cache for feature flags
let featureFlagsCache = {};
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Refreshes the feature flags cache from the database
 */
const refreshFeatureFlags = async () => {
  try {
    const [features] = await pool.query('SELECT * FROM feature_flags');
    
    const flags = {};
    features.forEach(feature => {
      flags[feature.feature_name] = feature.is_enabled;
    });
    
    // Ensure availability feature flags are always defined
    if (flags.dynamic_menu_availability === undefined) {
      flags.dynamic_menu_availability = true;
    }
    
    if (flags.restaurant_temporary_closure === undefined) {
      flags.restaurant_temporary_closure = true;
    }
    
    if (flags.special_hours_management === undefined) {
      flags.special_hours_management = true;
    }
    
    featureFlagsCache = flags;
    lastFetchTime = Date.now();
    
    return flags;
  } catch (err) {
    console.error('Error fetching feature flags:', err);
    return {
      dynamic_menu_availability: true,
      restaurant_temporary_closure: true,
      special_hours_management: true
    };
  }
};

/**
 * Gets all feature flags, either from cache or database
 */
const getFeatureFlags = async () => {
  const now = Date.now();
  
  // If cache is expired or empty, refresh it
  if (now - lastFetchTime > CACHE_TTL || Object.keys(featureFlagsCache).length === 0) {
    return await refreshFeatureFlags();
  }
  
  return featureFlagsCache;
};

/**
 * Checks if a specific feature is enabled
 */
const isFeatureEnabled = async (featureName) => {
  const flags = await getFeatureFlags();
  return flags[featureName] === true;
};

/**
 * Middleware that adds feature flags to the request object
 */
const featureFlagsMiddleware = async (req, res, next) => {
  try {
    const flags = await getFeatureFlags();
    req.featureFlags = flags;
    
    // Add a helper method to check if a feature is enabled
    req.isFeatureEnabled = (featureName) => {
      return req.featureFlags[featureName] === true;
    };
    
    next();
  } catch (err) {
    console.error('Error in feature flags middleware:', err);
    next();
  }
};

module.exports = featureFlagsMiddleware;
module.exports.isFeatureEnabled = isFeatureEnabled;
module.exports.refreshFeatureFlags = refreshFeatureFlags;
