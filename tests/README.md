# FENIX Construction Tracker - Browser Automation Test Suite

This directory contains comprehensive browser automation tests for the FENIX Construction Tracker application using Playwright.

## Test Structure

### 1. Splash Screen and Login Tests (`01-splash-and-login.spec.js`)
- **Splash Screen Display**: Tests the 3-second splash screen with FENIX branding
- **Login Form Functionality**: Tests login form appearance and validation
- **Admin Login**: Tests admin authentication (kango@fenix.com)
- **Employee Login**: Tests all employee accounts (Petre, Ilija, Vojne, Dragan, Tino, Vane)
- **Invalid Credentials**: Tests error handling for wrong credentials
- **Keyboard Navigation**: Tests Enter key login and tab navigation
- **Accessibility**: Tests form accessibility features

### 2. Employee Dashboard Tests (`02-employee-dashboard.spec.js`)
- **Dashboard Display**: Tests employee dashboard layout and elements
- **Work Session Management**: Tests start, pause, resume, and end work sessions
- **Screenshot Functionality**: Tests screenshot capture during work sessions
- **File Upload**: Tests file upload functionality
- **Location Tracking**: Tests GPS location display and updates
- **Session Timing**: Tests work session duration tracking
- **Multiple Sessions**: Tests multiple work sessions in sequence
- **Break Management**: Tests break timing and duration
- **State Persistence**: Tests session state across page refreshes
- **Error Handling**: Tests network errors and file upload failures
- **Responsive Design**: Tests mobile and tablet viewports
- **Accessibility**: Tests keyboard navigation and ARIA labels

### 3. Admin Dashboard Tests (`03-admin-dashboard.spec.js`)
- **Dashboard Overview**: Tests admin dashboard layout and navigation
- **Employee Management**: Tests CRUD operations for employees
  - Add new employees
  - Edit existing employees
  - Delete employees
  - Search and filter employees
- **Vehicle Management**: Tests CRUD operations for vehicles
  - Add new vehicles
  - Edit existing vehicles
  - Delete vehicles
  - Export to Excel/PDF
- **Work Files Management**: Tests file management functionality
  - Upload files
  - Preview files
  - Download files
  - Delete files
  - Search and filter files
- **Reports Generation**: Tests reporting functionality
  - Generate work hours reports
  - Export reports to Excel/PDF
- **Work History**: Tests work history viewing and filtering
  - Filter by date range
  - Export to Excel/PDF
- **Map View**: Tests employee location mapping
  - Display employee markers
  - Click markers for employee info
  - Filter by employee
- **Location History**: Tests location tracking history
  - View location history
  - Filter by employee and date
  - Export location data
- **Logout Functionality**: Tests admin logout
- **Responsive Design**: Tests mobile and tablet layouts
- **Accessibility**: Tests keyboard navigation and ARIA labels

### 4. Integration Tests (`04-integration-tests.spec.js`)
- **Complete Employee Journey**: End-to-end employee work session workflow
- **Complete Admin Journey**: End-to-end admin management workflow
- **Multi-Employee Simulation**: Tests multiple employees working simultaneously
- **File Management Workflow**: Tests complete file upload and management process
- **Export Functionality**: Tests all export features (Excel/PDF)
- **Error Handling**: Tests error recovery and graceful degradation
- **Session Persistence**: Tests state management across sessions
- **Cross-Browser Compatibility**: Tests functionality across different browsers
- **Performance Testing**: Tests rapid interactions and load times
- **Accessibility**: Tests keyboard navigation and screen reader support

### 5. Mobile Tests (`05-mobile-tests.spec.js`)
- **Mobile Splash and Login**: Tests mobile login experience
- **Mobile Employee Dashboard**: Tests mobile work session management
- **Mobile Admin Dashboard**: Tests mobile admin interface
- **Mobile CRUD Operations**: Tests mobile employee and vehicle management
- **Mobile File Management**: Tests mobile file upload and management
- **Mobile Reports**: Tests mobile report generation
- **Mobile Work History**: Tests mobile work history viewing
- **Mobile Map View**: Tests mobile map interactions
- **Mobile Location History**: Tests mobile location tracking
- **Touch Interactions**: Tests touch gestures and interactions
- **Responsive Design**: Tests multiple mobile screen sizes
- **Mobile Keyboard**: Tests mobile keyboard input handling
- **Mobile Gestures**: Tests swipe and pinch gestures
- **Mobile Performance**: Tests mobile loading performance
- **Mobile Offline**: Tests offline functionality
- **Mobile Accessibility**: Tests mobile accessibility features

## Test Coverage

### User Journeys Covered:
1. **Employee Work Session Journey**
   - Login → Start Work → Take Screenshot → Take Break → Resume Work → End Work → Logout

