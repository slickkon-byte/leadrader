// ==============================================================================
// FILE: sendDFYOutreach.js
// PURPOSE: Automated Outreach Campaign for ClientScout Done-For-You Partner Tier ($497/mo)
//
// SENDER: mateen@getclientscout.com (Authenticated via Google SMTP)
// ==============================================================================

require('dotenv').config();
const nodemailer = require('nodemailer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dfyTargetAgencies = [
  {
    name: 'Sure Oak',
    recipient: 'hello@sureoak.com',
    location: 'New York, US',
    specialty: 'SEO Strategy & Link Acquisition',
    praise: 'Love your data-backed SEO sprints and deep technical search strategies.'
  },
  {
    name: 'Coalition Technologies',
    recipient: 'sales@coalitiontechnologies.com',
    location: 'California, US',
    specialty: 'Web Design & Performance SEO',
    praise: 'Huge fan of your agency track record delivering measurable organic growth and Shopify builds.'
  },
  {
    name: 'The SEO Works',
    recipient: 'info@seoworks.co.uk',
    location: 'Sheffield / London, UK',
    specialty: 'Organic Search & PPC Growth',
    praise: 'Admire your award-winning search campaigns and transparent client reporting.'
  },
  {
    name: 'Scandiweb',
    recipient: 'info@scandiweb.com',
    location: 'Global / US & EU',
    specialty: 'eCommerce Growth & Web Engineering',
    praise: 'Incredible work on enterprise-grade eCommerce scaling and conversion optimization.'
  },
  {
    name: 'ClickWorkz Solutions',
    recipient: 'enquiries@clickworkz.com',
    location: 'Singapore',
    specialty: 'Digital Marketing & Social Campaigns',
    praise: 'Great reputation for tailored digital marketing and high-ROI brand engagement.'
  },
  {
    name: 'Foundry Digital',
    recipient: 'hello@foundrydigital.co.uk',
    location: 'London, UK',
    specialty: 'Webflow, WordPress & Brand Strategy',
    praise: 'Love your sleek, conversion-focused web design and development aesthetic.'
  },
  {
    name: 'MintTwist',
    recipient: 'hello@minttwist.com',
    location: 'London, UK',
    specialty: 'Search Marketing & Digital Transformation',
    praise: 'Impressive full-service digital strategies for ambitious mid-market brands.'
  },
  {
    name: 'Absolute Digital',
    recipient: 'hello@absolutedigital.sg',
    location: 'Singapore',
    specialty: 'Boutique SEO & Google Ads Management',
    praise: 'Consistently impressed by your boutique agency client results and search rankings.'
  },
  {
    name: 'Infront Webworks',
    recipient: 'sales@infront.com',
    location: 'Colorado, US',
    specialty: 'SEO Audits & Digital Growth',
    praise: 'Respected your veteran agency tenure in high-conversion search marketing.'
  },
  {
    name: 'Focus Pocus Media',
    recipient: 'hello@focuspocusmedia.com',
    location: 'US / Remote',
    specialty: 'B2B Google Ads & Paid Media',
    praise: 'Love your laser focus on profitable paid acquisition for SaaS and B2B.'
  }
];

async function dispatchDFYOutreach() {
  console.log('======================================================================');
  console.log('💎 [ClientScout] Launching High-Ticket DFY Partner Campaign ($497/mo)');
  console.log(`📧 Sender: Mateen | ClientScout <mateen@getclientscout.com>`);
  console.log(`🎯 Targets: ${dfyTargetAgencies.length} Verified Boutique Agencies`);
  console.log('======================================================================\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'slickkon@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'crxkxggqasmysqxc'
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ Google SMTP Mail Server Authenticated Successfully!\n');
  } catch (err) {
    console.error('❌ SMTP Connection Error:', err.message);
    process.exit(1);
  }

  let sentCount = 0;

  for (let i = 0; i < dfyTargetAgencies.length; i++) {
    const agency = dfyTargetAgencies[i];
    console.log(`[${i + 1}/${dfyTargetAgencies.length}] Preparing DFY Pitch for: ${agency.name} (${agency.recipient})...`);

    const subject = `Partnership question for ${agency.name} (Client Acquisition)`;
    const textBody = `Hi ${agency.name} Team,

I came across ${agency.name} and love the caliber of client work your team delivers in ${agency.specialty}. ${agency.praise}

Quick question: Are you currently taking on 2–3 new retainer clients this quarter?

At ClientScout (https://getclientscout.com), we run an automated intelligence scout that detects when companies post public $80k+/yr job listings for in-house marketers, SEO specialists, or web designers. When they do, they are openly signaling that they have budget and an urgent problem to solve.

We just opened our Done-For-You (DFY) Client Acquisition Partner Program ($497/mo):
• We scout companies actively hiring in your exact specialty
• We personalize and dispatch 100 tailored pitches every month directly on your agency's behalf
• Every prospect reply lands straight into your inbox so you just show up to close the retainer
• Strictly limited to 3 agencies per region (zero client or competitor overlap)

If your team prefers handling outbound in-house, you can also explore our live software feed directly on getclientscout.com.

Would you be open to a brief 5-minute chat this Thursday to see if our DFY outbound engine is a fit for ${agency.name}?

Best regards,

Mateen
Founder | ClientScout
https://getclientscout.com
mateen@getclientscout.com
`;

    try {
      await transporter.sendMail({
        from: '"Mateen | ClientScout" <mateen@getclientscout.com>',
        replyTo: 'mateen@getclientscout.com',
        to: agency.recipient,
        subject: subject,
        text: textBody
      });

      sentCount++;
      console.log(`   🚀 [DELIVERED] Sent to ${agency.name} <${agency.recipient}>!`);
    } catch (sendErr) {
      console.error(`   ⚠️ [FAILED] Could not send to ${agency.recipient}:`, sendErr.message);
    }

    // Human pacing delay between sends
    if (i < dfyTargetAgencies.length - 1) {
      console.log('   ⏳ Pacing 4 seconds before next send...\n');
      await sleep(4000);
    }
  }

  // Send 1 founder confirmation copy to slickkon@gmail.com
  console.log('\n📬 Sending Founder Confirmation Receipt to your Gmail (slickkon@gmail.com)...');
  try {
    await transporter.sendMail({
      from: '"Mateen | ClientScout" <mateen@getclientscout.com>',
      to: 'slickkon@gmail.com',
      subject: `[Founder Confirmation] DFY Partner Campaign Dispatched (${sentCount} Agencies)`,
      text: `Hey Mateen,\n\nYour high-ticket Done-For-You ($497/mo) outreach campaign has successfully dispatched to ${sentCount} boutique agency prospects:\n\n` +
        dfyTargetAgencies.map((a, idx) => `${idx + 1}. ${a.name} (${a.recipient}) - ${a.location}`).join('\n') +
        `\n\nAll inbound replies will forward straight to this inbox!\n\nBest,\nClientScout Engine`
    });
    console.log('✅ Founder Confirmation Email Delivered to slickkon@gmail.com!');
  } catch (receiptErr) {
    console.log('⚠️ Could not send founder confirmation:', receiptErr.message);
  }

  console.log('\n======================================================================');
  console.log(`🎉 [DFY Campaign Complete] ${sentCount} / ${dfyTargetAgencies.length} Agency Inboxes Reached!`);
  console.log('======================================================================\n');
}

dispatchDFYOutreach();
