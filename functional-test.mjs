// Systematic functional test for ServiceHub
import { chromium } from 'playwright';

const BASE = 'http://localhost:5176';
const tests = [];

function record(id, description, expected, actual, result) {
  tests.push({ id, description, expected, actual, result });
}

// Full page load - use for initial loads and error handling tests
async function go(page, route, waitFor) {
  await page.goto(BASE + route, { waitUntil: 'load', timeout: 15000 });
  if (waitFor) await page.waitForSelector(waitFor, { timeout: 8000 });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // ─── T01: Dashboard loads ───
  try {
    await go(page, '/');
    const h1Text = await page.locator('h1').first().textContent();
    record('T01', 'Dashboard loads', 'h1 "Welcome to ServiceHub"', h1Text, h1Text?.includes('Welcome') ? 'PASS' : 'FAIL');
  } catch (e) { record('T01', 'Dashboard loads', 'h1 visible', e.message, 'FAIL'); }

  // ─── T02: Navigation between all routes ───
  try {
    await go(page, '/');
    await page.click('a[href="/services"]');
    await page.waitForSelector('.services-grid', { timeout: 5000 });
    await page.click('a[href="/my-services"]');
    await page.waitForSelector('h1');
    await page.click('a[href="/profile"]');
    await page.waitForSelector('.profile-form');
    await page.click('a[href="/"]');
    await page.waitForSelector('.dashboard-summary');
    record('T02', 'Navigation between all routes', 'all routes load', 'all routes reachable via nav clicks', 'PASS');
  } catch (e) { record('T02', 'Navigation between all routes', 'all routes load', e.message, 'FAIL'); }

  // ─── T03: Services page loads service data ───
  try {
    await go(page, '/services', '.services-grid');
    const cardCount = await page.locator('.service-card').count();
    record('T03', 'Services page loads data', '8 service cards', `${cardCount} cards`, cardCount === 8 ? 'PASS' : 'FAIL');
  } catch (e) { record('T03', 'Services page loads data', 'cards render', e.message, 'FAIL'); }

  // ─── T04: Services loading state ───
  try {
    await ctx.route('**/data/services.json', async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });
    await page.goto(BASE + '/services', { waitUntil: 'load' });
    const loadingText = await page.locator('p').first().textContent({ timeout: 2000 });
    await page.waitForSelector('.services-grid', { timeout: 8000 });
    await ctx.unroute('**/data/services.json');
    record('T04', 'Services loading state', 'shows "Loading services..."', loadingText?.includes('Loading') ? `"${loadingText}"` : 'no loading msg', loadingText?.includes('Loading') ? 'PASS' : 'FAIL');
  } catch (e) {
    await ctx.unroute('**/data/services.json').catch(() => {});
    record('T04', 'Services loading state', 'shows loading msg', e.message, 'FAIL');
  }

  // ─── T05: Services error handling ───
  try {
    await ctx.route('**/data/services.json', (route) => route.fulfill({ status: 500, body: 'Server Error' }));
    await page.goto(BASE + '/services', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const errorVisible = await page.locator('p').first().textContent();
    await ctx.unroute('**/data/services.json');
    record('T05', 'Services error handling', 'shows error msg', errorVisible?.includes('Unable') || errorVisible?.includes('Failed') ? `"${errorVisible}"` : `not error: "${errorVisible}"`, errorVisible?.includes('Unable') ? 'PASS' : 'FAIL');
  } catch (e) {
    await ctx.unroute('**/data/services.json').catch(() => {});
    record('T05', 'Services error handling', 'shows error msg', e.message, 'FAIL');
  }

  // ─── T06: Search by service name ───
  try {
    await go(page, '/services', '.services-grid');
    await page.fill('#search-services', 'Fiber');
    await page.waitForTimeout(200);
    const count = await page.locator('.service-card').count();
    record('T06', 'Search "Fiber"', '1 card (Fiber Internet)', `${count} card(s)`, count === 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T06', 'Search by service name', 'filtered results', e.message, 'FAIL'); }

  // ─── T07: Category filtering ───
  try {
    await go(page, '/services', '.services-grid');
    await page.fill('#search-services', '');
    await page.selectOption('#category-filter', 'Utilities');
    await page.waitForTimeout(200);
    const count = await page.locator('.service-card').count();
    record('T07', 'Category filter "Utilities"', '3 cards', `${count} card(s)`, count === 3 ? 'PASS' : 'FAIL');
  } catch (e) { record('T07', 'Category filtering', '3 utility cards', e.message, 'FAIL'); }

  // ─── T08: Combined search + category ───
  try {
    await go(page, '/services', '.services-grid');
    await page.selectOption('#category-filter', 'Internet');
    await page.fill('#search-services', 'Cable');
    await page.waitForTimeout(200);
    const count = await page.locator('.service-card').count();
    record('T08', 'Search "Cable" + Category "Internet"', '1 card (Cable Internet)', `${count} card(s)`, count === 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T08', 'Combined search + category', '1 card', e.message, 'FAIL'); }

  // ─── T09: No-results state ───
  try {
    await go(page, '/services', '.services-grid');
    await page.selectOption('#category-filter', 'All');
    await page.fill('#search-services', 'xyznonexistent');
    await page.waitForTimeout(200);
    const noResults = await page.locator('p').filter({ hasText: 'No services found' }).count();
    record('T09', 'No-results state', 'shows "No services found"', `${noResults} msg element(s)`, noResults >= 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T09', 'No-results state', 'shows empty msg', e.message, 'FAIL'); }

  // ─── T10: Service Details valid ID ───
  try {
    await go(page, '/services/1', '.actions');
    const name = await page.locator('.service-details h2').textContent();
    const price = await page.locator('.detail-price').textContent();
    record('T10', 'Service Details valid ID 1', 'shows "High-Speed Fiber Internet" $89.99', `name="${name}" price="${price}"`, name?.includes('Fiber') && price?.includes('89.99') ? 'PASS' : 'FAIL');
  } catch (e) { record('T10', 'Service Details valid ID', 'shows service', e.message, 'FAIL'); }

  // ─── T11: Service Details invalid ID ───
  try {
    await go(page, '/services/999', 'main');
    const notFound = await page.locator('p').filter({ hasText: 'not found' }).count();
    record('T11', 'Service Details invalid ID 999', 'shows "Service not found"', `${notFound} not-found msg`, notFound >= 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T11', 'Service Details invalid ID', 'shows not found', e.message, 'FAIL'); }

  // ─── T12: Service Details loading/error ───
  try {
    await ctx.route('**/data/services.json', (route) => route.fulfill({ status: 500, body: 'fail' }));
    await page.goto(BASE + '/services/1', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const errorVisible = await page.locator('p').filter({ hasText: 'Unable' }).count();
    await ctx.unroute('**/data/services.json');
    record('T12', 'Service Details error handling', 'shows "Unable to load"', `${errorVisible} error msg`, errorVisible >= 1 ? 'PASS' : 'FAIL');
  } catch (e) {
    await ctx.unroute('**/data/services.json').catch(() => {});
    record('T12', 'Service Details loading/error', 'shows error', e.message, 'FAIL');
  }

  // ─── T13–T17: State persistence tests (use client-side nav to preserve context) ───

  // T13: Add Service from Details page
  try {
    await go(page, '/services/1', '.actions');
    await page.click('.actions .btn-primary');
    await page.waitForSelector('.btn-disabled', { timeout: 5000 });
    const disabledBtn = await page.locator('.btn-disabled').count();
    const btnText = await page.locator('.btn-disabled').first().textContent();
    record('T13', 'Add Service from Details', 'button becomes "Already Added"', `${disabledBtn} disabled btn, text="${btnText}"`, disabledBtn >= 1 && btnText?.includes('Already Added') ? 'PASS' : 'FAIL');
  } catch (e) { record('T13', 'Add Service', 'btn disables', e.message, 'FAIL'); }

  // T14: Duplicate prevention - use client-side nav to preserve state
  try {
    // After T13, page is at /services/1 with "Already Added" showing
    // Navigate to /services, then click service 1 card to revisit /services/1
    await page.click('a[href="/services"]');
    await page.waitForSelector('.services-grid', { timeout: 8000 });
    // Click on service 1 card
    await page.click('.service-card a[href="/services/1"]');
    await page.waitForSelector('.actions', { timeout: 8000 });
    // Service 1 should still be added - button should be disabled
    await page.waitForSelector('.btn-disabled', { timeout: 5000 });
    const stillDisabled = await page.locator('.btn-disabled').count();
    const btnText = await page.locator('.btn-disabled').first().textContent();
    record('T14', 'Duplicate Service prevention', 'stays disabled on revisit', `${stillDisabled} disabled btn, text="${btnText}"`, stillDisabled >= 1 && btnText?.includes('Already Added') ? 'PASS' : 'FAIL');
  } catch (e) { record('T14', 'Duplicate Service prevention', 'remains disabled', e.message, 'FAIL'); }

  // T15: My Services displays selected services
  try {
    await page.click('a[href="/my-services"]');
    await page.waitForSelector('.my-services-list', { timeout: 8000 });
    await page.waitForSelector('.my-service-item', { timeout: 5000 });
    const itemCount = await page.locator('.my-service-item').count();
    record('T15', 'My Services shows added service', '1 service item', `${itemCount} item(s)`, itemCount >= 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T15', 'My Services displays selected', 'shows service', e.message, 'FAIL'); }

  // T16: Remove Service
  try {
    await page.waitForSelector('.btn-remove', { timeout: 5000 });
    await page.click('.btn-remove');
    // Wait for list to clear
    await page.waitForSelector('p:has-text("No services added")', { timeout: 5000 });
    const empty = await page.locator('p').filter({ hasText: 'No services added' }).count();
    record('T16', 'Remove Service', 'shows empty state', `${empty} empty msg`, empty >= 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T16', 'Remove Service', 'shows empty', e.message, 'FAIL'); }

  // T17: Dashboard count updates after adding a service
  try {
    // Navigate to services list and add a service using client-side nav
    await page.click('a[href="/services"]');
    await page.waitForSelector('.services-grid', { timeout: 8000 });
    // Click on service card for id=2
    await page.click('a[href="/services/2"]');
    await page.waitForSelector('.actions', { timeout: 8000 });
    await page.click('.actions .btn-primary');
    await page.waitForSelector('.btn-disabled', { timeout: 5000 });
    // Now navigate to dashboard via client-side nav
    await page.click('a[href="/"]');
    await page.waitForSelector('.dashboard-summary', { timeout: 8000 });
    await page.waitForSelector('.dashboard-summary h2', { timeout: 5000 });
    const h2 = await page.locator('.dashboard-summary h2').textContent();
    record('T17', 'Dashboard count after add', 'count >= 1', `"${h2}"`, h2?.includes('1') ? 'PASS' : 'FAIL');
  } catch (e) { record('T17', 'Dashboard count updates', 'count increments', e.message, 'FAIL'); }

  // ─── T18: Profile empty-form validation ───
  try {
    await go(page, '/profile', '.profile-form');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(200);
    const errors = await page.locator('.error-message').count();
    record('T18', 'Profile empty-form validation', '3 error messages', `${errors} error(s)`, errors === 3 ? 'PASS' : 'FAIL');
  } catch (e) { record('T18', 'Profile empty-form validation', '3 errors', e.message, 'FAIL'); }

  // ─── T19: Profile invalid email ───
  try {
    await go(page, '/profile', '.profile-form');
    await page.fill('#fullName', 'Test User');
    await page.fill('#email', 'not-an-email');
    await page.fill('#phone', '1234567');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(200);
    const emailErr = await page.locator('#error-email').textContent();
    record('T19', 'Profile invalid email', '"valid email" error', `"${emailErr}"`, emailErr?.includes('valid email') ? 'PASS' : 'FAIL');
  } catch (e) { record('T19', 'Profile invalid email', 'shows email error', e.message, 'FAIL'); }

  // ─── T20: Profile invalid phone ───
  try {
    await go(page, '/profile', '.profile-form');
    await page.fill('#fullName', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', 'abc');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(200);
    const phoneErr = await page.locator('#error-phone').textContent();
    record('T20', 'Profile invalid phone', '"valid phone" error', `"${phoneErr}"`, phoneErr?.includes('valid phone') ? 'PASS' : 'FAIL');
  } catch (e) { record('T20', 'Profile invalid phone', 'shows phone error', e.message, 'FAIL'); }

  // ─── T21: Profile successful submission ───
  try {
    await go(page, '/profile', '.profile-form');
    await page.fill('#fullName', 'Jane Doe');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#phone', '+1234567890');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(200);
    const success = await page.locator('.success-message').count();
    record('T21', 'Profile successful submission', 'success message shown', `${success} success msg`, success >= 1 ? 'PASS' : 'FAIL');
  } catch (e) { record('T21', 'Profile successful submission', 'shows success', e.message, 'FAIL'); }

  // ─── T22: Navigation links/buttons work ───
  try {
    await go(page, '/');
    await page.click('a.btn-primary');
    await page.waitForSelector('.services-grid');
    await go(page, '/');
    await page.click('a.btn-back');
    await page.waitForSelector('.my-services-list, p');
    record('T22', 'Navigation links/buttons work', 'both dashboard action buttons navigate', 'both work', 'PASS');
  } catch (e) { record('T22', 'Navigation links/buttons', 'both work', e.message, 'FAIL'); }

  // ─── T23: Keyboard navigation/focus ───
  try {
    await go(page, '/profile', '.profile-form');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.id);
    record('T23', 'Keyboard Tab navigation', 'focus reaches form input', `focused=#${focused}`, focused === 'fullName' ? 'PASS' : 'FAIL');
  } catch (e) { record('T23', 'Keyboard navigation', 'focus moves correctly', e.message, 'FAIL'); }

  // ─── T24–T28: Responsive layout ───
  const widths = [
    { id: 'T24', w: 1280, h: 900, label: '1280px' },
    { id: 'T25', w: 768,  h: 1024, label: '768px' },
    { id: 'T26', w: 375,  h: 812, label: '375px' },
    { id: 'T27', w: 320,  h: 568, label: '320px' },
  ];
  for (const { id, w, h, label } of widths) {
    try {
      await page.setViewportSize({ width: w, height: h });
      await go(page, '/services', '.services-grid');
      const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
      const cardCount = await page.locator('.service-card').count();
      record(id, `Responsive layout at ${label}`, 'no overflow, cards visible', `overflow=${overflow} cards=${cardCount}`, !overflow && cardCount > 0 ? 'PASS' : 'FAIL');
    } catch (e) { record(id, `Responsive at ${label}`, 'no overflow', e.message, 'FAIL'); }
  }

  // ─── T28: Horizontal overflow check ───
  try {
    await page.setViewportSize({ width: 320, height: 568 });
    const routes = ['/', '/services', '/services/1', '/my-services', '/profile'];
    const overflows = [];
    for (const r of routes) {
      await go(page, r, 'main');
      const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 1);
      if (hasOverflow) overflows.push(r);
    }
    record('T28', 'Horizontal overflow at 320px across routes', 'no overflow on any route', `overflows: ${overflows.length === 0 ? 'none' : overflows.join(', ')}`, overflows.length === 0 ? 'PASS' : 'FAIL');
  } catch (e) { record('T28', 'Horizontal overflow check', 'no overflow', e.message, 'FAIL'); }

  await browser.close();

  // Print results table
  console.log('\n┌─────┬─────────────────────────────┬──────────────┬──────────────────────────────┬────────┐');
  console.log('│ ID  │ Test                        │ Expected     │ Actual                        │ Result │');
  console.log('├─────┼─────────────────────────────┼──────────────┼──────────────────────────────┼────────┤');
  for (const t of tests) {
    const desc = t.description.padEnd(27).slice(0, 27);
    const exp = t.expected.padEnd(12).slice(0, 12);
    const act = (t.actual || '').padEnd(28).slice(0, 28);
    const res = t.result === 'PASS' ? '  PASS ' : '  FAIL ';
    console.log(`│ ${t.id} │ ${desc} │ ${exp} │ ${act} │ ${res} │`);
  }
  console.log('└─────┴─────────────────────────────┴──────────────┴──────────────────────────────┴────────┘');

  const passed = tests.filter(t => t.result === 'PASS').length;
  const failed = tests.length - passed;
  console.log(`\nTotal: ${tests.length} | Passed: ${passed} | Failed: ${failed} | Rate: ${Math.round(passed / tests.length * 100)}%`);
  process.exit(failed === 0 ? 0 : 1);
})();
