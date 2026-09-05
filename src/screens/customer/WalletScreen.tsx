import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeft, Plus, Smartphone, Home, Clock, Wallet as WalletIcon, User } from 'lucide-react-native'
import { walletBalance, walletTransactions, okaPoints, redeemOptions, customerMission, weeklySpend } from '../../data/appPreview'
import { CediGhost } from '../../components/GhostSilhouette'
import IconButton from '../../components/IconButton'
import TabBar from '../../components/TabBar'
import WaveCap from '../../components/WaveCap'
import PointsCard from '../../components/PointsCard'
import MissionCard from '../../components/MissionCard'
import WeeklyMiniChart from '../../components/WeeklyMiniChart'
import { colors, fonts, primaryButtonGradient } from '../../theme'
import { brand } from '../../utils/brand'

interface WalletScreenProps {
  onBack: () => void
  onOpenProfile: () => void
}

/** Ported from WalletScreen.tsx on the web app-preview. */
const TOP_UP_AMOUNT = 50

export default function WalletScreen({ onBack, onOpenProfile }: WalletScreenProps) {
  const [balanceGHS, setBalanceGHS] = useState(walletBalance.balanceGHS)

  const handleTopUp = () => setBalanceGHS((prev) => prev + TOP_UP_AMOUNT)

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Wallet</Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.balanceCard}>
          <CediGhost top={12} left={210} width={112} rotate={-8} opacity={0.1} />
          <CediGhost top={92} left={14} width={70} rotate={12} opacity={0.07} />
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceValue}>GHS {balanceGHS.toFixed(2)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.savedMethod}>
              <Smartphone size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.savedMethodText}>{walletBalance.savedMethod}</Text>
            </View>
            <Pressable onPress={handleTopUp} style={({ pressed }) => pressed && { opacity: 0.8 }}>
              <LinearGradient colors={primaryButtonGradient.colors} style={styles.topUpBtn}>
                <Plus size={13} color="#fff" />
                <Text style={styles.topUpText}>Top up</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Animated.View entering={FadeIn.duration(300)}>
        <PointsCard
          balance={okaPoints.customer.balance}
          tier={okaPoints.customer.tier}
          nextTier={okaPoints.customer.nextTier}
          pointsToNextTier={okaPoints.customer.pointsToNextTier}
          tierProgress={okaPoints.customer.tierProgress}
          redeemOptions={redeemOptions}
          onRedeem={(option) => Alert.alert('Redeemed', `${option.label} redeemed!`)}
        />
        <MissionCard
          label={customerMission.label}
          progress={customerMission.progress}
          target={customerMission.target}
          rewardLabel={customerMission.rewardLabel}
        />

        <WeeklyMiniChart data={weeklySpend} label="This week's spend" />

        <Text style={styles.sectionLabel}>Recent activity</Text>
        <View>
          {walletTransactions.map((tx, i) => (
            <Animated.View key={tx.id} entering={FadeInDown.delay(i * 40).duration(250)} style={styles.txRow}>
              <View>
                <Text style={styles.txLabel}>{brand(tx.label)}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <Text style={[styles.txAmount, tx.amountGHS >= 0 && styles.txAmountPositive]}>
                {tx.amountGHS < 0 ? '−' : '+'}GHS {Math.abs(tx.amountGHS)}
              </Text>
            </Animated.View>
          ))}
        </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.tabBarOuter}>
        <WaveCap fill="#fff" />
        <SafeAreaView edges={['bottom']} style={styles.tabBarWrap}>
          <TabBar
            active="wallet"
            items={[
              { key: 'home', icon: Home, label: 'Home', onPress: onBack },
              { key: 'activity', icon: Clock, label: 'Activity' },
              { key: 'wallet', icon: WalletIcon, label: 'Wallet' },
              { key: 'profile', icon: User, label: 'Profile', onPress: onOpenProfile },
            ]}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  balanceCard: { borderRadius: 24, backgroundColor: colors.primary[900], padding: 20, overflow: 'hidden' },
  balanceLabel: { fontSize: 12, fontFamily: fonts.sansMedium, color: 'rgba(255,255,255,0.6)' },
  balanceValue: { marginTop: 4, fontFamily: fonts.display, fontSize: 28, color: '#fff' },
  balanceRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savedMethod: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  savedMethodText: { fontSize: 11, fontFamily: fonts.sansMedium, color: 'rgba(255,255,255,0.7)' },
  topUpBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  topUpText: { color: '#fff', fontFamily: fonts.sansSemibold, fontSize: 12 },
  // 100 wasn't enough clearance for the WaveCap + TabBar + safe-area-bottom
  // stack sitting on top (roughly 120-125pt on notch/home-indicator devices)
  // — the last transaction row was getting hidden behind the opaque tab bar.
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 150, gap: 10 },
  sectionLabel: { marginTop: 8, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(11,11,15,0.05)' },
  txLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  txTime: { fontSize: 11, color: colors.ink.light },
  txAmount: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  txAmountPositive: { color: colors.primary.DEFAULT },
  tabBarOuter: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabBarWrap: { marginTop: -1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 8, paddingBottom: 12 },
})
