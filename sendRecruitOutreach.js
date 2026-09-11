// ==============================================================================
// FILE: sendRecruitOutreach.js
// PURPOSE: Automated Outreach Campaign for RecruitScout ($99/mo)
//
// SENDER: mateen@getclientscout.com (Google SMTP Authenticated)
// ==============================================================================

require('dotenv').config();
const nodemailer = require('nodemailer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const targetRecruiters = [
  {
    name: 'Talener',
    recipient: 'info@talener.com',
    location: 'New York, US',
    niche: 'Software Engineering & Tech Staffing'
  },
  {
    name: 'Austin Fraser',
    recipient: 'contact@austinfraser.com',
    location: 'Austin / London',
    niche: 'Cloud & Engineering Search'
  },
  {
    name: 'Harnham',
    recipient: 'info@harnham.com',
    location: 'New York / London',
    niche: 'Data Science, Machine Learning & AI'
  },
  {
    name: 'Understanding Recruitment',
    recipient: 'info@understandingrecruitment.co.uk',
    location: 'UK / Boston',
    niche: 'Software, DevOps & Tech Leadership'
  },
  {
    name: 'Oscar Tech',
    recipient: 'enquiries@oscar-recruit.com',
    location: 'US / UK',
    niche: 'Enterprise Cloud & Software Search'
  },
  {
    name: 'Opus Recruitment Solutions',
    recipient: 'enquiries@opusrs.com',
    location: 'Global',
    niche: 'High-Growth Tech & Scale-Up Placements'
  },
  {
    name: 'Burns Sheehan',
    recipient: 'enquiries@burnssheehan.co.uk',
    location: 'London / Manchester',
    niche: 'Tech Leadership & Engineering Teams'
  },
  {
    name: 'Ignite Recruitment',
    recipient: 'info@ignite.com',
    location: 'US Nationwide',
    niche: 'Specialized Tech & Corporate Search'
  },
  {
    name: 'Revoco Talent',
    recipient: 'hello@revoco-talent.co.uk',
    location: 'Bristol / London',
    niche: 'Product, Engineering & Cyber Placements'
  },
  {
    name: 'Franklin Fitch',
    recipient: 'info@franklinfitch.com',
    location: 'Austin / Frankfurt / London',
    niche: 'IT Infrastructure & Cloud Placements'
  }
];

async function dispatchRecruitOutreach() {
  console.log('======================================================================');
  console.log('💼 [RecruitScout] Launching High-Ticket Recruiter Campaign ($99/mo)');
  console.log(`📧 Sender: Mateen | RecruitScout <mateen@getclientscout.com>`);
  console.log(`🎯 Targets: ${targetRecruiters.length} Verified Tech Staffing Agencies`);
  console.log('======================================================================\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'slickkon@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'crxkxggqasmysqxc'
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Google SMTP Mail Server Authenticated Successfully!\n');
  } catch (err) {
    console.error('❌ SMTP Connection Error:', err.message);
    process.exit(1);
  }

  let sentCount = 0;

  for (let i = 0; i < targetRecruiters.length; i++) {
    const recruiter = targetRecruiters[i];
    console.log(`[${i + 1}/${targetRecruiters.length}] Preparing Recruiter Pitch for: ${recruiter.name} (${recruiter.recipient})...`);

    const subject = `Partnership question for ${recruiter.name} (Tech Placement Intel)`;
    const textBody = `Hi ${recruiter.name} Team,

I came across ${recruiter.name} and love your track record in ${recruiter.niche}.

Quick question: Is your recruiting team actively looking to expand your hiring client roster this quarter?

At RecruitScout (https://getclientscout.com/recruit), we run an automated radar that detects when companies post urgent, unfulfilled $120k–$200k+ job openings for Software Engineers, Cloud Architects, and Tech Leaders before other headhunters swarm them.

When companies post these openings, their engineering backlogs are burning and they are desperate for pre-vetted talent. Every role in our feed represents an estimated $20,000 to $35,000 placement fee for your firm.

We just opened our Recruiter Intelligence Feed ($99/mo):
• Live stream of high-budget tech & executive hiring companies
• Calculated placement commission potential on every role
• 1-Click candidate placement pitch templates ready to send to hiring managers
• 1-Click CSV export to your ATS or CRM

You can preview today's active tech hiring companies live here: https://getclientscout.com/recruit

Would your team be open to a 5-minute chat this Thursday to see if our feed can help ${recruiter.name} close 1–2 extra placements this month?

Best regards,

Mateen
Founder | RecruitScout (ClientScout Suite)
https://getclientscout.com/recruit
mateen@getclientscout.com
`;

    try {
      await transporter.sendMail({
        from: '"Mateen | RecruitScout" <mateen@getclientscout.com>',
        replyTo: 'mateen@getclientscout.com',
        to: recruiter.recipient,
        subject: subject,
        text: textBody
      });

      sentCount++;
      console.log(`   🚀 [DELIVERED] Sent to ${recruiter.name} <${recruiter.recipient}>!`);
    } catch (sendErr) {
      console.error(`   ⚠️ [FAILED] Could not send to ${recruiter.recipient}:`, sendErr.message);
    }

    if (i < targetRecruiters.length - 1) {
      console.log('   ⏳ Pacing 4 seconds before next send...\n');
      await sleep(4000);
    }
  }

  // Founder confirmation email
  console.log('\n📬 Sending Founder Confirmation Receipt to your Gmail (slickkon@gmail.com)...');
  try {
    await transporter.sendMail({
      from: '"Mateen | RecruitScout" <mateen@getclientscout.com>',
      to: 'slickkon@gmail.com',
      subject: `[Founder Confirmation] RecruitScout Campaign Dispatched (${sentCount} Headhunter Firms)`,
      text: `Hey Mateen,\n\nYour RecruitScout ($99/mo) outreach campaign has successfully dispatched to ${sentCount} tech recruitment & staffing firms:\n\n` +
        targetRecruiters.map((r, idx) => `${idx + 1}. ${r.name} (${r.recipient}) - ${r.location}`).join('\n') +
        `\n\nAll inbound replies will forward straight to this inbox!\n\nBest,\nRecruitScout Engine`
    });
    console.log('✅ Founder Confirmation Delivered to slickkon@gmail.com!');
  } catch (receiptErr) {
    console.log('⚠️ Could not send founder confirmation:', receiptErr.message);
  }

  console.log('\n======================================================================');
  console.log(`🎉 [RecruitScout Campaign Complete] ${sentCount} / ${targetRecruiters.length} Recruiter Inboxes Reached!`);
  console.log('======================================================================\n');
}

dispatchRecruitOutreach();
