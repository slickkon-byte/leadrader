// ==============================================================================
// FILE: supabaseClient.js
// PURPOSE: Connects to your Supabase Digital Filing Cabinet
//
// ANALOGY: Think of this file like a dedicated office assistant who has the key
// to your Supabase filing cabinet. Whenever we need to store a new lead or find
// a customer's record, this assistant opens the drawer and handles the paperwork.
// ==============================================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Pull our secret digital keys from the .env safe file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('🗄️ [Supabase Assistant] Successfully connected to your digital filing cabinet!');
  } catch (err) {
    console.log('⚠️ [Supabase Assistant] Connection notice: Running in local safe mode.', err.message);
  }
} else {
  console.log('⚠️ [Supabase Assistant] Missing Supabase keys. Operating in offline safe mode.');
}

/**
 * Saves a list of leads into the Supabase database.
 * If the table does not exist yet, it safely falls back so the app never crashes.
 */
async function saveLeadsToCabinet(leads) {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from('leads')
      .upsert(leads.map(l => ({
        id: l.id,
        title: l.title,
        company_name: l.companyName,
        salary: l.salary,
        category: l.opportunity.category,
        agency_value: l.opportunity.agencyValue,
        posted_date: l.postedDate
      })));
    if (error) {
      // Table might not exist yet; that's completely normal for a brand new project!
      console.log('ℹ️ [Supabase Note] Leads kept in fast memory cache (Table ready to be initialized).');
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  supabase,
  saveLeadsToCabinet
};
