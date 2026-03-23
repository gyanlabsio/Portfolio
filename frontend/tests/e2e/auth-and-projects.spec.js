import { expect, test } from '@playwright/test';

const API_BASE = 'http://localhost:5000/api';

function wireApiMocks(page) {
  const state = {
    isLoggedIn: false,
    projects: [
      {
        _id: 'p1',
        title: 'Seed Project',
        description: 'Existing project in mocked state',
        techStack: ['React'],
        featured: false,
        order: 0,
        featuredImage: '',
      },
    ],
  };

  page.route(`${API_BASE}/auth/csrf-token`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, csrfToken: 'test-csrf-token' }),
    });
  });

  page.route(`${API_BASE}/auth/me`, async (route) => {
    if (!state.isLoggedIn) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Not authorized, no token' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        admin: {
          id: 'a1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
      }),
    });
  });

  page.route(`${API_BASE}/auth/login`, async (route) => {
    state.isLoggedIn = true;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        admin: {
          id: 'a1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
      }),
    });
  });

  page.route(`${API_BASE}/auth/logout`, async (route) => {
    state.isLoggedIn = false;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Logged out successfully' }),
    });
  });

  page.route(`${API_BASE}/projects`, async (route, request) => {
    if (!state.isLoggedIn) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Not authorized' }),
      });
      return;
    }

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, count: state.projects.length, data: state.projects }),
      });
      return;
    }

    if (request.method() === 'POST') {
      const payload = request.postDataJSON();
      const created = {
        _id: `p${state.projects.length + 1}`,
        featuredImage: '',
        ...payload,
      };
      state.projects.unshift(created);

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: created }),
      });
      return;
    }

    await route.fulfill({ status: 405, body: 'Method Not Allowed' });
  });

  page.route(`${API_BASE}/upload`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { url: 'https://example.com/fake.png', public_id: 'fake' } }),
    });
  });
}

test.describe('Admin smoke flows', () => {
  test.beforeEach(async ({ page }) => {
    wireApiMocks(page);
  });

  test('redirects protected admin route to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole('heading', { name: /cms login/i })).toBeVisible();
  });

  test('can login and create a project through admin UI', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });

    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('strong-password');
    await page.getByRole('button', { name: /^login$/i }).click();

    await expect(page).toHaveURL(/\/admin$/);

    await page.goto('/admin/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    await page.getByRole('button', { name: /new project/i }).click();
    await page.getByPlaceholder('Title').fill('E2E Project');
    await page.getByPlaceholder('Full Description').fill('Created from Playwright smoke test.');
    await page.getByRole('button', { name: /create project/i }).click();

    await expect(page.getByText('E2E Project')).toBeVisible();

    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
