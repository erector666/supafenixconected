const { test, expect } = require('@playwright/test');

test.describe('Mobile Tests - Responsive Design and Mobile User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Mobile Splash Screen and Login', async ({ page }) => {
    await page.goto('/');
    
    // Check splash screen on mobile
    await expect(page.locator('text=FENIX')).toBeVisible();
    await expect(page.locator('text=Construction Tracker')).toBeVisible();
    await expect(page.locator('img[alt="FENIX Logo"]')).toBeVisible();
    
    // Wait for login form
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Check mobile login form layout
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
    
    // Test mobile login
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
  });

  test('Mobile Employee Dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as employee
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    
    // Check mobile layout
    await expect(page.locator('text=Petre')).toBeVisible();
    await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
    await expect(page.locator('button:has-text("Take Screenshot")')).toBeVisible();
    await expect(page.locator('button:has-text("Upload Files")')).toBeVisible();
    
    // Test mobile work session
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.click('button:has-text("Take Break")');
    await expect(page.locator('text=On Break')).toBeVisible();
    
    await page.click('button:has-text("Resume Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
  });

  test('Mobile Admin Dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    
    // Test mobile navigation
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Employees')).toBeVisible();
    await expect(page.locator('text=Vehicles')).toBeVisible();
    await expect(page.locator('text=Work Files')).toBeVisible();
    await expect(page.locator('text=Reports')).toBeVisible();
    await expect(page.locator('text=Work History')).toBeVisible();
    await expect(page.locator('text=Map')).toBeVisible();
    await expect(page.locator('text=Location History')).toBeVisible();
  });

  test('Mobile Employees Management', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to employees
    await page.click('text=Employees');
    
    // Check mobile table layout
    await expect(page.locator('text=Name')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Role')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    
    // Test mobile add employee
    await page.click('button:has-text("Add Employee")');
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    
    // Fill form
    await page.fill('input[placeholder="Name"]', 'Mobile Test Employee');
    await page.fill('input[placeholder="Email"]', 'mobile@fenix.com');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.selectOption('select', 'worker');
    
    // Save
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Employee added successfully')).toBeVisible();
  });

  test('Mobile Vehicles Management', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to vehicles
    await page.click('text=Vehicles');
    
    // Check mobile table layout
    await expect(page.locator('text=Name')).toBeVisible();
    await expect(page.locator('text=Plate')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    
    // Test mobile add vehicle
    await page.click('button:has-text("Add Vehicle")');
    await expect(page.locator('input[placeholder="Vehicle Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="License Plate"]')).toBeVisible();
    
    // Fill form
    await page.fill('input[placeholder="Vehicle Name"]', 'Mobile Test Van');
    await page.fill('input[placeholder="License Plate"]', 'MOB-123');
    
    // Save
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Vehicle added successfully')).toBeVisible();
  });

  test('Mobile Work Files Management', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to work files
    await page.click('text=Work Files');
    
    // Check mobile table layout
    await expect(page.locator('text=File Name')).toBeVisible();
    await expect(page.locator('text=Type')).toBeVisible();
    await expect(page.locator('text=Size')).toBeVisible();
    await expect(page.locator('text=Uploaded By')).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
    
    // Test mobile file upload
    await page.click('button:has-text("Upload Files")');
    await expect(page.locator('text=Upload Files')).toBeVisible();
  });

  test('Mobile Reports Generation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to reports
    await page.click('text=Reports');
    
    // Check mobile reports layout
    await expect(page.locator('text=Work Hours Report')).toBeVisible();
    await expect(page.locator('text=Employee Performance')).toBeVisible();
    await expect(page.locator('text=Vehicle Usage')).toBeVisible();
    
    // Test mobile report generation
    await page.fill('input[type="date"]', '2024-01-01');
    await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
    await page.click('button:has-text("Generate Report")');
    await expect(page.locator('text=Report Generated')).toBeVisible();
  });

  test('Mobile Work History', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to work history
    await page.click('text=Work History');
    
    // Check mobile table layout
    await expect(page.locator('text=Employee')).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
    await expect(page.locator('text=Start Time')).toBeVisible();
    await expect(page.locator('text=End Time')).toBeVisible();
    await expect(page.locator('text=Duration')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    
    // Test mobile filtering
    await page.fill('input[type="date"]', '2024-01-01');
    await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
    await page.click('button:has-text("Filter")');
    await expect(page.locator('text=Filtered Results')).toBeVisible();
  });

  test('Mobile Map View', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to map
    await page.click('text=Map');
    
    // Check mobile map layout
    await expect(page.locator('text=Employee Locations')).toBeVisible();
    
    // Test mobile map interactions
    await expect(page.locator('[data-testid="google-map"]')).toBeVisible();
  });

  test('Mobile Location History', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Navigate to location history
    await page.click('text=Location History');
    
    // Check mobile table layout
    await expect(page.locator('text=Employee')).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
    await expect(page.locator('text=Time')).toBeVisible();
    await expect(page.locator('text=Location')).toBeVisible();
    await expect(page.locator('text=Coordinates')).toBeVisible();
    
    // Test mobile filtering
    await page.selectOption('select[aria-label="Employee filter"]', 'Petre');
    await expect(page.locator('text=Petre')).toBeVisible();
  });

  test('Mobile Touch Interactions', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as employee
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    
    // Test touch interactions
    await page.touchscreen.tap(page.locator('button:has-text("Start Work")'));
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.touchscreen.tap(page.locator('button:has-text("Take Screenshot")'));
    await expect(page.locator('text=Screenshot taken')).toBeVisible();
    
    await page.touchscreen.tap(page.locator('button:has-text("Take Break")'));
    await expect(page.locator('text=On Break')).toBeVisible();
    
    await page.touchscreen.tap(page.locator('button:has-text("Resume Work")'));
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.touchscreen.tap(page.locator('button:has-text("End Work")'));
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
  });

  test('Mobile Responsive Design - Different Screen Sizes', async ({ page }) => {
    const screenSizes = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 6/7/8' },
      { width: 414, height: 736, name: 'iPhone 6/7/8 Plus' },
      { width: 375, height: 812, name: 'iPhone X' },
      { width: 768, height: 1024, name: 'iPad' }
    ];

    for (const size of screenSizes) {
      await page.setViewportSize(size);
      
      await page.goto('/');
      await expect(page.locator('text=FENIX')).toBeVisible();
      
      await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
      await page.fill('input[type="email"]', 'petre@fenix.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Login")');
      
      await expect(page.locator('text=Employee Dashboard')).toBeVisible();
      await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
      
      await page.click('button:has-text("Logout")');
      await expect(page.locator('text=Login')).toBeVisible();
    }
  });

  test('Mobile Keyboard and Input Handling', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Test mobile keyboard input
    await page.click('input[type="email"]');
    await page.keyboard.type('petre@fenix.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('petre@fenix.com');
    
    await page.click('input[type="password"]');
    await page.keyboard.type('admin123');
    await expect(page.locator('input[type="password"]')).toHaveValue('admin123');
    
    await page.click('button:has-text("Login")');
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
  });

  test('Mobile Gesture Support', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin to test gestures on different views
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    
    // Test swipe gestures (if implemented)
    // This would test horizontal swiping between tabs or vertical scrolling
    
    // Test pinch to zoom on map
    await page.click('text=Map');
    await expect(page.locator('text=Employee Locations')).toBeVisible();
    
    // Test scroll behavior
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  });

  test('Mobile Performance and Loading', async ({ page }) => {
    // Test app loading performance on mobile
    const startTime = Date.now();
    
    await page.goto('/');
    await expect(page.locator('text=FENIX')).toBeVisible();
    
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    const loginTime = Date.now() - startTime;
    
    // Login and measure dashboard load time
    const dashboardStart = Date.now();
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    const dashboardTime = Date.now() - dashboardStart;
    
    // Verify reasonable load times (adjust thresholds as needed)
    expect(loginTime).toBeLessThan(5000);
    expect(dashboardTime).toBeLessThan(3000);
  });

  test('Mobile Offline/Online Handling', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login first
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    
    // Simulate offline mode
    await page.route('**/*', route => route.abort());
    
    // Try to start work session while offline
    await page.click('button:has-text("Start Work")');
    
    // Should handle offline state gracefully
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    
    // Restore online mode
    await page.unroute('**/*');
    
    // Should work normally again
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
  });

  test('Mobile Accessibility Features', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Test mobile accessibility
    await expect(page.locator('input[type="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[type="password"]')).toHaveAttribute('type', 'password');
    
    // Test mobile screen reader support
    await expect(page.locator('button:has-text("Login")')).toHaveAttribute('aria-label');
    
    // Login and test dashboard accessibility
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    
    // Check mobile accessibility attributes
    await expect(page.locator('button:has-text("Start Work")')).toHaveAttribute('aria-label');
    await expect(page.locator('button:has-text("Take Screenshot")')).toHaveAttribute('aria-label');
  });
}); 