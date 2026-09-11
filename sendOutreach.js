// ==============================================================================
// FILE: sendOutreach.js
// PURPOSE: Automated 1-Click Agency Outreach Engine for ClientScout
//
// SENDER: mateen@getclientscout.com (Official Business Address)
// ANALOGY: Think of this like your digital outreach director. It opens your
// official business inbox, types each custom pitch to verified agencies, pauses
// a few seconds so it looks completely human, and clicks send!
// ==============================================================================

require('dotenv').config();
const nodemailer = require('nodemailer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Verified real agencies with active, confirmed corporate mail servers
const verifiedAgencies = [
  {
    name: 'Black Propeller',
    recipient: 'info@blackpropeller.com',
    specialty: 'Paid Search & Meta Ads',
    icebreaker: 'Saw your breakdown on lowering customer acquisition costs and driving measurable ROAS on paid search.',
    leads: [
      '1. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)',
      '2. Head of Marketing at Garden3d ($150k+ marketing budget)',
      '3. Apex Health Group (Hiring Paid Search Specialist — $85k/yr budget)'
    ]
  },
  {
    name: 'Single Grain',
    recipient: 'contact@singlegrain.com',
    specialty: 'Full-Funnel Digital Growth & SEO',
    icebreaker: "Huge fan of Eric Siu's content and your team's tactical teardowns on modern B2B customer acquisition.",
    leads: [
      '1. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '2. Lumina Home Decor (Hiring Webflow & UI Designer — $70k/yr budget)',
      '3. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)'
    ]
  },
  {
    name: 'Siege Media',
    recipient: 'info@siegemedia.com',
    specialty: 'Content Marketing & Organic SEO',
    icebreaker: 'Ross Hudgens and your team have consistently set the industry benchmark for high-converting content marketing.',
    leads: [
      '1. Apex Health Group (Hiring Content & SEO Lead — $85k/yr budget)',
      '2. CT Marketing Agency (Hiring Freelance Copywriters — $35k/yr budget)',
      '3. Lumina Home Decor (Hiring Webflow & Creative Specialist — $70k/yr budget)'
    ]
  },
  {
    name: 'Inflow',
    recipient: 'info@GoInflow.com',
    specialty: 'eCommerce & Growth Marketing',
    icebreaker: "Love your agency's case studies on scaling Shopify stores and improving organic eCommerce search visibility.",
    leads: [
      '1. Lumina Home Decor (Hiring Webflow & Shopify Designer — $70k/yr budget)',
      '2. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)',
      '3. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)'
    ]
  },
  {
    name: 'Direct Online Marketing',
    recipient: 'info@directom.com',
    specialty: 'B2B Lead Gen & PPC',
    icebreaker: 'Impressive track record helping B2B mid-market companies scale their lead pipelines with search & paid media.',
    leads: [
      '1. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '2. Roastify Coffee Co. (Hiring Paid Ads Lead — $75k/yr budget)',
      '3. Credit Wellness (Hiring Growth Contractor — $35k/yr budget)'
    ]
  },
  {
    name: 'Victorious SEO',
    recipient: 'sales@victorious.com',
    specialty: 'ROI-Driven Search Engine Optimization',
    icebreaker: 'Your pure-play focus on search engine optimization and transparent ROI reporting is awesome.',
    leads: [
      '1. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '2. Lumina Home Decor (Hiring Webflow Designer — $70k/yr budget)',
      '3. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)'
    ]
  },
  {
    name: 'Brafton',
    recipient: 'info@brafton.com',
    specialty: 'Content Strategy & Creative Marketing',
    icebreaker: "Love your team's guides on content marketing ROI and creative execution.",
    leads: [
      '1. Freelance Content Writers ($50-$75/hour budget)',
      '2. Apex Health Group (Hiring SEO & Content Lead — $85k/yr budget)',
      '3. Lumina Home Decor (Hiring Webflow Designer — $70k/yr budget)'
    ]
  },
  {
    name: 'From The Future',
    recipient: 'info@ftf.agency',
    specialty: 'Technical SEO & Growth Engineering',
    icebreaker: "Huge respect for your team's technical SEO and data-driven approach to client retainers.",
    leads: [
      '1. Senior Full-stack Developer hiring leads ($95k/yr budget)',
      '2. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '3. Lumina Home Decor (Hiring Webflow Designer — $70k/yr budget)'
    ]
  },
  {
    name: 'Ignite Visibility',
    recipient: 'hello@ignitevisibility.com',
    specialty: 'Multi-Channel Digital Marketing',
    icebreaker: "Consistently impressed by your team's thought leadership and multi-channel client acquisition strategies.",
    leads: [
      '1. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)',
      '2. Garden3d (Hiring Head of Marketing — $150k+ budget)',
      '3. Apex Health Group (Hiring SEO Specialist — $85k/yr budget)'
    ]
  },
  {
    name: 'Mateen (Founder Verification Copy)',
    recipient: 'slickkon@gmail.com',
    specialty: 'Founder Test & Verification',
    icebreaker: '🎉 This is your personal verification copy confirming automated outreach is 100% active!',
    leads: [
      '1. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '2. Lumina Home Decor (Hiring Webflow Designer — $70k/yr budget)',
      '3. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)'
    ]
  }
];

async function runAutoOutreach() {
  console.log('=================================================================');
  console.log('🚀 [ClientScout Outreach Engine] Initializing Automated Dispatch');
  console.log(`📧 Sender: ${process.env.SENDER_NAME || 'Mateen | ClientScout'} <${process.env.SENDER_EMAIL}>`);
  console.log('=================================================================\n');

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Missing GMAIL credentials in .env file!');
    process.exit(1);
  }

  // Set up Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Verify SMTP connection
  try {
    await transporter.verify();
    console.log('✅ [Mail Carrier] Authenticated with Gmail SMTP successfully!\n');
  } catch (err) {
    console.error('❌ [Mail Carrier] Authentication failed:', err.message);
    process.exit(1);
  }

  let sentCount = 0;
  let failCount = 0;

  for (let i = 0; i < verifiedAgencies.length; i++) {
    const agency = verifiedAgencies[i];
    const progress = `[${i + 1}/${verifiedAgencies.length}]`;

    console.log(`📤 ${progress} Preparing email for ${agency.name} (${agency.recipient})...`);

    const emailSubject = `Quick question regarding ${agency.name} + 3 free leads`;

    const emailBody = `Hi ${agency.name} Team,\n\n${agency.icebreaker}\n\nI built an intelligence tool called ClientScout (https://clientscout-io.onrender.com) that monitors companies with $60k+ budgets actively hiring in-house marketers and SEO specialists. Because these companies have allocated budget right now, pitching an outsourced agency solution saves them over $30,000 in payroll taxes and weeks of interview time!\n\nI spotted 3 companies hiring right now that match your agency:\n${agency.leads.join('\n')}\n\nFeel free to pitch them directly—hope this brings you a new retainer client this month!\n\nIf you ever want 20+ fresh companies delivered every Monday morning with pre-written pitch letters, you can check out our live database here:\nhttps://clientscout-io.onrender.com\n\nBest regards,\nMateen\nFounder, ClientScout\nhttps://getclientscout.com`;

    try {
      await transporter.sendMail({
        from: `"${process.env.SENDER_NAME || 'Mateen | ClientScout'}" <${process.env.SENDER_EMAIL}>`,
        to: agency.recipient,
        replyTo: process.env.SENDER_EMAIL,
        subject: emailSubject,
        text: emailBody
      });

      console.log(`   ✅ Sent successfully to ${agency.recipient}!`);
      sentCount++;
    } catch (err) {
      console.error(`   ❌ Failed sending to ${agency.recipient}:`, err.message);
      failCount++;
    }

    // Friendly 4-second pause between emails so it behaves like a real human
    if (i < verifiedAgencies.length - 1) {
      console.log('   ⏳ Pausing 4 seconds for optimal inbox delivery...\n');
      await sleep(4000);
    }
  }

  console.log('\n=================================================================');
  console.log('🎉 [ClientScout Outreach Engine] CAMPAIGN COMPLETE!');
  console.log(`📊 Results: ${sentCount} Delivered, ${failCount} Failed`);
  console.log(`📬 Replies will arrive directly at: ${process.env.SENDER_EMAIL} (and forward to your Gmail)`);
  console.log('=================================================================');
}

runAutoOutreach();
