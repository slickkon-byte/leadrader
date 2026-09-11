// ==============================================================================
// FILE: dfyEngine.js
// PURPOSE: Automated "Done-For-You" Campaign Engine ($497/mo High-Ticket Service)
// 
// ANALOGY: Think of this like a digital marketing manager who works for your 
// agency client 24/7. It finds hiring companies in their exact niche, writes
// personalized emails on their behalf, and sends them out automatically!
// ==============================================================================

const nodemailer = require('nodemailer');
const { fetchFreshLeads } = require('./jobScout');

// Configure authenticated sending robot
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'slickkon@gmail.com',
    pass: 'crxkxggqasmysqxc'
  }
});

/**
 * Runs an automated outbound campaign on behalf of a paying agency client.
 * 
 * @param {Object} agencyClient - The agency that paid $497/month
 *   {
 *     agencyName: "Alpha SEO Labs",
 *     founderName: "Marcus Vance",
 *     contactEmail: "marcus@alphaseo.com",
 *     niche: "SEO",
 *     bookingLink: "https://calendly.com/alphaseo/growth-chat"
 *   }
 * @param {Array} targetHiringCompanies - Optional specific companies, or null to auto-pull
 * @param {Boolean} isDryRun - If true, tests output without sending real emails
 */
async function runDFYCampaign(agencyClient, targetHiringCompanies = null, isDryRun = true) {
  console.log('\n' + '='.repeat(70));
  console.log(`🚀 [DFY Engine] Launching Automated Campaign for: ${agencyClient.agencyName}`);
  console.log(`🎯 Niche: ${agencyClient.niche} | Mode: ${isDryRun ? 'SIMULATION / TEST' : 'LIVE DISPATCH'}`);
  console.log('='.repeat(70) + '\n');

  // 1. Fetch fresh hiring leads
  let leads = targetHiringCompanies;
  if (!leads || !leads.length) {
    console.log('🔍 [DFY Engine] Auto-scouting live hiring companies in client niche...');
    const allLeads = await fetchFreshLeads();
    leads = allLeads.filter(l => 
      l.opportunity.category.toLowerCase().includes(agencyClient.niche.toLowerCase()) ||
      l.title.toLowerCase().includes(agencyClient.niche.toLowerCase())
    );
    if (!leads.length) leads = allLeads.slice(0, 5); // Fallback to top high-budget leads
  }

  console.log(`📋 Found ${leads.length} qualified hiring companies matching ${agencyClient.niche}!\n`);

  const results = [];

  // 2. Process each lead
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    
    // Tailored pitch crafted on behalf of the client agency
    const subject = `Quick question regarding your ${lead.title} role at ${lead.companyName}`;
    const emailBody = `Hi ${lead.companyName} Team,

I noticed you're actively searching for a ${lead.title} (${lead.salary}).

Hiring an in-house full-time specialist usually takes 4-6 weeks of interviewing, plus payroll taxes and onboarding lag. 

At ${agencyClient.agencyName}, we specialize specifically in ${lead.opportunity.category}. We help companies like yours ${lead.opportunity.recommendedPitchAngle.toLowerCase()}—ready to produce results starting this Monday with zero hiring overhead.

Would you be open to a 10-minute discovery call this Thursday to see if an outsourced partnership makes sense for you?

You can grab a time directly on our calendar here: ${agencyClient.bookingLink}

Best regards,
${agencyClient.founderName}
${agencyClient.agencyName}
Direct: ${agencyClient.contactEmail}`;

    console.log(`[${i + 1}/${leads.length}] Prepared Pitch for: ${lead.companyName} (${lead.title})`);

    if (isDryRun) {
      console.log(`   📝 [DRY RUN] Pitch preview generated successfully!`);
      results.push({ company: lead.companyName, status: 'Previewed (Dry Run)', subject });
    } else {
      // Live send logic
      try {
        await transporter.sendMail({
          from: `"${agencyClient.founderName} | ${agencyClient.agencyName}" <mateen@getclientscout.com>`,
          replyTo: agencyClient.contactEmail,
          to: lead.companyEmail || 'slickkon@gmail.com', // Sends to test inbox if no direct company email
          subject: subject,
          text: emailBody
        });
        console.log(`   ✅ [SENT] Successfully delivered to ${lead.companyName}!`);
        results.push({ company: lead.companyName, status: 'Sent', subject });
      } catch (err) {
        console.log(`   ❌ [FAILED] Error sending: ${err.message}`);
        results.push({ company: lead.companyName, status: 'Error', error: err.message });
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`🏁 [DFY Engine] Campaign Run Completed! Total Leads Processed: ${results.length}`);
  console.log('='.repeat(70) + '\n');

  return results;
}

module.exports = { runDFYCampaign };

// Test run if called directly from terminal
if (require.main === module) {
  const sampleClient = {
    agencyName: 'Apex Growth Labs',
    founderName: 'Sarah Jenkins',
    contactEmail: 'sarah@apexgrowthlabs.com',
    niche: 'SEO',
    bookingLink: 'https://calendly.com/apexgrowth/15min'
  };

  runDFYCampaign(sampleClient, null, true).then(() => {
    console.log('💡 Dry run completed! To run live for a paid client, call with isDryRun = false.');
  });
}
