# 🎭 TVN-SUT Automation Framework

> Playwright E2E Automation for [tvn-sut.info](https://tvn-sut.info)
> Stack: TypeScript | Playwright | Page Object Model | Allure Report | GitHub Actions

---

## 📁 Project Structure

```
tvn-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI/CD pipeline
├── src/
│   ├── pages/
│   │   ├── BasePage.ts           # Abstract base for all POMs
│   │   ├── LoginPage.ts          # Login page POM
│   │   └── HomePage.ts           # Dashboard/Home page POM
│   ├── components/               # Reusable UI component objects
│   ├── data/
│   │   ├── config.ts             # Centralized env config
│   │   └── TestData.ts           # Test data factory (Faker.js)
│   ├── fixtures/
│   │   └── index.ts              # Custom Playwright fixtures
│   └── helpers/                  # Utility functions
├── tests/
│   ├── auth.setup.ts             # Global auth setup (runs once)
│   ├── smoke/
│   │   └── login.smoke.spec.ts   # Smoke tests
│   ├── e2e/
│   │   └── login.spec.ts         # Full E2E test suite
│   └── regression/
│       └── login.regression.spec.ts  # Regression tests
├── playwright/.auth/             # Stored auth state (gitignored)
├── .env.example                  # Environment variable template
├── playwright.config.ts          # Playwright configuration
└── tsconfig.json                 # TypeScript config
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd tvn-automation
npm install
npx playwright install --with-deps
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Run Tests

```bash
# Smoke tests (fastest — critical path only)
npm run test:smoke

# E2E tests (full coverage)
npm run test:e2e

# Regression tests (multi-browser)
npm run test:regression

# All tests
npm run test:all

# Interactive UI mode
npm run test:ui

# Debug mode (step-by-step)
npm run test:debug
```

### 4. View Reports

```bash
# Playwright built-in HTML report
npm run report:playwright

# Allure Report (full details with steps, screenshots, videos)
npm run report:allure
```

---

## 🧪 Test Coverage Matrix

| Test ID | Feature | Type | Priority |
|:--------|:--------|:-----|:---------|
| TC_SM_001 | Login page loads | Smoke | P1 |
| TC_SM_002 | Successful login | Smoke | P1 |
| TC_SM_003 | Login button enabled | Smoke | P1 |
| TC_LGN_001 | Valid credentials login | E2E Happy | P1 |
| TC_LGN_002 | Session persists after refresh | E2E Happy | P1 |
| TC_LGN_003 | Logout clears session | E2E Happy | P1 |
| TC_LGN_004 | Wrong password shows error | E2E Negative | P1 |
| TC_LGN_005 | Non-existent email shows error | E2E Negative | P1 |
| TC_LGN_006~008 | Empty field validations | E2E Negative | P2 |
| TC_LGN_009 | Invalid email formats (5 cases) | E2E Boundary | P2 |
| TC_LGN_010~011 | Password boundary values | E2E Boundary | P2 |
| TC_LGN_012 | SQL Injection attempts | Security | P1 |
| TC_LGN_013 | XSS payload attempts | Security | P1 |
| TC_LGN_014 | Password field is masked | Security | P2 |
| TC_LGN_015 | HTTPS enforced | Security | P1 |
| TC_LGN_016~019 | UI/UX (tab order, Enter key, link) | UI/UX | P3 |
| RG_LGN_001 | Back button after logout | Regression | P1 |
| RG_LGN_002 | Rapid double click on submit | Regression | P2 |
| RG_LGN_003 | Login in two tabs | Regression | P2 |
| RG_LGN_004 | Session cookie HttpOnly + Secure | Regression | P1 |

---

## ⚠️ Selector Update Required

After inspecting the actual website, update the **locators** in these files:
- [`src/pages/LoginPage.ts`](src/pages/LoginPage.ts) — look for `// ⚠️ UPDATE SELECTORS`
- [`src/pages/HomePage.ts`](src/pages/HomePage.ts) — look for `// ⚠️ UPDATE SELECTORS`

Recommended approach:
1. Open Chrome DevTools on the website
2. Use **Playwright Codegen** to auto-detect selectors: `npx playwright codegen https://tvn-sut.info`

---

## 🔐 CI/CD Secrets (GitHub Actions)

Add these secrets to your GitHub repository (`Settings → Secrets → Actions`):

| Secret | Description |
|:-------|:-----------|
| `BASE_URL` | `https://tvn-sut.info` |
| `USER_USERNAME` | Test account email |
| `USER_PASSWORD` | Test account password |
| `ADMIN_USERNAME` | Admin account email |
| `ADMIN_PASSWORD` | Admin account password |
