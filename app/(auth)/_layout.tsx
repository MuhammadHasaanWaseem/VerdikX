import { Stack } from "expo-router";
export default function Auth() {
    return (
        <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="signup" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="Username" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="UserId" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="UserLevel" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="otpconfirm" options={{headerShown:false,animation:'slide_from_left'}}/>
      
    </Stack>
    )
}
