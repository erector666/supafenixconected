// Test data for FENIX Construction Tracker tests

export const TEST_USERS = {
  admin: {
    email: 'kango@fenix.com',
    password: 'admin123',
    name: 'Admin'
  },
  employees: [
    {
      id: 1,
      name: 'Petre',
      email: 'petre@fenix.com',
      password: 'admin123',
      role: 'worker'
    },
    {
      id: 2,
      name: 'Ilija',
      email: 'ilija@fenix.com',
      password: 'admin123',
      role: 'worker'
    },
    {
      id: 3,
      name: 'Vojne',
      email: 'vojne@fenix.com',
      password: 'admin123',
      role: 'worker'
    },
    {
      id: 4,
      name: 'Dragan',
      email: 'dragan@fenix.com',
      password: 'admin123',
      role: 'worker'
    },
    {
      id: 5,
      name: 'Tino',
      email: 'tino@fenix.com',
      password: 'admin123',
      role: 'worker'
    },
    {
      id: 6,
      name: 'Vane',
      email: 'vane@fenix.com',
      password: 'admin123',
      role: 'worker'
    }
  ]
};

export const TEST_VEHICLES = [
  {
    id: 1,
    name: 'Van #1',
    plate: 'ABC-123',
    status: 'active'
  },
  {
    id: 2,
    name: 'Van #2',
    plate: 'DEF-456',
    status: 'active'
  },
  {
    id: 3,
    name: 'Truck #1',
    plate: 'GHI-789',
    status: 'active'
  },
  {
    id: 4,
    name: 'Worker Van',
    plate: 'XYZ-999',
    status: 'active'
  },
  {
    id: 5,
    name: 'Personal Car',
    plate: 'Own Vehicle',
    status: 'active'
  }
];

export const TEST_FILES = [
  {
    name: 'test-document.pdf',
    type: 'application/pdf',
    size: 1024000,
    category: 'document'
  },
  {
    name: 'work-photo.jpg',
    type: 'image/jpeg',
    size: 512000,
    category: 'image'
  },
  {
    name: 'screenshot.png',
    type: 'image/png',
    size: 256000,
    category: 'screenshot'
  },
  {
    name: 'report.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 2048000,
    category: 'document'
  }
];

export const TEST_LOCATIONS = [
  {
    latitude: 41.9981,
    longitude: 21.4254,
    address: 'Skopje, Macedonia',
    accuracy: 10
  },
  {
    latitude: 41.9982,
    longitude: 21.4255,
    address: 'Skopje, Macedonia',
    accuracy: 15
  },
  {
    latitude: 41.9983,
    longitude: 21.4256,
    address: 'Skopje, Macedonia',
    accuracy: 12
  }
];

export const TEST_DATES = {
  today: new Date().toISOString().slice(0, 10),
  yesterday: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  lastWeek: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  lastMonth: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  startOfYear: '2024-01-01',
  endOfYear: '2024-12-31'
};

export const TEST_WORK_SESSIONS = [
  {
    employeeId: 1,
    startTime: '2024-01-15T08:00:00Z',
    endTime: '2024-01-15T16:00:00Z',
    duration: 8,
    status: 'completed'
  },
  {
    employeeId: 2,
    startTime: '2024-01-15T08:30:00Z',
    endTime: '2024-01-15T17:00:00Z',
    duration: 8.5,
    status: 'completed'
  },
  {
    employeeId: 3,
    startTime: '2024-01-15T09:00:00Z',
    endTime: null,
    duration: null,
    status: 'active'
  }
];

export const TEST_REPORTS = {
  workHours: {
    title: 'Work Hours Report',
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    },
    filters: ['employee', 'date', 'duration']
  },
  employeePerformance: {
    title: 'Employee Performance Report',
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    },
    filters: ['employee', 'productivity', 'attendance']
  },
  vehicleUsage: {
    title: 'Vehicle Usage Report',
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    },
    filters: ['vehicle', 'driver', 'mileage']
  }
};

export const TEST_ERROR_MESSAGES = {
  invalidCredentials: 'Invalid credentials',
  networkError: 'Network error occurred',
  fileUploadError: 'File upload failed',
  sessionExpired: 'Session expired',
  permissionDenied: 'Permission denied'
};

export const TEST_SCREEN_SIZES = [
  { width: 320, height: 568, name: 'iPhone SE' },
  { width: 375, height: 667, name: 'iPhone 6/7/8' },
  { width: 414, height: 736, name: 'iPhone 6/7/8 Plus' },
  { width: 375, height: 812, name: 'iPhone X' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1024, height: 768, name: 'Desktop' },
  { width: 1920, height: 1080, name: 'Full HD' }
];

export const TEST_TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  veryLong: 60000
};

