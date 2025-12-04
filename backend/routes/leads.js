const express = require('express');
const LeadService = require('../services/leadService');

const router = express.Router();

// POST /api/leads - Process batch of names
router.post('/', async (req, res) => {
  try {
    const { names } = req.body;
    if (!names || !Array.isArray(names)) {
      return res.status(400).json({ error: 'Names must be an array' });
    }

    const results = await LeadService.processBatch(names);
    res.json(results);
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leads - Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await LeadService.getAllLeads();
    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
