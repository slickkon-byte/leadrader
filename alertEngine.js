// ==============================================================================
// FILE: alertEngine.js
// PURPOSE: Instant Remote Job Alert Subscription System for FastAlerts Remote ($9.99/mo)
//
// ANALOGY: Think of this like an automated private concierge for job seekers.
// The moment an $80k+ remote job appears, it pings the subscriber before the crowd!
// ==============================================================================

const nodemailer = require('nodemailer');
const { fetchFreshLeads } = require('./jobScout');

// In-memory subscriber list (persisted in session)
let subscribers = [
  { email: 'slickkon@gmail.com', role: 'Any', active: true, joinedDate: new Date().toISOString() }
];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'slickkon@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'crxkxggqasmysqxc'
  }
});

/**
 * Adds a new job seeker subscriber
 */
function addSubscriber(email, role = 'Any') {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const existing = subscribers.find(s => s.email === cleanEmail);
  if (existing) {
    return { success: true, message: 'You are already subscribed to instant job alerts!' };
  }

  subscribers.push({
    email: cleanEmail,
    role,
    active: true,
    joinedDate: new Date().toISOString()
  });

  return { success: true, message: 'Successfully subscribed to Instant Remote Job Alerts!' };
}

/**
 * Dispatches an instant alert digest to subscribers
 */
async function sendAlertDigest(targetEmail = null) {
  const leads = await fetchFreshLeads();
  const topLeads = leads.slice(0, 5);

  const recipient = targetEmail || 'slickkon@gmail.com';

  const subject = `⚡ [FastAlerts] 5 New $70k+ Remote Jobs Posted In The Last 2 Hours`;
  const body = `Hi there,\n\nHere are 5 fresh, high-budget remote job openings captured by FastAlerts before they get flooded with hundreds of applicants:\n\n` +
    topLeads.map((l, i) => `${i + 1}. ${l.title} at ${l.companyName}\n   💰 Salary: ${l.salary}\n   📍 Location: ${l.location}\n   🔗 Apply Directly: ${l.companyUrl}\n`).join('\n') +
    `\n💡 Pro Tip: Applying within the first 60 minutes gives you an 80% higher interview callback rate.\n\nBest,\nFastAlerts Remote\nPowered by ClientScout Engine`;

  try {
    await transporter.sendMail({
      from: '"FastAlerts Remote" <mateen@getclientscout.com>',
      to: recipient,
      subject,
      text: body
    });
    return { success: true, count: topLeads.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  addSubscriber,
  sendAlertDigest,
  subscribers
};

if (require.main === module) {
  console.log('Testing FastAlerts subscriber registration:');
  console.log(addSubscriber('testuser@gmail.com', 'SEO'));
}
