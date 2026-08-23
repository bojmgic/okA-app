/**
 * Ported from okA-website/src/data/appPreview.ts (+ vehicles.ts / photos.ts
 * folded in directly, since this app doesn't need the web site's separate
 * "real vehicle spec" vs "app preview mock pricing" split — here it's all
 * app data). Same field names, same mock numbers, so this native app and
 * the web app-preview describe the same product.
 */

const okaMotorbikeTransparent = require('../assets/vehicles/okA-app-png-temp/oka-motorbike-transparent.png')
const okaTricycleTransparent = require('../assets/vehicles/okA-app-png-temp/oka-tricycle-transparent.png')
const okaAboboyaaCargoTransparent = require('../assets/vehicles/okA-app-png-temp/oka-aboboyaa-cargo.png')

export interface VehicleOption {
  id: string
  name: string
  tagline: string
  description: string
  capacity: string
  priceGHS: number
  etaMins: number
  image: number
}

export const vehicleOptions: VehicleOption[] = [
  {
    id: 'okada',
    name: 'okAda',
    tagline: 'Quick through the city.',
    description: 'Fast urban transport and small package delivery when every minute matters.',
    capacity: 'Fast & light',
    priceGHS: 15,
    etaMins: 3,
    image: okaMotorbikeTransparent,
  },
  {
    id: 'tricycle',
    name: 'okA Tricycle (K3K3)',
    tagline: 'Room to move, room to carry.',
    description: 'Passenger and medium cargo transportation across the city, comfortable and dependable.',
    capacity: 'Passengers + medium cargo',
    priceGHS: 25,
    etaMins: 5,
    image: okaTricycleTransparent,
  },
  {
    id: 'aboboyaa',
    name: 'Aboboyaa Cargo',
    tagline: 'Built for the big move.',
    description:
      'Heavy cargo and commercial deliveries up to 500kg — building materials, food supplies, commercial goods, and furniture.',
    capacity: 'Up to 500kg',
    priceGHS: 60,
    etaMins: 8,
    image: okaAboboyaaCargoTransparent,
  },
]

export const mockRider = {
  name: 'Kwame Boateng',
  rating: 4.9,
  plate: 'GR 4521-24',
  vehicle: 'okAda',
  memberSince: 2023,
  totalTrips: 1284,
}

export const mockCustomer = {
  name: 'Ama Owusu',
  rating: 4.8,
  memberSince: 2024,
  totalRides: 62,
}

export const sendStatusSteps = ['Confirmed', 'Picked up', 'On the way', 'Delivered'] as const
export const driverTripSteps = ['Heading to pickup', 'Arrived — waiting', 'Trip in progress', 'Completed'] as const

export const incomingRequest = {
  type: 'ride' as 'ride' | 'send',
  fareGHS: 32,
  distanceKm: 6.4,
  etaPickupMins: 4,
  pickup: 'Osu, Accra',
  dropoff: 'Airport Residential Area',
  customer: mockCustomer,
}

export const earningsSummary = {
  todayGHS: 184,
  todayTrips: 7,
  weekGHS: 1120,
  cashOutAvailableGHS: 184,
}

export const recentTrips = [
  { id: 't1', label: 'Osu → Airport Residential', fareGHS: 32, time: '2:41 PM' },
  { id: 't2', label: 'Labone → Osu', fareGHS: 18, time: '1:55 PM' },
  { id: 't3', label: 'East Legon → Achimota', fareGHS: 45, time: '12:20 PM' },
  { id: 't4', label: 'Package → Dzorwulu', fareGHS: 22, time: '11:05 AM' },
]

export const walletBalance = { balanceGHS: 64, savedMethod: 'MTN MoMo •••• 4521' }

