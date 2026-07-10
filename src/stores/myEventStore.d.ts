declare module '@/stores/myEventStore' {
  export function useMyEventStore(): {
    events: Array<Record<string, unknown>>
    selectedEventId: number | null
    loading: boolean
    fetchMyEvents: () => Promise<void>
    selectEvent: (id: number) => void
    setPendingEditorEventId: (id: number | null) => void
    takePendingEditorEventId: () => number | null
    mergeListItem: (id: number, fields: Record<string, unknown>) => void
  }
}

declare module '@/stores/myEventStore.js' {
  export * from '@/stores/myEventStore'
}
