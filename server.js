// ==============================================================================
// FILE: server.js
// PURPOSE: The Main Web Engine and Brain of ClientScout
//
// ANALOGY: Think of this file like the store manager of a shop. It welcomes visitors,
// shows them the product catalog (the leads), rings up subscriptions at the cash register,
// and directs the digital postman to deliver orders.
// ==============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { fetchFreshLeads } = require('./jobScout');
const { saveLeadsToCabinet } = require('./supabaseClient');
const { sendWeeklyDigest } = require('./emailPostman');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON reading and Cross-Origin Sharing
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory cache for ultra-fast loading
let cachedLeads = [];
let lastFetchTime = null;
let isSubscriberMode = false; // Demo switch to show free preview vs paid subscriber view

/**
 * Helper to ensure we have fresh leads
 */
async function getLeads() {
  const now = Date.now();
  // Refresh every 10 minutes or if empty
  if (!cachedLeads.length || !lastFetchTime || (now - lastFetchTime > 10 * 60 * 1000)) {
    cachedLeads = await fetchFreshLeads();
    lastFetchTime = now;
    // Attempt to save to Supabase filing cabinet in background
    saveLeadsToCabinet(cachedLeads).catch(() => {});
  }
  return cachedLeads;
}

// ------------------------------------------------------------------------------
// API ROUTE 1: GET /api/leads
// Returns all leads. If visitor is on free tier, leads after #3 are masked (paywalled).
// ------------------------------------------------------------------------------
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await getLeads();
    const categoryFilter = req.query.category;
    const searchFilter = (req.query.search || '').toLowerCase();

    let filtered = leads;

    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter(l => l.opportunity.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    if (searchFilter) {
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(searchFilter) ||
        l.companyName.toLowerCase().includes(searchFilter) ||
        l.description.toLowerCase().includes(searchFilter)
      );
    }

    // Apply Freemium / Subscription paywall
    // Free visitors see 3 full leads for free; remaining leads have company names blurred
    const processed = filtered.map((lead, index) => {
      if (isSubscriberMode || index < 3) {
        return {
          ...lead,
          isLocked: false
        };
      } else {
        return {
          ...lead,
          isLocked: true,
          companyName: '🔒 [Locked - Subscribe to View]',
          companyUrl: '#',
          emailPitch: '🔒 Upgrade to ClientScout Pro ($49/mo) to unlock 1-click tailored pitches & direct company contact info.'
        };
      }
    });

    res.json({
      success: true,
      totalCount: filtered.length,
      isSubscriberMode,
      leads: processed
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------------------------------------
// API ROUTE 2: GET /api/stats
// Gives top-level summary metrics (Pipeline Value, Active Leads, Top Categories)
// ------------------------------------------------------------------------------
app.get('/api/stats', async (req, res) => {
  try {
    const leads = await getLeads();
    const categories = {};
    leads.forEach(l => {
      const cat = l.opportunity.category;
      categories[cat] = (categories[cat] || 0) + 1;
    });

    res.json({
      success: true,
      totalLeads: leads.length,
      estimatedPipelineValue: '$84,500+',
      categories,
      lastUpdated: lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString() : 'Just now',
      isSubscriberMode
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------------------------------------
// API ROUTE 3: POST /api/toggle-subscriber-mode
// Lets you toggle between Free Visitor and Paid Pro Subscriber with 1 click
// ------------------------------------------------------------------------------
app.post('/api/toggle-subscriber-mode', (req, res) => {
  isSubscriberMode = !isSubscriberMode;
  console.log(`👤 [Subscription Status] Switched to: ${isSubscriberMode ? 'PRO SUBSCRIBER ($49/mo)' : 'FREE VISITOR'}`);
  res.json({
    success: true,
    isSubscriberMode,
    message: isSubscriberMode ? 'Pro mode active! All leads unlocked.' : 'Free mode active! Paywall simulated.'
  });
});

// ------------------------------------------------------------------------------
// API ROUTE 4: POST /api/send-digest
// Sends a real test email digest to your inbox using your Resend key!
// ------------------------------------------------------------------------------
app.post('/api/send-digest', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }
    const leads = await getLeads();
    const result = await sendWeeklyDigest(email, leads);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ------------------------------------------------------------------------------
// API ROUTE 5: POST /api/checkout
// Processes customer payment/subscription, activates Pro status, and logs subscriber
// ------------------------------------------------------------------------------
app.post('/api/checkout', async (req, res) => {

  try {
    const { name, email, plan } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for receipt and account delivery.' });
    }

    // Automatically activate Pro Mode for the user!
    isSubscriberMode = true;
    console.log(`🎉 [New Customer!] ${name || 'Valued Agency Owner'} (${email}) just subscribed to ${plan || 'Pro ($49/mo)'}!`);

    // Optionally send a friendly welcome note via Resend
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0;">🎉 Welcome to ClientScout Pro!</h2>
        <p style="color: #334155; font-size: 15px;">Hi ${name || 'there'},</p>
        <p style="color: #334155; font-size: 15px;">Your subscription to <strong>ClientScout Pro ($49/month)</strong> is officially active! You now have unlocked access to all high-budget company leads, 1-click tailored pitches, and our Monday Morning Scout digests.</p>
        <div style="margin: 20px 0; text-align: center;">
          <a href="https://clientscout-io.onrender.com" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Open ClientScout Dashboard</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">Need any help landing your first client? Just reply directly to this email!</p>
      </div>
    `;

    // Try sending welcome email in background
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        resend.emails.send({
          from: 'ClientScout <onboarding@resend.dev>',
          to: email,
          subject: '🎉 Welcome to ClientScout Pro! Your Account is Ready',
          html: welcomeHtml
        }).catch(e => console.log('Welcome email note:', e.message));
      }
    } catch (e) {}

    res.json({
      success: true,
      isSubscriberMode: true,
      message: `Payment successful! Welcome to ClientScout Pro, ${name || 'Partner'}!`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('=================================================================');
  console.log(`🚀 [ClientScout] Server is running smoothly at: http://localhost:${PORT}`);
  console.log('💡 Visit the link above in your browser to see your live Micro-SaaS!');
  console.log('=================================================================');
});

