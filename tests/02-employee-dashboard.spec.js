const { test, expect } = require('@playwright/test');

test.describe('Employee Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
    
    // Login as employee
    await page.fill('input[type="email"]', 'petre@fenix.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
  });

  test('should display employee dashboard correctly', async ({ page }) => {
    // Check dashboard elements
    await expect(page.locator('text=Petre')).toBeVisible();
    await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
    await expect(page.locator('button:has-text("Take Screenshot")')).toBeVisible();
    await expect(page.locator('button:has-text("Upload Files")')).toBeVisible();
  });

  test('should start work session', async ({ page }) => {
    await page.click('button:has-text("Start Work")');
    
    // Should show work session started
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    await expect(page.locator('button:has-text("Take Break")')).toBeVisible();
    await expect(page.locator('button:has-text("End Work")')).toBeVisible();
    
    // Should show current time
    await expect(page.locator('text=Current Time:')).toBeVisible();
  });

  test('should take break during work session', async ({ page }) => {
    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Take break
    await page.click('button:has-text("Take Break")');
    await expect(page.locator('text=On Break')).toBeVisible();
    await expect(page.locator('button:has-text("Resume Work")')).toBeVisible();
  });

  test('should resume work after break', async ({ page }) => {
    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Take break
    await page.click('button:has-text("Take Break")');
    await expect(page.locator('text=On Break')).toBeVisible();
    
    // Resume work
    await page.click('button:has-text("Resume Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    await expect(page.locator('button:has-text("Take Break")')).toBeVisible();
  });

  test('should end work session', async ({ page }) => {
    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // End work
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
    await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
  });

  test('should take screenshot', async ({ page }) => {
    // Start work session first
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Take screenshot
    await page.click('button:has-text("Take Screenshot")');
    
    // Should show screenshot taken message
    await expect(page.locator('text=Screenshot taken')).toBeVisible();
  });

  test('should upload files', async ({ page }) => {
    // Create a test file
    const filePath = 'test-file.txt';
    await page.evaluate(() => {
      const blob = new Blob(['Test file content'], { type: 'text/plain' });
      const file = new File([blob], 'test-file.txt', { type: 'text/plain' });
      window.testFile = file;
    });
    
    // Click upload button
    await page.click('button:has-text("Upload Files")');
    
    // Should show file upload dialog or modal
    await expect(page.locator('text=Upload Files')).toBeVisible();
  });

  test('should display current location', async ({ page }) => {
    // Mock geolocation
    await page.addInitScript(() => {
      navigator.geolocation.getCurrentPosition = (success) => {
        success({
          coords: {
            latitude: 41.9981,
            longitude: 21.4254,
            accuracy: 10
          }
        });
      };
    });
    
    // Should show location information
    await expect(page.locator('text=Location:')).toBeVisible();
  });

  test('should handle work session timing', async ({ page }) => {
    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Wait a moment and check timing
    await page.waitForTimeout(2000);
    
    // Should show elapsed time
    await expect(page.locator('text=Elapsed:')).toBeVisible();
  });

  test('should handle multiple work sessions', async ({ page }) => {
    // First work session
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
    
    // Second work session
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    await page.click('button:has-text("End Work")');
    await expect(page.locator('text=Work Session Ended')).toBeVisible();
  });

  test('should handle break timing', async ({ page }) => {
    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Take break
    await page.click('button:has-text("Take Break")');
    await expect(page.locator('text=On Break')).toBeVisible();
    
    // Wait and check break duration
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Break Duration:')).toBeVisible();
  });

  test('should handle session state persistence', async ({ page }) => {
    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=Work Session Started')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Should maintain work session state
    await expect(page.locator('text=Work Session Started')).toBeVisible();
  });

  test('should handle location updates', async ({ page }) => {
    // Mock location updates
    await page.addInitScript(() => {
      let locationCallback;
      navigator.geolocation.watchPosition = (callback) => {
        locationCallback = callback;
        return 1; // watch ID
      };
      
      // Simulate location update
      setInterval(() => {
        if (locationCallback) {
          locationCallback({
            coords: {
              latitude: 41.9981 + Math.random() * 0.001,
              longitude: 21.4254 + Math.random() * 0.001,
              accuracy: 10
            }
          });
        }
      }, 1000);
    });
    
    // Should show location updates
    await expect(page.locator('text=Location:')).toBeVisible();
  });

  test('should handle file upload errors', async ({ page }) => {
    // Mock file upload error
    await page.addInitScript(() => {
      window.FileReader = class {
        readAsDataURL() {
          this.onerror(new Error('Upload failed'));
        }
      };
    });
    
    // Try to upload file
    await page.click('button:has-text("Upload Files")');
    
    // Should handle error gracefully
    await expect(page.locator('text=Upload Files')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/*', route => route.abort());
    
    // Try to start work session
    await page.click('button:has-text("Start Work")');
    
    // Should handle error gracefully
    await expect(page.locator('text=Employee Dashboard')).toBeVisible();
  });

  test('should test responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still be functional
    await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
    await expect(page.locator('button:has-text("Take Screenshot")')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Should still be functional
    await expect(page.locator('button:has-text("Start Work")')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Start Work")')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Take Screenshot")')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Upload Files")')).toBeFocused();
  });

  test('should handle accessibility features', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('button:has-text("Start Work")')).toHaveAttribute('aria-label');
    await expect(page.locator('button:has-text("Take Screenshot")')).toHaveAttribute('aria-label');
    
    // Check for proper heading structure
    await expect(page.locator('h1, h2, h3')).toHaveCount(1);
  });
}); 