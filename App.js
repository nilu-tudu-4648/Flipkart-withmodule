import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

import RaptorX from 'react-native-nilesh-module'
const apiKey = '9a60f01e9b7d2d5d37a1b134241311fd7dfdbc38';
export const simpleSDK = new RaptorX(apiKey);
const App = () => {
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