// ==============================================================================
// FILE: generateLeadPack.js
// PURPOSE: Automated Digital Product Generator for Gumroad & Fiverr ($29 - $49)
//
// ANALOGY: Think of this like a digital factory. It gathers the freshest,
// highest-budget hiring companies from our scout, packages them into a clean,
// ready-to-sell Excel/CSV file with 1-click pitch templates, ready for instant download!
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { fetchFreshLeads } = require('./jobScout');

async function createDigitalLeadPack() {
  console.log('======================================================================');
  console.log('📦 [ClientScout Product Factory] Generating Digital Lead Pack Vol. 1');
  console.log('======================================================================\n');

  console.log('🔍 Scouting active hiring companies with $60k+ budgets...');
  const leads = await fetchFreshLeads();

  const fileName = `ClientScout_Agency_Lead_Pack_${new Date().toISOString().slice(0, 10)}.csv`;
  const exportDir = path.join(__dirname, 'public', 'downloads');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const exportPath = path.join(exportDir, fileName);

  // CSV Header
  const headers = [
    'Company Name',
    'Role Hiring',
    'Estimated Salary Budget',
    'Potential Agency Retainer Value',
    'Niche Category',
    'Location',
    'Live Job URL / Company Link',
    'Tailored 1-Click Cold Email Pitch'
  ];

  // CSV Rows
  const rows = leads.map(l => {
    // Escape quotes for CSV
    const cleanPitch = (l.emailPitch || '').replace(/"/g, '""');
    const cleanDesc = (l.title || '').replace(/"/g, '""');
    return [
      `"${l.companyName}"`,
      `"${cleanDesc}"`,
      `"${l.salary}"`,
      `"${l.opportunity.agencyValue}"`,
      `"${l.opportunity.category}"`,
      `"${l.location}"`,
      `"${l.companyUrl}"`,
      `"${cleanPitch}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  fs.writeFileSync(exportPath, csvContent, 'utf8');

  console.log(`✅ Digital Product Generated Successfully!`);
  console.log(`📁 File Saved At: ${exportPath}`);
  console.log(`📊 Total Verified Leads Packaged: ${leads.length}`);
  console.log(`🌐 Live Downloadable Link: https://getclientscout.com/downloads/${fileName}\n`);

  console.log('======================================================================');
  console.log('💎 Ready to be uploaded to Gumroad and delivered on Fiverr!');
  console.log('======================================================================\n');

  return { fileName, exportPath, count: leads.length };
}

if (require.main === module) {
  createDigitalLeadPack();
}

module.exports = { createDigitalLeadPack };
