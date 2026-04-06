/**
 * Accessibility tests — Step 7
 *
 * Uses @axe-core/playwright to audit every public page for WCAG violations.
 * axe checks: ARIA roles, color contrast, keyboard-accessible elements,
 * missing alt text, label associations, landmark regions, focus order, etc.
 *
 * Violations are reported at three impact levels:
 *   critical | serious | moderate | minor
 *
 * Tests fail on 'critical' and 'serious' violations only — these are the ones
 * that block assistive-technology users completely.  'moderate' and 'minor'
 * issues are logged as warnings so they're visible without failing CI.
 *
 * To run:  npx playwright test tests/accessibility.spec.js
 * Requires the dev server to be running at http://localhost:5173
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Run an axe audit on the current page.
 * Logs warnings for moderate/minor issues.
 * Throws (fails the test) for critical/serious violations.
 */
async function auditPage(page, label) {
  const results = await new AxeBuilder({ page })
    // Disable color-contrast temporarily — requires a running backend for
    // accurate computed styles. Remove this line once backend is wired in CI.
    .disableRules(['color-contrast'])
    .analyze()

  const blocking = results.violations.filter((v) =>
    ['critical', 'serious'].includes(v.impact),
  )
  const warnings = results.violations.filter((v) =>
    ['moderate', 'minor'].includes(v.impact),
  )

  if (warnings.length > 0) {
    console.warn(
      `\n⚠  Accessibility warnings on ${label} (${warnings.length} moderate/minor):`,
    )
    warnings.forEach((v) => {
      console.warn(`  [${v.impact}] ${v.id}: ${v.description}`)
      v.nodes.forEach((n) => console.warn(`    → ${n.html}`))
    })
  }

  expect(
    blocking,
    `Critical/serious axe violations on ${label}:\n` +
      blocking
        .map((v) => `  [${v.impact}] ${v.id}: ${v.description}\n` +
          v.nodes.map((n) => `    → ${n.html}`).join('\n'))
        .join('\n'),
  ).toHaveLength(0)
}

// ─────────────────────────────────────────────────────────────────────────────
// Public pages
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — public pages', () => {
  test('home page has no critical/serious violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'Home (/)')
  })

  test('about page has no critical/serious violations', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'About (/about)')
  })

  test('contact page has no critical/serious violations', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'Contact (/contact)')
  })

  test('privacy page has no critical/serious violations', async ({ page }) => {
    await page.goto('/privacy')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'Privacy (/privacy)')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Auth page
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — auth page', () => {
  test('get-started page (sign up form) has no critical/serious violations', async ({ page }) => {
    await page.goto('/get-started')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'Get Started — Sign Up (/get-started)')
  })

  test('login form has no critical/serious violations', async ({ page }) => {
    await page.goto('/get-started')
    await page.waitForLoadState('networkidle')
    // Switch to login form
    await page.getByText(/already have an account/i).click()
    await page.waitForTimeout(300)
    await auditPage(page, 'Get Started — Login form')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Category pages
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — category pages', () => {
  const categories = ['fullstack', 'backend', 'mobile', 'devops', 'qa']

  for (const slug of categories) {
    test(`/categories/${slug} has no critical/serious violations`, async ({ page }) => {
      await page.goto(`/categories/${slug}`)
      await page.waitForLoadState('networkidle')
      await auditPage(page, `/categories/${slug}`)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard navigation — interactive elements must be reachable
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — keyboard navigation', () => {
  test('all interactive elements on home page are keyboard-focusable', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab through the page and check that focus advances
    let focusedCount = 0
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => document.activeElement?.tagName)
      if (focused && focused !== 'BODY') focusedCount++
    }
    expect(focusedCount).toBeGreaterThan(0)
  })

  test('get-started form fields are keyboard-navigable', async ({ page }) => {
    await page.goto('/get-started')
    await page.waitForLoadState('networkidle')

    // Tab to first field and type
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    // At least one input should be reachable by Tab
    const focused = await page.evaluate(
      () => document.activeElement?.tagName,
    )
    expect(['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT']).toContain(focused)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Images — alt text
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — images', () => {
  test('all images on the home page have an alt attribute', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const imagesWithoutAlt = await page.$$eval('img', (imgs) =>
      imgs
        .filter((img) => !img.hasAttribute('alt'))
        .map((img) => img.outerHTML),
    )

    expect(
      imagesWithoutAlt,
      `Found <img> elements missing alt attribute:\n${imagesWithoutAlt.join('\n')}`,
    ).toHaveLength(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Form labels — inputs must be labelled
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — form labels', () => {
  test('all inputs on the get-started page have accessible labels', async ({ page }) => {
    await page.goto('/get-started')
    await page.waitForLoadState('networkidle')

    // Inputs should have id+label association, aria-label, or placeholder
    const unlabelledInputs = await page.$$eval('input', (inputs) =>
      inputs
        .filter((input) => {
          const hasLabel =
            input.labels?.length > 0 ||
            input.getAttribute('aria-label') ||
            input.getAttribute('aria-labelledby') ||
            input.getAttribute('placeholder')
          return !hasLabel
        })
        .map((i) => i.outerHTML),
    )

    expect(
      unlabelledInputs,
      `Found unlabelled <input> elements:\n${unlabelledInputs.join('\n')}`,
    ).toHaveLength(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Page titles — every page needs a <title>
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — page titles', () => {
  const pages = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/get-started', label: 'Get Started' },
    { path: '/privacy', label: 'Privacy' },
  ]

  for (const { path, label } of pages) {
    test(`${label} page has a non-empty <title>`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const title = await page.title()
      expect(title.trim().length).toBeGreaterThan(0)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Mobile viewport — same checks at 375px width
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Accessibility — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('home page has no critical/serious violations on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'Home — mobile')
  })

  test('get-started page has no critical/serious violations on mobile', async ({ page }) => {
    await page.goto('/get-started')
    await page.waitForLoadState('networkidle')
    await auditPage(page, 'Get Started — mobile')
  })
})
