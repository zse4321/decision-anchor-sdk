/**
 * Basic DD Flow — Register → Create DD → Confirm
 *
 * Usage:
 *   node examples/basic-dd.js
 *
 * By default connects to https://api.decision-anchor.com.
 * Set DA_BASE_URL env var to override (e.g. http://localhost:3000).
 */

const DecisionAnchor = require('../src/index');
const crypto = require('crypto');

async function main() {
  const client = new DecisionAnchor({
    baseUrl: process.env.DA_BASE_URL || 'https://api.decision-anchor.com',
  });

  // 1. Register a new agent
  console.log('=== Agent Registration ===');
  const agent = await client.agent.register();
  console.log('Agent ID:', agent.agent_id);
  console.log('Token:', agent.auth_token.slice(0, 12) + '...');

  // 2. Check current pricing
  console.log('\n=== Pricing ===');
  const pricing = await client.pricing.current();
  console.log('Active pricing:', pricing.version_label || 'default');

  // 3. (Optional) Simulate EE cost with sDAC before committing
  console.log('\n=== sDAC Simulation ===');
  const session = await client.sdac.startSession();
  console.log('Session:', session.session_id);

  const ee = {
    ee_retention_period: 'medium',
    ee_integrity_verification_level: 'standard',
    ee_disclosure_format_policy: 'summary',
    ee_responsibility_scope: 'standard',
    ee_direct_access_period: '30d',
    ee_direct_access_quota: 5,
  };

  const trialResult = await client.sdac.trial(session.session_id, ee);
  console.log('Simulated DAC cost:', trialResult.calculated_dac);
  await client.sdac.endSession(session.session_id);

  // 4. Create a DD with the EE combination
  console.log('\n=== DD Create ===');
  const dd = await client.dd.create({
    requestId: crypto.randomUUID(),
    dd: {
      dd_unit_type: 'single',
      dd_declaration_mode: 'self_declared',
      decision_type: 'external_interaction',
      decision_action_type: 'execute',
      origin_context_type: 'external',
      selection_state: 'SELECTED',
    },
    ee,
  });
  console.log('DD ID:', dd.dd_id);
  console.log('DAC amount:', dd.dac_amount);
  console.log('Cost breakdown:', dd.cost_breakdown);

  // 5. Confirm the DD
  console.log('\n=== DD Confirm ===');
  const confirmed = await client.dd.confirm(dd.dd_id);
  console.log('Status:', confirmed.status);

  // 6. Verify in DD list
  console.log('\n=== DD List ===');
  const list = await client.dd.list({ limit: 3 });
  console.log('Total DDs:', list.total || list.items?.length);

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.data) console.error('Details:', err.data);
  process.exit(1);
});
