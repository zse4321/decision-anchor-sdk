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

★**층위 단서 — 이 제외는 점검(scan) 기준이다** (2026-08-12 명시). 사이트·인터페이스 CLAUDE.md 는 `verify`·`audit`·`judge`·`prove`·`검증`·`판정`·`증명`을 **무조건 회피**로 규정하는데, 이는 어긋남이 아니라 **적용 순간의 차이**다:
- 전 표면을 **훑을 때**는 함수명(`/v1/asa/verify`)·필드명(`ee_integrity_verification_level`)·정당 용법(`structured for external audit review`)이 섞여 낱말 기준 판정이 구조적으로 오탐을 낸다 — 그래서 본 문서는 제외한다.
- 사람이 읽는 산문을 **작성할 때**는 CLAUDE.md 의 무조건 회피가 적용된다. 산문에서 이 낱말들은 대개 DA 를 주어로 갖게 되므로, 보수적 회피가 결과적으로 §1과 같은 판정을 낸다.
- 두 기준은 충돌이 아니라 층위다. **판정이 필요하면 §1로 돌아간다.** (CLAUDE.md 상호 참조 여부는 별도 판단 대기.)

## 3. 정본 목록

```
record · tamper-evident · structured for · verification
delegation · boundary · external · audit · observability · trace
```

---

## 4. 점검 대상 표면 (§193 산출물)

**다음 점검은 이 목록에서 시작한다.** 새 표면을 만들면 여기 등재한다.

### A. 에이전트 직독 (최우선 — LLM이 그대로 읽는다)

★**"최근 점검"과 "그 후 변경"은 다른 값이다** — 변경이 점검을 무효화하지는 않으나, 점검 이후 내용이 바뀐 표면은 다음 점검의 우선 대상이다 (2026-08-12 실측).

| 표면 | 경로 | 최근 점검 | 그 후 변경 |
|---|---|---|---|
| openapi | `da-api-server/public/openapi.json` — 108경로 `summary`·`description`·`example` + `info.description` + `tags` | §193 | `488cb19`(§198 enum) · `8106322`(§200 자리표시자) · `ad9bc95`(§201 선언 정합) |
| MCP 도구 | `da-api-server/mcp/tools/*.js` (10개) — 도구명·설명·인자 description | §193 | — |
| A2A 카드 | `da-api-server/public/.well-known/agent-card.json` · `a2a/index.js` | §193 | — |
| AGENTS.md 정본 | `decision-anchor-sdk/AGENTS.md` | §193 | §204 시정은 `fe77c3e` 로 본 문서에 반영됨 |
| 파생 3곳 | `mcp/tools/docs.js` · `public/llms-full.txt` · `openapi info.description` | §193 | §204(8-09)·§205 재생성 |
| llms.txt | `da-api-server/public/llms.txt` | §193 | `c1f0ce6`(§205 규정명 제거) |
| 402 챌린지 | `middleware/x402Payment.js` — `DISCOVERY_LABELS`·`DISCOVERY_INPUT/OUTPUT_EXAMPLE` | §193 (히트 0) | — |
| 등록 응답 | `services/agent.service.js` `next_steps` | §193 | §195·§192 문안 — §193과 같은 날(8-07) 전후, 선후 미확인 |
| 메서드 가이드 | `controllers/methodGuide.controller.js` | §193 | — |
| 401·404 안내 | `utils/authGuidance.js`(§200 신설) · `app.js` 404 핸들러(§126) | 2026-08-09 (히트 0) | — |

### B. 사람 직독

