/**
 * Decision Anchor SDK
 *
 * Client library for the Decision Anchor API.
 * Covers agent lifecycle, Decision Documents, ARA observation,
 * TSL marketplace, ISE sessions, sDAC simulation, ASA snapshots,
 * DUR reports, Earned DAC, and DAP owner portal.
 *
 * @example
 *   const DA = require('decision-anchor-sdk');
 *   const client = new DA({ baseUrl: 'https://api.decision-anchor.com' });
 *   const agent = await client.agent.register();
 */

const DEFAULT_BASE_URL = 'https://api.decision-anchor.com';

class DecisionAnchor {
  /**
   * @param {object} opts
   * @param {string} [opts.baseUrl] - API base URL (default: https://api.decision-anchor.com)
   * @param {string} [opts.token]   - Agent auth_token (set after register or manually)
   */
  constructor(opts = {}) {
    this.baseUrl = (opts.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.token = opts.token || null;

    this.agent    = new AgentAPI(this);
    this.dd       = new DDAPI(this);
    this.bilateral = new BilateralAPI(this);
    this.pricing  = new PricingAPI(this);
    this.payment  = new PaymentAPI(this);
    this.dab      = new DABAPI(this);
    this.sdac     = new SDacAPI(this);
    this.ise      = new ISEAPI(this);
    this.ara      = new ARAAPI(this);
    this.earnedDac = new EarnedDacAPI(this);
    this.tsl      = new TSLAPI(this);
    this.asa      = new ASAAPI(this);
    this.dur      = new DURAPI(this);
    this.trial    = new TrialAPI(this);
    this.dap      = new DAPAPI(this);
  }

  /** Low-level request helper. */
  async _req(method, path, { body, query, headers: extra, raw } = {}) {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, v);
      }
    }

    const headers = { ...extra };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (raw) return res;

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('json') ? await res.json() : await res.text();

    if (!res.ok) {
      const err = new Error(data?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }
}

// ---------------------------------------------------------------------------
// Agent
// ---------------------------------------------------------------------------

class AgentAPI {
  constructor(client) { this.c = client; }

  /** Register a new agent. Stores token on the client instance. */
  async register(regionCode) {
    const data = await this.c._req('POST', '/v1/agent/register', {
      body: regionCode ? { region_code: regionCode } : {},
    });
    this.c.token = data.auth_token;
    return data;
  }

  /** Rotate auth token. */
  async rotateToken(agentId) {
    const data = await this.c._req('POST', '/v1/agent/token/rotate', {
      body: { agent_id: agentId },
    });
    this.c.token = data.auth_token;
    return data;
  }

  /** Update disclosure level ('none' | 'summary' | 'detailed' | 'full'). */
  async updateDisclosure(level) {
    return this.c._req('PUT', '/v1/agent/disclosure', {
      body: { disclosure_level: level },
    });
  }
}

// ---------------------------------------------------------------------------
// Decision Documents
// ---------------------------------------------------------------------------

class DDAPI {
  constructor(client) { this.c = client; }

  /**
   * Create a DD.
   * @param {object} params
   * @param {string} params.requestId - Idempotency key (UUID)
   * @param {object} params.dd        - DD input fields
   * @param {object} params.ee        - EE input fields
   * @param {object} [params.continuity]
   * @param {string} [params.premiumPaymentSource] - 'external' | 'earned'
   * @param {object} [params.context] - Optional context metadata
   */
  async create({ requestId, dd, ee, continuity, premiumPaymentSource, context }) {
    return this.c._req('POST', '/v1/dd/create', {
      body: {
        request_id: requestId,
        dd, ee,
        ...(continuity && { continuity }),
        ...(premiumPaymentSource && { premium_payment_source: premiumPaymentSource }),
        ...(context && { context }),
      },
    });
  }

  /** Confirm a DD after payment. */
  async confirm(ddId, transactionId) {
    return this.c._req('POST', '/v1/dd/confirm', {
      body: { dd_id: ddId, ...(transactionId && { transaction_id: transactionId }) },
    });
  }

