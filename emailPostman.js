// ==============================================================================
// FILE: emailPostman.js
// PURPOSE: Automated Email Delivery for ClientScout using Resend
//
// ANALOGY: Think of this file like a digital mail carrier with a bicycle.
// Whenever we want to send the weekly "Top 10 Leads" digest or a customer alert,
// this carrier stamps the envelope, pedals to the subscriber's inbox, and delivers it!
// ==============================================================================

require('dotenv').config();
const { Resend } = require('resend');

const resendApiKey = process.env.RESEND_API_KEY;
let resend = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
  console.log('📬 [Digital Postman] Resend postal service connected and ready!');
} else {
  console.log('⚠️ [Digital Postman] No Resend key found. Email dispatch disabled.');
}

/**
 * Sends a weekly lead digest to a subscriber's inbox.
 * 
 * @param {string} toEmail - Recipient email address
 * @param {Array} leads - The top leads to include in the email
 */
async function sendWeeklyDigest(toEmail, leads) {
  if (!resend) {
    return { success: false, message: 'Resend service not connected.' };
  }

  // Create clean HTML format for the email
  const leadRows = leads.slice(0, 5).map(l => `
    <div style="border-bottom: 1px solid #eaeaea; padding: 12px 0;">
      <h3 style="margin: 0 0 4px 0; color: #0f172a;">${l.title} at <strong>${l.companyName}</strong></h3>
      <p style="margin: 0 0 4px 0; color: #059669; font-weight: 600;">💰 Estimated Deal Value: ${l.opportunity.agencyValue}</p>
      <p style="margin: 0; color: #64748b; font-size: 14px;">🎯 <em>Why Pitch:</em> ${l.opportunity.whyPitch}</p>
    </div>
  `).join('');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #0f172a; color: white; padding: 16px; border-radius: 6px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px;">🎯 ClientScout</h1>
        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 14px;">Your Weekly High-Budget Client Leads</p>
      </div>
      <div style="padding: 16px 0;">
        <p style="color: #334155; font-size: 15px;">Here are the latest companies actively hiring for services this week. Pitch them before competitors do!</p>
        ${leadRows}
      </div>
      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <a href="https://leadrader.onrender.com" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View All 50+ Leads in Dashboard</a>
      </div>
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
        ClientScout B2B Micro-SaaS • Automated Client Acquisition Engine
      </p>
    </div>
  `;

  try {
    // Note: Resend Free Tier lets you send directly to your registered account email
    // or onboarding@resend.dev domain.
    const result = await resend.emails.send({
      from: 'ClientScout <onboarding@resend.dev>',
      to: toEmail,
      subject: '🎯 [ClientScout] Top High-Budget Leads This Week',
      html: emailHtml
    });
    console.log('✅ [Digital Postman] Email delivered successfully!', result);
    return { success: true, result };
  } catch (err) {
    console.error('❌ [Digital Postman] Failed to deliver email:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendWeeklyDigest
};
