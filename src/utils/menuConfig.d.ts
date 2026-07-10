import type { Component } from 'vue'

export interface SidebarMenuItem {
  id: string
  icon: Component
  label?: string
  route?: string
}

export const createEventPremiumMenuItems: SidebarMenuItem[]

export const menuConfigs: Record<string, SidebarMenuItem[]>

export function getMenuItems(pageType: string): SidebarMenuItem[]
