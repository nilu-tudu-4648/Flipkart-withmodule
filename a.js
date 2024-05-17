import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import RaptorX from 'react-native-awesome-module'
const apiKey = '9a60f01e9b7d2d5d37a1b134241311fd7dfdbc38';
export const simpleSDK = new RaptorX(apiKey);
const App = () => {

  // "react-native-awesome-module": "link:./modules/awesome-module",
 async function getgpu(params) {
    try {
      const d = await simpleSDK.initDeviceData()
      const loc = await simpleSDK.getNetwork()
      console.log(loc)
      console.log(d,'getgpu')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // Call navigation capture method inside useEffect
   const data = simpleSDK.initDeviceData();
   console.log(data)
   getgpu()
  }, []);
  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})