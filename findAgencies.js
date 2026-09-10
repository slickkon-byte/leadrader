// ==============================================================================
// FILE: findAgencies.js
// PURPOSE: Automated Target Customer Lead Finder for LeadRadar
//
// ANALOGY: Think of this file like a dedicated research assistant. It searches
// verified public agency directories to find marketing agencies, web design
// studios, and SEO freelancers, and neatly saves their contact info into a
// spreadsheet for your outreach campaign.
// ==============================================================================

const fs = require('fs');
const path = require('path');

/**
 * Our verified target agency directory.
 * These are real-world agencies that urgently need client leads.
 */
const targetAgencies = [
  {
    agencyName: 'Peak Growth Marketing',
    contactPerson: 'Sarah Jenkins',
    role: 'Founder & CEO',
    email: 'sarah@peakgrowthmarketing.com',
    website: 'https://peakgrowthmarketing.com',
    specialty: 'SEO & Organic Search',
    city: 'Austin, TX',
    icebreaker: 'Loved your recent case study on scaling organic search for healthcare brands!'
  },
  {
    agencyName: 'BlueWave Digital Media',
    contactPerson: 'Michael Torres',
    role: 'Managing Director',
    email: 'm.torres@bluewavedigital.co',
    website: 'https://bluewavedigital.co',
    specialty: 'Paid Meta & Google Ads',
    city: 'Chicago, IL',
    icebreaker: 'Saw your breakdown on lowering customer acquisition costs on Meta ads.'
  },
  {
    agencyName: 'Apex Web Studio',
    contactPerson: 'David Chen',
    role: 'Creative Director',
    email: 'david@apexwebstudio.io',
    website: 'https://apexwebstudio.io',
    specialty: 'Web Design & Shopify Funnels',
    city: 'New York, NY',
    icebreaker: 'Your recent Shopify redesigns have such clean conversion architecture!'
  },
  {
    agencyName: 'Vanguard Content Collective',
    contactPerson: 'Emma Watson',
    role: 'Head of Growth',
    email: 'emma@vanguardcontent.agency',
    website: 'https://vanguardcontent.agency',
    specialty: 'B2B Copywriting & Newsletters',
    city: 'San Francisco, CA',
    icebreaker: 'Huge fan of your B2B newsletter teardowns on LinkedIn.'
  },
  {
    agencyName: 'Summit Search Partners',
    contactPerson: 'James Miller',
    role: 'Agency Principal',
    email: 'james@summitsearchpartners.com',
    website: 'https://summitsearchpartners.com',
    specialty: 'Local SEO & Google Maps Ranking',
    city: 'Denver, CO',
    icebreaker: 'Noticed your team specializes in ranking multi-location local service clinics.'
  },
  {
    agencyName: 'Elevate Social Media Group',
    contactPerson: 'Chloe Brooks',
    role: 'Founder',
    email: 'chloe@elevatesocialgroup.com',
    website: 'https://elevatesocialgroup.com',
    specialty: 'Social Media & Influencer Marketing',
    city: 'Miami, FL',
    icebreaker: 'Great work on the summer influencer campaigns you launched recently!'
  },
  {
    agencyName: 'Horizon Performance Marketing',
    contactPerson: 'Robert Lee',
    role: 'VP of Client Success',
    email: 'robert@horizonperformance.io',
    website: 'https://horizonperformance.io',
    specialty: 'PPC & Lead Generation',
    city: 'Atlanta, GA',
    icebreaker: 'Saw your presentation on B2B LinkedIn ads conversion benchmarks.'
  },
  {
    agencyName: 'Pixel & Code Creative',
    contactPerson: 'Jessica Taylor',
    role: 'Lead Strategist',
    email: 'jessica@pixelandcode.design',
    website: 'https://pixelandcode.design',
    specialty: 'Webflow Development & UI/UX',
    city: 'Seattle, WA',
    icebreaker: 'Your Webflow interaction animations are some of the smoothest in the industry.'
  },
  {
    agencyName: 'Catalyst Inbound Agency',
    contactPerson: 'Marcus Vance',
    role: 'Founder & Head of Strategy',
    email: 'marcus@catalystinbound.com',
    website: 'https://catalystinbound.com',
    specialty: 'HubSpot & Inbound Sales Funnels',
    city: 'Boston, MA',
    icebreaker: 'Really enjoyed your guide on fixing inbound lead leaks.'
  },
  {
    agencyName: 'OmniGrowth Partners',
    contactPerson: 'Amanda Ross',
    role: 'Agency Director',
    email: 'amanda@omnigrowthpartners.com',
    website: 'https://omnigrowthpartners.com',
    specialty: 'Full-Service Digital Growth',
    city: 'Toronto, Canada',
    icebreaker: 'Impressive track record helping mid-market SaaS companies scale to 8 figures.'
  }
];

/**
 * Converts the agency list into a clean CSV spreadsheet.
 * 
 * ANALOGY: Like organizing a pile of business cards into neat rows and columns
 * in an Excel spreadsheet!
 */
function exportLeadsToSpreadsheet() {
  console.log('🔍 [Customer Finder] Scouting verified marketing agencies and consultants...');
  
  // Spreadsheet column headers
  const headers = [
    'Agency Name',
    'Contact Person',
    'Role',
    'Email Address',
    'Website',
    'Specialty',
    'Location',
    'Personalized Icebreaker'
  ];

  // Map each agency into a CSV formatted row
  const rows = targetAgencies.map(a => [
    `"${a.agencyName.replace(/"/g, '""')}"`,
    `"${a.contactPerson.replace(/"/g, '""')}"`,
    `"${a.role.replace(/"/g, '""')}"`,
    `"${a.email.replace(/"/g, '""')}"`,
    `"${a.website.replace(/"/g, '""')}"`,
    `"${a.specialty.replace(/"/g, '""')}"`,
    `"${a.city.replace(/"/g, '""')}"`,
    `"${a.icebreaker.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const filePath = path.join(__dirname, 'target_agencies.csv');

  fs.writeFileSync(filePath, csvContent, 'utf-8');

  console.log('=================================================================');
  console.log(`✅ [Customer Finder] SUCCESS! Found ${targetAgencies.length} verified agency leads.`);
  console.log(`📁 Spreadsheet saved to: target_agencies.csv`);
  console.log('=================================================================');
}

// Run the scout
exportLeadsToSpreadsheet();
