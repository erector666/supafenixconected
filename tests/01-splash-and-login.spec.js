const { test, expect } = require('@playwright/test');

test.describe('Splash Screen and Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display splash screen for 3 seconds', async ({ page }) => {
    // Check splash screen elements
    await expect(page.locator('text=FENIX')).toBeVisible();
    await expect(page.locator('text=Construction Tracker')).toBeVisible();
    await expect(page.locator('img[alt="FENIX Logo"]')).toBeVisible();
    
    // Wait for splash screen to disappear and login to appear
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
  });

  test('should show login form after splash screen', async ({ page }) => {
    // Wait for login form to appear
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Check login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('should login as admin successfully', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Should redirect to admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Overview')).toBeVisible();
  });

  test('should login as employee successfully', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as employee
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Should redirect to employee dashboard
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Try invalid login
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');
    
    // Should show error alert
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should login with Enter key', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login using Enter key
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.press('input[type="password"]', 'Enter');
    
    // Should redirect to employee dashboard
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
  });

  test('should test all employee logins', async ({ page }) => {
    const employees = [
      { email: 'petre@fenix.com', name: 'Petre' },
      { email: 'ilija@fenix.com', name: 'Ilija' },
      { email: 'vojne@fenix.com', name: 'Vojne' },
      { email: 'dragan@fenix.com', name: 'Dragan' },
      { email: 'tino@fenix.com', name: 'Tino' },
      { email: 'vane@fenix.com', name: 'Vane' }
    ];

    for (const employee of employees) {
      await page.goto('/');
      await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
      
      await page.fill('input[type="email"]', employee.email);
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Login")');
      
      await expect(page.locator('text=Employee Dashboard')).toBeVisible();
      await expect(page.locator(`text=${employee.name}`)).toBeVisible();
    }
  });

  test('should handle empty credentials', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Try login with empty fields
    await page.click('button:has-text("Login")');
    
    // Should show error
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should test login form accessibility', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Check form accessibility
    await expect(page.locator('input[type="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[type="password"]')).toHaveAttribute('type', 'password');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Login")')).toBeFocused();
  });
}); 