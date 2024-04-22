import * as RNLocalize from 'react-native-localize';
import DeviceInfo from 'react-native-device-info';
import {bytesToMB} from '../../utils/raptorx-utils';
import RNFS from 'react-native-fs';
import {Dimensions, NativeModules, Platform} from 'react-native';

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
export const makeDeviceDataApiCall = async (
  api,
  sessionId,
  customerId,
  deviceData,
) => {
  try {
    console.log({
      session_id: sessionId,
      customer_id: customerId,
      ...deviceData,
    });

    const response = await api.post('api/analytics/device/capture', {
      session_id: sessionId,
      customer_id: customerId,
      ...deviceData,
    });
    console.log('Device data API response:', response);
    return response.data; // Assuming the API response contains useful data
  } catch (error) {
    console.error('Error making device data API call:', error);
    throw error;
  }
};
export function getProximityDataFunc() {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      AwesomeModule.getProximityData()
        .then(proximityData => {
          resolve(proximityData);
        })
        .catch(() => {
          reject(error);
        });
    } else {
      reject(new Error('getProximityData is not available on this platform'));
    }
  });
}
export function getColorDepth() {
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
export function getViewPort() {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getViewPort()
          .then(viewportSize => {
            resolve(viewportSize);
          })
          .catch(error => {
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
async function getGPUDetails() {
  try {
    if (Platform.OS === 'android') {
      return new Promise((resolve, reject) => {
        NativeModules.GPUModule.getGPUDetails((error, gpuDetails) => {
          if (error) {
            reject(error);
          } else {
            resolve(gpuDetails);
          }
        });
      });
    } else {
      throw new Error('getGPUDetails is not available on this platform');
    }
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
export function getDeviceCores(){
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getDeviceCores()
          .then((cores) => {
            resolve(cores);
          })
          .catch((error) => {
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
export function getKernelInformation() {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getKernelInformation()
          .then((kernelInfo) => {
            resolve(kernelInfo);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error('getKernelInformation is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
const getAllDeviceData = async (api, sessionId, customerId) => {
  try {
    const gpu_detail = await getGPUDetails();
    const gpu_detail_renderer = gpu_detail.renderer;
    const gpu_detail_vendor = gpu_detail.vendor;
    const gpu_detail_version = gpu_detail.version;
    const proximity = await getProximityDataFunc();
    const proximity_data = proximity.isNear ? 'true' : 'false';
    const color_depth = await getColorDepth();
    const viewPort = await getViewPort();
    const viewport_size_height = viewPort.height.toString();
    const viewport_size_width = viewPort.width.toString();
    const deviceCores = await getDeviceCores()
    const kernel_information = await getKernelInformation()
    const carrier_info = await DeviceInfo.getCarrier();
    const device_vendor = DeviceInfo.getBrand();
    const device_model = DeviceInfo.getModel();
    const is_emulator = await DeviceInfo.isEmulator();
    const device_id = DeviceInfo.getDeviceId();
    const ip_address = await DeviceInfo.getIpAddress();
    const os_name =  DeviceInfo.getSystemName();
    const os_version = DeviceInfo.getSystemVersion();
    const device_ram =await DeviceInfo.getTotalMemory();
    const local_language = RNLocalize.getLocales()[0].languageCode;
    const storageInfo = await RNFS.getFSInfo();
    const available_storage = bytesToMB(storageInfo.freeSpace);
    const {width, height} = Dimensions.get('window');
    const screen_resolution = `${width}x${height}`;
    const cpu_archt_model = DeviceInfo.getModel();
    const buildInfo_buildNumber = DeviceInfo.getBuildNumber();
    const buildInfo_appVersion = DeviceInfo.getVersion();
    const buildInfo_buildId = await DeviceInfo.getBuildId();
    const buildInfo_bundleId = DeviceInfo.getBundleId();
    const buildInfo_appName = DeviceInfo.getApplicationName();
    const deviceData = {
      carrier_info,
      device_vendor,
      device_model,
      is_emulator:is_emulator.toString(),
      device_id,
      os_name,
      os_version,
      ip_address,
      local_language,
      available_storage,
      screen_resolution,
      device_ram:bytesToMB(device_ram),
      cpu_archt_model,
      buildInfo_buildNumber,
      buildInfo_appVersion,
      buildInfo_buildId,
      buildInfo_bundleId,
      buildInfo_appName,
      gpu_detail_renderer,
      gpu_detail_vendor,
      gpu_detail_version,
      proximity_data,
      color_depth,
      viewport_size_height,
      viewport_size_width,
      deviceCores:deviceCores.toString(),
      kernel_information
    };

    const deviceDataResult = await makeDeviceDataApiCall(
      api,
      sessionId,
      customerId,
      deviceData,
    );

    return deviceDataResult;
  } catch (error) {
    console.error('Error retrieving device information:', error);
    throw error;
  }
};

export default getAllDeviceData;
