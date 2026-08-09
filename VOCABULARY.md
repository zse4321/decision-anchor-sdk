# O-8 — 어휘 규율 (단일 출처)

> **본 파일이 정본이다.** §111이 O-8을 신설하고 §188·§192가 누락을 발견했으나, 규율과 점검 대상이 HANDOVER 산문에만 있어 **다음 점검이 참조할 목록이 없었다.** 그래서 세 번 빠졌다. 이 파일이 그 공백을 메운다.
>
> 갱신 시: 이 파일을 고치고 HANDOVER에 §로 남긴다. HANDOVER 산문을 정본으로 삼지 않는다.

---

## 1. 판정 기준 — 낱말이 아니라 주어다

> **DA가 증명·보증·판정하는 주어로 서면 오염이다.**

낱말 자체가 금지어인 것이 아니다. 같은 낱말이 문장 안에서 어떤 주어를 갖느냐로 갈린다.

**오염** — DA가 하는 일로 서술됨
- "DA proves both sides" · "externally verifiable" (DA가 그렇게 만든다) · "tamper-proof"

**정당** — 아래 넷은 낱말이 겹쳐도 정당하다
1. **상대가 확인하는 문장** — 읽는 쪽에 검증을 넘긴다. 예: `"DA records the tx pointer only and asserts no amount. Verify on-chain by tx_hash."`
2. **부정문(negative space)** — 예: `"Not a trust scoring system"` · `"does not monitor, judge, recommend, or intervene"`
3. **타자 비판** — 기존 방식의 한계 서술. 예: `"middleware layers enforce compliance"`
4. **타 규제 서술** — 외부 제도를 그대로 인용하는 자리

**기능명·필드명·코드 식별자는 산문이 아니다** — `/v1/asa/verify`, `ee_integrity_verification_level`, `x402Verified` 는 판정 대상이 아니다.

---

## 2. 회피 목록

```
proof · prove · proving · proven · tamper-proof
compliant · comply · guarantee · witness
자율성 보장 · 점수 · 등급 · 통제 · 감시
self-sovereign · liability shield · surveillance
```

★**`verify` 계열은 회피 목록에서 제외한다.** §111 원문이 `verification` 을 **정본 목록**에 두었는데 이후 조사가 회피로 취급해 **오탐률이 68%까지 올랐다**(§193 실측: 에이전트 직독 표면 히트 ~40 중 정당 ~27, 대부분이 verify 계열).

`verify` 계열은 **트리거가 아니다.** 다만 §1의 주어 기준에는 여전히 걸릴 수 있다 — "DA가 ~를 verifiable 하게 만든다"는 문장은 낱말이 아니라 **주어 때문에** 오염이다.

## 3. 정본 목록

```
record · tamper-evident · structured for · verification
delegation · boundary · external · audit · observability · trace
```

---

## 4. 점검 대상 표면 (§193 산출물)

**다음 점검은 이 목록에서 시작한다.** 새 표면을 만들면 여기 등재한다.

### A. 에이전트 직독 (최우선 — LLM이 그대로 읽는다)

| 표면 | 경로 | 최근 점검 |
|---|---|---|
| openapi | `da-api-server/public/openapi.json` — 108경로 `summary`·`description`·`example` + `info.description` + `tags` | §193 |
| MCP 도구 | `da-api-server/mcp/tools/*.js` (10개) — 도구명·설명·인자 description | §193 |
| A2A 카드 | `da-api-server/public/.well-known/agent-card.json` · `a2a/index.js` | §193 |
| AGENTS.md 정본 | `decision-anchor-sdk/AGENTS.md` | §193 |
| 파생 3곳 | `mcp/tools/docs.js` · `public/llms-full.txt` · `openapi info.description` | §193 |
| llms.txt | `da-api-server/public/llms.txt` | §193 |
| 402 챌린지 | `middleware/x402Payment.js` — `DISCOVERY_LABELS`·`DISCOVERY_INPUT/OUTPUT_EXAMPLE` | §193 (히트 0) |
| 등록 응답 | `services/agent.service.js` `next_steps` | §193 |
| 메서드 가이드 | `controllers/methodGuide.controller.js` | §193 |
| 401·404 안내 | `utils/authGuidance.js`(§200 신설) · `app.js` 404 핸들러(§126) | 2026-08-09 (히트 0) |

### B. 사람 직독

| 표면 | 경로 | 최근 점검 |
|---|---|---|
| 코어 사이트 | `decision-anchor-site` — `index.html`·`ko.html`·`es`·`fr`·`ja`·`zh-tw` | **미분류** |
| 블로그 | 사이트 `blog/` + 언어별 · `decision-anchor-sdk/blog/*.md` | **미분류** |
| 변경 기록 | 사이트 `changelog/` 6개 언어 | **미분류** |
| 사이트 llms | 사이트 `llms.txt`·`llms-full.txt` (★sync 체계 밖 독립 사본) | **미분류** |

### C. 외부 제출문 (§188 범위 — 한 번 나가면 회수가 어렵다)