| 표면 | 경로 | 최근 점검 | 회피어 히트 (2026-08-12 실측, 미판정) |
|---|---|---|---|
| 코어 사이트 | `decision-anchor-site` — `index.html`·`ko.html`·`es`·`fr`·`ja`·`zh-tw` (JSON-LD·branch-note 포함) | **미분류** | 6파일 5건 |
| 블로그 | 사이트 `blog/` 글 36 + 인덱스 6 · `decision-anchor-sdk/blog/*.md` | **미분류** | 42파일 54건 |
| 변경 기록 | 사이트 `changelog/` 6개 언어 (drafts 6 포함 13파일) | **미분류** | 13파일 146건 |
| 사이트 llms | 사이트 `llms.txt`·`llms-full.txt` (★sync 체계 밖 독립 사본 — §207 로 2026-08-11 정본과 바이트 동일 동기화됨) | **미분류** | 2파일 2건 |
| 인터페이스 | `~/decision-anchor-interfaces` — `solo`·`business` × 6언어 12파일 (+자체 CLAUDE.md) | **미분류** — 2026-08-11 6개 언어 확장(§210) | 12파일 7건 (대부분 부정문·타국어 활용형) |
| 랜딩 JSON-LD | 사이트 6파일 `<head>` 의 `application/ld+json` 블록 (§208 신설) | **미분류** | 0건 |
| 랜딩 branch-note | 사이트 6파일 `<aside class="branch">` 설명 구획 (§209·§211 신설) | **미분류** | 0건 |

- **합계 (인터페이스 제외한 종전 4표면)**: 63파일 **207건** — §6의 종전 "~150건" 을 대체하는 실측치.
- ★**집계 방법의 한계**: 라틴어군은 대소문자 무시 부분일치라 스페인어 `probar` 활용형(`prueba`·`prueban`)·프랑스어 파생이 `prove` 히트에 섞인다. 판정 단계에서 걸러야 할 노이즈다.
- ★**changelog 146건 중 상당수는 §7-5에서 이미 정당 판정된 계열**(결함 서술·HTTP 301 설명·DAP 삭제권·어휘 규율 확정 등 29건). 수치 판정 시 §5·§7-5 승계 여부가 함께 걸린다.
- `_shared/lang-ja.css`·`lang-zh-tw.css`(2026-08-11 신설)는 **등재하지 않는다** — 산문이 없고(폰트 스택·`line-break`), 주석은 내부용 한국어다. 다음 점검이 같은 판단을 반복하지 않도록 여기 남긴다.

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

(~~`interfaces` 레포~~ — 2026-08-12 §4-B 로 이전. "트리에 없다"는 **경로 오인**이었다: 모노레포가 아니라 홈 직하 `~/decision-anchor-interfaces/` 에 있으며(2026-06-13 신설), §111 정정 기록도 그 레포 이력에 실재한다 — `2af9add`, 2026-07-13, "compliance by structure → accountability by structure".)

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
  - 실측 재확인(2026-08-12): openapi 2 · agent-card 3 · llms.txt(정본) 2 · methodGuide 2 · app.js 1 = **10건, 종전 수치와 일치.**
  - ★**사이트 llms 미러 2건이 §207 동기화로 새로 생겼다** — 미러 규칙(바이트 동일)의 자동 복제이며, **대체어 확정 시 미러 재복사가 동반 절차가 된다.**
  - 2026-08-11 인터페이스 확장으로 들어간 `Bilateral` 은 **전부 `Witness` 없는 파생**(anchor/declaration 계열, business 6언어 각 3곳). 블로그 `internal-logs-fail` 6언어판의 `Bilateral Decision Declaration, Bilateral DD` 병기도 동일. **`Witness` 계열 신규 유입 0.**
  - 대체어 후보 논의 기록은 HANDOVER 전체에서 **0건**(재기록만 2회 — §192 계열·§204 PENDING). ★**시한을 두지 않는다** — 시장 반응을 보며 판단한다.
- **사이트·블로그·changelog·인터페이스 등 미분류** — 실측 **63파일 207건**(2026-08-12, 인터페이스 7건 별도. §4-B 표·집계 한계·§5/§7-5 승계 문제 참조. 종전 "~150건" 을 대체).
- **어휘 린터 미착수** — 화이트리스트 방식이면 실행 가능(§111 판단). §5 목록이 화이트리스트의 초기 내용이 된다. `agents-md:check` 옆(`staging.sh test` 사전 단계)이 자리. (2026-08-12 확인: `package.json` 에 `agents-md:check` 만 존재 — 미착수 유지.)

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

---

## 8. 언어별 표기 (다국어 표면)

