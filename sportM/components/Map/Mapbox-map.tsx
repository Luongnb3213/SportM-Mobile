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

  useEffect(() => {
    const requestLocationPermission = async () => {
      const isGranted = await Mapbox.requestAndroidLocationPermissions();
      if (isGranted) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    };
    requestLocationPermission();
  }, []);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // Sample coordinates (Ho Chi Minh City)
  const initialCoordinates: [number, number] = [105.804817, 21.028511];

  // Sample markers
  const markers = [
    {
      id: '1',
      coordinate: [105.804817, 21.228511] as [number, number],
      title: 'Landmark 81',
      description: 'Tòa nhà cao nhất Việt Nam',
    },
    {
      id: '2',
      coordinate: [105.804817, 21.028511] as [number, number],
      title: 'Sân bay Tân Sơn Nhất',
      description: 'Sân bay quốc tế',
    },
  ];

  const handleUserLocationUpdate = (location: any) => {
    const coords: [number, number] = [
      location.coords.longitude,
      location.coords.latitude,
    ];
    setUserLocation(coords);
  };

  const flyToLocation = (coordinate: [number, number]) => {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: 14,
      animationDuration: 2000,
    });
  };

  const flyToUserLocation = () => {
    if (userLocation) {
      flyToLocation(userLocation);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        styleJSON="mapbox://styles/mapbox/streets-v9"
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        scaleBarEnabled={false}
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

        {/* User Location */}
        <UserLocation
          visible={true}
          onUpdate={handleUserLocationUpdate}
          showsUserHeadingIndicator={true}
        />

        <Mapbox.MarkerView id="marker1" coordinate={[105.854444, 21.029167]}>
          <View className="relative items-center justify-center">
            {/* <View className="bg-green-500 rounded-full w-12 h-12 items-center justify-center shadow-lg">
              <Image
                source={require('../../../assets/images/react-logo.png')}
                className="w-8 h-8"
              />
            </View>
            <View className="absolute bottom-[-8px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-500" /> */}
            <FontAwesome5 name="map-marker-alt" size={24} color="black" />
          </View>
        </Mapbox.MarkerView>
      </MapView>

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => flyToLocation(initialCoordinates)}
        >
          <Text style={styles.buttonText}>Về TPHCM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={flyToUserLocation}>
          <Text style={styles.buttonText}>Vị trí của tôi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
