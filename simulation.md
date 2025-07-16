# FENIX Construction Tracker - User Simulation Guide

## Overview
This document simulates the complete user journey through the FENIX Construction Tracker app, covering both employee and admin workflows, from initial login to daily operations.

---

## 🚀 App Launch & Initial Experience

### 1. Splash Screen (3 seconds)
- **Screen**: Orange gradient background with FENIX logo
- **Animation**: Logo pulses, text fades in
- **Duration**: 3 seconds automatic transition
- **Next**: Automatically proceeds to login screen

### 2. Login Screen
- **Background**: Orange gradient with FENIX branding
- **Logo**: FENIX logo prominently displayed
- **Form Fields**:
  - Email input
  - Password input
  - Login button with icon
- **User Options**:
  - Admin login: `kango@fenix.com` / `admin123`
  - Employee logins: `petre@fenix.com` / `admin123`, etc.

---

## 👷 Employee Workflow Simulation

### **Employee Login & Dashboard**
1. **Login as Employee**
   - Enter: `petre@fenix.com` / `admin123`
   - Click "Login" button
   - System validates credentials
   - Redirects to Employee Dashboard

2. **Employee Dashboard Overview**
   - **Header**: "Welcome, Petre" with logout button
   - **Work Status Card**: Shows current work status
   - **Location Card**: Displays current GPS coordinates
   - **Action Buttons**: Start Work, Take Break, Resume, End Work
   - **My Files Section**: Shows uploaded files

### **Starting a Work Session**
1. **Click "Start Work"**
   - Modal opens: "Work Details"
   - **Required Fields**:
     - Work Description (mandatory)
     - Vehicle Selection (optional)
     - Starting Kilometers (optional)
   - **Vehicle Options**:
     - Van #1 (ABC-123)
     - Van #2 (DEF-456)
     - Truck #1 (GHI-789)
     - Worker Van (XYZ-999)
     - Personal Car (Own Vehicle)
     - "No vehicle / Walking"

2. **Fill Work Details**
   - Description: "Installing electrical systems at Site A"
   - Vehicle: Select "Van #1 (ABC-123)"
   - Starting Kilometers: Enter "45,250"
   - Click "Start Work"

3. **Work Session Active**
   - Status changes to "Working" (green)
   - Location tracking begins (every 10 minutes)
   - Action buttons update:
     - "Take Break" (yellow)
     - "Take Screenshot" (purple)
     - "End Work" (red)

### **During Work Session**
1. **Location Tracking**
   - GPS coordinates update every 10 minutes
   - Location history stored automatically
   - Current location visible in Location Card

2. **Taking a Break**
   - Click "Take Break"
   - Status changes to "On Break" (yellow)
   - Button changes to "Resume Work" (blue)
   - Break time logged

3. **Taking Screenshots**
   - Click "Take Screenshot"
   - Mock screenshot captured
   - Notification appears: "Screenshot saved"
   - Screenshot count increases

4. **Resuming Work**
   - Click "Resume Work"
   - Status returns to "Working" (green)
   - Break duration calculated and logged

### **Ending Work Session**
1. **Click "End Work"**
   - Confirmation dialog appears
   - Click "Confirm"
   - Work session ends
   - Status changes to "Idle"
   - Location tracking stops
   - Session data saved to work logs

### **File Management (Employee)**
1. **Viewing Files**
   - Scroll through "My Files" section
   - Click on files to preview
   - Download files as needed

---

## 👨‍💼 Admin Workflow Simulation

### **Admin Login & Dashboard**
1. **Login as Admin**
   - Enter: `kango@fenix.com` / `admin123`
   - Click "Login"
   - Redirects to Admin Dashboard

2. **Admin Dashboard Layout**
   - **Left Sidebar**: Navigation menu
   - **Main Content**: Tab-based interface
   - **Navigation Order**:
     1. Overview
     2. Employees
     3. Vehicles
     4. Map
     5. Location History
     6. Work History
     7. Reports
     8. Work Files

### **Overview Tab**
1. **Dashboard Metrics**
   - Active Workers: Real-time count
   - Total Hours Today: Calculated sum
   - Completed Jobs: Count of finished sessions
   - Recent Activity: Latest work events

### **Employees Tab**
1. **Employee Management**
   - **Add Worker**: Click "Add Worker" button
     - Modal opens with form
     - Fill: Name, Email, Password, Role
     - Click "Save"
   - **Add Admin**: Click "Add Admin" button
     - Same form, role set to "admin"
   - **Edit Employee**: Click "Edit" on any employee
     - Modal opens with current data
     - Modify fields and save
   - **Delete Employee**: Click "Delete"
     - Confirmation dialog
     - Employee removed from system

