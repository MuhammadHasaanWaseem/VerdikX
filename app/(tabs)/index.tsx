import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { useAuth } from '../context/AuthProvider'

const index = () => {
  const {signOut}=useAuth()
  return (
    <View style={{
        backgroundColor:'black',flex:1,justifyContent:'center',alignItems:'center'
      }}>
     <Pressable onPress={signOut}>
       <Text style={{
        color:'white'
      }} >Logout</Text>
     </Pressable>
    </View>
  )
}

export default index