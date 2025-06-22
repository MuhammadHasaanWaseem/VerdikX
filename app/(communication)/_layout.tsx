import { Stack } from "expo-router";
export default function Auth() {
    return (
        <Stack initialRouteName="freinds">
        <Stack.Screen name="freinds" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="freindreq" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="messsage" options={{headerShown:false,animation:'slide_from_left'}}/>
        <Stack.Screen name="dm" options={{headerShown:false,animation:'slide_from_left'}}/>

      
    </Stack>
    )
}
