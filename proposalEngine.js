// ==============================================================================
// FILE: proposalEngine.js
// PURPOSE: 1-Click High-Converting Proposal Generator for ProposalHero ($19/mo)
// 
// ANALOGY: Like having an elite sales copywriter sitting next to you on Upwork.
// You paste what the client wants, and it gives you 3 winning proposals in 3 seconds!
// ==============================================================================

/**
 * Generates 3 distinct, high-converting freelance proposals from any job post
 */
function generateProposals(jobTitle, jobDescription, freelancerName = 'Alex', skills = 'SEO, Web Design, Paid Ads') {
  const cleanTitle = (jobTitle || 'Specialist').trim();
  const cleanDesc = (jobDescription || '').trim();
  
  // Extract key themes
  const isWeb = /web|design|shopify|wordpress|ui|ux|landing/i.test(cleanTitle + ' ' + cleanDesc);
  const isSEO = /seo|search|rank|traffic|google/i.test(cleanTitle + ' ' + cleanDesc);
  const isAds = /ad|ppc|facebook|meta|google ads|roas/i.test(cleanTitle + ' ' + cleanDesc);

  let nicheFocus = 'digital growth and conversion';
  if (isWeb) nicheFocus = 'high-converting web design and clean UX';
  else if (isSEO) nicheFocus = 'organic Google rankings and high-intent traffic';
  else if (isAds) nicheFocus = 'profitable paid advertising campaigns and lower CPA';

  // Proposal 1: The Direct Problem-Solver
  const proposal1 = {
    style: 'The Direct Problem-Solver (Best for Fast Reviewers)',
    badge: 'Most Popular',
    content: `Hi there,

I saw your posting for a ${cleanTitle}. Most applicants will send you generic copy-pasted templates, so I'll keep this short and focused on your goals.

I specialize specifically in ${nicheFocus}. Based on your description, the primary bottleneck right now is executing this quickly without weeks of back-and-forth revisions.

Here is what my first 7-day sprint would look like for you:
1. Quick kickoff audit to align on your exact specifications
2. Rapid first draft delivered within 72 hours for your feedback
3. Polished, production-ready final deliverable with zero guesswork

I have availability to start immediately. Are you open to a quick 10-minute chat to review the scope?

Best,
${freelancerName}`
  };

  // Proposal 2: The Proof & Case Study Hook
  const proposal2 = {
    style: 'The Authority & Proof Hook (Best for High-Budget Clients)',
    badge: 'High Conversion',
    content: `Hi there,

Your project for a ${cleanTitle} caught my eye because I recently completed a very similar project in this exact space.

When tackling this kind of challenge, the biggest risk is wasting budget on deliverables that look decent but fail to drive real business results.

My approach focuses on:
• Clean, measurable execution built around your specific KPIs
• Daily async Loom updates so you never have to chase me for status
• A 100% satisfaction guarantee before final milestone release

You can view my portfolio and recent case studies here: [Paste Portfolio Link]

Would love to hear more about your timeline. What does success look like for this project in the next 30 days?

Warm regards,
${freelancerName}`
  };

  // Proposal 3: The "Free Mini-Audit" Trojan Horse
  const proposal3 = {
    style: 'The Free Value / Mini-Audit (Highest Reply Rate)',
    badge: 'Highest Reply Rate',
    content: `Hi there,

Regarding your ${cleanTitle} opening: I took a quick look at your requirements and already have a few specific ideas on how to save you time and maximize your budget.

Before you even hire anyone, I'd be happy to put together a free 3-minute video breakdown with:
1. Two quick fixes you can implement immediately to improve performance
2. The most common pitfall to avoid with this exact type of project
3. A clear milestone roadmap if we decide to partner up

If you'd like me to send that breakdown over, just reply with a quick "yes" or drop your website link. Zero obligation either way!

Best regards,
${freelancerName}`
  };

  return [proposal1, proposal2, proposal3];
}

module.exports = { generateProposals };

if (require.main === module) {
  const test = generateProposals('Shopify E-Commerce Designer', 'Need a complete redesign of our supplement store for higher conversions.');
  console.log('✅ Generated 3 Proposal Variations:');
  test.forEach((p, i) => console.log(`\n--- [${i+1}] ${p.style} ---\n${p.content}`));
}