| 표면 | 비고 | 최근 점검 |
|---|---|---|
| 디렉토리 등재 설명 | x402-list · x402scan · satring · agent-tools.cloud · agentic.market · usdc.org | §188 |
| PR 본문 | 외부 6건 (`awesome-x402`·`crewAI-examples`·`langchain-mcp-adapters`·`x402-foundation`×2·`awesome-remote-mcp-servers`) | §188 |
| MCP Registry | 게시본 전 버전 (구버전 소급 수정 안 함 — §188 결정) | §188 |

### D. ★미점검 — 아직 한 번도 훑지 않았다

- **에러 메시지 전수** — 전 서비스·컨트롤러의 `new Error(...)` 문안
- **DAP 포털** (3002, `dap-frontend`)
- **어드민 콘솔** 문안 (`admin/public/`)
- **`interfaces` 레포** — §111이 정정했다고 적었으나 현재 트리에 없다. 위치·존속 여부 미확인

---

## 5. 정당 판정 목록 (재검토 불요)

**아래는 판정이 끝났다.** 다음 점검에서 다시 보지 않는다. 문장이 바뀌면 재판정한다.

### openapi
- `/v1/asa/verify` `summary`·`responses.200` — ASA 해시 대조 **기능명**
- `tags[13]` "state backup verification" — 기능 분류명
- `/v1/asa/subscribe` "unlimited register/verify" — 기능 이름
- `/dap/asa/verify/{agent_id}` `summary`·응답 — 동일
- `/v1/dur/summary`·`/dap/dur/summary` "DA records the tx pointer only and **asserts no amount** … **Verify on-chain by tx_hash**" — ★**§1-1 상대 확인 문장.** DA가 단언하지 않는다고 명시하고 검증을 읽는 쪽에 넘긴다. O-8과 정반대 방향이다
- `/v1/dur/summary` "External verification anchor" — 온체인 대조 지점 명명
- `components.schemas.EEInput.required` `ee_integrity_verification_level` — **필드명**
- `/v1/agent/token/recover` "possession of agent_id + recovery_key is the **proof**" — 인증 기전 서술. DA가 세계에 대해 증명하는 것이 아니라 자기 인증 모델을 적은 것. ★**경계선이며 정당으로 판정한다**

### 코드 식별자 (외부 노출 아님)
- `middleware/x402Payment.js` — `req.x402Verified` · `markVerified()` · `payment_ref_id='x402_verified'`
- `middleware/x402Payment.js:82` 주석 — 규율 자체를 적은 주석

### 부정문
- `"Not a trust scoring system"` — AGENTS.md · agent-card · app.js · openapi (§111 판정 승계)
- `"Non-judgmental — does not monitor, judge, recommend, or intervene"` — openapi `info.description` 외

---

## 6. 미해결

- **`Bilateral Decision Witness`** — openapi(2) · agent-card(3) · llms.txt(2) · methodGuide(2) 등 **5표면에 고유명사처럼 박혀 있다.** 한 곳만 고치면 어긋난다. **대체어 확정이 선행**이며 그 전까지 무접촉.
- **사이트·블로그·changelog ~150건 미분류** (§4-B)
- **어휘 린터 미착수** — 화이트리스트 방식이면 실행 가능(§111 판단). §5 목록이 화이트리스트의 초기 내용이 된다. `agents-md:check` 옆(`staging.sh test` 사전 단계)이 자리.

---

# 7. 계약 정확성 점검 (O-8과 층이 다르다)

> **§4 점검 대상 표면 목록을 O-8과 공유한다.** 같은 표면을 두 기준으로 본다.

## 7-1. 판정 기준 — "사실인가"

- **O-8(§1)** 은 *"DA가 증명·보증·판정한다고 읽히는가"* 를 묻는다. **포지셔닝** 규율이고, 사실이어도 말하지 않기로 한 것이 있다.
- **본 절** 은 *"사실인가"* 를 묻는다. **금지어가 아니라 조건부 참**이다.

> **등급·조건을 특정하지 않은 무조건 서술은 거짓이다.**

같은 낱말이 조건과 함께 쓰이면 참이고, 조건 없이 쓰이면 거짓이다. `permanent` 가 대표 사례다.

## 7-2. 보존 계약 — 사실 (§193 실측)

| 값 | 층위 | 기간 | 과금 |
|---|---|---|---|
| `short` | 축 | **90일** | 0 |
| `medium` | 축 | **365일** | 20 |
| `long` | 축 | **1,825일 (5년)** | 50 |
| `extreme_long` | **오버레이** | **3,650일 (10년)** | 100 (1회) |
| `indefinite` | **오버레이** | 구독 유지 중 무기한 | 월 50 DAC |

★**축 3값 + 오버레이 2종**이다(§166). 다섯이 모두 축 위에 있다고 쓰면 오독이 난다 — `AGENTS.md` 가 그렇게 단언해 두 번 오독을 만든 전례가 있다.

**만료 시 원본을 지우지 않는다.** `utils/ara-env-stats-scheduler.js` 가 만료 메타데이터를 `ara_environment_stats` 로 **비식별 흡수**하고, 운영 경로에 `core_dd`·`core_ee` 물리 삭제는 **0건**이다. 접근 차단은 **ARA 직접 접근 기간·쿼터**가 담당한다.