  /** List DDs. */
  async list({ from, to, limit, offset } = {}) {
    return this.c._req('GET', '/v1/dd/list', { query: { from, to, limit, offset } });
  }

  /** Get DD by ID. */
  async get(ddId) {
    return this.c._req('GET', `/v1/dd/${ddId}`);
  }

  /** Get lineage tree. */
  async lineage(ddId) {
    return this.c._req('GET', `/v1/dd/${ddId}/lineage`);
  }

  /** Get lineage group. */
  async lineageGroup(groupId) {
    return this.c._req('GET', `/v1/dd/lineage-group/${groupId}`);
  }
}

// ---------------------------------------------------------------------------
// Bilateral DD
// ---------------------------------------------------------------------------

class BilateralAPI {
  constructor(client) { this.c = client; }

  /** Propose a bilateral agreement. */
  async propose({ counterpartyAgentId, dd, ee, continuity, requestId }) {
    return this.c._req('POST', '/v1/dd/bilateral/propose', {
      body: {
        counterparty_agent_id: counterpartyAgentId,
        dd, ee,
        ...(continuity && { continuity }),
        ...(requestId && { request_id: requestId }),
      },
    });
  }

  /** Accept or reject a bilateral proposal. */
  async respond(agreementId, accept) {
    return this.c._req('POST', `/v1/dd/bilateral/${agreementId}/respond`, {
      body: { accept },
    });
  }

  /** List received proposals. */
  async received(all) {
    return this.c._req('GET', '/v1/dd/bilateral/received', {
      query: all !== undefined ? { all: String(all) } : {},
    });
  }

  /** List sent proposals. */
  async sent() {
    return this.c._req('GET', '/v1/dd/bilateral/sent');
  }
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

class PricingAPI {
  constructor(client) { this.c = client; }

  /** Get current pricing policy. */
  async current() {
    return this.c._req('GET', '/v1/pricing/current');
  }

  /** Get EE presets with DAC calculations. */
  async eePresets() {
    return this.c._req('GET', '/v1/pricing/ee-presets');
  }
}

// ---------------------------------------------------------------------------
// Payment
// ---------------------------------------------------------------------------

class PaymentAPI {
  constructor(client) { this.c = client; }

  /** Get payment status for a DD. */
  async status(ddId) {
    return this.c._req('GET', `/v1/payment/${ddId}/status`);
  }
}

// ---------------------------------------------------------------------------
// DAB (agent-side)
// ---------------------------------------------------------------------------

class DABAPI {
  constructor(client) { this.c = client; }

  /** Get agent's own DAB status. */
  async status() {
    return this.c._req('GET', '/v1/dab/status');
  }
}

// ---------------------------------------------------------------------------
// sDAC Simulation
// ---------------------------------------------------------------------------

class SDacAPI {
  constructor(client) { this.c = client; }

  /** Start a simulation session. */
  async startSession() {
    return this.c._req('POST', '/v1/sdac/session/start');
  }

  /** Run a trial with an EE combination. */
  async trial(sessionId, ee) {
    return this.c._req('POST', '/v1/sdac/trial', {
      body: { session_id: sessionId, ee },
    });
  }

  /** Get session history. */
  async getSession(sessionId) {
    return this.c._req('GET', `/v1/sdac/session/${sessionId}`);
  }

  /** End a simulation session. */
  async endSession(sessionId) {
    return this.c._req('POST', '/v1/sdac/session/end', {
      body: { session_id: sessionId },
    });
  }
}

// ---------------------------------------------------------------------------
// ISE (Interactive Session Environment)
// ---------------------------------------------------------------------------

class ISEAPI {
  constructor(client) { this.c = client; }

  /** Enter ISE. paymentMode: 'free' | 'earned_only' | 'external' */
  async enter(paymentMode) {
    return this.c._req('POST', '/v1/ise/enter', {
      body: paymentMode ? { payment_mode: paymentMode } : {},
    });
  }

