import { useState, useEffect, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

const LocationTracker = () => {
  // Karimnagar and Hyderabad coordinates
  const KARIMNAGAR_LAT = 18.4386;
  const KARIMNAGAR_LNG = 79.1288;
  const HYDERABAD_LAT = 17.3850;
  const HYDERABAD_LNG = 78.4867;
  
  const [targetLocation, setTargetLocation] = useState<Location | null>({
    lat: KARIMNAGAR_LAT,
    lng: KARIMNAGAR_LNG,
    timestamp: Date.now(),
  });
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [path, setPath] = useState<google.maps.Polyline | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.Polyline | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Points along the path from Karimnagar to Hyderabad
  // These are simplified waypoints along the route
  const routePoints = [
    { lat: 18.4386, lng: 79.1288 }, // Karimnagar
    { lat: 18.3500, lng: 79.0500 }, // Near Jammikunta
    { lat: 18.1500, lng: 78.9500 }, // Near Huzurabad
    { lat: 18.0000, lng: 78.8500 }, // Near Jangaon
    { lat: 17.7500, lng: 78.7000 }, // Near Aler
    { lat: 17.5500, lng: 78.6000 }, // Near Bhongir
    { lat: 17.4500, lng: 78.5500 }, // Near Ghatkesar
    { lat: 17.3850, lng: 78.4867 }  // Hyderabad
  ];

  // Load Google Maps API
  useEffect(() => {
    const scriptId = 'google-maps-script';
    
    // Check if script is already loaded
    if (document.getElementById(scriptId)) {
      setIsApiLoaded(true);
      return;
    }

    // Check if google is already available
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
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newUserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
        };
        
        setUserLocation(newUserLocation);
        
        // If user marker exists, update its position
        if (userMarker && map) {
          userMarker.setPosition({
            lat: newUserLocation.lat,
            lng: newUserLocation.lng
          });
        }
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
      }
    );
  };

  // Initialize map when API is loaded
  useEffect(() => {
    if (!isApiLoaded || !mapRef.current || map) return;

    const defaultCenter = { lat: KARIMNAGAR_LAT, lng: KARIMNAGAR_LNG };
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 9,
      center: defaultCenter,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
    });
    
    setMap(newMap);
    
    // Create marker for target (moving from Karimnagar to Hyderabad)
    const newMarker = new window.google.maps.Marker({
      position: defaultCenter,
      map: newMap,
      title: 'Target Location',
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        scale: 5,
        rotation: 180, // South direction by default (Hyderabad is south of Karimnagar)
      },
    });
    
    setMarker(newMarker);
    
    // Create path for tracking movement history
    const newPath = new window.google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map: newMap,
    });
    
    setPath(newPath);
    
    // Create path for the route from Karimnagar to Hyderabad
    const newRoutePath = new window.google.maps.Polyline({
      path: routePoints,
      geodesic: true,
      strokeColor: '#0000FF',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      map: newMap,
    });
    
    setRoutePath(newRoutePath);
    
    // Create bounds to fit both locations
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: KARIMNAGAR_LAT, lng: KARIMNAGAR_LNG });
    bounds.extend({ lat: HYDERABAD_LAT, lng: HYDERABAD_LNG });
    newMap.fitBounds(bounds);
    
    // Get user location and create marker
    getUserLocation();
  }, [isApiLoaded]);
  
  // Create user marker when user location is available
  useEffect(() => {
    if (!map || !userLocation) return;
    
    if (!userMarker) {
      const newUserMarker = new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 7,
        },
      });
      
      setUserMarker(newUserMarker);
      
      // Add user location to bounds
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: KARIMNAGAR_LAT, lng: KARIMNAGAR_LNG });
      bounds.extend({ lat: HYDERABAD_LAT, lng: HYDERABAD_LNG });
      bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
      map.fitBounds(bounds);
    }
  }, [map, userLocation, userMarker]);

  // Update map when target location changes
  useEffect(() => {
    if (!map || !marker || !targetLocation || !path) return;

    const position = { lat: targetLocation.lat, lng: targetLocation.lng };
    
    marker.setPosition(position);
    if (targetLocation.heading !== undefined) {
      marker.setIcon({
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        scale: 5,
        rotation: targetLocation.heading,
      });
    }
    
    // Add location to history and update path
    const pathCoords = [...locationHistory.map(loc => ({ lat: loc.lat, lng: loc.lng })), position];
    path.setPath(pathCoords);
    
  }, [targetLocation, map, marker, path, locationHistory]);

  // Calculate heading between two points
  const calculateHeading = (start: {lat: number, lng: number}, end: {lat: number, lng: number}) => {
    if (!window.google) return 0;
    
    const heading = window.google.maps.geometry.spherical.computeHeading(
      new window.google.maps.LatLng(start.lat, start.lng),
      new window.google.maps.LatLng(end.lat, end.lng)
    );
    
    return heading;
  };
  
  // Interpolate between two points by a fraction t (0-1)
  const interpolatePoints = (p1: {lat: number, lng: number}, p2: {lat: number, lng: number}, t: number) => {
    return {
      lat: p1.lat + (p2.lat - p1.lat) * t,
      lng: p1.lng + (p2.lng - p1.lng) * t
    };
  };
  
  // Find current segment in route based on progress
  const findCurrentSegment = (progress: number) => {
    if (progress >= 1) return routePoints.length - 2;
    
    const totalSegments = routePoints.length - 1;
    const progressPerSegment = 1 / totalSegments;
    const currentSegment = Math.floor(progress / progressPerSegment);
    
    return Math.min(currentSegment, totalSegments - 1);
  };

  // Animate movement along the route
  const animateAlongRoute = (timestamp: number) => {
    if (!isConnected) return;
    
    // Update progress
    setProgress(prev => {
      const newProgress = prev + 0.001;
      return newProgress > 1 ? 1 : newProgress;
    });
    
    animationRef.current = requestAnimationFrame(animateAlongRoute);
  };

  // Start/stop animation based on connection status
  useEffect(() => {
    if (isConnected) {
      // Reset progress if starting fresh
      setProgress(0);
      setLocationHistory([]);
      
      // Start animation
      animationRef.current = requestAnimationFrame(animateAlongRoute);
    } else {
      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isConnected]);

  // Update target location based on progress
  useEffect(() => {
    if (!isConnected) return;
    
    const currentSegment = findCurrentSegment(progress);
    const totalSegments = routePoints.length - 1;
    const progressPerSegment = 1 / totalSegments;
    const segmentProgress = (progress - (currentSegment * progressPerSegment)) / progressPerSegment;
    
    const p1 = routePoints[currentSegment];
    const p2 = routePoints[currentSegment + 1];
    
    const newPos = interpolatePoints(p1, p2, segmentProgress);
    const heading = calculateHeading(p1, p2);
    
    const newLocation = {
      lat: newPos.lat,
      lng: newPos.lng,
      timestamp: Date.now(),
      heading: heading,
      speed: 60, // km/h
    };
    
    setTargetLocation(newLocation);
    setLocationHistory(prev => [...prev, newLocation]);
    
  }, [progress, isConnected]);

  // Connect/disconnect tracker
  const connectToTracker = () => {
    if (isConnected) {
      setIsConnected(false);
      return;
    }

    // Get user location if needed
    if (!userLocation) {
      getUserLocation();
    }
    
    setIsConnected(true);
  };

  if (!isApiLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className="location-tracker">
      <div className="map-container" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
      
      <div className="controls" style={{ padding: '1rem' }}>
        <button 
          onClick={connectToTracker} 
          className={`tracking-button ${isConnected ? 'active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isConnected ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
        >
          {isConnected ? "Stop Tracker" : "Start Journey: Karimnagar to Hyderabad"}
        </button>
        
        <button
          onClick={getUserLocation}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Update My Location
        </button>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', height: '12px' }}>
            <div 
              style={{ 
                width: `${progress * 100}%`, 
                backgroundColor: '#4CAF50', 
                height: '100%', 
                borderRadius: '4px',
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span>Karimnagar</span>
            <span>Hyderabad</span>
          </div>
        </div>
        
        {targetLocation && (
          <div className="location-info" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Target Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <div>
                <strong>Latitude:</strong> {targetLocation.lat.toFixed(6)}
              </div>
              <div>
                <strong>Longitude:</strong> {targetLocation.lng.toFixed(6)}
              </div>
              <div>
                <strong>Last Update:</strong> {new Date(targetLocation.timestamp).toLocaleTimeString()}
              </div>
              <div>
                <strong>Speed:</strong> {targetLocation.speed ? `${targetLocation.speed.toFixed(1)} km/h` : 'N/A'}
              </div>
              <div>
                <strong>Heading:</strong> {targetLocation.heading !== undefined ? `${targetLocation.heading.toFixed(0)}°` : 'N/A'}
              </div>
              <div>
                <strong>Journey:</strong> {(progress * 100).toFixed(1)}% complete
              </div>
            </div>
          </div>
        )}
        
        {userLocation && (
          <div className="user-location-info" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Your Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <div>
                <strong>Latitude:</strong> {userLocation.lat.toFixed(6)}
              </div>
              <div>
                <strong>Longitude:</strong> {userLocation.lng.toFixed(6)}
              </div>
              <div>
                <strong>Last Update:</strong> {new Date(userLocation.timestamp).toLocaleTimeString()}
              </div>
              <div>
                <strong>Accuracy:</strong> {userLocation.accuracy ? `±${userLocation.accuracy.toFixed(1)} meters` : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message" style={{
          padding: '1rem',
          backgroundColor: '#ffebee',
          color: '#c62828',
          margin: '1rem',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationTracker;