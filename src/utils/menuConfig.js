import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  SkipBackIcon,
  UserPlus,
} from "lucide-vue-next"

// Menu configurations for all pages
export const menuConfigs = {
  // Event Free
  createEventFree: [
    { id: "home", icon: Home, label: "Home", route: "/create-event-free" },
    { id: "details", icon: FileText, label: "Details", route: "/create-event-free" },
    { id: "analytics", icon: BarChart3, route: "/create-event-free/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-event-free/settings", label: "Settings" },
    { id: "invites", icon: UserPlus, label: "Invites", route: "/create-event-free/invites" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
  ],

  // Event Premium
  createEventPremium: [
    { id: "home", icon: Home, label: "Home", route: "/create-event-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-event-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-event-premium/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-event-premium/settings", label: "Settings" },
    { id: "invites", icon: UserPlus, label: "Invites", route: "/create-event-premium/invites" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
  ],

  // Event Organiser Free
  createEventOrganiserFree: [
    { id: "home", icon: Home, label: "Home", route: "/create-organiser-free" },
    { id: "details", icon: FileText, label: "Details", route: "/create-organiser-free" },
    { id: "analytics", icon: BarChart3, route: "/create-organiser-free/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-organiser-free/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
  ],

  // Event Organiser Premium
  createEventOrganiserPremium: [
    { id: "home", icon: Home, label: "Home", route: "/create-organiser-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-organiser-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-organiser-premium/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-organiser-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
  ],

  // Talents Free
  createTalentsFree: [
    { id: "home", icon: Home, label: "Home", route: "/create-talents-free" },
    { id: "details", icon: FileText, label: "Details", route: "/create-talents-free" },
    { id: "analytics", icon: BarChart3, route: "/create-talents-free/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-talents-free/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
  ],

  // Talents Premium
  createTalentsPremium: [
    { id: "home", icon: Home, label: "Home", route: "/create-talents-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-talents-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-talents-premium/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-talents-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
  ],

  // Venue Free
  createVenueFree: [
    { id: "home", icon: Home, label: "Home", route: "/create-venue-free" },
    { id: "details", icon: FileText, label: "Details", route: "/create-venue-free" },
    { id: "analytics", icon: BarChart3, route: "/create-venue-free/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-venue-free/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
  ],

  // Venue Premium
  createVenuePremium: [
    { id: "home", icon: Home, label: "Home", route: "/create-venue-premium" },
    { id: "details", icon: FileText, label: "Details", route: "/create-venue-premium" },
    { id: "analytics", icon: BarChart3, route: "/create-venue-premium/report", label: "Analytics" },
    { id: "settings", icon: Settings, route: "/create-venue-premium/settings", label: "Settings" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "back", icon: SkipBackIcon, label: "Back" },
  ],
}

// Helper function to get menu items by page type
export function getMenuItems(pageType) {
  return menuConfigs[pageType] || menuConfigs.createEventFree
}