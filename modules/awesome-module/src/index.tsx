import {DeviceEventEmitter, NativeModules, Platform} from 'react-native';
import axios from 'axios'
const LINKING_ERROR =
  `The package 'react-native-awesome-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AwesomeModule = NativeModules.AwesomeModule
  ? NativeModules.AwesomeModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function onSensorChanged(callback: (data: any) => void) {
  if (Platform.OS === 'android') {
    DeviceEventEmitter.addListener('ProximityData', callback);
  }
}
export async function makeApiCall(){
  try {
    const {data} = await axios.get('https://fakestoreapi.com/products')
    console.log(data,'d')
    return data
  } catch (error) {
    console.log(error)
  }
}
export function getProximityData(): Promise<{isNear: boolean}> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      AwesomeModule.getProximityData()
        .then((proximityData: {isNear: boolean}) => {
          resolve(proximityData);
        })
        .catch((error: Error) => {
          reject(error);
        });
    } else {
      reject(new Error('getProximityData is not available on this platform'));
    }
  });
}

export function getBoottime(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getBootTime()
          .then((boottime: string) => {
            resolve(boottime);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error('getBoottime is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getKernelInformation(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getKernelInformation()
          .then((kernelInfo: string) => {
            resolve(kernelInfo);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(
          new Error('getKernelInformation is not available on this platform'),
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getColorDepth(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const colorDepth =
        Platform.OS === 'android' ? AwesomeModule.getColorDepth() : ''; // Adjust based on the platform
      resolve(colorDepth);
    } catch (error) {
      reject(error);
    }
  });
}
export function getViewPort(): Promise<{width: number; height: number}> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getViewPort()
          .then((viewportSize: {width: number; height: number}) => {
            resolve(viewportSize);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        // For iOS or other platforms, you can handle accordingly
        resolve({width: 0, height: 0});
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getDeviceCores(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getDeviceCores()
          .then((cores: number) => {
            resolve(cores);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error('getDeviceCores is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getGPUDetails(): Promise<{[key: string]: string}> {
  return new Promise((resolve, reject) => {
    if (AwesomeModule.getGPUDetails) {
      AwesomeModule.getGPUDetails()
        .then((gpuDetails: any) => {
          // Check if gpuDetails is an object
          if (typeof gpuDetails === 'object' && gpuDetails !== null) {
            resolve(gpuDetails);
          } else {
            reject(new Error('Invalid GPU details received'));
          }
        })
        .catch((error: Error) => {
          reject(error);
        });
    } else {
      reject(new Error('GPU details not available'));
    }
  });
}