export const TEST_SELECTORS = {
  // Login
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton: 'button:has-text("Login")',
  
  // Employee Dashboard
  startWorkButton: 'button:has-text("Start Work")',
  endWorkButton: 'button:has-text("End Work")',
  takeBreakButton: 'button:has-text("Take Break")',
  resumeWorkButton: 'button:has-text("Resume Work")',
  takeScreenshotButton: 'button:has-text("Take Screenshot")',
  uploadFilesButton: 'button:has-text("Upload Files")',
  
  // Admin Dashboard
  overviewTab: 'text=Overview',
  employeesTab: 'text=Employees',
  vehiclesTab: 'text=Vehicles',
  workFilesTab: 'text=Work Files',
  reportsTab: 'text=Reports',
  workHistoryTab: 'text=Work History',
  mapTab: 'text=Map',
  locationHistoryTab: 'text=Location History',
  
  // Common
  logoutButton: 'button:has-text("Logout")',
  saveButton: 'button:has-text("Save")',
  cancelButton: 'button:has-text("Cancel")',
  deleteButton: 'button:has-text("Delete")',
  confirmButton: 'button:has-text("Confirm")',
  exportButton: 'button:has-text("Export")',
  filterButton: 'button:has-text("Filter")',
  
  // Forms
  nameInput: 'input[placeholder="Name"]',
  emailInputPlaceholder: 'input[placeholder="Email"]',
  passwordInputPlaceholder: 'input[placeholder="Password"]',
  vehicleNameInput: 'input[placeholder="Vehicle Name"]',
  licensePlateInput: 'input[placeholder="License Plate"]',
  
  // Tables
  tableHeaders: {
    name: 'text=Name',
    email: 'text=Email',
    role: 'text=Role',
    status: 'text=Status',
    actions: 'text=Actions',
    date: 'text=Date',
    time: 'text=Time',
    duration: 'text=Duration',
    employee: 'text=Employee',
    startTime: 'text=Start Time',
    endTime: 'text=End Time',
    location: 'text=Location',
    coordinates: 'text=Coordinates'
  }
};

export const TEST_ASSERTIONS = {
  // Dashboard titles
  employeeDashboard: 'text=Employee Dashboard',
  adminDashboard: 'text=Admin Dashboard',
  
  // Status messages
  workSessionStarted: 'text=Work Session Started',
  workSessionEnded: 'text=Work Session Ended',
  onBreak: 'text=On Break',
  screenshotTaken: 'text=Screenshot taken',
  
  // Success messages
  employeeAdded: 'text=Employee added successfully',
  employeeUpdated: 'text=Employee updated successfully',
  employeeDeleted: 'text=Employee deleted successfully',
  vehicleAdded: 'text=Vehicle added successfully',
  vehicleUpdated: 'text=Vehicle updated successfully',
  vehicleDeleted: 'text=Vehicle deleted successfully',
  filesDeleted: 'text=Files deleted successfully',
  reportGenerated: 'text=Report Generated',
  
  // Error messages
  invalidCredentials: 'text=Invalid credentials',
  
  // Map elements
  googleMap: '[data-testid="google-map"]',
  employeeMarker: '[data-testid="employee-marker"]',
  employeeLocations: 'text=Employee Locations',
  
  // File elements
  filePreview: 'text=File Preview',
  uploadFiles: 'text=Upload Files',
  uploading: 'text=Uploading...'
};

export const TEST_ACTIONS = {
  // Login actions
  loginAsAdmin: async (page) => {
    await page.fill(TEST_SELECTORS.emailInput, TEST_USERS.admin.email);
    await page.fill(TEST_SELECTORS.passwordInput, TEST_USERS.admin.password);
    await page.click(TEST_SELECTORS.loginButton);
  },
  
  loginAsEmployee: async (page, employeeIndex = 0) => {
    const employee = TEST_USERS.employees[employeeIndex];
    await page.fill(TEST_SELECTORS.emailInput, employee.email);
    await page.fill(TEST_SELECTORS.passwordInput, employee.password);
    await page.click(TEST_SELECTORS.loginButton);
  },
  
  // Work session actions
  startWorkSession: async (page) => {
    await page.click(TEST_SELECTORS.startWorkButton);
  },
  
  endWorkSession: async (page) => {
    await page.click(TEST_SELECTORS.endWorkButton);
  },
  
  takeBreak: async (page) => {
    await page.click(TEST_SELECTORS.takeBreakButton);
  },
  
  resumeWork: async (page) => {
    await page.click(TEST_SELECTORS.resumeWorkButton);
  },
  
  takeScreenshot: async (page) => {
    await page.click(TEST_SELECTORS.takeScreenshotButton);
  },
  
  // Navigation actions
  navigateToTab: async (page, tabSelector) => {
    await page.click(tabSelector);
  },
  
  logout: async (page) => {
    await page.click(TEST_SELECTORS.logoutButton);
  }
};

export default {
  TEST_USERS,
  TEST_VEHICLES,
  TEST_FILES,
  TEST_LOCATIONS,
  TEST_DATES,
  TEST_WORK_SESSIONS,
  TEST_REPORTS,
  TEST_ERROR_MESSAGES,
  TEST_SCREEN_SIZES,
  TEST_TIMEOUTS,
  TEST_SELECTORS,
  TEST_ASSERTIONS,
  TEST_ACTIONS
}; 