export const walletTransactions = [
  { id: 'w1', label: 'Ride — okAda', amountGHS: -15, time: 'Today, 2:41 PM' },
  { id: 'w2', label: 'Wallet top-up', amountGHS: 50, time: 'Yesterday, 9:02 AM' },
  { id: 'w3', label: 'Send — K3K3', amountGHS: -25, time: 'Mon, 4:18 PM' },
  { id: 'w4', label: 'Wallet top-up', amountGHS: 100, time: 'Sat, 11:30 AM' },
]

export const okaPoints = {
  customer: { balance: 1240, tier: 'Silver', nextTier: 'Gold', pointsToNextTier: 260, tierProgress: 0.68 },
  rider: { balance: 3180, tier: 'Gold', nextTier: 'Platinum', pointsToNextTier: 820, tierProgress: 0.42 },
}

export const redeemOptions = [
  { id: 'discount10', label: 'GHS 10 off your next trip', pointsCost: 250 },
  { id: 'freeride', label: 'Free okAda ride', pointsCost: 500 },
]

export const customerMission = {
  label: 'Take 3 rides this week',
  progress: 2,
  target: 3,
  rewardLabel: '+50 bonus points',
}

export const riderMission = {
  label: 'Complete 5 trips today',
  progress: 3,
  target: 5,
  rewardLabel: '+GHS 20 bonus',
}

export const weeklySpend = [
  { day: 'M', valueGHS: 18 },
  { day: 'T', valueGHS: 32 },
  { day: 'W', valueGHS: 12 },
  { day: 'T', valueGHS: 45 },
  { day: 'F', valueGHS: 28 },
  { day: 'S', valueGHS: 60 },
  { day: 'S', valueGHS: 15 },
]

export const weeklyEarnings = [
  { day: 'M', valueGHS: 120 },
  { day: 'T', valueGHS: 145 },
  { day: 'W', valueGHS: 98 },
  { day: 'T', valueGHS: 168 },
  { day: 'F', valueGHS: 184 },
  { day: 'S', valueGHS: 210 },
  { day: 'S', valueGHS: 76 },
]

export const activityHistory = [
  {
    date: 'Today',
    trips: [
      { id: 'a1', type: 'ride' as const, label: 'Osu → Airport Residential', vehicle: 'okAda', fareGHS: 32, time: '2:41 PM', status: 'Completed' as const },
      { id: 'a2', type: 'send' as const, label: 'Package to Dzorwulu', vehicle: 'Tricycle', fareGHS: 22, time: '11:05 AM', status: 'Completed' as const },
    ],
  },
  {
    date: 'Yesterday',
    trips: [
      { id: 'a3', type: 'ride' as const, label: 'Labone → Osu', vehicle: 'okAda', fareGHS: 18, time: '5:55 PM', status: 'Completed' as const },
      { id: 'a4', type: 'ride' as const, label: 'East Legon → Achimota', vehicle: 'Aboboyaa', fareGHS: 45, time: '12:20 PM', status: 'Cancelled' as const },
    ],
  },
  {
    date: 'Mon, 12 Aug',
    trips: [
      { id: 'a5', type: 'send' as const, label: 'Package to Spintex', vehicle: 'Tricycle', fareGHS: 27, time: '4:18 PM', status: 'Completed' as const },
    ],
  },
]

export const notifications = [
  { id: 'n1', kind: 'trip' as const, title: 'Your rider is arriving', body: 'Kwame is 2 minutes from your pickup point.', time: '2m ago', unread: true },
  { id: 'n2', kind: 'promo' as const, title: 'Weekend fare — 20% off okAda', body: 'Book any okAda ride before Sunday to save.', time: '3h ago', unread: true },
  { id: 'n3', kind: 'account' as const, title: 'Payment method added', body: 'MTN MoMo •••• 4521 was saved to your wallet.', time: 'Yesterday', unread: false },
  { id: 'n4', kind: 'trip' as const, title: 'Trip receipt ready', body: 'GHS 18 — Labone to Osu.', time: 'Yesterday', unread: false },
  { id: 'n5', kind: 'system' as const, title: 'okA Points expiring soon', body: '260 points expire at the end of the month.', time: '2 days ago', unread: false },
]
