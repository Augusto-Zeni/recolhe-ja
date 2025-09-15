import { Button } from '@/src/components/Button'
import { Text } from '@/src/components/Text'
import { colors } from '@/src/styles/colors'
import { Image, ImageBackground } from 'expo-image'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Register() {
  return (
    <ImageBackground
      source={require('@/assets/images/background-register.png')}
      contentFit="cover"
      style={styles.image}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.contentContainer}>
            <View style={styles.containerAnimations}>
              <View style={styles.centerWrapper}>
                <Image
                  source={require('@/assets/gifs/green-leaf.gif')}
                  style={styles.leafBase}
                  contentFit="cover"
                />
                <Image
                  source={require('@/assets/gifs/yellow-leaf.gif')}
                  style={styles.leafOverlay}
                  contentFit="cover"
                />
              </View>
            </View>

            <View style={styles.containerRegister}>
              <SafeAreaView edges={['bottom']} style={{ gap: 32 }}>
                <View style={styles.containerLogo}>
                  <Image source={require('@/assets/images/Logo.svg')} contentFit='contain' style={styles.logo} />
                  <Text style={styles.logoText}>RecicleJá</Text>
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.title}>Olá,</Text>
                  <Text style={styles.title}>Seja Bem-Vindo</Text>
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.text}>Recicle de forma inteligente,</Text>
                  <Text style={styles.text}>contribua para um futuro mais verde.</Text>
                </View>

                <Button onPress={() => { }} style={styles.button}>
                  <Image source={require('@/assets/images/google-logo.svg')} contentFit='contain' style={styles.logoGoogle} />
                  <Text style={styles.buttonText}>Entrar com o Google</Text>
                </Button>
                <View style={styles.infoTextContent}>
                  <Text style={styles.infoText}>Criando uma conta,</Text>
                  <Text style={styles.infoText}>você concorda com todos os nossos termos e condições.</Text>
                </View>
              </SafeAreaView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    width: '100%',
    flex: 1,
    marginTop: 12,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  containerAnimations: {
    height: '37%',
    position: 'relative',
  },
  centerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafBase: {
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    height: '60%',
  },
  leafOverlay: {
    position: 'absolute',
    zIndex: 1,
    transform: [{ rotate: '180deg' }],
    width: '100%',
    height: '60%',
  },
  containerRegister: {
    flex: 1,
    backgroundColor: colors.green100,
    paddingHorizontal: 24,
    paddingTop: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  containerLogo: {
    display: 'flex',
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 42,
    height: 42,
  },
  logoText: {
    fontFamily: 'Poppins_300Light',
    lineHeight: 32,
    fontSize: 16,
  },
  textContent: {
    display: 'flex',
  },
  title: {
    fontSize: 42,
    lineHeight: 45,
    fontFamily: 'Poppins_200ExtraLight',
  },
  text: {
    fontSize: 17,
    fontFamily: 'Poppins_200ExtraLight',
  },
  button: {
    backgroundColor: colors.green200,
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  logoGoogle: {
    width: 32,
    height: 32,
  },
  buttonText: {
    color: colors.white
  },
  infoTextContent: {

  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Poppins_200ExtraLight',
  },
})