    const cron = require('node-cron');
const Lead = require('../models/Lead');

const startCronJob = () => {
  // Cron job: Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      // Find verified leads that are not synced
      const verifiedLeads = await Lead.find({ status: 'Verified', synced: false });

      if (verifiedLeads.length > 0) {
        for (const lead of verifiedLeads) {
          console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);

          // Mark as synced
          lead.synced = true;
          await lead.save();
        }
      } else {
        console.log('[CRM Sync] No new verified leads to sync.');
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });

  console.log('Cron job started: Runs every 5 minutes');
};

module.exports = startCronJob;
