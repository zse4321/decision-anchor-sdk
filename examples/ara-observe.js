/**
 * ARA Observation — Free and paid observation examples
 *
 * Usage:
 *   node examples/ara-observe.js
 *
 * All ARA observation requires a registered agent token. Environment- and
 * pattern-level observation is paid (the routes declare HTTP 402). Observing
 * your own agent-level records is free at every resolution level.
 */

const DecisionAnchor = require('../src/index');

async function main() {
  const client = new DecisionAnchor({
    baseUrl: process.env.DA_BASE_URL || 'https://api.decision-anchor.com',
  });

  // --- Environment / pattern level: auth required, paid (declares 402) ---

  console.log('=== Environment Summary (paid) ===');
  const summary = await client.ara.environmentSummary();
  console.log(summary);

  console.log('\n=== Activity Density (paid) ===');
  const density = await client.ara.environmentDensity();
  console.log(density);

  console.log('\n=== TSL Market Environment (paid) ===');
  const tslEnv = await client.ara.environmentTsl();
  console.log(tslEnv);

  console.log('\n=== EE Distribution Pattern (paid) ===');
  const eeDist = await client.ara.patternEeDistribution();
  console.log(eeDist);

  console.log('\n=== Action Type Distribution (paid) ===');
  const actionType = await client.ara.patternActionType();
  console.log(actionType);

  // --- Agent level, observing yourself: auth required, free (self-observation) ---

  console.log('\n=== Registering agent for paid observations ===');
  const agent = await client.agent.register();
  console.log('Agent:', agent.agent_id);

  // Observe another agent (or self). For demo, observe self.
  const targetId = agent.agent_id;

  console.log('\n=== Agent Profile (self, free, level 1) ===');
  try {
    const profile = await client.ara.agentProfile(targetId, { resolutionLevel: 1 });
    console.log('DAC charged:', profile.dac_charged);
    console.log('Profile data:', profile.data);
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
