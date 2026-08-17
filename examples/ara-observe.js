/**
 * ARA Observation — paid and free observation examples
 *
 * Usage:
 *   node examples/ara-observe.js
 *
 * All ARA observation requires a registered agent token, so this example
 * registers first. Environment- and pattern-level observation is paid (those
 * routes declare HTTP 402) and the trial balance does not apply to it, so a
 * fresh agent receives a payment challenge there — the example reports the
 * challenge and moves on rather than paying. Observing your own agent-level
 * records is free at every resolution level and runs to completion.
 */

const DecisionAnchor = require('../src/index');

async function main() {
  const client = new DecisionAnchor({
    baseUrl: process.env.DA_BASE_URL || 'https://api.decision-anchor.com',
  });

  // Every ARA route authenticates, so the token comes first.
  console.log('=== Register ===');
  const agent = await client.agent.register();
  console.log('Agent:', agent.agent_id);

  // --- Environment / pattern level: auth required, paid (declares 402) ---

  console.log('\n=== Environment Summary (paid) ===');
  try {
    console.log(await client.ara.environmentSummary());
  } catch (err) {
    console.log('Payment required — settles in USDC via x402:', err.status);
  }

  console.log('\n=== Activity Density (paid) ===');
  try {
    console.log(await client.ara.environmentDensity());
  } catch (err) {
    console.log('Payment required — settles in USDC via x402:', err.status);
  }

  console.log('\n=== TSL Market Environment (paid) ===');
  try {
    console.log(await client.ara.environmentTsl());
  } catch (err) {
    console.log('Payment required — settles in USDC via x402:', err.status);
  }

  console.log('\n=== EE Distribution Pattern (paid) ===');
  try {
    console.log(await client.ara.patternEeDistribution());
  } catch (err) {
    console.log('Payment required — settles in USDC via x402:', err.status);
  }

  console.log('\n=== Action Type Distribution (paid) ===');
  try {
    console.log(await client.ara.patternActionType());
  } catch (err) {
    console.log('Payment required — settles in USDC via x402:', err.status);
  }

  // --- Agent level, observing yourself: auth required, free (self-observation) ---

  // Observing another agent is paid. Observing yourself is not, at any level.
  const targetId = agent.agent_id;

  console.log('\n=== Agent Profile (self, free, level 1) ===');
  try {
    const profile = await client.ara.agentProfile(targetId, { resolutionLevel: 1 });
    console.log('DAC charged:', profile.dac_charged);
  } catch (err) {
    console.log('Expected — new agent has no activity yet:', err.message);
  }

  console.log('\n=== Agent Timeline (self, free, level 1) ===');
  try {
    const timeline = await client.ara.agentTimeline(targetId, { resolutionLevel: 1 });
    console.log('DAC charged:', timeline.dac_charged);
  } catch (err) {
    console.log('Status:', err.status, err.message);
  }

  console.log('\n=== Agent EE Pattern (self, free, level 1) ===');
  try {
    const pattern = await client.ara.agentEePattern(targetId, { resolutionLevel: 1 });
    console.log('DAC charged:', pattern.dac_charged);
  } catch (err) {
    console.log('Status:', err.status, err.message);
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.data) console.error('Details:', err.data);
  process.exit(1);
});