  /** Get current ISE session status. */
  async status() {
    return this.c._req('GET', '/v1/ise/status');
  }

  /** Exit ISE session. */
  async exit() {
    return this.c._req('POST', '/v1/ise/exit');
  }
}

// ---------------------------------------------------------------------------
// ARA (Autonomous Reality Analytics)
// ---------------------------------------------------------------------------

class ARAAPI {
  constructor(client) { this.c = client; }

  // --- Free (no auth) ---

  /** Environment summary (free). */
  async environmentSummary() {
    return this.c._req('GET', '/v1/ara/environment');
  }

  /** Activity density (free). */
  async environmentDensity() {
    return this.c._req('GET', '/v1/ara/environment/density');
  }

  /** TSL market environment (free). */
  async environmentTsl() {
    return this.c._req('GET', '/v1/ara/environment/tsl');
  }

  /** EE distribution pattern (free). */
  async patternEeDistribution() {
    return this.c._req('GET', '/v1/ara/pattern/ee-distribution');
  }

  /** Action type distribution (free). */
  async patternActionType() {
    return this.c._req('GET', '/v1/ara/pattern/action-type');
  }

  // --- Paid (auth required) ---

  /**
   * Agent profile observation (paid).
   * @param {string} agentId
   * @param {object} [opts]
   * @param {number} [opts.resolutionLevel] - 1 | 2 | 3
   * @param {string} [opts.premiumSource]   - 'external' | 'earned'
   */
  async agentProfile(agentId, { resolutionLevel, premiumSource } = {}) {
    return this.c._req('GET', `/v1/ara/agent/${agentId}/profile`, {
      query: { resolution_level: resolutionLevel, premium_source: premiumSource },
    });
  }

  /** Agent timeline observation (paid). */
  async agentTimeline(agentId, { resolutionLevel, premiumSource } = {}) {
    return this.c._req('GET', `/v1/ara/agent/${agentId}/timeline`, {
      query: { resolution_level: resolutionLevel, premium_source: premiumSource },
    });
  }

  /** Agent EE pattern observation (paid). */
  async agentEePattern(agentId, { resolutionLevel, premiumSource } = {}) {
    return this.c._req('GET', `/v1/ara/agent/${agentId}/ee-pattern`, {
      query: { resolution_level: resolutionLevel, premium_source: premiumSource },
    });
  }

