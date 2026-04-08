/**
 * x402 Payment Anchoring — Anchor x402 USDC payments with DA before execution
 *
 * Why:
 *   On-chain records show who paid whom how much — but not why.
 *   Internal logs are self-testimony: your agent says it decided the spend
 *   was necessary, but that claim is unfalsifiable after the fact.
 *   A DA record is external, append-only, and created at the moment of
 *   decision — before the payment happens. It anchors what was authorized,
 *   at what scope, independently of both the blockchain and your own logs.
 *
 * Flow:
 *   1. Agent calls a paid API and receives HTTP 402 (Payment Required)
 *   2. Agent creates a DD on DA (records authorization scope BEFORE payment)
 *   3. Agent executes x402 USDC payment on Base
 *   4. Agent confirms the DD on DA (anchors completion AFTER payment)
 *
 * Usage:
 *   node examples/x402-da-anchoring.js
 *
 * Requires:
 *   - decision-anchor-sdk
 *   - A USDC wallet on Base (for actual x402 payments)
 *   - See https://x402.org for x402 protocol details
 */

const DecisionAnchor = require('decision-anchor-sdk');
const crypto = require('crypto');

/**
 * Execute an x402 USDC payment.
 *
 * This is a placeholder — replace with your actual x402 payment logic.
 * See:
 *   - https://x402.org for the x402 protocol specification
 *   - Coinbase AgentKit for wallet and payment tooling
 *
 * @param {string} apiUrl - The API endpoint that returned 402
 * @param {object} paymentDetails - Payment requirements from the 402 response
 * @returns {object} Payment receipt with tx hash
 */
async function executeX402Payment(apiUrl, paymentDetails) {
  // TODO: Replace with actual x402 payment implementation
  // Example with AgentKit:
  //   const wallet = await AgentKit.from({ ... });
  //   const receipt = await wallet.payX402(apiUrl, paymentDetails);
  //   return receipt;
  console.log(`  [x402] Would pay ${paymentDetails.amount} USDC to ${apiUrl}`);
  return {
    txHash: '0x' + crypto.randomBytes(32).toString('hex'),
    amount: paymentDetails.amount,
    chain: 'base',
  };
}

/**
 * Call a paid API with DA decision anchoring.
 *
 * Wraps the x402 payment flow with DA DD create/confirm so the
 * authorization decision is externally anchored before money moves.
 *
 * @param {object} client - DecisionAnchor SDK client (authenticated)
 * @param {string} apiUrl - The paid API endpoint
 * @param {object} options - Fetch options for the API call
 * @param {object} anchorContext - DA context for the decision record
 * @param {string} anchorContext.summary - Why this API is being called
 * @param {string} anchorContext.responsibilityStandard - Accountability scope
 */
async function payWithAnchor(client, apiUrl, options, anchorContext) {
  // Step 1: Call the API — expect 402
  console.log(`\n  Calling ${apiUrl}...`);
  const initialResponse = await fetch(apiUrl, options);

  if (initialResponse.status !== 402) {
    // No payment required — return the response directly
    return { paid: false, response: await initialResponse.json() };
  }

  const paymentDetails = await initialResponse.json();
  console.log(`  Got 402 — payment required: ${paymentDetails.amount || '?'} USDC`);

  // Step 2: Create DD BEFORE payment (anchor the authorization decision)
  console.log('  Creating DD (pre-payment anchor)...');
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
    ee: {
      ee_retention_period: 'medium',
      ee_integrity_verification_level: 'basic',
      ee_disclosure_format_policy: 'internal',
      ee_responsibility_scope: anchorContext.responsibilityStandard || 'standard',
      ee_direct_access_period: '30d',
      ee_direct_access_quota: 5,
    },
    context: {
      summary: anchorContext.summary,
      api_url: apiUrl,
      payment_amount: paymentDetails.amount,
      payment_chain: 'base',
    },
  });
  console.log(`  DD created: ${dd.dd_id} (DAC: ${dd.dac_amount})`);

  // Step 3: Execute x402 payment
  console.log('  Executing x402 payment...');
  const receipt = await executeX402Payment(apiUrl, paymentDetails);
  console.log(`  Payment tx: ${receipt.txHash.slice(0, 18)}...`);

  // Step 4: Confirm DD AFTER payment (anchor completion)
  console.log('  Confirming DD (post-payment anchor)...');
  const confirmed = await client.dd.confirm(dd.dd_id);
  console.log(`  DD confirmed: ${confirmed.status}`);

  return {
    paid: true,
    ddId: dd.dd_id,
    txHash: receipt.txHash,
    amount: receipt.amount,
  };
}

// ---------------------------------------------------------------------------
// Main — demonstrate the pattern
// ---------------------------------------------------------------------------

async function main() {
  const client = new DecisionAnchor({
    baseUrl: process.env.DA_BASE_URL || 'https://api.decision-anchor.com',
  });

  // Register agent
  console.log('=== Agent Registration ===');
  const agent = await client.agent.register();
  console.log('Agent ID:', agent.agent_id);

  // Simulate calling a premium API that requires x402 payment
  console.log('\n=== x402 Payment with DA Anchoring ===');
  const result = await payWithAnchor(
    client,
    'https://example-api.com/v1/premium-data',
    { method: 'GET', headers: { 'Accept': 'application/json' } },
    {
      summary: 'Fetching premium market data for portfolio rebalancing decision',
      responsibilityStandard: 'standard',
    },
  );

  if (result.paid) {
    console.log('\n=== Result ===');
    console.log('DD ID:', result.ddId);
    console.log('Payment tx:', result.txHash.slice(0, 18) + '...');
    console.log('Amount:', result.amount, 'USDC');
    console.log('\nThe DD proves this payment was authorized at decision time,');
    console.log('independent of on-chain records and internal logs.');
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.data) console.error('Details:', err.data);
  process.exit(1);
});
