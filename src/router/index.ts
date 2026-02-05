import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from '../pages/Home.vue'
import CreateProfile from '../pages/CreateProfile.vue'
import CreateEventFree from '../pages/packages/CreateEventFree.vue'
import EventReport from '../pages/packages/eventsettings/EventReport.vue'
import EventSettings from '../pages/packages/eventsettings/EventSettings.vue'
import CreateEventOrganiserFree from '../pages/packages/CreateEventOrganiserFree.vue'
import CreateTalentsFree from '../pages/packages/CreateTalentsFree.vue'
import CreateVenueFree from '../pages/packages/CreateVenueFree.vue'
import CreateEventPremium from '../pages/packages/CreateEventPremium.vue'
import EventPremiumReport from '../pages/packages/eventsettings/EventPremiumReport.vue'
import EventPremiumSettings from '../pages/packages/eventsettings/EventPremiumSettings.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },

  { path: '/create-profile', name: 'CreateProfile', component: CreateProfile },

  { path: '/create-event-free', name: 'CreateEventFree', component: CreateEventFree },

  { path: '/create-event-free/report', name: 'EventReport', component: EventReport },

  { path: '/create-event-free/settings', name: 'EventSettings', component: EventSettings },

  { path: '/create-event-organiser-free', name: 'CreateEventOrganiserFree', component: CreateEventOrganiserFree },

  { path: '/create-talents-free', name: 'CreateTalentsFree', component: CreateTalentsFree },

  { path: '/create-venue-free', name: 'CreateVenueFree', component: CreateVenueFree },

  { path: '/create-event-premium', name: 'CreateEventPremium', component: CreateEventPremium },

  { path: '/create-event-premium/report', name: 'EventPremiumReport', component: EventPremiumReport },

  { path: '/create-event-premium/settings', name: 'EventPremiumSettings', component: EventPremiumSettings },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
