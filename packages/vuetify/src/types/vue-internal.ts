/**
 * Внутренние типы рендера Vuetify (mergeData, h, директивы).
 * Явные импорты вместо дополнения модуля `vue`.
 */
import type { Component, DirectiveBinding, VNode, VNodeArrayChildren, VNodeChild } from 'vue'

export type { VNode }

/** Объект данных для mergeData / второго аргумента h() в legacy-gen* */
export interface VNodeData {
  [key: string]: any
  model?: {
    callback: (v: any) => void
    expression: string
    value: any
  }
}

export type CreateElement = (
  type: any,
  props?: VNodeData | null,
  children?: any
) => VNode

export type VNodeDirective = DirectiveBinding

export type VNodeChildren = VNodeChild
export type VNodeChildrenArrayContents = VNodeArrayChildren

/** Объекты переходов с `functional: true` до полного перевода на функциональный API Vue 3 */
export type FunctionalComponentOptions = Component

/** Аналог старых PropOptions для reduce-конфигов пропсов в VGrid */
export type PropOptions = Record<string, any>
