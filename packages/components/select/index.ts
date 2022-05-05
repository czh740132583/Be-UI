/*
 * @index.ts
 * @deprecated
 * @author czh
 * @update (czh 2021/10/27)
 */

import {App} from 'vue'
import beSelect from './src/be-select'
import beSelectMultiple from './src/be-select-multiple'
import type {SFCWithInstall} from '../../utils/type/types'
import '../../style/be-select.scss'

/**
 * 组件装载方法
 * @param app
 */
beSelect.install = (app: App): void => {
  app.component(beSelect.name, beSelect)
}
export const BeSelect = beSelect as SFCWithInstall<typeof beSelect>

/**
 * 组件装载方法
 * @param app
 */
beSelectMultiple.install = (app: App): void => {
  app.component(beSelectMultiple.name, beSelectMultiple)
}
export const BeSelectMultiple = beSelectMultiple as SFCWithInstall<typeof beSelectMultiple>
