import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  deviceId?: string;
}

interface DeviceInfo {
  id: string;
  name: string;
  lastSeen: number;
}

const LocationTracker = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [path, setPath] = useState<google.maps.Polyline | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [deviceMode, setDeviceMode] = useState<'tracker' | 'display'>('display');
  const [connectedDevices, setConnectedDevices] = useState<DeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState(`Device_${Math.floor(Math.random() * 1000)}`);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Generate a session ID on component mount
  useEffect(() => {
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    if (!sessionId) return;

    // Connect to the WebSocket server - you'll need to set up this server
    const socket = io('https://your-websocket-server.com');
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Register device with server
      socket.emit('register', { 
        deviceId: sessionId,
        deviceName: deviceName,
        deviceType: deviceMode
      });
    });

    socket.on('locationUpdate', (data: Location) => {
      if (deviceMode === 'display' && (!selectedDevice || data.deviceId === selectedDevice)) {
        setCurrentLocation(data);
        setLocationHistory(prev => [...prev.slice(-200), data]);
      }
    });

    socket.on('devicesList', (devices: DeviceInfo[]) => {
      setConnectedDevices(devices.filter(d => d.id !== sessionId));
      
      // Auto-select the first tracking device if none is selected
      if (deviceMode === 'display' && !selectedDevice && 
          devices.some(d => d.id !== sessionId)) {
        const firstTracker = devices.find(d => d.id !== sessionId);
        if (firstTracker) setSelectedDevice(firstTracker.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('error', (err: string) => {
      setError(`Socket error: ${err}`);
    });

    socketRef.current = socket;

    return () => {
      if (socket) socket.disconnect();
    };
  }, [sessionId, deviceMode, selectedDevice, deviceName]);

  // Load Google Maps API
  useEffect(() => {
    const scriptId = 'google-maps-script';
    
    if (document.getElementById(scriptId)) {
      setIsApiLoaded(true);
      return;
    }

    if (window.google) {
      setIsApiLoaded(true);
      return;
    }

    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAB_lzF8wWxOa4addSjkkKnjwuJKDRZ3Fo&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsApiLoaded(true);
      script.onerror = () => setError('Failed to load Google Maps API');
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();

    return () => {
      const script = document.getElementById(scriptId);
      if (script) document.head.removeChild(script);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Initialize map when API is loaded (only in display mode)
  useEffect(() => {
    if (!isApiLoaded || !mapRef.current || map || deviceMode !== 'display') return;

    const defaultCenter = { lat: 0, lng: 0 };
    const center = currentLocation || defaultCenter;
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 19, // Higher zoom for walking
      center,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
    });
    
    setMap(newMap);
    
    const newMarker = new window.google.maps.Marker({
      position: center,
      map: newMap,
      title: 'Tracked Device',
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: '#4285F4', // Google blue
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        scale: 7, // Slightly larger for visibility
        rotation: 0,
      },
    });
    
    setMarker(newMarker);
    
    const newPath = new window.google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#4285F4',
      strokeOpacity: 0.7,
      strokeWeight: 4, // Thicker path
      map: newMap,
    });
    
    setPath(newPath);
  }, [isApiLoaded, map, currentLocation, deviceMode]);

  // Update map when location changes (display mode)
  useEffect(() => {
    if (!map || !marker || !currentLocation || !path || deviceMode !== 'display') return;

    const position = { lat: currentLocation.lat, lng: currentLocation.lng };
    
    // Update marker position and rotation
    marker.setPosition(position);
    if (currentLocation.heading !== undefined) {
      marker.setIcon({
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        scale: 7,
        rotation: currentLocation.heading,
      });
    }
    
    // Smoothly pan map to new location
    map.panTo(position);
    
    // Update path
    const pathCoords = [...locationHistory.map(loc => ({ lat: loc.lat, lng: loc.lng })), position];
    path.setPath(pathCoords);
    
    // Auto-zoom based on distance traveled
    if (locationHistory.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      pathCoords.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds);
    }
  }, [currentLocation, map, marker, path, locationHistory, deviceMode]);

  // Start/stop live tracking (tracker mode)
  const toggleTracking = () => {
    if (isTracking) {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTracking(false);
    } else {
      // Start tracking
      if ("geolocation" in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: position.timestamp,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed || 0,
              heading: position.coords.heading || undefined,
              deviceId: sessionId
            };
            
            setCurrentLocation(newLocation);
            
            // Send location update to server
            if (socketRef.current) {
              socketRef.current.emit('sendLocation', newLocation);
            }
            
            setError(null);
          },
          (err) => {
            setError(`Error getting location: ${err.message}`);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
          }
        );
        
        watchIdRef.current = id;
        setIsTracking(true);
      } else {
        setError("Geolocation is not supported by your browser");
      }
    }
  };

  // Get single location update
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || undefined,
            deviceId: sessionId
          };
          
          setCurrentLocation(newLocation);
          
          // Send location update to server
          if (socketRef.current && deviceMode === 'tracker') {
            socketRef.current.emit('sendLocation', newLocation);
          }
          
          setError(null);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  // Switch mode between tracker and display
  const switchMode = () => {
    const newMode = deviceMode === 'tracker' ? 'display' : 'tracker';
    setDeviceMode(newMode);
    
    // Re-register with new mode
    if (socketRef.current) {
      socketRef.current.emit('register', { 
        deviceId: sessionId,
        deviceName: deviceName,
        deviceType: newMode
      });
    }
  };

  // Select device to track
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    // Clear history when switching devices
    setLocationHistory([]);
  };

  if (!isApiLoaded && deviceMode === 'display') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading Google Maps...
      </div>
    );
  }

  // Tracker Mode UI
  if (deviceMode === 'tracker') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '1rem' 
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Location Tracker - Phone Mode
        </h1>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Device Name:
          </label>
          <input 
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '1rem'
            }}
          />
        </div>
          
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexDirection: 'column'
        }}>
          <button 
            onClick={toggleTracking}
            style={{
              padding: '1rem',
              backgroundColor: isTracking ? '#ff4444' : '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isTracking ? "Stop Sharing Location" : "Start Sharing Location"}
          </button>
          
          <button 
            onClick={getCurrentLocation}
            style={{
              padding: '1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Share Current Location Once
          </button>
        </div>
        
        {currentLocation && (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Current Location Data:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <div><strong>Latitude:</strong> {currentLocation.lat.toFixed(6)}</div>
              <div><strong>Longitude:</strong> {currentLocation.lng.toFixed(6)}</div>
              <div><strong>Accuracy:</strong> ±{currentLocation.accuracy?.toFixed(1) || '0'} meters</div>
              <div><strong>Speed:</strong> {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}</div>
              <div><strong>Direction:</strong> {currentLocation.heading !== undefined ? `${currentLocation.heading.toFixed(0)}°` : 'N/A'}</div>
              <div><strong>Last Update:</strong> {new Date(currentLocation.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={switchMode}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Switch to Display Mode (Laptop)
          </button>
        </div>
      </div>
    );
  }

  // Display Mode UI (laptop)
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '0.5rem', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ margin: 0 }}>Location Tracker - Display Mode</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <select
              value={selectedDevice || ''}
              onChange={(e) => handleDeviceSelect(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="" disabled>Select device to track</option>
              {connectedDevices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} (Last seen: {new Date(device.lastSeen).toLocaleTimeString()})
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={switchMode}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Switch to Tracker Mode
          </button>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        style={{ 
          flex: 1, 
          width: '100%',
          backgroundColor: '#f0f0f0' // Show background while map loads
        }}
      />
      
      <div style={{
        padding: '1rem',
        backgroundColor: 'white',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        zIndex: 1
      }}>
        {connectedDevices.length === 0 && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#e3f2fd',
            color: '#0d47a1',
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            No tracking devices connected. Open this app on another device and set it to 'Tracker Mode'.
          </div>
        )}
        
        {currentLocation && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <div>
              <strong>Latitude:</strong> {currentLocation.lat.toFixed(6)}
            </div>
            <div>
              <strong>Longitude:</strong> {currentLocation.lng.toFixed(6)}
            </div>
            <div>
              <strong>Accuracy:</strong> ±{currentLocation.accuracy?.toFixed(1) || '0'} meters
            </div>
            <div>
              <strong>Speed:</strong> {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
            </div>
            <div>
              <strong>Direction:</strong> {currentLocation.heading !== undefined ? `${currentLocation.heading.toFixed(0)}°` : 'N/A'}
            </div>
            <div>
              <strong>Last Update:</strong> {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;