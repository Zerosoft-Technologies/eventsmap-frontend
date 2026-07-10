import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  SkipBackIcon,
  UserPlus,
  Images,
  MessageSquareText,
} from 'lucide-vue-next'

/** Canonical sidebar for /create-event-premium and all child routes */
export const createEventPremiumMenuItems = [
  { id: 'home', icon: Home, label: 'Home', route: '/create-event-premium' },
  { id: 'details', icon: FileText, label: 'Details', route: '/create-event-premium' },
  { id: 'recurring', icon: Calendar, label: 'Recurring', route: '/create-event-premium/recurring-series' },
  { id: 'analytics', icon: BarChart3, route: '/create-event-premium/report', label: 'Analytics' },
  { id: 'gallery', label: 'Gallery', icon: Images, route: '/create-event-premium/gallery-images' },
  { id: 'settings', icon: Settings, route: '/create-event-premium/settings', label: 'Settings' },
  { id: 'invites', icon: UserPlus, label: 'Invites', route: '/create-event-premium/invites' },
  { id: 'back', icon: SkipBackIcon, label: 'Back' },
  { id: 'chatbox', icon: MessageSquareText, label: 'Chatbox' },
]

export const menuConfigs = {
  createEventFree: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-event-free' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-event-free' },
    { id: 'analytics', icon: BarChart3, route: '/create-event-free/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-event-free/settings', label: 'Settings' },
    { id: 'invites', icon: UserPlus, label: 'Invites', route: '/create-event-free/invites' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ],
  createEventPremium: createEventPremiumMenuItems,
  createEventOrganiserFree: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-organiser-free' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-organiser-free' },
    { id: 'analytics', icon: BarChart3, route: '/create-organiser-free/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-organiser-free/settings', label: 'Settings' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ],
  createEventOrganiserPremium: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-organiser-premium' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-organiser-premium' },
    { id: 'analytics', icon: BarChart3, route: '/create-organiser-premium/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-organiser-premium/settings', label: 'Settings' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'back', icon: SkipBackIcon, label: 'Back' },
  ],
  createTalentsFree: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-talents-free' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-talents-free' },
    { id: 'analytics', icon: BarChart3, route: '/create-talents-free/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-talents-free/settings', label: 'Settings' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ],
  createTalentsPremium: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-talents-premium' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-talents-premium' },
    { id: 'analytics', icon: BarChart3, route: '/create-talents-premium/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-talents-premium/settings', label: 'Settings' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'back', icon: SkipBackIcon, label: 'Back' },
  ],
  createVenueFree: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-venue-free' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-venue-free' },
    { id: 'analytics', icon: BarChart3, route: '/create-venue-free/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-venue-free/settings', label: 'Settings' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ],
  createVenuePremium: [
    { id: 'home', icon: Home, label: 'Home', route: '/create-venue-premium' },
    { id: 'details', icon: FileText, label: 'Details', route: '/create-venue-premium' },
    { id: 'analytics', icon: BarChart3, route: '/create-venue-premium/report', label: 'Analytics' },
    { id: 'settings', icon: Settings, route: '/create-venue-premium/settings', label: 'Settings' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'back', icon: SkipBackIcon, label: 'Back' },
  ],
}

export function getMenuItems(pageType) {
  return menuConfigs[pageType] ?? menuConfigs.createEventFree
}
