import express from 'express';
const router = express.Router();

/**
 * Get Mapbox access token
 * GET /api/config/mapbox-token
 * Returns the Mapbox access token for frontend use
 */
router.get('/mapbox-token', (req, res) => {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
    
    if (!mapboxToken) {
      return res.status(404).json({ 
        error: 'Mapbox token not configured',
        message: 'Le token Mapbox n\'est pas configuré sur le serveur'
      });
    }

    res.json({ 
      token: mapboxToken,
      message: 'Token Mapbox récupéré avec succès'
    });
  } catch (error) {
    console.error('Error fetching Mapbox token:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Erreur interne du serveur lors de la récupération du token'
    });
  }
});

/**
 * Get public configuration
 * GET /api/config/public
 * Returns public configuration that can be safely exposed to frontend
 */
router.get('/public', (req, res) => {
  try {
    res.json({
      mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || '',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching public config:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Erreur interne du serveur'
    });
  }
});

export default router; 