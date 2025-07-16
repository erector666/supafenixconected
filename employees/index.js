// Employee data loader for FENIX Construction Tracker
// This file loads all employee data from individual JSON files

import petre from './petre.json';
import ilija from './ilija.json';
import vojne from './vojne.json';
import dragan from './dragan.json';
import tino from './tino.json';
import vane from './vane.json';
import admin from './admin.json';

// Export all employees as an array
export const employees = [
  petre,
  ilija,
  vojne,
  dragan,
  tino,
  vane,
  admin
];

// Export individual employees for direct access
export { petre, ilija, vojne, dragan, tino, vane, admin };

// Export admin separately for easy access
export const adminUser = admin;

// Export workers only (excluding admin)
export const workers = employees.filter(emp => emp.role === 'worker');

// Export active employees only
export const activeEmployees = employees.filter(emp => emp.status === 'active');

// Export active workers only
export const activeWorkers = workers.filter(emp => emp.status === 'active');

// Helper function to find employee by email
export const findEmployeeByEmail = (email) => {
  return employees.find(emp => emp.email === email);
};

// Helper function to find employee by ID
export const findEmployeeById = (id) => {
  return employees.find(emp => emp.id === id);
};

// Helper function to validate credentials
export const validateCredentials = (email, password) => {
  const employee = findEmployeeByEmail(email);
  if (employee && employee.password === password) {
    return employee;
  }
  return null;
};

// Export default as the employees array
export default employees; 