const { test, expect } = require('@playwright/test');

test.describe('Admin Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as admin
    await page.fill('input[type="email"]', 'kango@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('should display admin dashboard correctly', async ({ page }) => {
    // Check dashboard elements
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Employees')).toBeVisible();
    await expect(page.locator('text=Vehicles')).toBeVisible();
    await expect(page.locator('text=Work Files')).toBeVisible();
    await expect(page.locator('text=Reports')).toBeVisible();
    await expect(page.locator('text=Work History')).toBeVisible();
    await expect(page.locator('text=Map')).toBeVisible();
    await expect(page.locator('text=Location History')).toBeVisible();
  });

  test.describe('Overview Tab', () => {
    test('should display overview statistics', async ({ page }) => {
      await page.click('text=Overview');
      
      // Check overview elements
      await expect(page.locator('text=Total Employees')).toBeVisible();
      await expect(page.locator('text=Active Work Sessions')).toBeVisible();
      await expect(page.locator('text=Total Vehicles')).toBeVisible();
      await expect(page.locator('text=Today\'s Work Hours')).toBeVisible();
    });

    test('should display employee status cards', async ({ page }) => {
      await page.click('text=Overview');
      
      // Check employee status cards
      await expect(page.locator('text=Petre')).toBeVisible();
      await expect(page.locator('text=Ilija')).toBeVisible();
      await expect(page.locator('text=Vojne')).toBeVisible();
      await expect(page.locator('text=Dragan')).toBeVisible();
      await expect(page.locator('text=Tino')).toBeVisible();
      await expect(page.locator('text=Vane')).toBeVisible();
    });

    test('should show real-time updates', async ({ page }) => {
      await page.click('text=Overview');
      
      // Should show current time and date
      await expect(page.locator('text=Current Time:')).toBeVisible();
      await expect(page.locator('text=Current Date:')).toBeVisible();
    });
  });

  test.describe('Employees Tab', () => {
    test('should display employees list', async ({ page }) => {
      await page.click('text=Employees');
      
      // Check employees table
      await expect(page.locator('text=Name')).toBeVisible();
      await expect(page.locator('text=Email')).toBeVisible();
      await expect(page.locator('text=Role')).toBeVisible();
      await expect(page.locator('text=Status')).toBeVisible();
      await expect(page.locator('text=Actions')).toBeVisible();
    });

    test('should add new employee', async ({ page }) => {
      await page.click('text=Employees');
      
      // Click add employee button
      await page.click('button:has-text("Add Employee")');
      
      // Fill employee form
      await page.fill('input[placeholder="Name"]', 'Test Employee');
      await page.fill('input[placeholder="Email"]', 'test@fenix.com');
      await page.fill('input[placeholder="Password"]', 'password123');
      await page.selectOption('select', 'worker');
      
      // Save employee
      await page.click('button:has-text("Save")');
      
      // Should show success message
      await expect(page.locator('text=Employee added successfully')).toBeVisible();
    });

    test('should edit existing employee', async ({ page }) => {
      await page.click('text=Employees');
      
      // Click edit button for first employee
      await page.click('button:has-text("Edit")').first();
      
      // Modify employee data
      await page.fill('input[placeholder="Name"]', 'Updated Name');
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Should show success message
      await expect(page.locator('text=Employee updated successfully')).toBeVisible();
    });

    test('should delete employee', async ({ page }) => {
      await page.click('text=Employees');
      
      // Click delete button for first employee
      await page.click('button:has-text("Delete")').first();
      
      // Confirm deletion
      await page.click('button:has-text("Confirm")');
      
      // Should show success message
      await expect(page.locator('text=Employee deleted successfully')).toBeVisible();
    });

    test('should search employees', async ({ page }) => {
      await page.click('text=Employees');
      
      // Search for specific employee
      await page.fill('input[placeholder="Search employees..."]', 'Petre');
      
      // Should show filtered results
      await expect(page.locator('text=Petre')).toBeVisible();
    });

    test('should filter employees by role', async ({ page }) => {
      await page.click('text=Employees');
      
      // Filter by role
      await page.selectOption('select[aria-label="Role filter"]', 'worker');
      
      // Should show only workers
      await expect(page.locator('text=worker')).toBeVisible();
    });
  });

  test.describe('Vehicles Tab', () => {
    test('should display vehicles list', async ({ page }) => {
      await page.click('text=Vehicles');
      
      // Check vehicles table
      await expect(page.locator('text=Name')).toBeVisible();
      await expect(page.locator('text=Plate')).toBeVisible();
      await expect(page.locator('text=Status')).toBeVisible();
      await expect(page.locator('text=Actions')).toBeVisible();
    });

    test('should add new vehicle', async ({ page }) => {
      await page.click('text=Vehicles');
      
      // Click add vehicle button
      await page.click('button:has-text("Add Vehicle")');
      
      // Fill vehicle form
      await page.fill('input[placeholder="Vehicle Name"]', 'Test Van');
      await page.fill('input[placeholder="License Plate"]', 'TEST-123');
      
      // Save vehicle
      await page.click('button:has-text("Save")');
      
      // Should show success message
      await expect(page.locator('text=Vehicle added successfully')).toBeVisible();
    });

    test('should edit existing vehicle', async ({ page }) => {
      await page.click('text=Vehicles');
      
      // Click edit button for first vehicle
      await page.click('button:has-text("Edit")').first();
      
      // Modify vehicle data
      await page.fill('input[placeholder="Vehicle Name"]', 'Updated Van');
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Should show success message
      await expect(page.locator('text=Vehicle updated successfully')).toBeVisible();
    });

    test('should delete vehicle', async ({ page }) => {
      await page.click('text=Vehicles');
      
      // Click delete button for first vehicle
      await page.click('button:has-text("Delete")').first();
      
      // Confirm deletion
      await page.click('button:has-text("Confirm")');
      
      // Should show success message
      await expect(page.locator('text=Vehicle deleted successfully')).toBeVisible();
    });

    test('should export vehicle data to Excel', async ({ page }) => {
      await page.click('text=Vehicles');
      
      // Click export button for first vehicle
      await page.click('button:has-text("Export")').first();
      
      // Choose Excel export
      await page.click('button:has-text("Excel")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });

    test('should export vehicle data to PDF', async ({ page }) => {
      await page.click('text=Vehicles');
      
      // Click export button for first vehicle
      await page.click('button:has-text("Export")').first();
      
      // Choose PDF export
      await page.click('button:has-text("PDF")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });
  });

  test.describe('Work Files Tab', () => {
    test('should display work files list', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Check files table
      await expect(page.locator('text=File Name')).toBeVisible();
      await expect(page.locator('text=Type')).toBeVisible();
      await expect(page.locator('text=Size')).toBeVisible();
      await expect(page.locator('text=Uploaded By')).toBeVisible();
      await expect(page.locator('text=Date')).toBeVisible();
      await expect(page.locator('text=Actions')).toBeVisible();
    });

    test('should upload new files', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Click upload button
      await page.click('button:has-text("Upload Files")');
      
      // Create test file
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click('input[type="file"]');
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('test-file.txt');
      
      // Should show upload progress
      await expect(page.locator('text=Uploading...')).toBeVisible();
    });

    test('should preview files', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Click preview button for first file
      await page.click('button:has-text("Preview")').first();
      
      // Should show preview modal
      await expect(page.locator('text=File Preview')).toBeVisible();
    });

    test('should download files', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Click download button for first file
      await page.click('button:has-text("Download")').first();
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });

    test('should delete files', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Select files for deletion
      await page.click('input[type="checkbox"]').first();
      
      // Click bulk delete
      await page.click('button:has-text("Delete Selected")');
      
      // Confirm deletion
      await page.click('button:has-text("Confirm")');
      
      // Should show success message
      await expect(page.locator('text=Files deleted successfully')).toBeVisible();
    });

    test('should filter files by type', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Filter by file type
      await page.selectOption('select[aria-label="File type filter"]', 'image');
      
      // Should show only image files
      await expect(page.locator('text=image')).toBeVisible();
    });

    test('should search files', async ({ page }) => {
      await page.click('text=Work Files');
      
      // Search for specific file
      await page.fill('input[placeholder="Search files..."]', 'screenshot');
      
      // Should show filtered results
      await expect(page.locator('text=screenshot')).toBeVisible();
    });
  });

  test.describe('Reports Tab', () => {
    test('should display reports dashboard', async ({ page }) => {
      await page.click('text=Reports');
      
      // Check reports elements
      await expect(page.locator('text=Work Hours Report')).toBeVisible();
      await expect(page.locator('text=Employee Performance')).toBeVisible();
      await expect(page.locator('text=Vehicle Usage')).toBeVisible();
    });

    test('should generate work hours report', async ({ page }) => {
      await page.click('text=Reports');
      
      // Select date range
      await page.fill('input[type="date"]', '2024-01-01');
      await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
      
      // Generate report
      await page.click('button:has-text("Generate Report")');
      
      // Should show report data
      await expect(page.locator('text=Report Generated')).toBeVisible();
    });

    test('should export report to Excel', async ({ page }) => {
      await page.click('text=Reports');
      
      // Click export button
      await page.click('button:has-text("Export")');
      
      // Choose Excel export
      await page.click('button:has-text("Excel")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });

    test('should export report to PDF', async ({ page }) => {
      await page.click('text=Reports');
      
      // Click export button
      await page.click('button:has-text("Export")');
      
      // Choose PDF export
      await page.click('button:has-text("PDF")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });
  });

  test.describe('Work History Tab', () => {
    test('should display work history', async ({ page }) => {
      await page.click('text=Work History');
      
      // Check work history table
      await expect(page.locator('text=Employee')).toBeVisible();
      await expect(page.locator('text=Date')).toBeVisible();
      await expect(page.locator('text=Start Time')).toBeVisible();
      await expect(page.locator('text=End Time')).toBeVisible();
      await expect(page.locator('text=Duration')).toBeVisible();
      await expect(page.locator('text=Status')).toBeVisible();
    });

    test('should filter work history by date', async ({ page }) => {
      await page.click('text=Work History');
      
      // Select date range
      await page.fill('input[type="date"]', '2024-01-01');
      await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
      
      // Apply filter
      await page.click('button:has-text("Filter")');
      
      // Should show filtered results
      await expect(page.locator('text=Filtered Results')).toBeVisible();
    });

    test('should export work history to Excel', async ({ page }) => {
      await page.click('text=Work History');
      
      // Click export button
      await page.click('button:has-text("Export to Excel")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });

    test('should export work history to PDF', async ({ page }) => {
      await page.click('text=Work History');
      
      // Click export button
      await page.click('button:has-text("Export to PDF")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });
  });

  test.describe('Map Tab', () => {
    test('should display map with employee locations', async ({ page }) => {
      await page.click('text=Map');
      
      // Check map elements
      await expect(page.locator('[data-testid="google-map"]')).toBeVisible();
      await expect(page.locator('text=Employee Locations')).toBeVisible();
    });

    test('should show employee markers on map', async ({ page }) => {
      await page.click('text=Map');
      
      // Should show employee markers
      await expect(page.locator('[data-testid="employee-marker"]')).toBeVisible();
    });

    test('should display employee info on marker click', async ({ page }) => {
      await page.click('text=Map');
      
      // Click on employee marker
      await page.click('[data-testid="employee-marker"]').first();
      
      // Should show employee info
      await expect(page.locator('text=Employee Information')).toBeVisible();
    });

    test('should filter map by employee', async ({ page }) => {
      await page.click('text=Map');
      
      // Select specific employee
      await page.selectOption('select[aria-label="Employee filter"]', 'Petre');
      
      // Should show only selected employee
      await expect(page.locator('text=Petre')).toBeVisible();
    });
  });

  test.describe('Location History Tab', () => {
    test('should display location history', async ({ page }) => {
      await page.click('text=Location History');
      
      // Check location history table
      await expect(page.locator('text=Employee')).toBeVisible();
      await expect(page.locator('text=Date')).toBeVisible();
      await expect(page.locator('text=Time')).toBeVisible();
      await expect(page.locator('text=Location')).toBeVisible();
      await expect(page.locator('text=Coordinates')).toBeVisible();
    });

    test('should filter location history by employee', async ({ page }) => {
      await page.click('text=Location History');
      
      // Select specific employee
      await page.selectOption('select[aria-label="Employee filter"]', 'Petre');
      
      // Should show only selected employee's history
      await expect(page.locator('text=Petre')).toBeVisible();
    });

    test('should filter location history by date', async ({ page }) => {
      await page.click('text=Location History');
      
      // Select date range
      await page.fill('input[type="date"]', '2024-01-01');
      await page.fill('input[type="date"]:nth-child(2)', '2024-12-31');
      
      // Apply filter
      await page.click('button:has-text("Filter")');
      
      // Should show filtered results
      await expect(page.locator('text=Filtered Results')).toBeVisible();
    });

    test('should export location history', async ({ page }) => {
      await page.click('text=Location History');
      
      // Click export button
      await page.click('button:has-text("Export")');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });
  });

  test('should handle logout', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Logout")');
    
    // Should redirect to login
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still be functional
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Employees')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Should still be functional
    await expect(page.locator('text=Overview')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation through sidebar
    await page.keyboard.press('Tab');
    await expect(page.locator('text=Overview')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('text=Employees')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('text=Vehicles')).toBeFocused();
  });

  test('should handle accessibility features', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('button:has-text("Add Employee")')).toHaveAttribute('aria-label');
    await expect(page.locator('button:has-text("Add Vehicle")')).toHaveAttribute('aria-label');
    
    // Check for proper heading structure
    await expect(page.locator('h1, h2, h3')).toHaveCount(1);
  });
}); 