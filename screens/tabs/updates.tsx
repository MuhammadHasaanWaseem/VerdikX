import React from 'react'
import { StatusBar, View } from 'react-native'
export default ()=> {
  return (
    <View style={{
        backgroundColor:'black',flex:1,justifyContent:'center',alignItems:'center'
      }}>
        <StatusBar hidden={true}/>
    
    </View>
  )
}

