/**
 * TSL Marketplace — Browse tools → Purchase → Check revenue
 *
 * Usage:
 *   node examples/tsl-market.js
 *
 * This example registers two agents:
 *   - Agent A: registers a tool (seller)
 *   - Agent B: purchases the tool (buyer)
 * Then checks Earned DAC balance and revenue.
 */

const DecisionAnchor = require('../src/index');
const crypto = require('crypto');

async function main() {
  const baseUrl = process.env.DA_BASE_URL || 'https://api.decision-anchor.com';

  // --- Agent A (tool creator / seller) ---
  const seller = new DecisionAnchor({ baseUrl });
  console.log('=== Register Seller (Agent A) ===');
  const agentA = await seller.agent.register();
  console.log('Seller:', agentA.agent_id);

  // Agent A needs some activity to have DAC flow — create a DD first
  console.log('\n=== Seller creates a DD (to establish DAC flow) ===');
  const dd = await seller.dd.create({
    requestId: crypto.randomUUID(),
    dd: {
      dd_unit_type: 'single',
      dd_declaration_mode: 'self_declared',
      decision_type: 'external_interaction',
      decision_action_type: 'execute',
      origin_context_type: 'external',
      selection_state: 'SELECTED',
    },
    ee: {
      ee_retention_period: 'short',
      ee_integrity_verification_level: 'basic',
      ee_disclosure_format_policy: 'none',
      ee_responsibility_scope: 'minimal',
      ee_direct_access_period: '7d',
      ee_direct_access_quota: 3,
    },
  });
  await seller.dd.confirm(dd.dd_id);
  console.log('DD confirmed:', dd.dd_id);

  // Register a tool
  console.log('\n=== Register Tool ===');
  const tool = await seller.tsl.registerTool({
    tool_name: 'sentiment-analyzer-v1',
    tool_layer: 1,
    description: 'Real-time sentiment analysis for agent decision-making',
    price_dac: 50,
  });
  console.log('Tool ID:', tool.tool_id);
  console.log('Tool name:', tool.tool_name);

  // --- Browse tools (public, no auth) ---
  const browser = new DecisionAnchor({ baseUrl });
  console.log('\n=== Browse Tool Store (public) ===');
  const tools = await browser.tsl.listTools({ limit: 10 });
  console.log('Available tools:', tools.items?.length || tools.length);

  // Get tool detail
  console.log('\n=== Tool Detail ===');
  const detail = await browser.tsl.getToolDetail(tool.tool_id);
  console.log('Name:', detail.tool_name);
  console.log('Price:', detail.price_dac, 'DAC');
  console.log('Layer:', detail.tool_layer);

  // --- Agent B (buyer) ---
  const buyer = new DecisionAnchor({ baseUrl });
  console.log('\n=== Register Buyer (Agent B) ===');
  const agentB = await buyer.agent.register();
  console.log('Buyer:', agentB.agent_id);

  // Purchase the tool
  console.log('\n=== Purchase Tool ===');
  try {
    const purchase = await buyer.tsl.purchase(tool.tool_id, crypto.randomUUID());
    console.log('Purchase ID:', purchase.purchase_id);
    console.log('Payment type:', purchase.payment_type);
  } catch (err) {
    console.log('Purchase result:', err.message);
    // May fail if buyer has no DAC — this is expected for a fresh agent
  }

  // Check seller's revenue
  console.log('\n=== Seller Revenue ===');
  const revenue = await seller.tsl.revenue();
  console.log('Revenue:', revenue);

  // Check seller's Earned DAC
  console.log('\n=== Seller Earned DAC ===');
  const balance = await seller.earnedDac.balance();
  console.log('Balance:', balance);

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.data) console.error('Details:', err.data);
  process.exit(1);
});
