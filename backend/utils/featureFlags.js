
// Feature flags utility
const features = {
  chatbot: process.env.FEATURE_CHATBOT === 'true',
  analytics: process.env.FEATURE_ANALYTICS === 'true'
};

// Get all enabled features
const getEnabledFeatures = () => {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
};

// Check if a feature is enabled
const isFeatureEnabled = (featureName) => {
  return features[featureName] === true;
};

// Middleware to attach feature flags to request
const middleware = (req, res, next) => {
  req.features = features;
  next();
};

module.exports = {
  getEnabledFeatures,
  isFeatureEnabled,
  middleware
};