2. **Employee Monitoring**
   - **Real-time Status**: Working/Break/Not Working
   - **Current Location**: GPS coordinates if active
   - **Monthly Hours**: Total hours worked this month
   - **Work History**: Recent sessions for each employee

### **Vehicles Tab**
1. **Vehicle Management**
   - **Add Vehicle**: Click "Add Vehicle"
     - Modal opens: Name, Plate
     - Click "Save"
   - **Edit Vehicle**: Click "Edit" on any vehicle
     - Modify name or plate
   - **Delete Vehicle**: Click "Delete"
     - Confirmation required

2. **Vehicle Export**
   - **Select Date**: Choose export date
   - **Click Export**: Opens choice modal
   - **Choose Format**: Excel or PDF
   - **Download**: File downloads automatically

### **Map Tab**
1. **Real-time Location View**
   - **Google Maps**: Shows all active workers
   - **Worker Markers**: Color-coded (green=working, yellow=break)
   - **Click Worker**: Shows details panel
   - **Worker Details**:
     - Name and status
     - Start time
     - Work description
     - Vehicle information
   - **Map Controls**: Zoom, pan, reset view

### **Location History Tab**
1. **Historical Location Data**
   - **Date Picker**: Select specific date
   - **Employee List**: Shows all employees
   - **Location Data**: GPS coordinates with timestamps
   - **Session Grouping**: Locations grouped by work session

### **Work History Tab**
1. **Work Session Records**
   - **Employee Filter**: All employees or specific employee
   - **Date Range**: Today, Last 7 Days, Last 30 Days, All Time
   - **Session Details**:
     - Employee name and hours
     - Start/end times
     - Work description
     - Vehicle used
     - Break count
     - Location updates count

### **Reports Tab**
1. **Date-based Reporting**
   - **Date Picker**: Select report date
   - **Export Button**: Opens format choice
   - **Report Data**:
     - Employee name
     - Total hours
     - Days worked
     - Average hours per day
   - **Export Options**: Excel or PDF

### **Work Files Tab**
1. **File Management**
   - **Upload Files**: Click "Upload Files"
     - Select files from device
     - Choose category and description
   - **File Categories**: Document, Image, Report, Contract, Invoice, Other
   - **File Operations**:
     - View/Preview files
     - Download files
     - Delete files
     - Bulk delete selected files
   - **File Filtering**: By category or uploader

---

## 🔄 Real-time Data Flow Simulation

### **Location Updates (Every 10 Minutes)**
1. **Worker Device**: GPS coordinates captured
2. **Data Structure**: 
   ```javascript
   {
     latitude: 41.9981,
     longitude: 21.4254,
     timestamp: "2024-01-15T10:30:00Z"
   }
   ```
3. **Storage**: Added to work session's locationHistory array
4. **Admin View**: Updates in real-time on Map tab

### **Work Session States**
1. **Not Started**: No active session
2. **Working**: Active session, location tracking on
3. **Break**: Paused session, location tracking continues
4. **Completed**: Ended session, data saved to logs

---

## 📊 Data Export Simulation

### **Vehicle Export**
1. **Select Vehicle**: Click "Export" on any vehicle
2. **Choose Date**: Pick specific date
3. **Select Format**: Excel or PDF
4. **Download**: File named `VehicleName_YYYY-MM-DD_data.xlsx/pdf`

### **Reports Export**
1. **Select Date**: Choose report date
2. **Click Export**: Opens format choice
3. **Choose Format**: Excel or PDF
4. **Download**: File named `report_YYYY-MM-DD.xlsx/pdf`

---

## 🔐 Security & Access Control

### **Role-based Access**
- **Admin**: Full access to all features
- **Employee**: Limited to own work session and files

### **Session Management**
- **Login Required**: All features require authentication
- **Logout**: Clears session and returns to login

---

## 📱 User Experience Highlights

### **Responsive Design**
- Works on desktop and mobile devices
- Touch-friendly interface
- Adaptive layouts

### **Real-time Updates**
- Live location tracking
- Instant status changes
- Real-time notifications

### **Intuitive Navigation**
- Clear sidebar navigation
- Consistent UI patterns
- Easy-to-find actions

### **Data Visualization**
- Google Maps integration
- Color-coded status indicators
- Progress tracking

---

## 🎯 Key User Journeys

### **Daily Worker Journey**
1. Login → Start Work → Work with breaks → End Work → Logout

### **Admin Monitoring Journey**
1. Login → Overview → Check Employees → Monitor Map → Generate Reports → Logout

### **File Management Journey**
1. Upload Files → Organize by Category → Share with Team → Download as Needed

This simulation covers the complete user experience of the FENIX Construction Tracker app, demonstrating how both employees and administrators interact with the system for effective construction project management. 