# Employees Folder

This folder contains all employee data for the FENIX Construction Tracker application.

## Structure

Each employee has their own JSON file containing their complete profile information:

- `admin.json` - Admin user credentials
- `petre.json` - Employee Petre
- `ilija.json` - Employee Ilija
- `vojne.json` - Employee Vojne
- `dragan.json` - Employee Dragan
- `tino.json` - Employee Tino
- `vane.json` - Employee Vane
- `index.js` - Main loader file that exports all employees

## Employee Data Format

Each employee JSON file contains:

```json
{
  "id": 1,
  "name": "Employee Name",
  "email": "employee@fenix.com",
  "password": "admin123",
  "role": "worker",
  "phone": "+389-70-123-456",
  "department": "Construction",
  "hire_date": "2024-01-01",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Usage

### Import all employees
```javascript
import employees from './employees';
```

### Import specific employee
```javascript
import { petre, adminUser } from './employees';
```

### Import helper functions
```javascript
import { 
  findEmployeeByEmail, 
  validateCredentials, 
  activeWorkers 
} from './employees';
```

### Validate login credentials
```javascript
import { validateCredentials } from './employees';

const employee = validateCredentials('petre@fenix.com', 'admin123');
if (employee) {
  // Login successful
  console.log('Welcome,', employee.name);
}
```

## Available Exports

- `employees` - Array of all employees
- `workers` - Array of workers only (excluding admin)
- `activeEmployees` - Array of active employees only
- `activeWorkers` - Array of active workers only
- `adminUser` - Admin user object
- `findEmployeeByEmail(email)` - Find employee by email
- `findEmployeeById(id)` - Find employee by ID
- `validateCredentials(email, password)` - Validate login credentials

## Adding New Employees

1. Create a new JSON file in this folder (e.g., `newemployee.json`)
2. Follow the employee data format above
3. Import the new employee in `index.js`
4. Add the employee to the `employees` array in `index.js`

## Security Note

⚠️ **Important**: These are development/test credentials. In production:
- Use strong, unique passwords
- Implement proper password hashing
- Store credentials securely in a database
- Use environment variables for sensitive data
- Enable two-factor authentication

## Current Employees

| Name | Email | Role | Department |
|------|-------|------|------------|
| Admin | kango@fenix.com | admin | Management |
| Petre | petre@fenix.com | worker | Construction |
| Ilija | ilija@fenix.com | worker | Construction |
| Vojne | vojne@fenix.com | worker | Construction |
| Dragan | dragan@fenix.com | worker | Construction |
| Tino | tino@fenix.com | worker | Construction |
| Vane | vane@fenix.com | worker | Construction |

**Default Password**: `admin123` (for all users) 