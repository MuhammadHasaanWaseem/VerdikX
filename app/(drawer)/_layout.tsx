import { Stack } from "expo-router";
export default function drawer() {
    return (
        <Stack initialRouteName="drawer">
        <Stack.Screen name="PrivacyPolicy" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="UserTerms" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="drawer" options={{headerShown:false,animation:'slide_from_right'}}/>
        
      
    </Stack>
    )
}
