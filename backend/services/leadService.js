const axios = require('axios');
const Lead = require('../models/Lead');

class LeadService {
  static async processBatch(names) {
    const results = [];

    // Process each name asynchronously
    const promises = names.map(async (name) => {
      try {
        const response = await axios.get(`https://api.nationalize.io?name=${name}`);
        const data = response.data;

        if (data.country && data.country.length > 0) {
          const topCountry = data.country[0];
          const probability = topCountry.probability;
          const status = probability > 0.9 ? 'Verified' : 'To Check';

          // Save to DB
          const lead = new Lead({
            name,
            country: topCountry.country_id,
            probability,
            status
          });
          await lead.save();

          results.push({
            name,
            country: topCountry.country_id,
            probability,
            status
          });
        } else {
          // No data, mark as To Check
          const lead = new Lead({
            name,
            country: 'Unknown',
            probability: 0,
            status: 'To Check'
          });
          await lead.save();

          results.push({
            name,
            country: 'Unknown',
            probability: 0,
            status: 'To Check'
          });
        }
      } catch (error) {
        console.error(`Error processing ${name}:`, error.message);
        // On error, still save with To Check
        const lead = new Lead({
          name,
          country: 'Error',
          probability: 0,
          status: 'To Check'
        });
        await lead.save();

        results.push({
          name,
          country: 'Error',
          probability: 0,
          status: 'To Check'
        });
      }
    });

    await Promise.all(promises);

    return results;
  }

  static async getAllLeads() {
    return await Lead.find().sort({ createdAt: -1 });
  }
}

module.exports = LeadService;
