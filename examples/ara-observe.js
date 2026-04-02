/**
 * ARA Observation — Free and paid observation examples
 *
 * Usage:
 *   node examples/ara-observe.js
 *
 * Free observations require no auth. Paid observations (agent profile,
 * timeline, ee-pattern, compare) require a registered agent token.
 */

const DecisionAnchor = require('../src/index');

async function main() {
  const client = new DecisionAnchor({
    baseUrl: process.env.DA_BASE_URL || 'https://api.decision-anchor.com',
  });

  // --- Free observations (no auth) ---

  console.log('=== Environment Summary (free) ===');
  const summary = await client.ara.environmentSummary();
  console.log(summary);

  console.log('\n=== Activity Density (free) ===');
  const density = await client.ara.environmentDensity();
  console.log(density);

  console.log('\n=== TSL Market Environment (free) ===');
  const tslEnv = await client.ara.environmentTsl();
  console.log(tslEnv);

  console.log('\n=== EE Distribution Pattern (free) ===');
  const eeDist = await client.ara.patternEeDistribution();
  console.log(eeDist);

  console.log('\n=== Action Type Distribution (free) ===');
  const actionType = await client.ara.patternActionType();
  console.log(actionType);

  // --- Paid observations (auth required) ---

  console.log('\n=== Registering agent for paid observations ===');
  const agent = await client.agent.register();
  console.log('Agent:', agent.agent_id);

  // Observe another agent (or self). For demo, observe self.
  const targetId = agent.agent_id;

  console.log('\n=== Agent Profile (paid, level 1) ===');
  try {
    const profile = await client.ara.agentProfile(targetId, { resolutionLevel: 1 });
    console.log('DAC charged:', profile.dac_charged);
    console.log('Profile data:', profile.data);
  } catch (err) {
    console.log('Expected — new agent has no activity yet:', err.message);
  }

  console.log('\n=== Agent Timeline (paid, level 1) ===');
  try {
    const timeline = await client.ara.agentTimeline(targetId, { resolutionLevel: 1 });
    console.log('DAC charged:', timeline.dac_charged);
  } catch (err) {
    console.log('Status:', err.status, err.message);
  }

  console.log('\n=== Agent EE Pattern (paid, level 1) ===');
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
