// ==============================================================================
// FILE: auditEngine.js
// PURPOSE: Automated Website Speed & Performance Auditor for SiteAudit Radar ($49/mo)
//
// ANALOGY: Like a virtual mechanic that runs a quick health check on any car.
// It checks speed, mobile responsiveness, and security, gives a score out of 100,
// and gives web design agencies a ready-to-send pitch pointing out the flaws!
// ==============================================================================

const axios = require('axios');

/**
 * Scans a target website URL and returns performance metrics & client pitch
 */
async function auditWebsite(inputUrl) {
  let targetUrl = inputUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const startTime = Date.now();
  let status = 200;
  let loadTimeMs = 0;
  let htmlContent = '';
  let headers = {};
  let isHttps = targetUrl.startsWith('https://');

  try {
    const res = await axios.get(targetUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ClientScoutAudit/1.0'
      }
    });
    loadTimeMs = Date.now() - startTime;
    htmlContent = res.data || '';
    headers = res.headers || {};
    status = res.status;
  } catch (err) {
    loadTimeMs = Date.now() - startTime;
    if (err.response) {
      status = err.response.status;
      headers = err.response.headers || {};
    } else {
      // Offline or network error
      return {
        url: targetUrl,
        success: false,
        error: 'Unable to reach website. Please verify the URL and try again.'
      };
    }
  }

  // Diagnostics
  const issues = [];
  const passes = [];
  let score = 100;

  // 1. Response Time Check
  if (loadTimeMs > 1200) {
    score -= 25;
    issues.push(`Slow Server Response Time: ${loadTimeMs}ms (Google recommends < 600ms for optimal SEO).`);
  } else if (loadTimeMs > 600) {
    score -= 10;
    issues.push(`Moderate Server Response: ${loadTimeMs}ms. Can be optimized with CDN and caching.`);
  } else {
    passes.push(`Fast Initial Server Response: ${loadTimeMs}ms (Excellent!).`);
  }

  // 2. Mobile Viewport Check
  const hasViewport = typeof htmlContent === 'string' && htmlContent.includes('<meta name="viewport"');
  if (!hasViewport) {
    score -= 30;
    issues.push('Missing Mobile Viewport Tag: Mobile visitors may experience broken layout or improper zooming.');
  } else {
    passes.push('Mobile Viewport Meta Tag Detected (Mobile friendly ready).');
  }

  // 3. SSL / HTTPS Check
  if (!isHttps) {
    score -= 20;
    issues.push('Insecure Connection (HTTP): Modern browsers display a "Not Secure" warning to visitors.');
  } else {
    passes.push('Secure HTTPS SSL Certificate Installed.');
  }

  // 4. Modern Compression
  const contentEncoding = headers['content-encoding'] || '';
  if (!contentEncoding.includes('gzip') && !contentEncoding.includes('br')) {
    score -= 15;
    issues.push('Missing Gzip/Brotli Compression: Assets are served uncompressed, slowing down page loads.');
  } else {
    passes.push(`Modern Compression Active (${contentEncoding}).`);
  }

  // 5. Security Headers
  const hasHsts = headers['strict-transport-security'];
  if (!hasHsts) {
    score -= 5;
    issues.push('Missing HSTS Security Header (Strict Transport Security).');
  } else {
    passes.push('HSTS Protection Active.');
  }

  score = Math.max(20, Math.min(100, score));

  // Determine Grade
  let grade = 'A';
  let badgeColor = 'emerald';
  if (score < 60) {
    grade = 'Needs Immediate Attention (F)';
    badgeColor = 'rose';
  } else if (score < 80) {
    grade = 'Sub-Optimal (C)';
    badgeColor = 'amber';
  } else {
    grade = 'Good Performance (A)';
  }

  const hostname = new URL(targetUrl).hostname.replace('www.', '');

  // Generate Agency Pitch
  const agencyPitch = `Hi ${hostname} Team,

I ran a quick technical performance audit on ${hostname} and noticed a couple of items that are likely costing you conversions:

${issues.map((iss, i) => `• ${iss}`).join('\n')}

When mobile visitors hit slow load times or missing optimization tags, bounce rates increase by over 32% according to Google research.

Our agency specializes in high-speed web redesigns and speed sprints. We typically take sites from sub-optimal speeds to sub-second load times within 14 days.

Would you be open to seeing a free 3-minute video breakdown of how we can fix these bottlenecks for ${hostname}?

Best regards,
[Your Name]
[Your Agency Name]`;

  return {
    success: true,
    url: targetUrl,
    domain: hostname,
    score,
    grade,
    badgeColor,
    loadTimeMs,
    issues,
    passes,
    estimatedAgencyValue: '$3,500 – $6,000 Redesign & Speed Sprint',
    agencyPitch
  };
}

module.exports = { auditWebsite };

if (require.main === module) {
  auditWebsite('google.com').then(r => console.log('Audit Result for Google:', r.score, r.grade));
}
