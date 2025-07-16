const { test, expect } = require('@playwright/test');

test.describe('Integration Tests - Complete User Journeys', () => {
  test('Complete Employee Work Session Journey', async ({ page }) => {
    // 1. Start at splash screen
    await page.goto('/');
    await expect(page.locator('text=FENIX')).toBeVisible();
    
    // 2. Wait for login form
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // 3. Login as employee
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // 4. Verify employee dashboard
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    await expect(page.locator('text=Petre')).toBeVisible();
    
    // 5. Start work session
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // 6. Take screenshot
    await page.click('button:has-text("Take Screenshot")');
    await expect(page.locator('text=Screenshot taken')).toBeVisible();
    
    // 7. Take break
    await page.click('button:has-text("Take Break")');
    await expect(page.locator('text=On Break')).toBeVisible();
    
    // 8. Resume work
    await page.click('button:has-text("Resume Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // 9. End work session
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
    
    // 10. Logout
    await page.click('button:has-text("Logout")');
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('Complete Admin Management Journey', async ({ page }) => {
    // 1. Login as admin
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // 2. Verify admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    
    // 3. Check overview
    await page.click('text=Overview');
    await expect(page.locator('text=Total Employees')).toBeVisible();
    await expect(page.locator('text=Total Vehicles')).toBeVisible();
    
    // 4. Add new employee
    await page.click('text=Employees');
    await page.click('button:has-text("Add Employee")');
    await page.fill('input[placeholder="Name"]', 'Integration Test Employee');
    await page.fill('input[placeholder="Email"]', 'integration@fenix.com');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.selectOption('select', 'worker');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Employee added successfully')).toBeVisible();
    
    // 5. Add new vehicle
    await page.click('text=Vehicles');
    await page.click('button:has-text("Add Vehicle")');
    await page.fill('input[placeholder="Vehicle Name"]', 'Integration Test Van');
    await page.fill('input[placeholder="License Plate"]', 'INT-123');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Vehicle added successfully')).toBeVisible();
    
    // 6. Upload work files
    await page.click('text=Work Files');
    await page.click('button:has-text("Upload Files")');
    // File upload would be tested here
    
    // 7. Generate and export report
    await page.click('text=Reports');
    await page.fill('input[type="date"]', '2024-01-01');
    await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
    await page.click('button:has-text("Generate Report")');
    await expect(page.locator('text=Report Generated')).toBeVisible();
    
    // 8. Check work history
    await page.click('text=Work History');
    await expect(page.locator('text=Employee')).toBeVisible();
    
    // 9. Check map
    await page.click('text=Map');
    await expect(page.locator('text=Employee Locations')).toBeVisible();
    
    // 10. Check location history
    await page.click('text=Location History');
    await expect(page.locator('text=Employee')).toBeVisible();
    
    // 11. Logout
    await page.click('button:has-text("Logout")');
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('Multi-Employee Work Session Simulation', async ({ page, context }) => {
    // Create multiple browser contexts to simulate multiple employees
    const employee1 = await context.newPage();
    const employee2 = await context.newPage();
    const admin = await context.newPage();
    
    // Employee 1 starts work
    await employee1.goto('/');
    await expect(employee1.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await employee1.fill('input[type="email"]', 'petre@fenix.com');
    await employee1.fill('input[type="password"]', 'admin123');
    await employee1.click('button:has-text("Login")');
    await expect(employee1.locator('text=Employee Dashboard')).toBeVisible();
    await employee1.click('button:has-text("Start Work")');
    await expect(employee1.locator('text=Work Session Started')).toBeVisible();
    
    // Employee 2 starts work
    await employee2.goto('/');
    await expect(employee2.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await employee2.fill('input[type="email"]', 'ilija@fenix.com');
    await employee2.fill('input[type="password"]', 'admin123');
    await employee2.click('button:has-text("Login")');
    await expect(employee2.locator('text=Employee Dashboard')).toBeVisible();
    await employee2.click('button:has-text("Start Work")');
    await expect(employee2.locator('text=Work Session Started')).toBeVisible();
    
    // Admin monitors
    await admin.goto('/');
    await expect(admin.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await admin.fill('input[type="email"]', 'kango@fenix.com');
    await admin.fill('input[type="password"]', 'admin123');
    await admin.click('button:has-text("Login")');
    await expect(admin.locator('text=Admin Dashboard')).toBeVisible();
    
    // Check overview shows active sessions
    await admin.click('text=Overview');
    await expect(admin.locator('text=Active Work Sessions')).toBeVisible();
    
    // Check map shows both employees
    await admin.click('text=Map');
    await expect(admin.locator('text=Employee Locations')).toBeVisible();
    
    // Employee 1 takes break
    await employee1.click('button:has-text("Take Break")');
    await expect(employee1.locator('text=On Break')).toBeVisible();
    
    // Employee 2 ends work
    await employee2.click('button:has-text("End Work")');
    await expect(employee2.locator('text=Work Session Ended')).toBeVisible();
    
    // Employee 1 resumes and ends work
    await employee1.click('button:has-text("Resume Work")');
    await expect(employee1.locator('text=Work Session Started')).toBeVisible();
    await employee1.click('button:has-text("End Work")');
    await expect(employee1.locator('text=Work Session Ended')).toBeVisible();
    
    // Admin checks work history
    await admin.click('text=Work History');
    await expect(admin.locator('text=Employee')).toBeVisible();
    
    // Close all pages
    await employee1.close();
    await employee2.close();
    await admin.close();
  });

  test('File Management Workflow', async ({ page }) => {
    // Login as employee
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Start work session
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Take screenshot
    await page.click('button:has-text("Take Screenshot")');
    await expect(page.locator('text=Screenshot taken')).toBeVisible();
    
    // Upload files
    await page.click('button:has-text("Upload Files")');
    // File upload testing would be here
    
    // End work session
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
    
    // Login as admin to manage files
    await page.click('button:has-text("Logout")');
    await expect(page.locator('text=Login')).toBeVisible();
    
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Check work files
    await page.click('text=Work Files');
    await expect(page.locator('text=File Name')).toBeVisible();
    
    // Preview files
    await page.click('button:has-text("Preview")').first();
    await expect(page.locator('text=File Preview')).toBeVisible();
    
    // Download files
    await page.click('button:has-text("Download")').first();
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });

  test('Export Functionality Workflow', async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Export vehicle data
    await page.click('text=Vehicles');
    await page.click('button:has-text("Export")').first();
    await page.click('button:has-text("Excel")');
    const download1 = await page.waitForEvent('download');
    await download1;
    
    await page.click('button:has-text("Export")').first();
    await page.click('button:has-text("PDF")');
    const download2 = await page.waitForEvent('download');
    await download2;
    
    // Export reports
    await page.click('text=Reports');
    await page.fill('input[type="date"]', '2024-01-01');
    await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
    await page.click('button:has-text("Generate Report")');
    await expect(page.locator('text=Report Generated')).toBeVisible();
    
    await page.click('button:has-text("Export")');
    await page.click('button:has-text("Excel")');
    const download3 = await page.waitForEvent('download');
    await download3;
    
    await page.click('button:has-text("Export")');
    await page.click('button:has-text("PDF")');
    const download4 = await page.waitForEvent('download');
    await download4;
    
    // Export work history
    await page.click('text=Work History');
    await page.click('button:has-text("Export to Excel")');
    const download5 = await page.waitForEvent('download');
    await download5;
    
    await page.click('button:has-text("Export to PDF")');
    const download6 = await page.waitForEvent('download');
    await download6;
  });

  test('Error Handling and Recovery', async ({ page }) => {
    // Test network error handling
    await page.route('**/*', route => route.abort());
    
    await page.goto('/');
    // Should handle network errors gracefully
    
    // Restore network
    await page.unroute('**/*');
    
    // Test invalid login
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    
    // Test valid login after error
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
  });

  test('Session Persistence and State Management', async ({ page }) => {
    // Login as employee
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Start work session
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Refresh page - should maintain state
    await page.reload();
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Take break
    await page.click('button:has-text("Take Break")');
    await expect(page.locator('text=On Break')).toBeVisible();
    
    // Refresh page - should maintain break state
    await page.reload();
    await expect(page.locator('text=On Break')).toBeVisible();
    
    // Resume work
    await page.click('button:has-text("Resume Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // End work session
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
  });

  test('Cross-Browser Compatibility', async ({ page, browserName }) => {
    // Test basic functionality across different browsers
    await page.goto('/');
    await expect(page.locator('text=FENIX')).toBeVisible();
    
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
    
    await page.click('button:has-text("Logout")');
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('Performance and Load Testing', async ({ page }) => {
    // Test with multiple rapid interactions
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Rapid login attempts
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="email"]', 'petre@fenix.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Login")');
      await expect(page.locator('text=Employee Dashboard')).toBeVisible();
      
      await page.click('button:has-text("Start Work")');
      await expect(page.locator('text=Work Session Started')).toBeVisible();
      
      await page.click('button:has-text("End Work")');
      await expect(page.locator('text=Work Session Ended')).toBeVisible();
      
      await page.click('button:has-text("Logout")');
      await expect(page.locator('text=Login')).toBeVisible();
    }
  });

  test('Accessibility and Keyboard Navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Login")')).toBeFocused();
    
    // Login with keyboard
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
    
    // Test keyboard navigation in dashboard
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Start Work")')).toBeFocused();
    
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("End Work")')).toBeFocused();
    
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
  });
}); 