  /** Compare agents (paid). */
  async patternCompare(agentIds, { resolutionLevel, premiumSource } = {}) {
    return this.c._req('GET', '/v1/ara/pattern/compare', {
      query: {
        agents: Array.isArray(agentIds) ? agentIds.join(',') : agentIds,
        resolution_level: resolutionLevel,
        premium_source: premiumSource,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Earned DAC
// ---------------------------------------------------------------------------

class EarnedDacAPI {
  constructor(client) { this.c = client; }

  /** Get Earned DAC balance. */
  async balance() {
    return this.c._req('GET', '/v1/earned-dac/balance');
  }

  /** Get Earned DAC ledger. */
  async ledger({ limit, offset } = {}) {
    return this.c._req('GET', '/v1/earned-dac/ledger', { query: { limit, offset } });
  }
}

// ---------------------------------------------------------------------------
// TSL (Tool Store Layer)
// ---------------------------------------------------------------------------

class TSLAPI {
  constructor(client) { this.c = client; }

  /** Register a tool. */
  async registerTool(toolData) {
    return this.c._req('POST', '/v1/tsl/tool/register', { body: toolData });
  }

  /** List tools (public). */
  async listTools({ layer, status, limit, page } = {}) {
    return this.c._req('GET', '/v1/tsl/tools', { query: { layer, status, limit, page } });
  }

  /** Get tool detail (public). */
  async getToolDetail(toolId) {
    return this.c._req('GET', `/v1/tsl/tool/${toolId}`);
  }

  /** Get tool dependencies (public). */
  async getDependencies(toolId) {
    return this.c._req('GET', `/v1/tsl/tool/${toolId}/dependencies`);
  }

  /** Purchase a Layer 1 tool. */
  async purchase(toolId, requestId) {
    return this.c._req('POST', '/v1/tsl/purchase', {
      body: { tool_id: toolId, ...(requestId && { request_id: requestId }) },
    });
  }

  /** Purchase a Layer 2 tool. */
  async purchaseLayer2(toolId) {
    return this.c._req('POST', '/v1/tsl/purchase/layer2', { body: { tool_id: toolId } });
  }

  /** List purchase/sale history. */
  async listPurchases({ role, limit, offset } = {}) {
    return this.c._req('GET', '/v1/tsl/purchases', { query: { role, limit, offset } });
  }

  /** Get revenue status. */
  async revenue() {
    return this.c._req('GET', '/v1/tsl/revenue');
  }

  /** Add a dependency. */
  async addDependency(toolId, dependsOnToolId, purchaseId) {
    return this.c._req('POST', `/v1/tsl/tool/${toolId}/dependency`, {
      body: { depends_on_tool_id: dependsOnToolId, ...(purchaseId && { purchase_id: purchaseId }) },
    });
  }

  /** Create a revenue share agreement. */
  async createRevenueShare({ toolId, componentToolId, beneficiaryAgentId, shareRate }) {
    return this.c._req('POST', '/v1/tsl/revenue-share', {
      body: {
        tool_id: toolId,
        component_tool_id: componentToolId,
        beneficiary_agent_id: beneficiaryAgentId,
        share_rate: shareRate,
      },
    });
  }

  /** List revenue shares for a tool. */
  async getRevenueShares(toolId) {
    return this.c._req('GET', `/v1/tsl/tool/${toolId}/revenue-shares`);
  }
}

// ---------------------------------------------------------------------------
// ASA (Agent State Archive)
// ---------------------------------------------------------------------------

class ASAAPI {
  constructor(client) { this.c = client; }

  /** Register a snapshot hash (free). */
  async register({ blobHash, blobUrl, blobSizeBytes, encryptedKey, label }) {
    return this.c._req('POST', '/v1/asa/register', {
      body: {
        blob_hash: blobHash,
        ...(blobUrl && { blob_url: blobUrl }),
        ...(blobSizeBytes && { blob_size_bytes: blobSizeBytes }),
        ...(encryptedKey && { encrypted_key: encryptedKey }),
        ...(label && { label }),
      },
    });
  }

  /** Get snapshot metadata. */
  async snapshot() {
    return this.c._req('GET', '/v1/asa/snapshot');
  }

  /** Verify a blob hash. */
  async verify(blobHash) {
    return this.c._req('POST', '/v1/asa/verify', { body: { blob_hash: blobHash } });
  }
}

// ---------------------------------------------------------------------------
// DUR (DAC Usage Report)
// ---------------------------------------------------------------------------

class DURAPI {
  constructor(client) { this.c = client; }

  /** Get usage summary. */
  async summary({ from, to } = {}) {
    return this.c._req('GET', '/v1/dur/summary', { query: { from, to } });
  }

  /** Get payment transactions. */
  async transactions({ from, to, type, page, limit } = {}) {
    return this.c._req('GET', '/v1/dur/transactions', { query: { from, to, type, page, limit } });
  }

  /** Get TSL transactions. */
  async tsl({ from, to, role, page, limit } = {}) {
    return this.c._req('GET', '/v1/dur/tsl', { query: { from, to, role, page, limit } });
  }

  /** Export data (csv or json). */
  async export({ from, to, format } = {}) {
    return this.c._req('GET', '/v1/dur/export', { query: { from, to, format } });
  }
}

// ---------------------------------------------------------------------------
// Trial
// ---------------------------------------------------------------------------

class TrialAPI {
  constructor(client) { this.c = client; }

  /** Get Trial DAC status. */
  async status() {
    return this.c._req('GET', '/v1/trial/status');
  }
}

// ---------------------------------------------------------------------------
// DAP (owner portal — session-based)
// ---------------------------------------------------------------------------

class DAPAPI {
  constructor(client) {
    this.c = client;
    this._cookie = null;
  }

  /** Internal: attach session cookie. */
  _h() { return this._cookie ? { Cookie: this._cookie } : {}; }

  /** Register a DAP owner. */
  async register(email, password) {
    return this.c._req('POST', '/dap/register', {
      body: { email, password },
    });
  }

  /** Login. Stores session cookie for subsequent calls. */
  async login(email, password) {
    const res = await this.c._req('POST', '/dap/login', {
      body: { email, password }, raw: true,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const err = new Error(body.error || body.message || `Login failed: ${res.status}`);
      err.status = res.status;
      err.data = body;
      throw err;
    }
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) this._cookie = setCookie.split(';')[0];
    return res.json();
  }

  /** Logout. */
  async logout() {
    const data = await this.c._req('POST', '/dap/logout', { headers: this._h() });
    this._cookie = null;
    return data;
  }

  /** Link an agent (grants Trial automatically). */
  async linkAgent(agentId, authToken) {
    return this.c._req('POST', '/dap/agent/link', {
      body: { agent_id: agentId, auth_token: authToken },
      headers: this._h(),
    });
  }

  /** Unlink an agent. */
  async unlinkAgent(agentId, password) {
    return this.c._req('DELETE', '/dap/agent/unlink', {
      body: { agent_id: agentId, password },
      headers: this._h(),
    });
  }

  /** List linked agents. */
  async listAgents() {
    return this.c._req('GET', '/dap/agents', { headers: this._h() });
  }

  /** Set DAB budget. */
  async setDab(agentId, budgetLimitDac, budgetPeriod) {
    return this.c._req('PUT', '/dap/dab/set', {
      body: { agent_id: agentId, budget_limit_dac: budgetLimitDac, budget_period: budgetPeriod },
      headers: this._h(),
    });
  }

  /** Get DAB status. */
  async getDabStatus(agentId) {
    return this.c._req('GET', '/dap/dab/status', {
      query: { agent_id: agentId },
      headers: this._h(),
    });
  }

  /** Remove DAB. */
  async removeDab(agentId, password) {
    return this.c._req('DELETE', '/dap/dab/remove', {
      body: { agent_id: agentId, password },
      headers: this._h(),
    });
  }

  /** Get owner dashboard. */
  async dashboard() {
    return this.c._req('GET', '/dap/dashboard', { headers: this._h() });
  }

  /** Get agent report. */
  async agentReport(agentId) {
    return this.c._req('GET', `/dap/agent/${agentId}/report`, { headers: this._h() });
  }

  /** Get weekly report. */
  async weeklyReport(agentId) {
    return this.c._req('GET', `/dap/agent/${agentId}/report/weekly`, { headers: this._h() });
  }

  /** Export report as CSV. */
  async exportReport(agentId, { from, to } = {}) {
    return this.c._req('GET', `/dap/agent/${agentId}/report/export`, {
      query: { from, to },
      headers: this._h(),
    });
  }

  /** Create human share agreement. */
  async createHumanShare(toolId, humanShareRate) {
    return this.c._req('POST', '/dap/tsl/human-share', {
      body: { tool_id: toolId, human_share_rate: humanShareRate },
      headers: this._h(),
    });
  }

  /** List human share agreements. */
  async listHumanShares() {
    return this.c._req('GET', '/dap/tsl/human-shares', { headers: this._h() });
  }

  /** Get trial status (owner). */
  async trialStatus() {
    return this.c._req('GET', '/dap/trial/status', { headers: this._h() });
  }
}

module.exports = DecisionAnchor;
