import { useState } from 'react'
import { View, Text, TextInput, Image, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Phone, ShieldCheck } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VehicleGhost } from '../../components/GhostSilhouette'
import PrimaryButton from '../../components/PrimaryButton'
import { colors, fonts } from '../../theme'
import { brand } from '../../utils/brand'

const okaLogo = require('../../assets/brand/oka-logo-v3.webp')

interface AuthScreenProps {
  role: 'customer' | 'rider'
  onDone: () => void
  onOpenLegal?: () => void
}

/**
 * Phone-number + OTP sign-in — ported from AuthScreen.tsx on the web
 * app-preview. Two steps in one screen (enter phone, then a 4-digit code)
 * rather than two separate screens, matching the linear flow it actually is.
 */
export default function AuthScreen({ role, onDone, onOpenLegal }: AuthScreenProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  const canSendCode = phone.replace(/\D/g, '').length >= 9
  const canVerify = code.length === 4

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <VehicleGhost top={220} left={90} width={176} rotate={-6} opacity={0.1} />

        <View style={styles.header}>
          <Image source={okaLogo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>
            {step === 'phone' ? brand(role === 'customer' ? 'Get moving with okA' : 'Start earning with okA') : 'Enter the code'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'phone' ? "We'll text you a code to sign in — no password to remember." : `We sent a 4-digit code to ${phone || 'your number'}.`}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {step === 'phone' ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.phoneField}>
              <Phone size={16} color={colors.primary[300]} />
              <Text style={styles.dialCode}>+233</Text>
              <TextInput
                keyboardType="phone-pad"
                placeholder="24 123 4567"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(200)}>
              <View style={styles.otpRow}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={[styles.otpBox, code.length > i && styles.otpBoxFilled]}>
                    <Text style={styles.otpDigit}>{code[i] ?? ''}</Text>
                  </View>
                ))}
              </View>
              <TextInput
                keyboardType="number-pad"
                maxLength={4}
                value={code}
                onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 4))}
                style={styles.hiddenOtpInput}
                placeholder="Type the 4-digit code"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
              <Pressable onPress={() => setStep('phone')} style={({ pressed }) => [pressed && styles.editLinkPressed]}>
                <Text style={styles.editLink}>Wrong number? Edit</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>

        <View>
          <PrimaryButton
            label={step === 'phone' ? 'Send code' : 'Verify & continue'}
            disabled={step === 'phone' ? !canSendCode : !canVerify}
            icon={step === 'otp' ? <ShieldCheck size={15} color="#fff" /> : undefined}
            onPress={() => (step === 'phone' ? setStep('otp') : onDone())}
          />
          {onOpenLegal ? (
            <Pressable onPress={onOpenLegal}>
              <Text style={styles.terms}>{brand("\n                By continuing you agree to okA's ")}<Text style={styles.termsLink}>Terms and Privacy Policy</Text>.
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.terms}>{brand("By continuing you agree to okA's Terms and Privacy Policy.")}</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary[900], paddingHorizontal: 24, paddingBottom: 16 },
  header: { marginTop: 56 },
  logo: { height: 32, width: 32 * (1672 / 941), marginBottom: 24 },
  title: { fontFamily: fonts.display, fontSize: 26, color: '#fff' },
  subtitle: { marginTop: 6, fontFamily: fonts.sans, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  phoneField: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dialCode: { fontFamily: fonts.sansMedium, fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  input: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 14, color: '#fff' },
  otpRow: { marginTop: 32, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  otpBox: {
    height: 52,
    width: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  otpBoxFilled: { backgroundColor: '#fff', borderColor: '#fff' },
  otpDigit: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  hiddenOtpInput: { marginTop: 16, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: fonts.sans },
  editLink: { marginTop: 12, textAlign: 'center', fontFamily: fonts.sansMedium, fontSize: 12, color: colors.primary[300] },
  editLinkPressed: { opacity: 0.6 },
  terms: { marginTop: 16, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  termsLink: { color: 'rgba(255,255,255,0.75)', textDecorationLine: 'underline' },
})
