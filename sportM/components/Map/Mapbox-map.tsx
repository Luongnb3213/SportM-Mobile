import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  PointAnnotation,
  Callout,
  UserLocation,
  ShapeSource,
  CircleLayer,
} from '@rnmapbox/maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons';
// Set your Mapbox access token
Mapbox.setAccessToken(
  'pk.eyJ1IjoibHVvbmdjaGFvaSIsImEiOiJjbWZndzlwNHcwNW52MnJwdDJlaGViMDUxIn0.8D0hYvlEZdwx3GzONsOHpg'
);

const MapboxExample = () => {
   const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const initialCoordinates: [number, number] = [105.804817, 21.028511]; // (thực ra là Hà Nội)

  useEffect(() => {
    (async () => {
      const ok = await Mapbox.requestAndroidLocationPermissions();
      console.log('Location permission', ok ? 'granted' : 'denied');
    })();
  }, []);

  const handleUserLocationUpdate = (loc: any) => {
    setUserLocation([loc.coords.longitude, loc.coords.latitude]);
  };

  const flyToLocation = (coord: [number, number]) => {
    if (!mapReady) return;
    cameraRef.current?.setCamera({
      centerCoordinate: coord,
      zoomLevel: 14,
      animationDuration: 2000,
    });
  };

  const flyToUserLocation = () => {
    if (userLocation) flyToLocation(userLocation);
  };
  return (
    <View style={styles.container}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v9"   // ✅ dùng styleURL
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
        scaleBarEnabled={false}
        onDidFinishRenderingMapFully={() => setMapReady(true)} // ✅ chờ map ready
      >
        <Camera
          ref={cameraRef}
          zoomLevel={15}
          centerCoordinate={initialCoordinates}
          pitch={45}
          heading={30}
          animationMode="flyTo"
          animationDuration={1000}
        />

        <UserLocation
          visible
          onUpdate={handleUserLocationUpdate}
          showsUserHeadingIndicator
        />

        {/* ✅ Dùng PointAnnotation thay MarkerView */}
        {mapReady && (
          <Mapbox.PointAnnotation id="marker1" coordinate={[105.854444, 21.029167]}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome5 name="map-marker-alt" size={24} color="black" />
            </View>
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => flyToLocation(initialCoordinates)}>
          <Text style={styles.buttonText}>Về TPHCM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={flyToUserLocation}>
          <Text style={styles.buttonText}>Vị trí của tôi</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutText: {
    fontSize: 14,
    color: '#333',
    padding: 5,
  },
  buttonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapboxExample;
