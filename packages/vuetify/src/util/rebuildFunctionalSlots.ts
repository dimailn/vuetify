import type { CreateElement, VNode } from '../types/vue-internal'

export default function rebuildFunctionalSlots (slots: { [key: string]: VNode[] | undefined }, h: CreateElement) {
  const children: VNode[] = []

  for (const slot in slots) {
    if (slots.hasOwnProperty(slot)) {
      children.push(h('template', { slot }, slots[slot]))
    }
  }

  return children
}
