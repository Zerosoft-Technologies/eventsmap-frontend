import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from '../pages/Home.vue'
import CreateProfile from '../pages/CreateProfile.vue'
import CreateEventFree from '../pages/packages/CreateEventFree.vue'
import EventReport from '../pages/packages/events-navlinks/EventReport.vue'
import EventSettings from '../pages/packages/events-navlinks/EventSettings.vue'
import CreateEventPremium from '../pages/packages/CreateEventPremium.vue'
import EventPremiumReport from '../pages/packages/events-navlinks/EventPremiumReport.vue'
import EventPremiumSettings from '../pages/packages/events-navlinks/EventPremiumSettings.vue'

import CreateEventOrganiserFree from '../pages/packages/CreateEventOrganiserFree.vue'
import EventOrganiserReport from '../pages/packages/eventorganiser-navlinks/EventOrganiserReport.vue'
import EventOrganiserSettings from '../pages/packages/eventorganiser-navlinks/EventOrganiserSettings.vue'
import CreateEventOrganiserPremium from '../pages/packages/CreateEventOrganiserPremium.vue'
import EventOrganiserPremiumReport from '../pages/packages/eventorganiser-navlinks/EventOrganiserPremiumReport.vue'
import EventOrganiserPremiumSettings from '../pages/packages/eventorganiser-navlinks/EventOrganiserPremiumSettings.vue'

import CreateTalentsFree from '../pages/packages/CreateTalentsFree.vue'
import TalentsReport from '../pages/packages/talents-navlinks/TalentsReport.vue'
import TalentsSettings from '../pages/packages/talents-navlinks/TalentsSettings.vue'
import CreateTalentsPremium from '../pages/packages/CreateTalentsPremium.vue'
import TalentsPremiumReport from '../pages/packages/talents-navlinks/TalentsPremiumReport.vue'
import TalentsPremiumSettings from '../pages/packages/talents-navlinks/TalentsPremiumSettings.vue'

import CreateVenueFree from '../pages/packages/CreateVenueFree.vue'
import VenueReport from '../pages/packages/venue-navlinks/VenueReport.vue'
import VenueSettings from '../pages/packages/venue-navlinks/VenueSettings.vue'
import CreateVenuePremium from '../pages/packages/CreateVenuePremium.vue'
import VenuePremiumReport from '../pages/packages/venue-navlinks/VenuePremiumReport.vue'
import VenuePremiumSettings from '../pages/packages/venue-navlinks/VenuePremiumSettings.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },

  { path: '/create-profile', name: 'CreateProfile', component: CreateProfile },

  { path: '/create-event-free', name: 'CreateEventFree', component: CreateEventFree },

  { path: '/create-event-free/report', name: 'EventReport', component: EventReport },

  { path: '/create-event-free/settings', name: 'EventSettings', component: EventSettings },

  { path: '/create-event-premium', name: 'CreateEventPremium', component: CreateEventPremium },

  { path: '/create-event-premium/report', name: 'EventPremiumReport', component: EventPremiumReport },

  { path: '/create-event-premium/settings', name: 'EventPremiumSettings', component: EventPremiumSettings },

  { path: '/create-event-organiser-free', name: 'CreateEventOrganiserFree', component: CreateEventOrganiserFree },

  { path: '/create-event-organiser-free/report', name: 'EventOrganiserReport', component: EventOrganiserReport },

  { path: '/create-event-organiser-free/settings', name: 'EventOrganiserSettings', component: EventOrganiserSettings },

  { path: '/create-event-organiser-premium', name: 'CreateEventOrganiserPremium', component: CreateEventOrganiserPremium },

  { path: '/create-event-organiser-premium/report', name: 'EventOrganiserPremiumReport', component: EventOrganiserPremiumReport },

  { path: '/create-event-organiser-premium/settings', name: 'EventOrganiserPremiumSettings', component: EventOrganiserPremiumSettings },

  { path: '/create-talents-free', name: 'CreateTalentsFree', component: CreateTalentsFree },

  { path: '/create-talents-free/report', name: 'TalentsReport', component: TalentsReport },

  { path: '/create-talents-free/settings', name: 'TalentsSettings', component: TalentsSettings },

  { path: '/create-talents-premium', name: 'CreateTalentsPremium', component: CreateTalentsPremium },

  { path: '/create-talents-premium/report', name: 'TalentsPremiumReport', component: TalentsPremiumReport },

  { path: '/create-talents-premium/settings', name: 'TalentsPremiumSettings', component: TalentsPremiumSettings },

  { path: '/create-venue-free', name: 'CreateVenueFree', component: CreateVenueFree },

  { path: '/create-venue-free/report', name: 'VenueReport', component: VenueReport },

  { path: '/create-venue-free/settings', name: 'VenueSettings', component: VenueSettings },

  { path: '/create-venue-premium', name: 'CreateVenuePremium', component: CreateVenuePremium },

  { path: '/create-venue-premium/report', name: 'VenuePremiumReport', component: VenuePremiumReport },

  { path: '/create-venue-premium/settings', name: 'VenuePremiumSettings', component: VenuePremiumSettings },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
