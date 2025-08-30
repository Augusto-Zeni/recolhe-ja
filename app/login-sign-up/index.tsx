import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/InputText'
import { Text } from '@/src/components/Text'
import { colors } from '@/src/styles/colors'
import { globalStyles } from '@/src/styles/globalStyles'
import { Image } from 'expo-image'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

export function LoginSignUp() {
  const [isLogin, setIsLogin] = useState<boolean>(true)

  const handleSwitchText = (isLogin: boolean) => {
    setIsLogin(isLogin)
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContent}>
            <Image source={require('@/assets/Logo.svg')} contentFit='contain' style={styles.logo} />
            <Text style={styles.logoText}>RecicleJá</Text>
          </View>

          <View style={styles.containerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Olá,</Text>
              <Text style={styles.title}>Seja Bem-Vindo</Text>
            </View>

            <View style={styles.switchContainer}>
              <TouchableOpacity onPress={() => handleSwitchText(true)}>
                <Text style={[styles.switchText, isLogin && styles.selectedSwitch]}>Já tenho uma conta</Text>
              </TouchableOpacity>
              <Text style={styles.switchText}>/</Text>
              <TouchableOpacity onPress={() => handleSwitchText(false)}>
                <Text style={[styles.switchText, !isLogin && styles.selectedSwitch]}>Não tenho uma conta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {isLogin ? (
                <>
                  <Input placeholder='Email' inputStyle={{ height: 56 }} />
                  <Input placeholder='Senha' inputStyle={{ height: 56 }} secureTextEntry />
                </>
              ) : (
                <>
                  <Input placeholder='Nome Completo' inputStyle={{ height: 56 }} />
                  <Input placeholder='Email' inputStyle={{ height: 56 }} />
                  <Input placeholder='Senha' inputStyle={{ height: 56 }} secureTextEntry />
                </>
              )}
            </View>

            <Button variant='primary' onPress={() => { }}>
              <Text style={globalStyles.buttonText}>LOGIN</Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContent: {
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
  containerContent: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    gap: 12
  },
  titleContainer: {
    display: 'flex',
  },
  title: {
    fontSize: 42,
    lineHeight: 45,
    fontFamily: 'Poppins_200ExtraLight',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  switchText: {
    fontSize: 15,
  },
  selectedSwitch: {
    color: colors.green300,
  },
  form: {
    gap: 12,
  },
})