2. **Admin Management Journey**
   - Login → Overview → Add Employee → Add Vehicle → Upload Files → Generate Reports → View History → Logout

3. **Multi-Employee Workflow**
   - Multiple employees working simultaneously
   - Admin monitoring multiple employees
   - Real-time updates and coordination

4. **File Management Workflow**
   - Employee uploads files during work session
   - Admin manages and downloads files
   - File preview and organization

5. **Export and Reporting Workflow**
   - Generate various reports
   - Export data in multiple formats
   - Filter and search functionality

### Technical Coverage:
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iPhone, Android, iPad
- **Responsive Design**: Multiple screen sizes and orientations
- **Performance Testing**: Load times and responsiveness
- **Error Handling**: Network errors, invalid inputs, edge cases
- **Accessibility**: Keyboard navigation, screen readers, ARIA labels
- **State Management**: Session persistence, data consistency
- **Security**: Authentication, authorization, data validation

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npm run test:e2e:install`

### Test Commands
```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Show test report
npm run test:e2e:report
```

### Running Specific Test Files
```bash
# Run only login tests
npx playwright test 01-splash-and-login.spec.js

# Run only employee tests
npx playwright test 02-employee-dashboard.spec.js

# Run only admin tests
npx playwright test 03-admin-dashboard.spec.js

# Run only integration tests
npx playwright test 04-integration-tests.spec.js

# Run only mobile tests
npx playwright test 05-mobile-tests.spec.js
```

### Running Tests on Specific Browsers
```bash
# Run tests on Chrome only
npx playwright test --project=chromium

# Run tests on Firefox only
npx playwright test --project=firefox

# Run tests on Safari only
npx playwright test --project=webkit

# Run tests on mobile Chrome
npx playwright test --project="Mobile Chrome"

# Run tests on mobile Safari
npx playwright test --project="Mobile Safari"
```

## Test Configuration

### Playwright Config (`playwright.config.js`)
- **Base URL**: http://localhost:3000
- **Test Directory**: ./tests
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Browser Projects
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: iPhone 12, Pixel 5
- **Tablet**: iPad

## Test Data

### Default Users
- **Admin**: kango@fenix.com / admin123
- **Employees**: 
  - petre@fenix.com / admin123
  - ilija@fenix.com / admin123
  - vojne@fenix.com / admin123
  - dragan@fenix.com / admin123
  - tino@fenix.com / admin123
  - vane@fenix.com / admin123

### Default Vehicles
- Van #1 (ABC-123)
- Van #2 (DEF-456)
- Truck #1 (GHI-789)
- Worker Van (XYZ-999)
- Personal Car (Own Vehicle)

## Best Practices

### Test Organization
- Tests are organized by functionality and user role
- Each test file focuses on a specific area
- Integration tests cover complete user journeys
- Mobile tests ensure responsive design

### Test Reliability
- Tests use proper wait conditions
- Tests handle async operations correctly
- Tests clean up after themselves
- Tests are independent and can run in any order

### Test Maintainability
- Tests use descriptive names
- Tests include proper assertions
- Tests are well-documented
- Tests follow consistent patterns

### Performance Considerations
- Tests run in parallel when possible
- Tests use efficient selectors
- Tests minimize unnecessary waits
- Tests clean up resources properly

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:e2e:install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Common Issues
1. **Tests failing on CI but passing locally**
   - Check for timing issues
   - Verify browser versions match
   - Check for environment differences

2. **Tests timing out**
   - Increase timeout values
   - Check for slow network conditions
   - Verify selectors are correct

3. **Tests flaky**
   - Add proper wait conditions
   - Use more reliable selectors
   - Check for race conditions

### Debug Tips
1. Use `--headed` mode to see what's happening
2. Use `--debug` mode to step through tests
3. Use `--ui` mode for interactive debugging
4. Check screenshots and videos on failure
5. Use Playwright Inspector for detailed debugging

## Reporting

### HTML Report
- Generated automatically after test runs
- Shows test results, screenshots, and videos
- Accessible via `npm run test:e2e:report`

### JSON Report
- Machine-readable format
- Useful for CI/CD integration
- Stored in `test-results/results.json`

### JUnit Report
- Compatible with CI/CD systems
- Stored in `test-results/results.xml`

## Future Enhancements

### Planned Improvements
1. **Visual Regression Testing**: Compare screenshots across versions
2. **API Testing**: Test backend endpoints
3. **Load Testing**: Test application under load
4. **Security Testing**: Test for common vulnerabilities
5. **Accessibility Testing**: Automated accessibility checks
6. **Performance Testing**: Measure and track performance metrics

### Test Expansion
1. **More Edge Cases**: Test unusual user behaviors
2. **Internationalization**: Test multiple languages
3. **Offline Functionality**: Test offline capabilities
4. **Push Notifications**: Test notification systems
5. **Deep Linking**: Test URL-based navigation 