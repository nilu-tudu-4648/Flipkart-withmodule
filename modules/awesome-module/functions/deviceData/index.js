import * as RNLocalize from 'react-native-localize';
import DeviceInfo from 'react-native-device-info';
import {bytesToMB} from '../../utils/raptorx-utils';
import RNFS from 'react-native-fs';
import {Dimensions, NativeModules, Platform} from 'react-native';

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
const getAllDeviceData = async (api, sessionId, customerId) => {
  try {
    const gpu_detail = await getGPUDetails();
    const gpu_detail_renderer = gpu_detail.renderer
    const gpu_detail_vendor = gpu_detail.vendor
    const gpu_detail_version = gpu_detail.version
    const carrier_info = await DeviceInfo.getCarrier();
    const device_vendor = DeviceInfo.getBrand();
    const device_model = DeviceInfo.getModel();
    const is_emulator = await DeviceInfo.isEmulator();
    const device_id = DeviceInfo.getDeviceId();
    const ip_address = await DeviceInfo.getIpAddress();
    const os_name = await DeviceInfo.getBaseOs();
    const os_version = DeviceInfo.getSystemVersion();
    const device_ram = DeviceInfo.getTotalMemory();
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
      is_emulator,
      device_id,
      os_name,
      os_version,
      ip_address,
      local_language,
      available_storage,
      screen_resolution,
      device_ram,
      cpu_archt_model,
      buildInfo_buildNumber,
      buildInfo_appVersion,
      buildInfo_buildId,
      buildInfo_bundleId,
      buildInfo_appName,
      gpu_detail_renderer,
      gpu_detail_vendor,
      gpu_detail_version
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
