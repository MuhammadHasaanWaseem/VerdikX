import { router } from "expo-router";
import { ArrowRight } from 'lucide-react-native';
import { Image, StatusBar, TouchableOpacity } from "react-native";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";

export default () => {
 

  return (
    <Animated.View entering={SlideInRight.duration(500).damping(2)} style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar hidden={false} />
      <Animated.View entering={SlideInLeft.delay(500).damping(2)} style={{ justifyContent: 'center', alignContent: 'center', flex: 1, alignItems: 'center' }}>
        <Image source={require('../assets/Appicons/VerdikX.png')} style={{ width: 200, height: 200 }} />
        <Animated.Text entering={SlideInLeft.delay(500).damping(2)} style={{ fontSize: 16, color: 'white', fontStyle: 'italic', fontWeight: '900', textAlign: 'center' }}>
          Continue To VerdickX , Your Esports Code
        </Animated.Text>
        <TouchableOpacity style={{ marginTop: '10%' }} onPress={() => router.push('/(auth)/login')}>
          <ArrowRight size={32} strokeWidth={4} color={'#3bff31'} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}