**구독 만료 시 강등된다.** `utils/retention-indefinite-scheduler.js` 가 `grace`(14일) 만료 후 `indefinite` DD 를 **`short`(90일)로 강등**하고 `retention_demotion` 에 `demoted_from`·`demoted_to`·`reason` 를 남긴다. ★**`core_ee` 는 손대지 않는다** — 강등이 오버레이로만 이뤄져 **선언 시점 불변이 지켜진다.**

## ★7-3. 현재 `permanent` 가 참인 조건은 없다

`permanent` 는 **`indefinite` + 구독 유지**에서만 참인데,

- 라이브 `/v1/pricing/current` → `indefinite_available: false`, `"It is currently unavailable — selecting it is rejected"`
- `system_config.feature_retention_indefinite_enabled` = **`false`**

**즉 지금은 어떤 맥락에서도 `permanent` 가 참이 아니다.** 현재 최장은 `extreme_long` 10년이다.

★**기능이 열리면 이 판정이 바뀐다.** `feature_retention_indefinite_enabled` 를 켜는 날 **본 §7 을 갱신한다.**

## 7-4. `immutable` 의 두 뜻 — 갈라서 판정한다

- **㉠ "지워지지 않는다"** — 보존 기간과 **충돌한다.** 판정 필요
- **㉡ "고쳐지지 않는다"** — append-only. **참**

★**changelog 의 `"Extending immutability of decision metadata"`(ko `"결정 메타데이터 불변성 확대"`)는 ㉡ 이다.** append-only 트리거 확대를 적은 것이고 보존 기간과 무관하다. **정당으로 등재 — 다음 점검에서 재검토하지 않는다.**

★**§193 실측 기준 `immutable` 계열은 에이전트 직독 표면에 0건**이었다. 두 뜻을 가를 일이 아직 없었다.

## 7-5. 정당·별도 분류 목록 (재검토 불요)

### 참 — 조건이 명시돼 있다
- `openapi.json:312` — `"indefinite (permanent while subscribed, no axis add, 50 DAC per month)"`
- `public/llms-full.txt:282` · `decision-anchor-sdk/AGENTS.md:276` · `mcp/tools/docs.js:281` — 표 안 `"permanent while subscribed"`

### 별도 분류 — 보존 기간이 아니라 다른 것을 가리킨다
- `mcp/tools/sdac.js:8·:23` — 원문 `"before creating permanent decisions"` / `"without creating a permanent record"`. SDAC 모의와 대비한 **"실제로 기록되는"** 뜻이었다. ★**§194 에서 `real` 로 교체** — `permanent` 가 보존 기간으로 오독될 여지를 없앴다. `billable` 은 무료 경로가 있어 부정확하다.
- `mcp/tools/sdac.js:92` — **한국어 주석**, 외부 노출 아님

### 무관 — 사이트 changelog 29건
전부 **보존 약속과 무관**하다: 결함 서술(`"permanent deadlock"`·`"영구 교착"`) · HTTP 301 설명(`"A permanent redirect is cached"`) · DAP 삭제권(`"permanent deletion after a 30-day grace period"`·`"영구 삭제"` — 보존과 **반대 방향**) · 어휘 규율 확정(`"fixed permanently"`·`"영구 확정"`) · append-only 단언 결함 인용(`"passes forever after the first success"`) · 상시 가동 에이전트(`blog/es "funcionamiento permanente"`). **6개 언어 번역본도 원문이 무해하므로 무해하다.**

### 코어 본문 잠금 구간
`index.html`·`ko.html` — 본 계열 히트 **0건**. §111 백로그 2건(`autonomy`·`guarantees`)은 **O-8 소관**이며 여전히 무접촉.

## 7-6. 린터 규칙 후보 — O-8 보다 자동화가 쉽다

```
permanent|forever|immutable 히트
  → 같은 문장에 indefinite|subscribed|while 이 없으면 경고
```

§193 실측 8건 기준 **오탐 2건**(`sdac.js`)뿐이고 그마저 화이트리스트로 처리된다. O-8 은 문맥 판정이 본질이라 오탐이 구조적인데(§111 ~50%, §193 68%), 본 절은 **조건절 유무**라는 기계적 신호가 있다.

## 7-7. 추적 항목 — 첫 만료

★**만료 후 조회 동작을 아직 확인하지 못했다.** 만료 도래 건이 없어 실측이 불가능하다.

**실측 산출**(2026-08-07 기준): 최초 DD 는 2026-06-04 이나 등급이 **`medium`(365일)** 이라 만료가 2027-06-04 이다. **실제 최초 만료는 `72903c4e-2ee1-4693-a6a7-59904021ee81`**(2026-07-27 13:04:32 생성, **`short`**) → **2026-10-25**.

그 무렵 확인할 것: 만료 후 `GET /v1/dd/{dd_id}` 반환값 · ARA 직접 접근 차단 동작 · 그 동작이 문서(`AGENTS.md`·openapi)와 일치하는지.
