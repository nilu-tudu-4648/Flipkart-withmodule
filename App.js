import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  getBoottime,
  getColorDepth,
  getDeviceCores,
  getKernelInformation,
  getProximityData,
  getViewPort,
  makeApiCall,
  onSensorChanged,
} from 'react-native-awesome-module';

const App = () => {
  const getColorDepthValue = async () => {
    try {
      const colorDepth = await getColorDepth();
      console.log('Color Depth:', colorDepth);
    } catch (error) {
      console.log('Error retrieving color depth:', error);
    }
  };

  const getViewPortValue = async () => {
    try {
      const viewportSize = await getViewPort();
      console.log('Viewport Size:', viewportSize);
    } catch (error) {
      console.log('Error retrieving viewport size:', error);
    }
  };
  const getDeviceCorestValue = async () => {
    try {
      const getDeviceCoresres = await getDeviceCores();
      console.log('getDeviceCores:', getDeviceCoresres);
    } catch (error) {
      console.log('Error retrieving viewport size:', error);
    }
  };
  const getKernelInformationValue = async () => {
    try {
      const getKernelInformationval = await getKernelInformation();
      console.log('getKernelInformation:', getKernelInformationval);
    } catch (error) {
      console.log('Error retrieving viewport size:', error);
    }
  };
  const getBoottimeValue = async () => {
    try {
      const data = await makeApiCall()
console.log(data)
      // const getBoottimev = await getBoottime();
      // console.log('getBoottime:', getBoottimev);
    } catch (error) {
      console.log('Error retrieving viewport size:', error);
    }
  };

  useEffect(() => {
    getColorDepthValue();
    getViewPortValue();
    getDeviceCorestValue();
    getKernelInformationValue();
    getBoottimeValue();
  }, []);
  useEffect(() => {
    // Retrieve proximity data
    const retrieveProximityData = async () => {
      try {
        const proximityData = await getProximityData();
        console.log('Proximity Data:', proximityData);
      } catch (error) {
        console.log('Error retrieving proximity data:', error);
      }
    };

    // Subscribe to sensor change events
    const subscribeToSensor = () => {
      onSensorChanged((data) => {
        console.log('Sensor Data:', data);
      });
    };

    // Call the functions
    retrieveProximityData();
    subscribeToSensor();
  }, []);
  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
