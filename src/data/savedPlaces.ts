import { Home, Briefcase, Star } from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'

export interface SavedPlace {
  id: string
  icon: LucideIcon
  label: string
  detail: string
}

// Single source of truth for the customer's saved addresses — shared between
// HomeScreen's quick-pick list and SavedPlacesScreen's full editable list
// (both live off state lifted to RootApp) so adding/removing a place in one
// place is reflected in the other instead of two independently-seeded lists.
export const initialSavedPlaces: SavedPlace[] = [
  { id: 'home', icon: Home, label: 'Home', detail: 'East Legon' },
  { id: 'work', icon: Briefcase, label: 'Work', detail: 'Airport City' },
  { id: 'mall', icon: Star, label: 'Accra Mall', detail: 'Frequent stop' },
]