> **취지** — 영어 용어는 표기가 하나여야 점유가 성립하므로 **번역하지 않고 원문을 유지**한다. 다만 각 언어권 독자에게 뜻이 닿아야 하므로 **첫 등장에 현지어 풀이를 병기**한다. 표면별로 방침이 다르다 — 코어 랜딩·블로그는 용어 + 병기, **인터페이스는 학술 명사구를 피하고 일상어 풀이만** 쓴다.
>
> **적용 완료** (2026-08-12): 1단계 랜딩 5개 언어판(사이트 `a142586`·본 문서 `be31ab0`) → 2단계 블로그 36파일(`a8abc96` 직접 수정 + `88a442c5`·`dcbb520`·`a9ddc7b` 콘솔 재발행). 전 표면 실측 — **구표기 잔존 0 · 표와 어긋난 곳 0.**

### 8-1. 표기 표

| 개념 | en | ko | ja | zh-tw | fr | es |
|---|---|---|---|---|---|---|
| External Anchoring Layer | 원문 | 외부 앵커링 레이어 | 外部アンカリング・レイヤー | 外部錨定層 | la couche d'ancrage externe | la capa de anclaje externo |
| self-testimony | 원문 | 자기증언 | 自己証言 | 自我證言 | auto-témoignage | autotestimonio |
| content-blind | 원문 | 내용을 읽지 않는 | 内容を読まない | 不讀取內容 | sans lire le contenu | sin leer el contenido |
| Pre-execution Anchoring | 원문 | 실행 전 고정 | 実行前の固定 | 執行前固定 | ancrage avant exécution | anclaje previo a la ejecución |
| Bilateral DD | 원문 | 양자 결정 선언 | 双方向決定宣言 | 雙邊決定宣告 | déclaration de décision bilatérale | declaración de decisión bilateral |
| friction value | 원문 | 마찰값 | 摩擦値 | 摩擦值 | valeur de friction | valor de fricción |

### 8-2. 병기 규칙

- **첫 등장에만 병기**하고 이후는 한쪽만 쓴다.
- 어느 쪽이 앞에 오는지는 표면에 따른다 — 랜딩은 `영어 원문(현지어)`, 블로그는 `현지어(영어 원문)`. 현행 관행을 따른 것이며 바꾸지 않는다.
- 괄호 형식은 언어 관행을 따른다 — ko·ja·zh-tw는 전각/밀착(ko는 반각 밀착), fr·es는 반각 + 앞 공백.

### 8-3. `recorder is not the actor` — 부정형이 정본

"기록자와 행위자가 분리된다" 계열은 결과 서술이며 명제가 아니다. 언어별 정본 문장:

| 언어 | 정본 문장 |
|---|---|
| en | The recorder is not the actor. |
| ko | 기록자는 행위자가 아니다. |
| ja | 記録者は行為者ではない。 |
| zh-tw | 記錄者不是行為者。 |
| fr | Le consignateur n'est pas l'acteur. |
| es | El que consigna no es el actor. |

### 8-4. 예외

- **인터페이스 영역**(solo·business) — 1군 용어를 쓰지 않는다. 개념을 일상어로 풀어 쓴다. `Bilateral`만 예외로 영어 유지 + 인접 풀이(현행 유지).
- **기계 표면**(llms·OpenAPI·루트 응답·Agent Card·AGENTS.md) — 영어 단일. 현지어 병기를 넣지 않는다.
- `Bilateral`의 현지어 명칭(ko 양자 / ja 双方向 / zh-tw 雙邊)은 **통일하지 않는다** — 각 언어에서 자연스러운 말이 다를 뿐이며, 영어 `Bilateral` 병기가 연결을 유지한다.

### 8-5. 미등재 — 판단 대기 (확정 표기 아님, 표에 넣지 않는다)

- **`Bilateral Decision Witness` 전체 용어** — §8-1 에는 `Bilateral DD` 만 있다. §6 미해결과 연결되어 **표기 확정이 대체어 결정에 종속**된다.
- **`non-judgmental`** — 인터페이스 footer 포함 전 표면 영어 고정. 언어별 취급 미규정.
- **2군 용어 계열** — `append-only`(블로그 ko "추가 전용") · `tamper-evident` · `accountability boundary`("책임 경계"·"責任境界"). 현지어 표현이 이미 쓰이나 표에 없다.
- **`recorder` 외 명제형 문장** — 예: `"It does not judge, does not predict, does not intervene, does not look inside."` 4연 부정 나열. 언어별 확정문 미등재.
