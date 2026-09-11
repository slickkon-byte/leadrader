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

// 3 Replacement verified boutique agencies with active inboxes
const verifiedAgencies = [
  {
    name: "M'ai Digital",
    recipient: 'hello@mai-digital.sg',
    specialty: 'SEO & Google Ads / SEM',
    icebreaker: 'Love your boutique agency focus on data-driven SEO and paid search campaigns!',
    leads: [
      '1. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '2. Roastify Coffee Co. (Hiring Meta Ads Lead — $75k/yr budget)',
      '3. Lumina Home Decor (Hiring Webflow Designer — $70k/yr budget)'
    ]
  },
  {
    name: 'Fenzo Digital',
    recipient: 'hello@fenzodigital.com',
    specialty: 'SEO & Web Development',
    icebreaker: 'Impressive work on your boutique agency portfolio for search optimization and web growth.',
    leads: [
      '1. Lumina Home Decor (Hiring Webflow & UI Designer — $70k/yr budget)',
      '2. Apex Health Group (Hiring SEO Strategist — $85k/yr budget)',
      '3. Senior React & Full-Stack hiring leads ($95k/yr budget)'
    ]
  },
  {
    name: 'Common Ground Digital',
    recipient: 'enquiries@commonground.digital',
    specialty: 'B2B PPC & Paid Acquisition',
    icebreaker: 'Huge fan of your senior-led boutique approach to B2B paid search and conversion performance.',
    leads: [
      '1. Roastify Coffee Co. (Hiring Paid Ads Lead — $75k/yr budget)',
      '2. Head of Marketing at Garden3d ($150k+ marketing budget)',
      '3. Apex Health Group (Hiring Paid Search Specialist — $85k/yr budget)'
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
