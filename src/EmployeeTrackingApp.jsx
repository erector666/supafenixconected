import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Camera, Play, Pause, Square, Car, Users, Calendar, BarChart3, Settings, LogOut, Upload, FileText, Image, Download, Trash2, Eye, File, Package } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import WeatherWidget from './components/WeatherWidget';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import LanguageSelector from './components/LanguageSelector';
import employeeService from './services/employeeService';
import vehicleService from './services/vehicleService';

const EmployeeTrackingAppContent = () => {
  const { t, currentLanguage } = useI18n();
  // Using currentLanguage in the component ensures it re-renders when language changes
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('splash');
  const [workSession, setWorkSession] = useState(null);
  const [location, setLocation] = useState(null);
  // Import employees from the employees folder
  const [employees, setEmployees] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Materials State
  const [materials, setMaterials] = useState([
    { 
      id: 1, 
      name: 'Cement Bags', 
      quantity: 50, 
      unit: 'bags', 
      price: 15.50, 
      project: 'Skopje Mall Construction', 
      worksite: 'Skopje Center', 
      purchaseDate: '2024-01-10', 
      supplier: 'Beton Pro', 
      receiptFile: null,
      description: 'Portland cement for foundation work'
    },
    { 
      id: 2, 
      name: 'Steel Rebar', 
      quantity: 200, 
      unit: 'pieces', 
      price: 8.75, 
      project: 'Residential Complex', 
      worksite: 'Aerodrom District', 
      purchaseDate: '2024-01-12', 
      supplier: 'Metal Solutions', 
      receiptFile: null,
      description: 'Reinforcement steel for concrete structures'
    }
  ]);

  // App Files State
  const [appFiles, setAppFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [employeeLocations, setEmployeeLocations] = useState({});
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load employees data from Supabase on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await employeeService.getAllEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
        setEmployees([]);
      }
    };
    
    loadEmployees();
  }, []);

  // Load vehicles data from Supabase on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const vehiclesData = await vehicleService.getAllVehicles();
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error loading vehicles:', error);
        setVehicles([]);
      }
    };
    
    loadVehicles();
  }, []);

  // File Management Functions
  const addFileToAppFiles = (fileData) => {
    const newFile = {
      id: Date.now() + Math.random(),
      fileName: fileData.fileName,
      originalName: fileData.originalName || fileData.fileName,
      fileType: fileData.fileType,
      fileSize: fileData.fileSize,
      filePath: fileData.filePath || fileData.url,
      mimeType: fileData.mimeType,
      category: fileData.category,
      uploadedBy: fileData.uploadedBy,
      uploadedByName: fileData.uploadedByName,
      uploadedByType: fileData.uploadedByType,
      uploadDate: new Date().toISOString(),
      description: fileData.description || '',
      tags: fileData.tags || [],
      relatedWorkSessionId: fileData.relatedWorkSessionId || null,
      relatedEmployeeId: fileData.relatedEmployeeId || null,
      isPublic: fileData.isPublic || false,
      status: 'active'
    };
    
    setAppFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const removeFileFromAppFiles = (fileId) => {
    setAppFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updateFileInAppFiles = (fileId, updates) => {
    setAppFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    ));
  };

  const getFilesByCategory = (category) => {
    return appFiles.filter(file => file.category === category && file.status === 'active');
  };

  const getFilesByUser = (userId, userType) => {
    return appFiles.filter(file => 
      file.uploadedBy === userId && 
      file.uploadedByType === userType && 
      file.status === 'active'
    );
  };

  const getFileIcon = (mimeType, category) => {
    if (category === 'screenshot') return Camera;
    if (mimeType?.startsWith('image/')) return Image;
    if (mimeType?.includes('pdf')) return FileText;
    if (mimeType?.includes('document') || mimeType?.includes('word')) return FileText;
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return FileText;
    return File;
  };

  const openFile = (file) => {
    if (file.mimeType?.startsWith('image/') || file.category === 'screenshot') {
      setPreviewFile(file);
    } else if (file.mimeType?.includes('pdf')) {
      window.open(file.filePath, '_blank');
    } else {
      // Fallback for other file types
      window.open(file.filePath, '_blank');
    }
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.filePath;
    link.download = file.originalName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Removed mock captureScreenshot function - now using real camera

  const handleFileUpload = async (files, category = 'document', description = '') => {
    const uploadedFiles = [];
    
    for (let file of files) {
      // Mock upload process
      const fileData = {
        fileName: `${Date.now()}_${file.name}`,
        originalName: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        fileSize: file.size,
        mimeType: file.type,
        category: category,
        uploadedBy: currentUser.id,
        uploadedByName: currentUser.name,
        uploadedByType: isAdmin ? 'admin' : 'employee',
        description: description,
        tags: [],
        isPublic: true,
        filePath: `/uploads/${Date.now()}_${file.name}` // Mock path
      };

      const uploadedFile = addFileToAppFiles(fileData);
      uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  };

  // Splash Screen Component
  const SplashScreen = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setCurrentView('login');
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="FENIX Logo" 
              className="mx-auto w-64 h-32 object-contain animate-pulse" 
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">FENIX</h1>
          <p className="text-xl text-white/90 animate-fade-in-delay">{t('appName')}</p>
          <div className="mt-8">
            <div className="w-16 h-1 bg-white mx-auto rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  };

  // Login Component
  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
      try {
        // Validate credentials using Supabase service
        const employee = await employeeService.validateCredentials(email, password);
        
        if (employee) {
          setCurrentUser(employee);
          setIsAdmin(employee.role === 'admin');
          setCurrentView(employee.role === 'admin' ? 'admin' : 'employee');
          
          if (employee.role !== 'admin') {
            getCurrentLocation();
          }
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mb-6 relative">
              <img src="/logo.png" alt="FENIX Logo" className="mx-auto w-48 h-24 object-contain" />
              <div className="absolute top-0 right-0 transform -translate-y-1 translate-x-2">
                <LanguageSelector />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">FENIX</h1>
            <p className="text-gray-600">{t('appName')}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('emailPlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('passwordPlaceholder')}
                required
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
            >
              {t('loginButton')}
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>{t('splashSubtitle')}</p>
          </div>
        </div>
      </div>
    );
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({ error: 'Location not available' });
        }
      );
    }
  };

  // Continuous location tracking
  useEffect(() => {
    let watchId;
    
    if (navigator.geolocation) {
      // Get initial location
      getCurrentLocation();
      
      // Set up continuous location tracking
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          setLocation(newLocation);
          
          // Update employee locations for admin dashboard
          if (currentUser) {
            setEmployeeLocations(prev => ({
              ...prev,
              [currentUser.id]: newLocation
            }));
          }
        },
        (error) => {
          console.error('Error watching location:', error);
          setLocation({ error: 'Location not available' });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000 // 30 seconds
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [currentUser]);

  // Employee Dashboard Component
  const EmployeeDashboard = () => {
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [kilometers, setKilometers] = useState('');
    const [workDescription, setWorkDescription] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showEndWorkModal, setShowEndWorkModal] = useState(false);
    const [finalWorkDescription, setFinalWorkDescription] = useState('');
    const [finalPhotoTaken, setFinalPhotoTaken] = useState(false);

    const startWork = () => {
      if (!selectedVehicle) {
        setShowVehicleModal(true);
        return;
      }
      
      if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
            (position) => {
              const startLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date().toISOString()
              };
              
              const session = {
                id: Date.now(),
                employeeId: currentUser.id,
                employeeName: currentUser.name,
                startTime: new Date().toISOString(),
                startLocation: startLocation,
                vehicle: vehicles.find(v => v.id === parseInt(selectedVehicle)),
                gasAmount: parseFloat(kilometers) || 0,
                workDescription: workDescription,
                screenshots: [],
                breaks: [],
                status: 'working',
                locationHistory: [startLocation]
              };
            setWorkSession(session);
            setWorkLogs([...workLogs, session]);
          },
          (error) => {
            const startLocation = { error: 'Location not available' };
            
            const session = {
              id: Date.now(),
              employeeId: currentUser.id,
              employeeName: currentUser.name,
              startTime: new Date().toISOString(),
              startLocation: startLocation,
              vehicle: vehicles.find(v => v.id === parseInt(selectedVehicle)),
              gasAmount: parseFloat(kilometers) || 0,
              workDescription: workDescription,
              screenshots: [],
              breaks: [],
              status: 'working',
              locationHistory: [startLocation]
            };
            setWorkSession(session);
            setWorkLogs([...workLogs, session]);
          }
        );
      }
    };

    const takeBreak = () => {
      if (workSession) {
        const updatedSession = {
          ...workSession,
          breaks: [...workSession.breaks, {
            start: new Date().toISOString(),
            location: location
          }],
          status: 'break'
        };
        setWorkSession(updatedSession);
        updateWorkLog(updatedSession);
      }
    };

    const resumeWork = () => {
      if (workSession && workSession.breaks.length > 0) {
        const lastBreak = workSession.breaks[workSession.breaks.length - 1];
        lastBreak.end = new Date().toISOString();
        
        const updatedSession = {
          ...workSession,
          status: 'working'
        };
        setWorkSession(updatedSession);
        updateWorkLog(updatedSession);
      }
    };

    const endWork = () => {
      if (workSession) {
        setShowEndWorkModal(true);
      }
    };

    const confirmEndWork = () => {
      if (workSession) {
        const updatedSession = {
          ...workSession,
          endTime: new Date().toISOString(),
          endLocation: location,
          status: 'completed',
          finalWorkDescription: finalWorkDescription,
          finalPhotoTaken: finalPhotoTaken
        };
        setWorkSession(null);
        updateWorkLog(updatedSession);
        setShowEndWorkModal(false);
        setFinalWorkDescription('');
        setFinalPhotoTaken(false);
      }
    };

    const takeFinalPhoto = () => {
      // Create a file input element for camera access
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera if available
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Create a mock file data structure similar to captureScreenshot
          const finalPhotoFile = {
            id: Date.now() + Math.random(),
            fileName: `final_work_photo_${currentUser.name}_${Date.now()}.jpg`,
            originalName: `Final Work Photo - ${currentUser.name} - ${new Date().toLocaleString()}.jpg`,
            fileType: 'image',
            fileSize: file.size,
            mimeType: file.type,
            category: 'screenshot',
            uploadedBy: currentUser.id,
            uploadedByName: currentUser.name,
            uploadedByType: 'employee',
            description: `Final work completion photo taken by ${currentUser.name}`,
            tags: ['work', 'completed', 'final', 'photo', currentUser.name],
            relatedWorkSessionId: workSession?.id,
            relatedEmployeeId: currentUser.id,
            isPublic: true,
            filePath: URL.createObjectURL(file), // Create a blob URL for the file
            uploadDate: new Date().toISOString()
          };

          // Add to app files
          addFileToAppFiles(finalPhotoFile);
          
          const finalPhotoData = {
            id: finalPhotoFile.id,
            timestamp: finalPhotoFile.uploadDate,
            location: location,
            type: 'work_completed',
            fileId: finalPhotoFile.id
          };

          if (workSession) {
            const updatedSession = {
              ...workSession,
              finalPhoto: finalPhotoData
            };
            setWorkSession(updatedSession);
            updateWorkLog(updatedSession);
          }

          setFinalPhotoTaken(true);
          setTimeout(() => setFinalPhotoTaken(false), 3000);
        }
      };
      
      // Trigger the file input click to open camera
      input.click();
    };

    const updateWorkLog = (session) => {
      setWorkLogs(logs => logs.map(log => 
        log.id === session.id ? session : log
      ));
    };

    const takeScreenshot = () => {
      // Create a file input element for camera access
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera if available
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Create a mock file data structure similar to captureScreenshot
          const screenshotFile = {
            id: Date.now() + Math.random(),
            fileName: `work_photo_${currentUser.name}_${Date.now()}.jpg`,
            originalName: `Work Photo - ${currentUser.name} - ${new Date().toLocaleString()}.jpg`,
            fileType: 'image',
            fileSize: file.size,
            mimeType: file.type,
            category: 'screenshot',
            uploadedBy: currentUser.id,
            uploadedByName: currentUser.name,
            uploadedByType: 'employee',
            description: `Work progress photo taken by ${currentUser.name}`,
            tags: ['work', 'progress', 'photo', currentUser.name],
            relatedWorkSessionId: workSession?.id,
            relatedEmployeeId: currentUser.id,
            isPublic: true,
            filePath: URL.createObjectURL(file), // Create a blob URL for the file
            uploadDate: new Date().toISOString()
          };

          // Add to app files
          addFileToAppFiles(screenshotFile);
          
          const screenshotData = {
            id: screenshotFile.id,
            timestamp: screenshotFile.uploadDate,
            location: location,
            type: 'work_progress',
            fileId: screenshotFile.id
          };

          if (workSession) {
            const updatedSession = {
              ...workSession,
              screenshots: [...workSession.screenshots, screenshotData]
            };
            setWorkSession(updatedSession);
            updateWorkLog(updatedSession);
          }

          setScreenshot(screenshotData);
          setTimeout(() => setScreenshot(null), 3000);
        }
      };
      
      // Trigger the file input click to open camera
      input.click();
    };

    useEffect(() => {
      let intervalId;
      if (workSession && workSession.status === 'working') {
        intervalId = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const newLocation = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: new Date().toISOString()
                };
                setWorkSession(prev => {
                  if (!prev) return prev;
                  const updatedHistory = prev.locationHistory ? [...prev.locationHistory, newLocation] : [newLocation];
                  const updated = { ...prev, locationHistory: updatedHistory };
                  updateWorkLog(updated);
                  return updated;
                });
              }
            );
          }
        }, 10 * 60 * 1000); // every 10 minutes
      }
      return () => clearInterval(intervalId);
    }, [workSession]);

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">{t('welcome')}, {currentUser.name}</h1>
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('login');
                  setWorkSession(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('workStatus')}</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                workSession ? 
                  workSession.status === 'working' ? 'bg-green-100 text-green-800' :
                  workSession.status === 'break' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
                {workSession ? 
                  workSession.status === 'working' ? t('working') :
                  workSession.status === 'break' ? t('onBreak') : t('idle')
                : t('notStarted')}
              </div>
            </div>

            {workSession && (
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">{t('started')}:</span> {new Date(workSession.startTime).toLocaleString()}</p>
                <p><span className="font-medium">{t('vehicle')}:</span> {workSession.vehicle?.name}</p>
                <p><span className="font-medium">{t('kilometers')}:</span> {workSession.gasAmount} km</p>
                {workSession.workDescription && (
                  <div>
                    <p className="font-medium">{t('workDescription')}:</p>
                    <p className="text-gray-700 bg-gray-50 p-2 rounded mt-1">{workSession.workDescription}</p>
                  </div>
                )}
                <p><span className="font-medium">{t('photos')}:</span> {workSession.screenshots.length}</p>
                <p><span className="font-medium">{t('breaks')}:</span> {workSession.breaks.length}</p>
              </div>
            )}
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
              <MapPin className="text-orange-500 mr-2" size={20} />
              <h3 className="font-semibold">{t('currentLocation')}</h3>
            </div>
            {location ? (
              location.error ? (
                <p className="text-red-500 text-sm">{t('locationError')}</p>
              ) : (
                <p className="text-sm text-gray-600">
                  {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                </p>
              )
            ) : (
              <p className="text-gray-500 text-sm">{t('gettingLocation')}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!workSession ? (
              <button
                onClick={startWork}
                className="w-full bg-green-500 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition duration-200"
              >
                <Play size={20} />
                <span className="font-semibold">{t('startWork')}</span>
              </button>
            ) : (
              <>
                {workSession.status === 'working' ? (
                  <button
                    onClick={takeBreak}
                    className="w-full bg-yellow-500 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-600 transition duration-200"
                  >
                    <Pause size={20} />
                    <span className="font-semibold">{t('takeBreak')}</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeWork}
                    className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition duration-200"
                  >
                    <Play size={20} />
                    <span className="font-semibold">{t('resumeWork')}</span>
                  </button>
                )}

                <button
                  onClick={takeScreenshot}
                  className="w-full bg-purple-500 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-600 transition duration-200"
                >
                  <Camera size={20} />
                  <span className="font-semibold">{t('takePhotoOfWork')}</span>
                </button>

                <button
                  onClick={endWork}
                  className="w-full bg-red-500 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600 transition duration-200"
                >
                  <Square size={20} />
                  <span className="font-semibold">{t('endWork')}</span>
                </button>
              </>
            )}
          </div>

          {/* Work Documents Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <FileText className="text-blue-500 mr-2" size={20} />
                {t('workDocuments')}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.capture = 'environment';
                    input.onchange = async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          await handleFileUpload(files, 'image', `Receipt photo taken by ${currentUser.name}`);
                          alert('Photo uploaded successfully!');
                        } catch (error) {
                          console.error('Photo upload error:', error);
                          alert('Error uploading photo. Please try again.');
                        }
                      }
                    };
                    input.click();
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200 flex items-center space-x-1 text-sm"
                  title="Take photo of receipt"
                >
                  <Camera size={14} />
                  <span>{t('takePhoto')}</span>
                </button>
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx';
                    input.multiple = true;
                    input.onchange = async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          await handleFileUpload(files, 'document', `Uploaded by ${currentUser.name}`);
                          alert('Files uploaded successfully!');
                        } catch (error) {
                          console.error('File upload error:', error);
                          alert('Error uploading files. Please try again.');
                        }
                      }
                    };
                    input.click();
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 flex items-center space-x-1 text-sm"
                >
                  <Upload size={14} />
                  <span>{t('attachFile')}</span>
                </button>
              </div>
            </div>
            
            {/* Admin Documents */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{t('documentsFromAdmin')}</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {appFiles.filter(file => file.uploadedByType === 'admin' && file.status === 'active').slice(0, 5).map((file) => {
                  const FileIcon = getFileIcon(file.mimeType, file.category);
                  return (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-blue-50 rounded hover:bg-blue-100 transition duration-200">
                      <div 
                        className="flex items-center space-x-2 flex-1 cursor-pointer"
                        onClick={() => openFile(file)}
                        title="Click to open file"
                      >
                        <FileIcon 
                          size={16} 
                          className="text-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-32 hover:text-blue-600">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.fileSize)} • {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                          {file.description && (
                            <p className="text-xs text-gray-400 truncate max-w-40">
                              {file.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFile(file);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-500 transition duration-200"
                          title="View file"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(file);
                          }}
                          className="p-1 text-gray-500 hover:text-green-500 transition duration-200"
                          title="Download file"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {appFiles.filter(file => file.uploadedByType === 'admin' && file.status === 'active').length === 0 && (
                  <div className="text-center py-2 text-gray-500">
                    <p className="text-sm">{t('noFilesFound')}</p>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* My Files Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <FileText className="text-orange-500 mr-2" size={20} />
                {t('myFiles')}
              </h3>
              <span className="text-sm text-gray-500">
                {getFilesByUser(currentUser.id, 'employee').length} {t('filesCount')}
              </span>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {getFilesByUser(currentUser.id, 'employee').slice(0, 10).map((file) => {
                const FileIcon = getFileIcon(file.mimeType, file.category);
                return (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition duration-200">
                    <div 
                      className="flex items-center space-x-2 flex-1 cursor-pointer"
                      onClick={() => openFile(file)}
                      title="Click to open file"
                    >
                      <FileIcon 
                        size={16} 
                        className={file.category === 'screenshot' ? 'text-purple-500' : 'text-gray-500'}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32 hover:text-blue-600">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.fileSize)} • {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                        {file.description && (
                          <p className="text-xs text-gray-400 truncate max-w-40">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFile(file);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-500 transition duration-200"
                        title="View file"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(file);
                        }}
                        className="p-1 text-gray-500 hover:text-green-500 transition duration-200"
                        title="Download file"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {getFilesByUser(currentUser.id, 'employee').length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Camera size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{t('noFilesYet')}</p>
                  <p className="text-xs">{t('takePhotosHint')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weather Widget - Moved to bottom */}
        <div className="mt-4">
          <WeatherWidget location={location ? `${location.latitude?.toFixed(2)}, ${location.longitude?.toFixed(2)}` : 'Current Location'} />
        </div>

        {/* Vehicle Selection Modal */}
        {showVehicleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Select Vehicle & Gas</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.license_plate})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Details Section */}
                {selectedVehicle && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Vehicle Details</h4>
                    {(() => {
                      const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicle));
                      if (!vehicle) return null;
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Name:</span>
                              <span className="text-sm font-medium">{vehicle.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">License Plate:</span>
                              <span className="text-sm font-medium">{vehicle.license_plate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Make:</span>
                              <span className="text-sm font-medium">{vehicle.make || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Model:</span>
                              <span className="text-sm font-medium">{vehicle.model || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Year:</span>
                              <span className="text-sm font-medium">{vehicle.year || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Color:</span>
                              <span className="text-sm font-medium">{vehicle.color || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Type:</span>
                              <span className="text-sm font-medium">{vehicle.type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Status:</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                                vehicle.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {vehicle.status || 'active'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kilometers</label>
                  <input
                    type="number"
                    value={kilometers}
                    onChange={(e) => setKilometers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter kilometers"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
                  <textarea
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe your work for today..."
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowVehicleModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedVehicle) {
                        setShowVehicleModal(false);
                        startWork();
                      }
                    }}
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
                  >
                    Start Work
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Work Photo Notification */}
        {screenshot && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <Camera size={16} />
              <span>Work photo captured and uploaded!</span>
            </div>
          </div>
        )}

        {/* End Work Modal */}
        {showEndWorkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Complete Work Session</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Completed Today</label>
                  <textarea
                    value={finalWorkDescription}
                    onChange={(e) => setFinalWorkDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe what work was completed today..."
                    rows="4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Final Work Photo</p>
                    <p className="text-xs text-gray-500">Take a photo of the completed work</p>
                  </div>
                  <button
                    onClick={takeFinalPhoto}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-200 flex items-center space-x-2"
                  >
                    <Camera size={16} />
                    <span>Take Photo</span>
                  </button>
                </div>

                {finalPhotoTaken && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                    <div className="flex items-center space-x-2">
                      <Camera size={16} />
                      <span>Final photo captured!</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEndWorkModal(false);
                      setFinalWorkDescription('');
                      setFinalPhotoTaken(false);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEndWork}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                  >
                    Complete Work
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    // Get current language to ensure component re-renders when language changes
    const { currentLanguage } = useI18n();
    const calculateWorkHours = (log) => {
      if (!log.startTime || !log.endTime) return 0;
      
      const start = new Date(log.startTime);
      const end = new Date(log.endTime);
      const totalMs = end - start;
      
      const breakMs = log.breaks.reduce((total, breakItem) => {
        if (breakItem.start && breakItem.end) {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          return total + (breakEnd - breakStart);
        }
        return total;
      }, 0);
      
      return Math.max(0, (totalMs - breakMs) / (1000 * 60 * 60));
    };

    const getTotalHoursThisMonth = (employeeId) => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      return workLogs
        .filter(log => {
          const logDate = new Date(log.startTime);
          return log.employeeId === employeeId && 
                 logDate.getMonth() === currentMonth && 
                 logDate.getFullYear() === currentYear &&
                 log.status === 'completed';
        })
        .reduce((total, log) => total + calculateWorkHours(log), 0);
    };

    const OverviewTab = () => (
      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('activeWorkers')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workLogs.filter(log => log.status === 'working' || log.status === 'break').length}
                </p>
              </div>
              <Users className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('totalHoursToday')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workLogs
                    .filter(log => {
                      const today = new Date().toDateString();
                      return new Date(log.startTime).toDateString() === today;
                    })
                    .reduce((total, log) => total + calculateWorkHours(log), 0)
                    .toFixed(1)}
                </p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('completedJobs')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workLogs.filter(log => log.status === 'completed').length}
                </p>
              </div>
              <BarChart3 className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        {/* Weather Forecast for Work Planning */}
        <WeatherWidget location="Skopje, Macedonia" />

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">{t('recentActivity')}</h3>
          </div>
          <div className="divide-y">
            {workLogs.slice(-5).reverse().map((log, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{log.employeeName}</p>
                    <p className="text-sm text-gray-600">
                      {log.status === 'completed' ? t('completedWork') : 
                       log.status === 'working' ? t('startedWork') : t('onBreakStatus')}
                    </p>
                    {log.workDescription && (
                      <p className="text-xs text-gray-500 mt-1">{log.workDescription}</p>
                    )}
                    
                    {/* Location Information */}
                    <div className="mt-2 space-y-1">
                      {log.startLocation && !log.startLocation.error && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1 text-orange-500" />
                          <span className="font-medium">Start:</span>
                          <span className="ml-1">
                            {log.startLocation.latitude?.toFixed(6)}, {log.startLocation.longitude?.toFixed(6)}
                          </span>
                        </div>
                      )}
                      {log.endLocation && !log.endLocation.error && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1 text-red-500" />
                          <span className="font-medium">End:</span>
                          <span className="ml-1">
                            {log.endLocation.latitude?.toFixed(6)}, {log.endLocation.longitude?.toFixed(6)}
                          </span>
                        </div>
                      )}
                      {log.startLocation?.error && (
                        <div className="flex items-center text-xs text-red-500">
                          <MapPin size={12} className="mr-1" />
                          <span>Start location unavailable</span>
                        </div>
                      )}
                      {log.endLocation?.error && (
                        <div className="flex items-center text-xs text-red-500">
                          <MapPin size={12} className="mr-1" />
                          <span>End location unavailable</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600">
                      {new Date(log.startTime).toLocaleString()}
                    </p>
                    {log.status === 'completed' && (
                      <p className="text-sm font-medium text-green-600">
                        {calculateWorkHours(log).toFixed(1)}h
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const EmployeesTab = () => {
      const [showEmployeeModal, setShowEmployeeModal] = useState(false);
      const [editingEmployee, setEditingEmployee] = useState(null);
      const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: 'worker' });

      const openAddEmployee = (role = 'worker') => {
        setEditingEmployee(null);
        setNewEmployee({ name: '', email: '', password: '', role });
        setShowEmployeeModal(true);
      };
      const openEditEmployee = (emp) => {
        setEditingEmployee(emp);
        setNewEmployee({ ...emp });
        setShowEmployeeModal(true);
      };
      const handleEmployeeSave = async () => {
        try {
          console.log('Starting employee save process...');
          console.log('Current newEmployee state:', newEmployee);
          
          // Validate required fields
          if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
            alert('Please fill in all required fields: Name, Email, and Password');
            return;
          }
          
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(newEmployee.email)) {
            alert('Please enter a valid email address');
            return;
          }
          
          if (editingEmployee) {
            // Update existing employee
            console.log('Updating existing employee:', editingEmployee.id);
            const updatedEmployee = await employeeService.updateEmployee(editingEmployee.id, newEmployee);
            if (updatedEmployee) {
              setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
              alert('Employee updated successfully');
            }
          } else {
            // Create new employee
            console.log('Creating new employee...');
            const employeeData = {
              ...newEmployee,
              status: 'active',
              department: 'Construction'
            };
            console.log('Employee data to create:', employeeData);
            const createdEmployee = await employeeService.createEmployee(employeeData);
            if (createdEmployee) {
              setEmployees(prev => [...prev, createdEmployee]);
              alert('Employee added successfully');
            }
          }
          setShowEmployeeModal(false);
        } catch (error) {
          console.error('Error saving employee:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          alert(`Error saving employee: ${error.message || 'Please try again.'}`);
        }
      };
      const handleEmployeeDelete = async (id) => {
        if (window.confirm('Delete this employee/admin?')) {
          try {
            await employeeService.deleteEmployee(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            alert('Employee deleted successfully');
          } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Error deleting employee. Please try again.');
          }
        }
      };

      const getCurrentLocationForEmployee = (employeeId) => {
        const activeSession = workLogs.find(log => 
          log.employeeId === employeeId && 
          (log.status === 'working' || log.status === 'break') &&
          log.locationHistory && 
          log.locationHistory.length > 0
        );
        
        if (activeSession && activeSession.locationHistory.length > 0) {
          const lastLocation = activeSession.locationHistory[activeSession.locationHistory.length - 1];
          return lastLocation;
        }
        return null;
      };

      return (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button onClick={() => openAddEmployee('worker')} className="bg-orange-500 text-white px-3 py-2 rounded">Add Worker</button>
          </div>
          {employees.map(employee => {
            const currentLocation = getCurrentLocationForEmployee(employee.id);
            const activeSession = workLogs.find(log => 
              log.employeeId === employee.id && 
              (log.status === 'working' || log.status === 'break')
            );
            
            return (
              <div key={employee.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{employee.name}</h3>
                    <p className="text-gray-600">{employee.email}</p>
                    {currentLocation && currentLocation.latitude ? (
                      <div className="mt-2 flex items-center">
                        <MapPin className="text-orange-500 mr-1" size={14} />
                        <span className="text-xs text-gray-600">
                          {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({new Date(currentLocation.timestamp).toLocaleTimeString()})
                        </span>
                      </div>
                    ) : activeSession ? (
                      <div className="mt-2 flex items-center">
                        <MapPin className="text-red-500 mr-1" size={14} />
                        <span className="text-xs text-red-500">Location unavailable</span>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center">
                        <MapPin className="text-gray-400 mr-1" size={14} />
                        <span className="text-xs text-gray-400">Not working</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {getTotalHoursThisMonth(employee.id).toFixed(1)}h
                    </p>
                    {activeSession && (
                      <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        activeSession.status === 'working' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activeSession.status === 'working' ? 'Working' : 'On Break'}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => openEditEmployee(employee)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleEmployeeDelete(employee.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </div>
                  </div>
                </div>
                
                {/* Simplified Work Logs */}
                <div className="space-y-2">
                  {workLogs
                    .filter(log => log.employeeId === employee.id)
                    .slice(-3)
                    .map((log, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between text-sm border-b py-2">
                        <div className="flex-1">
                          <span>{new Date(log.startTime).toLocaleDateString()}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            log.status === 'completed' ? 'bg-green-100 text-green-800' :
                            log.status === 'working' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.status === 'completed' ? `${calculateWorkHours(log).toFixed(1)}h` : log.status}
                          </span>
                          {log.workDescription && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Work: {log.workDescription}</p>
                            </div>
                          )}
                        </div>

                        {/* Optionally show location history snippet */}
                        {log.locationHistory && log.locationHistory.length > 1 && (
                          <div className="mt-2">
                            <span className="block text-xs text-gray-500 mb-1">Location History:</span>
                            <ul className="text-xs text-gray-700 list-disc ml-4">
                              {log.locationHistory.map((loc, idx) => (
                                <li key={idx}>
                                  {loc.latitude ? `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}` : loc.error || 'No location'} ({new Date(loc.timestamp).toLocaleTimeString()})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
          {showEmployeeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{editingEmployee ? 'Edit' : 'Add'} {newEmployee.role === 'admin' ? 'Admin' : 'Worker'}</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Name" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
                  <input type="email" placeholder="Email" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} className="w-full border px-3 py-2 rounded" />
                  <input type="password" placeholder="Password" value={newEmployee.password} onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })} className="w-full border px-3 py-2 rounded" />
                  <select value={newEmployee.role} onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} className="w-full border px-3 py-2 rounded">
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleEmployeeSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setShowEmployeeModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const VehiclesTab = () => {
      const [showVehicleModal, setShowVehicleModal] = useState(false);
      const [editingVehicle, setEditingVehicle] = useState(null);
      const [newVehicle, setNewVehicle] = useState({ name: '', license_plate: '' });
      const [exportDate, setExportDate] = useState(() => new Date().toISOString().slice(0, 10));
      const [exportVehicle, setExportVehicle] = useState(null);
      const [showExportChoice, setShowExportChoice] = useState(false);

      const openAddVehicle = () => {
        setEditingVehicle(null);
        setNewVehicle({ name: '', license_plate: '' });
        setShowVehicleModal(true);
      };
      const openEditVehicle = (veh) => {
        setEditingVehicle(veh);
        setNewVehicle({ ...veh });
        setShowVehicleModal(true);
      };
      const handleVehicleSave = async () => {
        try {
          if (editingVehicle) {
            // Update existing vehicle
            const updatedVehicle = await vehicleService.updateVehicle(editingVehicle.id, newVehicle);
            if (updatedVehicle) {
              setVehicles(prev => prev.map(veh => veh.id === editingVehicle.id ? updatedVehicle : veh));
              alert('Vehicle updated successfully');
            }
          } else {
            // Create new vehicle
            const vehicleData = {
              ...newVehicle,
              status: 'active'
            };
            const createdVehicle = await vehicleService.createVehicle(vehicleData);
            if (createdVehicle) {
              setVehicles(prev => [...prev, createdVehicle]);
              alert('Vehicle added successfully');
            }
          }
          setShowVehicleModal(false);
        } catch (error) {
          console.error('Error saving vehicle:', error);
          alert('Error saving vehicle. Please try again.');
        }
      };
      const handleVehicleDelete = async (id) => {
        if (window.confirm('Delete this vehicle?')) {
          try {
            await vehicleService.deleteVehicle(id);
            setVehicles(prev => prev.filter(veh => veh.id !== id));
            alert('Vehicle deleted successfully');
          } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Error deleting vehicle. Please try again.');
          }
        }
      };

      const openExportChoice = (vehicle) => {
        setExportVehicle(vehicle);
        setShowExportChoice(true);
      };
      const closeExportChoice = () => {
        setExportVehicle(null);
        setShowExportChoice(false);
      };

      const exportVehicleDataExcel = (vehicle) => {
        const logs = workLogs.filter(log =>
          log.vehicle?.id === vehicle.id &&
          new Date(log.startTime).toISOString().slice(0, 10) === exportDate
        );
        const data = logs.map(log => ({
          Employee: log.employeeName,
          Date: new Date(log.startTime).toLocaleDateString(),
          'Start Time': new Date(log.startTime).toLocaleTimeString(),
          'End Time': new Date(log.endTime).toLocaleTimeString(),
          Kilometers: log.kilometers || '',
          'Location Tag': log.locationTag || '',
        }));
        const sheetName = vehicle.name.replace(/\s+/g, '_') + '_Data';
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${vehicle.name.replace(/\s+/g, '_')}_${exportDate}_data.xlsx`);
        closeExportChoice();
      };
      const exportVehicleDataPDF = (vehicle) => {
        const logs = workLogs.filter(log =>
          log.vehicle?.id === vehicle.id &&
          new Date(log.startTime).toISOString().slice(0, 10) === exportDate
        );
        const data = logs.map(log => ({
          Employee: log.employeeName,
          Date: new Date(log.startTime).toLocaleDateString(),
          'Start Time': new Date(log.startTime).toLocaleTimeString(),
          'End Time': new Date(log.endTime).toLocaleTimeString(),
          Kilometers: log.kilometers || '',
          'Location Tag': log.locationTag || '',
        }));
        const doc = new jsPDF();
        const tableData = data.map(row => [row.Employee, row.Date, row['Start Time'], row['End Time'], row.Kilometers, row['Location Tag']]);
        autoTable(doc, {
          head: [['Employee', 'Date', 'Start Time', 'End Time', 'Kilometers', 'Location Tag']],
          body: tableData
        });
        doc.save(`${vehicle.name.replace(/\s+/g, '_')}_${exportDate}_data.pdf`);
        closeExportChoice();
      };

      return (
        <div className="space-y-6">
          <div className="flex gap-2 mb-4">
            <button onClick={openAddVehicle} className="bg-orange-500 text-white px-3 py-2 rounded">Add Vehicle</button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Fleet</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Date:</label>
              <input
                type="date"
                value={exportDate}
                onChange={e => setExportDate(e.target.value)}
                className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Car className="text-orange-500 mr-2" size={20} />
                      <h4 className="font-semibold">{vehicle.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditVehicle(vehicle)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleVehicleDelete(vehicle.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      <button
                        onClick={() => openExportChoice(vehicle)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Plate: {vehicle.license_plate}</p>
                    {vehicle.make && vehicle.model && (
                      <p className="text-gray-600">{vehicle.make} {vehicle.model}</p>
                    )}
                    {vehicle.year && (
                      <p className="text-gray-600">Year: {vehicle.year}</p>
                    )}
                    {vehicle.color && (
                      <p className="text-gray-600">Color: {vehicle.color}</p>
                    )}
                    {vehicle.type && (
                      <p className="text-gray-600">Type: {vehicle.type}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        vehicle.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : vehicle.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showVehicleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">{editingVehicle ? 'Edit' : 'Add'} Vehicle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Pickup Truck 1" 
                        value={newVehicle.name} 
                        onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Plate *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., ABC-123" 
                        value={newVehicle.license_plate} 
                        onChange={e => setNewVehicle({ ...newVehicle, license_plate: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Ford, Toyota" 
                        value={newVehicle.make || ''} 
                        onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input 
                        type="text" 
                        placeholder="e.g., F-150, Tacoma" 
                        value={newVehicle.model || ''} 
                        onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input 
                        type="number" 
                        placeholder="e.g., 2020" 
                        value={newVehicle.year || ''} 
                        onChange={e => setNewVehicle({ ...newVehicle, year: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        min="1900"
                        max="2030"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <input 
                        type="text" 
                        placeholder="e.g., White, Black" 
                        value={newVehicle.color || ''} 
                        onChange={e => setNewVehicle({ ...newVehicle, color: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select 
                        value={newVehicle.type || ''} 
                        onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select type</option>
                        <option value="pickup">Pickup Truck</option>
                        <option value="van">Van</option>
                        <option value="truck">Truck</option>
                        <option value="car">Car</option>
                        <option value="suv">SUV</option>
                        <option value="trailer">Trailer</option>
                        <option value="excavator">Excavator</option>
                        <option value="bulldozer">Bulldozer</option>
                        <option value="crane">Crane</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        value={newVehicle.status || 'active'} 
                        onChange={e => setNewVehicle({ ...newVehicle, status: e.target.value })} 
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out_of_service">Out of Service</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={handleVehicleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">Save Vehicle</button>
                  <button onClick={() => setShowVehicleModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200">Cancel</button>
                </div>
              </div>
            </div>
          )}
          {showExportChoice && exportVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xs text-center">
                <h3 className="text-lg font-semibold mb-4">Export {exportVehicle.name}</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={() => exportVehicleDataExcel(exportVehicle)} className="bg-green-500 text-white px-4 py-2 rounded">Export as Excel</button>
                  <button onClick={() => exportVehicleDataPDF(exportVehicle)} className="bg-blue-500 text-white px-4 py-2 rounded">Export as PDF</button>
                  <button onClick={closeExportChoice} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const MaterialsTab = () => {
      const [showMaterialModal, setShowMaterialModal] = useState(false);
      const [editingMaterial, setEditingMaterial] = useState(null);
      const [newMaterial, setNewMaterial] = useState({ 
        name: '', 
        quantity: '', 
        unit: 'pieces', 
        price: '', 
        project: '', 
        worksite: '', 
        purchaseDate: new Date().toISOString().slice(0, 10), 
        supplier: '', 
        description: '',
        receiptFile: null
      });
      const [exportDate, setExportDate] = useState(() => new Date().toISOString().slice(0, 10));
      const [exportWorksite, setExportWorksite] = useState('');
      const [showExportModal, setShowExportModal] = useState(false);
      const [filterProject, setFilterProject] = useState('');
      const [filterWorksite, setFilterWorksite] = useState('');
      const [filterSupplier, setFilterSupplier] = useState('');

      const openAddMaterial = () => {
        setEditingMaterial(null);
        setNewMaterial({ 
          name: '', 
          quantity: '', 
          unit: 'pieces', 
          price: '', 
          project: '', 
          worksite: '', 
          purchaseDate: new Date().toISOString().slice(0, 10), 
          supplier: '', 
          description: '',
          receiptFile: null
        });
        setShowMaterialModal(true);
      };

      const openEditMaterial = (material) => {
        setEditingMaterial(material);
        setNewMaterial({ ...material });
        setShowMaterialModal(true);
      };

      const handleMaterialSave = () => {
        if (editingMaterial) {
          setMaterials(prev => prev.map(mat => mat.id === editingMaterial.id ? { ...editingMaterial, ...newMaterial } : mat));
        } else {
          setMaterials(prev => [...prev, { ...newMaterial, id: Date.now() }]);
        }
        setShowMaterialModal(false);
      };

      const handleMaterialDelete = (id) => {
        if (window.confirm('Delete this material?')) {
          setMaterials(prev => prev.filter(mat => mat.id !== id));
        }
      };

      const handleReceiptUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          try {
            const uploadedFiles = await handleFileUpload(files, 'receipt', `Receipt for ${newMaterial.name}`);
            setNewMaterial(prev => ({ ...prev, receiptFile: uploadedFiles[0] }));
          } catch (error) {
            console.error('Receipt upload error:', error);
          }
        }
      };

      const getFilteredMaterials = () => {
        let filtered = materials;
        
        if (filterProject) {
          filtered = filtered.filter(mat => mat.project.toLowerCase().includes(filterProject.toLowerCase()));
        }
        if (filterWorksite) {
          filtered = filtered.filter(mat => mat.worksite.toLowerCase().includes(filterWorksite.toLowerCase()));
        }
        if (filterSupplier) {
          filtered = filtered.filter(mat => mat.supplier.toLowerCase().includes(filterSupplier.toLowerCase()));
        }
        
        return filtered.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
      };

      const exportMaterialsByDate = (format = 'excel') => {
        const filteredMaterials = materials.filter(mat => 
          new Date(mat.purchaseDate).toISOString().slice(0, 10) === exportDate
        );
        
        const data = filteredMaterials.map(mat => ({
          Name: mat.name,
          Quantity: mat.quantity,
          Unit: mat.unit,
          Price: mat.price,
          'Total Cost': (mat.quantity * mat.price).toFixed(2),
          Project: mat.project,
          Worksite: mat.worksite,
          'Purchase Date': mat.purchaseDate,
          Supplier: mat.supplier,
          Description: mat.description
        }));

        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Materials_Data');
          XLSX.writeFile(wb, `Materials_${exportDate}.xlsx`);
        } else {
          const doc = new jsPDF();
          const tableData = data.map(row => [
            row.Name, row.Quantity, row.Unit, row.Price, row['Total Cost'], 
            row.Project, row.Worksite, row['Purchase Date'], row.Supplier
          ]);
          autoTable(doc, {
            head: [['Name', 'Quantity', 'Unit', 'Price', 'Total Cost', 'Project', 'Worksite', 'Purchase Date', 'Supplier']],
            body: tableData
          });
          doc.save(`Materials_${exportDate}.pdf`);
        }
        setShowExportModal(false);
      };

      const exportMaterialsByWorksite = (format = 'excel') => {
        const filteredMaterials = materials.filter(mat => mat.worksite === exportWorksite);
        
        const data = filteredMaterials.map(mat => ({
          Name: mat.name,
          Quantity: mat.quantity,
          Unit: mat.unit,
          Price: mat.price,
          'Total Cost': (mat.quantity * mat.price).toFixed(2),
          Project: mat.project,
          Worksite: mat.worksite,
          'Purchase Date': mat.purchaseDate,
          Supplier: mat.supplier,
          Description: mat.description
        }));

        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Materials_Data');
          XLSX.writeFile(wb, `Materials_${exportWorksite.replace(/\s+/g, '_')}.xlsx`);
        } else {
          const doc = new jsPDF();
          const tableData = data.map(row => [
            row.Name, row.Quantity, row.Unit, row.Price, row['Total Cost'], 
            row.Project, row.Worksite, row['Purchase Date'], row.Supplier
          ]);
          autoTable(doc, {
            head: [['Name', 'Quantity', 'Unit', 'Price', 'Total Cost', 'Project', 'Worksite', 'Purchase Date', 'Supplier']],
            body: tableData
          });
          doc.save(`Materials_${exportWorksite.replace(/\s+/g, '_')}.pdf`);
        }
        setShowExportModal(false);
      };

      const filteredMaterials = getFilteredMaterials();
      const totalValue = filteredMaterials.reduce((sum, mat) => sum + (mat.quantity * mat.price), 0);

      return (
        <div className="space-y-6">
          {/* Header with Add Button and Export */}
          <div className="flex justify-between items-center">
            <button onClick={openAddMaterial} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200 flex items-center space-x-2">
              <Package size={16} />
              <span>Add Material</span>
            </button>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowExportModal(true)} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredMaterials.length}</p>
                </div>
                <Package className="text-orange-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalValue.toFixed(2)}</p>
                </div>
                <BarChart3 className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{materials
                      .filter(mat => {
                        const purchaseDate = new Date(mat.purchaseDate);
                        const now = new Date();
                        return purchaseDate.getMonth() === now.getMonth() && 
                               purchaseDate.getFullYear() === now.getFullYear();
                      })
                      .reduce((sum, mat) => sum + (mat.quantity * mat.price), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project:</label>
                <input
                  type="text"
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  placeholder="Filter by project..."
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Worksite:</label>
                <input
                  type="text"
                  value={filterWorksite}
                  onChange={(e) => setFilterWorksite(e.target.value)}
                  placeholder="Filter by worksite..."
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier:</label>
                <input
                  type="text"
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  placeholder="Filter by supplier..."
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Materials List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Materials Inventory</h3>
            </div>
            <div className="divide-y">
              {filteredMaterials.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No materials found for the selected filters.</p>
                </div>
              ) : (
                filteredMaterials.map((material) => (
                  <div key={material.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Package className="text-orange-500" size={20} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{material.name}</h4>
                            <p className="text-sm text-gray-600">
                              {material.quantity} {material.unit} • €{material.price} each • Total: €{(material.quantity * material.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Project:</span> {material.project}
                          </div>
                          <div>
                            <span className="font-medium">Worksite:</span> {material.worksite}
                          </div>
                          <div>
                            <span className="font-medium">Supplier:</span> {material.supplier}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {material.purchaseDate}
                          </div>
                        </div>
                        {material.description && (
                          <p className="text-sm text-gray-600 mt-2">{material.description}</p>
                        )}
                        {material.receiptFile && (
                          <div className="mt-2">
                            <button
                              onClick={() => openFile(material.receiptFile)}
                              className="text-blue-500 hover:text-blue-700 text-sm flex items-center space-x-1"
                            >
                              <FileText size={14} />
                              <span>View Receipt</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => openEditMaterial(material)} 
                          className="bg-yellow-400 text-white px-3 py-1 rounded text-sm hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleMaterialDelete(material.id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add/Edit Material Modal */}
          {showMaterialModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">{editingMaterial ? 'Edit' : 'Add'} Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material Name:</label>
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Cement Bags"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                    <input
                      type="number"
                      value={newMaterial.quantity}
                      onChange={e => setNewMaterial({ ...newMaterial, quantity: parseFloat(e.target.value) || '' })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit:</label>
                    <select
                      value={newMaterial.unit}
                      onChange={e => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="bags">Bags</option>
                      <option value="kg">Kilograms</option>
                      <option value="tons">Tons</option>
                      <option value="liters">Liters</option>
                      <option value="meters">Meters</option>
                      <option value="boxes">Boxes</option>
                      <option value="pallets">Pallets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (€):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMaterial.price}
                      onChange={e => setNewMaterial({ ...newMaterial, price: parseFloat(e.target.value) || '' })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="15.50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project:</label>
                    <input
                      type="text"
                      value={newMaterial.project}
                      onChange={e => setNewMaterial({ ...newMaterial, project: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Skopje Mall Construction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Worksite:</label>
                    <input
                      type="text"
                      value={newMaterial.worksite}
                      onChange={e => setNewMaterial({ ...newMaterial, worksite: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Skopje Center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date:</label>
                    <input
                      type="date"
                      value={newMaterial.purchaseDate}
                      onChange={e => setNewMaterial({ ...newMaterial, purchaseDate: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier:</label>
                    <input
                      type="text"
                      value={newMaterial.supplier}
                      onChange={e => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Beton Pro"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                    <textarea
                      value={newMaterial.description}
                      onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      placeholder="Additional details about the material..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt:</label>
                    <input
                      type="file"
                      onChange={handleReceiptUpload}
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    {newMaterial.receiptFile && (
                      <p className="text-sm text-green-600 mt-1">✓ Receipt uploaded: {newMaterial.receiptFile.originalName}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={handleMaterialSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Save
                  </button>
                  <button onClick={() => setShowMaterialModal(false)} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export Modal */}
          {showExportModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Export Materials</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Export by Date:</label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={exportDate}
                        onChange={e => setExportDate(e.target.value)}
                        className="flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button 
                        onClick={() => exportMaterialsByDate('excel')}
                        className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 text-sm"
                      >
                        Excel
                      </button>
                      <button 
                        onClick={() => exportMaterialsByDate('pdf')}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Export by Worksite:</label>
                    <div className="flex space-x-2">
                      <select
                        value={exportWorksite}
                        onChange={e => setExportWorksite(e.target.value)}
                        className="flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select worksite...</option>
                        {[...new Set(materials.map(mat => mat.worksite))].map(worksite => (
                          <option key={worksite} value={worksite}>{worksite}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => exportMaterialsByWorksite('excel')}
                        className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 text-sm"
                      >
                        Excel
                      </button>
                      <button 
                        onClick={() => exportMaterialsByWorksite('pdf')}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => setShowExportModal(false)} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const WorkFilesTab = () => {
      const [fileFilter, setFileFilter] = useState('all');
      const [selectedFiles, setSelectedFiles] = useState([]);
      const [uploadDescription, setUploadDescription] = useState('');
      const [uploadCategory, setUploadCategory] = useState('document');

      const handleFileUploadClick = () => {
        fileInputRef.current?.click();
      };

      const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          try {
            await handleFileUpload(files, uploadCategory, uploadDescription);
            setUploadDescription('');
            e.target.value = ''; // Reset file input
          } catch (error) {
            console.error('File upload error:', error);
          }
        }
      };

      const handleBulkDelete = () => {
        if (selectedFiles.length > 0 && window.confirm(`Delete ${selectedFiles.length} selected files?`)) {
          selectedFiles.forEach(fileId => removeFileFromAppFiles(fileId));
          setSelectedFiles([]);
        }
      };

      const toggleFileSelection = (fileId) => {
        setSelectedFiles(prev => 
          prev.includes(fileId) 
            ? prev.filter(id => id !== fileId)
            : [...prev, fileId]
        );
      };

      const getFilteredFiles = () => {
        let filtered = appFiles.filter(file => file.status === 'active');
        
        if (fileFilter === 'screenshots') {
          filtered = filtered.filter(file => file.category === 'screenshot');
        } else if (fileFilter === 'documents') {
          filtered = filtered.filter(file => file.category === 'document');
        } else if (fileFilter === 'images') {
          filtered = filtered.filter(file => file.fileType === 'image' && file.category !== 'screenshot');
        }
        
        return filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      };

      const filteredFiles = getFilteredFiles();

      return (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="report">Report</option>
                    <option value="contract">Contract</option>
                    <option value="invoice">Invoice</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                  <input
                    type="text"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleFileUploadClick}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200 flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Upload Files</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                />
                <span className="text-sm text-gray-500">
                  Supports: PDF, Office documents, images
                </span>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter:</label>
                  <select
                    value={fileFilter}
                    onChange={(e) => setFileFilter(e.target.value)}
                    className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Files</option>
                    <option value="screenshots">Screenshots</option>
                    <option value="documents">Documents</option>
                    <option value="images">Images</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  Total: {filteredFiles.length} files
                </div>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedFiles.length} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 flex items-center space-x-1"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Files List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Files</h3>
            </div>
            <div className="divide-y">
              {filteredFiles.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <File size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No files found for the selected filter.</p>
                </div>
              ) : (
                filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mimeType, file.category);
                  return (
                    <div key={file.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <div 
                            className="flex items-center space-x-3 flex-1 cursor-pointer"
                            onClick={() => openFile(file)}
                            title="Click to open file"
                          >
                            <FileIcon 
                              size={24} 
                              className={`${
                                file.category === 'screenshot' ? 'text-purple-500' :
                                file.fileType === 'image' ? 'text-blue-500' :
                                'text-gray-500'
                              }`}
                            />
                            <div>
                              <p className="font-medium text-gray-900 hover:text-blue-600 transition duration-200">{file.originalName}</p>
                              <div className="text-sm text-gray-500 space-x-2">
                                <span>{formatFileSize(file.fileSize)}</span>
                                <span>•</span>
                                <span className="capitalize">{file.category}</span>
                                <span>•</span>
                                <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                              </div>
                              {file.description && (
                                <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                              )}
                              {file.relatedWorkSessionId && (
                                <p className="text-xs text-orange-600 mt-1">
                                  📋 Related to work session #{file.relatedWorkSessionId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <p className="text-gray-600">
                              {file.uploadedByName} ({file.uploadedByType})
                            </p>
                            <p className="text-gray-500">
                              {new Date(file.uploadDate).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openFile(file);
                              }}
                              className="p-1 text-gray-500 hover:text-blue-500 transition duration-200"
                              title="View file"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(file);
                              }}
                              className="p-1 text-gray-500 hover:text-green-500 transition duration-200"
                              title="Download file"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete "${file.originalName}"?`)) {
                                  removeFileFromAppFiles(file.id);
                                }
                              }}
                              className="p-1 text-gray-500 hover:text-red-500 transition duration-200"
                              title="Delete file"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    };

    const ReportsTab = () => {
      const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
      const [showExportChoice, setShowExportChoice] = useState(false);
      const [showWorkerExportChoice, setShowWorkerExportChoice] = useState(false);
      const [selectedWorker, setSelectedWorker] = useState(null);

      const getReportData = () => {
        // Filter workLogs for the selected date
        const logsForDate = workLogs.filter(log =>
          log.status === 'completed' &&
          new Date(log.startTime).toISOString().slice(0, 10) === reportDate
        );
        // Aggregate by employee
        return employees.map(employee => {
          const empLogs = logsForDate.filter(log => log.employeeId === employee.id);
          const totalHours = empLogs.reduce((sum, log) => sum + calculateWorkHours(log), 0);
          const daysWorked = new Set(empLogs.map(log => new Date(log.startTime).toDateString())).size;
          const avgHours = daysWorked > 0 ? totalHours / daysWorked : 0;
          return {
            Employee: employee.name,
            EmployeeId: employee.id,
            'Total Hours': totalHours.toFixed(1),
            'Days Worked': daysWorked,
            'Avg Hours/Day': avgHours.toFixed(1)
          };
        });
      };

      const exportReportExcel = () => {
        const data = getReportData();
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `report_${reportDate}.xlsx`);
        setShowExportChoice(false);
      };
      const exportReportPDF = () => {
        const data = getReportData();
        const doc = new jsPDF();
        const tableData = data.map(row => [row.Employee, row['Total Hours'], row['Days Worked'], row['Avg Hours/Day']]);
        autoTable(doc, {
          head: [['Employee', 'Total Hours', 'Days Worked', 'Avg Hours/Day']],
          body: tableData
        });
        doc.save(`report_${reportDate}.pdf`);
        setShowExportChoice(false);
      };

      const exportWorkerReport = (employeeName, employeeId, format = 'excel') => {
        // Filter workLogs for the specific employee and date
        const logsForDate = workLogs.filter(log =>
          log.status === 'completed' &&
          log.employeeId === employeeId &&
          new Date(log.startTime).toISOString().slice(0, 10) === reportDate
        );
        
        const data = logsForDate.map(log => ({
          'Start Time': new Date(log.startTime).toLocaleString(),
          'End Time': new Date(log.endTime).toLocaleString(),
          'Work Description': log.workDescription || '',
          'Vehicle': log.vehicle ? `${log.vehicle.name} (${log.vehicle.license_plate})` : '',
          'Gas Used (km)': log.gasAmount || '',
          'Breaks': log.breaks.length,
          'Total Hours': calculateWorkHours(log).toFixed(1),
          'Location': log.startLocation?.latitude ? `${log.startLocation.latitude.toFixed(4)}, ${log.startLocation.longitude.toFixed(4)}` : 'N/A'
        }));

        if (format === 'excel') {
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, employeeName.replace(/\s+/g, '_'));
          XLSX.writeFile(wb, `${employeeName.replace(/\s+/g, '_')}_report_${reportDate}.xlsx`);
        } else if (format === 'pdf') {
          const doc = new jsPDF();
          
          // Add title
          doc.setFontSize(16);
          doc.text(`${employeeName} - Work Report`, 14, 20);
          doc.setFontSize(12);
          doc.text(`Date: ${new Date(reportDate).toLocaleDateString()}`, 14, 30);
          doc.text(`Total Sessions: ${data.length}`, 14, 40);
          
          // Add summary
          const totalHours = data.reduce((sum, row) => sum + parseFloat(row['Total Hours']), 0);
          const totalBreaks = data.reduce((sum, row) => sum + row['Breaks'], 0);
          doc.text(`Total Hours: ${totalHours.toFixed(1)}h`, 14, 50);
          doc.text(`Total Breaks: ${totalBreaks}`, 14, 60);
          
          // Add table
          const tableData = data.map(row => [
            row['Start Time'],
            row['End Time'],
            row['Work Description'].substring(0, 30) + (row['Work Description'].length > 30 ? '...' : ''),
            row['Vehicle'],
            row['Gas Used (km)'],
            row['Breaks'],
            row['Total Hours']
          ]);
          
          autoTable(doc, {
            startY: 70,
            head: [['Start Time', 'End Time', 'Work Description', 'Vehicle', 'Gas (km)', 'Breaks', 'Hours']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [255, 140, 0] },
            styles: { fontSize: 8 }
          });
          
          doc.save(`${employeeName.replace(/\s+/g, '_')}_report_${reportDate}.pdf`);
        }
      };

      const handleWorkerExport = (employeeName, employeeId) => {
        setSelectedWorker({ name: employeeName, id: employeeId });
        setShowWorkerExportChoice(true);
      };

      const exportWorkerFormat = (format) => {
        if (selectedWorker) {
          exportWorkerReport(selectedWorker.name, selectedWorker.id, format);
          setShowWorkerExportChoice(false);
          setSelectedWorker(null);
        }
      };

      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Report by Date</h3>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date:</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={e => setReportDate(e.target.value)}
                  className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button onClick={() => setShowExportChoice(true)} className="bg-green-500 text-white px-4 py-2 rounded">Export</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Employee</th>
                    <th className="text-left py-2">Total Hours</th>
                    <th className="text-left py-2">Days Worked</th>
                    <th className="text-left py-2">Avg Hours/Day</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getReportData().map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 font-medium">{row.Employee}</td>
                      <td className="py-2">{row['Total Hours']}h</td>
                      <td className="py-2">{row['Days Worked']}</td>
                      <td className="py-2">{row['Avg Hours/Day']}h</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleWorkerExport(row.Employee, row.EmployeeId)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                          title={`Export ${row.Employee}'s detailed report`}
                        >
                          📊 Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {showExportChoice && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xs text-center">
                <h3 className="text-lg font-semibold mb-4">Export Report</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={exportReportExcel} className="bg-green-500 text-white px-4 py-2 rounded">Export as Excel</button>
                  <button onClick={exportReportPDF} className="bg-blue-500 text-white px-4 py-2 rounded">Export as PDF</button>
                  <button onClick={() => setShowExportChoice(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
          
          {showWorkerExportChoice && selectedWorker && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xs text-center">
                <h3 className="text-lg font-semibold mb-4">Export {selectedWorker.name}'s Report</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={() => exportWorkerFormat('excel')} className="bg-green-500 text-white px-4 py-2 rounded">Export as Excel</button>
                  <button onClick={() => exportWorkerFormat('pdf')} className="bg-blue-500 text-white px-4 py-2 rounded">Export as PDF</button>
                  <button onClick={() => {
                    setShowWorkerExportChoice(false);
                    setSelectedWorker(null);
                  }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const WorkHistoryTab = () => {
      const [selectedEmployee, setSelectedEmployee] = useState('all');
      const [dateFilter, setDateFilter] = useState('all');
      
      const getFilteredWorkLogs = () => {
        let filtered = workLogs.filter(log => log.status === 'completed');
        
        if (selectedEmployee !== 'all') {
          filtered = filtered.filter(log => log.employeeId === parseInt(selectedEmployee));
        }
        
        if (dateFilter === 'today') {
          const today = new Date().toDateString();
          filtered = filtered.filter(log => new Date(log.startTime).toDateString() === today);
        } else if (dateFilter === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(log => new Date(log.startTime) >= weekAgo);
        } else if (dateFilter === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter(log => new Date(log.startTime) >= monthAgo);
        }
        
        return filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      };

      const exportWorkHistoryToExcel = () => {
        const logs = getFilteredWorkLogs();
        let employeeName = 'All_Employees';
        if (selectedEmployee !== 'all') {
          const emp = employees.find(e => e.id === parseInt(selectedEmployee));
          if (emp) employeeName = emp.name.replace(/\s+/g, '_');
        }
        const data = logs.map(log => ({
          Employee: log.employeeName,
          'Start Time': new Date(log.startTime).toLocaleString(),
          'End Time': new Date(log.endTime).toLocaleString(),
          'Work Description': log.workDescription || '',
          Vehicle: log.vehicle ? `${log.vehicle.name} (${log.vehicle.license_plate})` : '',
          'Gas Used (L)': log.gasAmount || '',
          'Breaks': log.breaks.length,
          'Total Hours': calculateWorkHours(log).toFixed(1),
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, employeeName + '_WorkHistory');
        XLSX.writeFile(wb, `${employeeName}_work_history.xlsx`);
      };

      const exportWorkHistoryToPDF = () => {
        const logs = getFilteredWorkLogs();
        const doc = new jsPDF();
        const tableData = logs.map(log => [
          log.employeeName,
          new Date(log.startTime).toLocaleString(),
          new Date(log.endTime).toLocaleString(),
          log.workDescription || '',
          log.vehicle ? `${log.vehicle.name} (${log.vehicle.license_plate})` : '',
          log.gasAmount || '',
          log.breaks.length,
          calculateWorkHours(log).toFixed(1)
        ]);
        autoTable(doc, {
          head: [[
            'Employee', 'Start Time', 'End Time', 'Work Description', 'Vehicle', 'Gas Used (L)', 'Breaks', 'Total Hours'
          ]],
          body: tableData
        });
        doc.save('work_history.pdf');
      };

      return (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Work History</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee:</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Employees</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              {/* Export buttons removed as requested */}
            </div>
          </div>

          {/* History List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Completed Work Sessions</h3>
            </div>
            <div className="divide-y">
              {getFilteredWorkLogs().map((log, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-lg">{log.employeeName}</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {calculateWorkHours(log).toFixed(1)}h
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(log.startTime).toLocaleDateString()} - {new Date(log.endTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.startTime).toLocaleTimeString()} - {new Date(log.endTime).toLocaleTimeString()}
                      </p>
                      {log.workDescription && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Work Description:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">{log.workDescription}</p>
                        </div>
                      )}
                      {log.vehicle && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Vehicle:</span> {log.vehicle.name} ({log.vehicle.license_plate})
                        </p>
                      )}
                      {log.gasAmount > 0 && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Gas Used:</span> {log.gasAmount}L
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {log.breaks.length} breaks taken
                      </p>
                      {log.locationHistory && log.locationHistory.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {log.locationHistory.length} location updates
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {getFilteredWorkLogs().length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No completed work sessions found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    const MapTab = () => {
      const [selectedWorker, setSelectedWorker] = useState(null);
      const [mapCenter, setMapCenter] = useState(null);
      const [mapZoom, setMapZoom] = useState(12);
      
      const activeSessions = workLogs.filter(log => (log.status === 'working' || log.status === 'break') && log.locationHistory && log.locationHistory.length > 0);
      
      const defaultCenter = activeSessions.length > 0 && activeSessions[0].locationHistory[activeSessions[0].locationHistory.length-1].latitude
        ? {
            lat: activeSessions[0].locationHistory[activeSessions[0].locationHistory.length-1].latitude,
            lng: activeSessions[0].locationHistory[activeSessions[0].locationHistory.length-1].longitude
          }
        : { lat: 41.9981, lng: 21.4254 }; // Default to Skopje

      const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
      });

      const handleMarkerClick = (worker) => {
        const lastLoc = worker.locationHistory[worker.locationHistory.length - 1];
        if (lastLoc && lastLoc.latitude) {
          setSelectedWorker(worker);
          setMapCenter({ lat: lastLoc.latitude, lng: lastLoc.longitude });
          setMapZoom(15);
        }
      };

      const clearSelection = () => {
        setSelectedWorker(null);
        setMapCenter(null);
        setMapZoom(12);
      };

      return (
        <div className="space-y-4">
          {selectedWorker && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-orange-600">{selectedWorker.employeeName}</h3>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`font-medium ${
                      selectedWorker.status === 'working' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedWorker.status === 'working' ? 'Working' : 'On Break'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Started: {new Date(selectedWorker.startTime).toLocaleString()}
                  </p>
                  {selectedWorker.workDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Work:</span> {selectedWorker.workDescription}
                    </p>
                  )}
                  {selectedWorker.vehicle && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Vehicle:</span> {selectedWorker.vehicle.name} ({selectedWorker.vehicle.license_plate})
                    </p>
                  )}
                </div>
                <button
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter || defaultCenter}
                zoom={mapZoom}
              >
                {activeSessions.map((log, idx) => {
                  const lastLoc = log.locationHistory[log.locationHistory.length-1];
                  if (!lastLoc.latitude) return null;
                  
                  // Custom marker with a simple circle and initial
                  const flagIcon = {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                          </filter>
                        </defs>
                        <g filter="url(#shadow)">
                          <rect x="14" y="8" width="2" height="20" fill="#8B4513" stroke="#654321" stroke-width="0.5"/>
                          <rect x="16" y="8" width="12" height="8" fill="#FF0000" stroke="#CC0000" stroke-width="0.5"/>
                          <rect x="16" y="8" width="12" height="2" fill="#FFFFFF"/>
                          <rect x="16" y="12" width="12" height="2" fill="#FFFFFF"/>
                          <circle cx="15" cy="28" r="2" fill="#654321" stroke="#8B4513" stroke-width="0.5"/>
                        </g>
                      </svg>
                    `)}`,
                    scaledSize: { width: 32, height: 32 },
                    anchor: { x: 15, y: 28 },
                    labelOrigin: { x: 15, y: 20 }
                  };
                  
                  return (
                    <Marker
                      key={log.id}
                      position={{ lat: lastLoc.latitude, lng: lastLoc.longitude }}
                      icon={flagIcon}
                      label={{
                        text: log.employeeName[0],
                        className: "marker-label",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                      title={`${log.employeeName} (Last update: ${new Date(lastLoc.timestamp).toLocaleTimeString()})`}
                      onClick={() => handleMarkerClick(log)}
                    />
                  );
                })}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">Loading map...</div>
            )}
          </div>

          {/* Active Workers List */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Active Workers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeSessions.map((worker) => {
                const lastLoc = worker.locationHistory[worker.locationHistory.length - 1];
                return (
                  <button
                    key={worker.id}
                    onClick={() => handleMarkerClick(worker)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedWorker?.id === worker.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{worker.employeeName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          worker.status === 'working' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {worker.status === 'working' ? 'Working' : 'Break'}
                        </span>
                      </div>
                      {lastLoc && lastLoc.latitude ? (
                        <p className="text-xs text-gray-600 mt-1">
                          📍 {lastLoc.latitude.toFixed(4)}, {lastLoc.longitude.toFixed(4)}
                        </p>
                      ) : (
                        <p className="text-xs text-red-500 mt-1">📍 Location unavailable</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Last update: {lastLoc ? new Date(lastLoc.timestamp).toLocaleTimeString() : 'Never'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {activeSessions.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active workers at the moment</p>
            )}
          </div>
        </div>
      );
    };

    const LocationHistoryTab = () => {
      const [selectedEmployee, setSelectedEmployee] = useState('all');
      const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
      const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'

      // Get all logs for the selected date
      const logsByDate = workLogs.filter(log => {
        const logDate = new Date(log.startTime).toISOString().slice(0, 10);
        return logDate === selectedDate;
      });

      // Filter by selected employee
      const filteredLogs = selectedEmployee === 'all' 
        ? logsByDate 
        : logsByDate.filter(log => log.employeeId === parseInt(selectedEmployee));

      // Group logs by employee for timeline view
      const logsByEmployee = employees.reduce((acc, employee) => {
        const employeeLogs = filteredLogs.filter(log => log.employeeId === employee.id);
        if (employeeLogs.length > 0) {
          acc[employee.id] = employeeLogs;
        }
        return acc;
      }, {});



      // Calculate total distance for a work session
      const calculateDistance = (locationHistory) => {
        if (!locationHistory || locationHistory.length < 2) return 0;
        
        let totalDistance = 0;
        for (let i = 1; i < locationHistory.length; i++) {
          const prev = locationHistory[i - 1];
          const curr = locationHistory[i];
          
          if (prev.latitude && curr.latitude) {
            // Haversine formula for distance calculation
            const R = 6371; // Earth's radius in km
            const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
            const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                     Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) *
                     Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            totalDistance += R * c;
          }
        }
        return totalDistance;
      };

      return (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Location History Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee:</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Employees</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Mode:</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="timeline">Timeline View</option>
                  <option value="list">List View</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          {viewMode === 'timeline' && (
            <div className="space-y-6">
              {Object.keys(logsByEmployee).length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No location history found for the selected criteria.</p>
                </div>
              ) : (
                Object.entries(logsByEmployee).map(([employeeId, logs]) => {
                  const employee = employees.find(emp => emp.id === parseInt(employeeId));
                  return (
                    <div key={employeeId} className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b bg-gray-50">
                        <h4 className="text-lg font-semibold text-gray-800">{employee.name}</h4>
                        <p className="text-sm text-gray-600">
                          {logs.length} work session{logs.length !== 1 ? 's' : ''} on {new Date(selectedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-6">
                          {logs.map((log, logIndex) => {
                            const totalDistance = calculateDistance(log.locationHistory);
                            const sessionDuration = log.endTime 
                              ? (new Date(log.endTime) - new Date(log.startTime)) / (1000 * 60 * 60)
                              : (new Date() - new Date(log.startTime)) / (1000 * 60 * 60);
                            
                            return (
                              <div key={logIndex} className="border-l-4 border-orange-500 pl-6 relative">
                                {/* Timeline dot */}
                                <div className="absolute left-[-8px] top-0 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow"></div>
                                
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold text-gray-800">
                                      Work Session #{logIndex + 1}
                                    </h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      log.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      log.status === 'working' ? 'bg-blue-100 text-blue-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {log.status === 'completed' ? 'Completed' : 
                                       log.status === 'working' ? 'Active' : 'On Break'}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                                    <div>
                                      <span className="font-medium">Start:</span> {new Date(log.startTime).toLocaleTimeString()}
                                    </div>
                                    <div>
                                      <span className="font-medium">Duration:</span> {sessionDuration.toFixed(1)}h
                                    </div>
                                    <div>
                                      <span className="font-medium">Distance:</span> {totalDistance.toFixed(2)} km
                                    </div>
                                  </div>

                                  {log.workDescription && (
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-4">
                                      <span className="font-medium">Work:</span> {log.workDescription}
                                    </p>
                                  )}
                                </div>

                                {/* Location Timeline */}
                                <div className="space-y-3">
                                  <h6 className="font-medium text-gray-700">Location Updates:</h6>
                                  <div className="space-y-2">
                                    {log.locationHistory && log.locationHistory.length > 0 ? (
                                      log.locationHistory.map((location, locIndex) => (
                                        <div key={locIndex} className="flex items-start space-x-3 bg-gray-50 p-3 rounded">
                                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-gray-800">
                                                {location.latitude ? 
                                                  `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 
                                                  'Location unavailable'
                                                }
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {new Date(location.timestamp).toLocaleTimeString()}
                                              </span>
                                            </div>
                                            {locIndex > 0 && log.locationHistory[locIndex - 1].latitude && location.latitude && (
                                              <p className="text-xs text-gray-500 mt-1">
                                                Distance from previous: {(() => {
                                                  const prev = log.locationHistory[locIndex - 1];
                                                  const R = 6371;
                                                  const dLat = (location.latitude - prev.latitude) * Math.PI / 180;
                                                  const dLon = (location.longitude - prev.longitude) * Math.PI / 180;
                                                  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                                           Math.cos(prev.latitude * Math.PI / 180) * Math.cos(location.latitude * Math.PI / 180) *
                                                           Math.sin(dLon/2) * Math.sin(dLon/2);
                                                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                                                  return (R * c).toFixed(2);
                                                })()} km
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">No location data available</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Location History List</h3>
              </div>
              <div className="divide-y">
                {filteredLogs.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No location history found for the selected criteria.</p>
                  </div>
                ) : (
                  filteredLogs.map((log, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{employees.find(emp => emp.id === log.employeeId)?.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(log.startTime).toLocaleString()} - {log.endTime ? new Date(log.endTime).toLocaleString() : 'Active'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'completed' ? 'bg-green-100 text-green-800' :
                          log.status === 'working' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      
                      {log.locationHistory && log.locationHistory.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Location Updates ({log.locationHistory.length}):</p>
                          <div className="space-y-1">
                            {log.locationHistory.slice(-5).map((location, locIndex) => (
                              <div key={locIndex} className="text-xs text-gray-600">
                                {location.latitude ? 
                                  `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
                                  'Location unavailable'
                                } - {new Date(location.timestamp).toLocaleTimeString()}
                              </div>
                            ))}
                            {log.locationHistory.length > 5 && (
                              <p className="text-xs text-gray-400 italic">
                                ... and {log.locationHistory.length - 5} more updates
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-orange-500">
            <h1 className="text-xl font-bold text-white">{t('adminDashboard')}</h1>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {[
                { id: 'overview', label: t('overview'), icon: BarChart3 },
                { id: 'employees', label: t('employees'), icon: Users },
                { id: 'vehicles', label: t('vehicles'), icon: Car },
                { id: 'materials', label: 'Materials', icon: Package },
                { id: 'map', label: t('mapView'), icon: MapPin },
                { id: 'locationHistory', label: t('locationHistory'), icon: MapPin },
                { id: 'workHistory', label: t('workHistory'), icon: Calendar },
                { id: 'reports', label: t('reports'), icon: Calendar },
                { id: 'workFiles', label: t('workFiles'), icon: FileText }
              ].map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* New header bar for language selector and logout */}
          <div className="flex justify-end items-center p-4 bg-white border-b">
            <LanguageSelector />
            <button
              onClick={() => {
                setCurrentUser(null);
                setCurrentView('login');
              }}
              className="ml-4 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <LogOut size={22} />
            </button>
          </div>
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'employees' && <EmployeesTab />}
            {activeTab === 'vehicles' && <VehiclesTab />}
            {activeTab === 'materials' && <MaterialsTab />}
            {activeTab === 'map' && <MapTab />}
            {activeTab === 'locationHistory' && <LocationHistoryTab />}
            {activeTab === 'workHistory' && <WorkHistoryTab />}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'workFiles' && <WorkFilesTab />}
          </div>
        </main>
      </div>
    );
  };

  // File Preview Modal Component
  const FilePreviewModal = () => {
    if (!previewFile) return null;

    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          setPreviewFile(null);
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        onClick={() => setPreviewFile(null)}
      >
        <div 
          className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewFile.originalName}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <span>{formatFileSize(previewFile.fileSize)}</span>
                  <span className="mx-2">•</span>
                  <span>Uploaded by {previewFile.uploadedByName} ({previewFile.uploadedByType})</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(previewFile.uploadDate).toLocaleString()}</span>
                </div>
                {previewFile.description && (
                  <p className="text-sm text-gray-600 mt-1">{previewFile.description}</p>
                )}
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-gray-700 p-2"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            <div className="flex justify-center">
              <img 
                src={previewFile.filePath} 
                alt={previewFile.originalName}
                className="max-w-full max-h-full rounded-lg shadow-lg"
                style={{ maxHeight: '70vh' }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={() => downloadFile(previewFile)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={() => {
                window.open(previewFile.filePath, '_blank');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
            >
              <Eye size={16} />
              <span>Open in New Tab</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  if (currentView === 'splash') {
    return <SplashScreen />;
  }

  if (currentView === 'login') {
    return <LoginForm />;
  }

  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard />
        <FilePreviewModal />
      </>
    );
  }

  if (currentView === 'employee') {
    return (
      <>
        <EmployeeDashboard />
        <FilePreviewModal />
      </>
    );
  }

  return null;
};

const EmployeeTrackingApp = () => {
  // Force re-render when language changes
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    // Listen for language change events
    const handleLanguageChange = () => {
      // Force the entire app to re-render when language changes
      forceUpdate();
    };
    
    // Listen for both custom events
    document.addEventListener('fenix_language_changed', handleLanguageChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'fenix_language') {
        handleLanguageChange();
      }
    });
    
    return () => {
      document.removeEventListener('fenix_language_changed', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);
  
  return (
    <I18nProvider>
      <EmployeeTrackingAppContent />
    </I18nProvider>
  );
};

export default EmployeeTrackingApp;