/*
* @input-number.test.ts
* @deprecated be-input-number组件单元测试
* @author czh
* @update (czh 2021/11/18)
*/
import {mount} from '@vue/test-utils'
import BeInputNumber from '../src/be-input-number'
import {ComponentInternalInstance, getCurrentInstance, nextTick, onMounted, ref} from "vue";
import {asyncExpect} from "../../../utils/utils";
const mousedown = new Event('mousedown')

interface IInputNumTest extends ComponentInternalInstance {
    blur: Function
    focus: Function
    select: Function
}

const _mount = (options: any) =>
    mount({
        components: {
            'BeInputNumber': BeInputNumber,
        },
        ...options,
    })
/**
 * 测试props生效
 * @param options
 */
describe('test-be-input-number-props', () => {
    test('props-size-mini', async () => {
        const wrapper = await mount(BeInputNumber, {
            props: {
                size: 'mini'
            },
        })

        expect(wrapper.find('.be-input-number__mini').exists()).toBeTruthy()
    })
    test('props-size-medium', async () => {
        const wrapper = await mount(BeInputNumber, {
            props: {
                size: 'medium'
            },
        })
        expect(wrapper.find('.be-input-number__medium').exists()).toBeTruthy()
    })
    test('props-size-large', async () => {
        const wrapper = await mount(BeInputNumber, {
            props: {
                size: 'large'
            },
        })
        expect(wrapper.find('.be-input-number__large').exists()).toBeTruthy()
    })
    test('props-disabled', async () => {
        const wrapper = await _mount({
            template: '<BeInputNumber :disabled="true" v-model="num" />',
            setup() {
                const num = ref(0)
                return {
                    num,
                }
            },
        })
        wrapper.find('.be-input-number__up').trigger('mousedown')
        document.dispatchEvent(mousedown)
        await nextTick()
        expect(wrapper.find('input').element.value).toEqual('0')
        wrapper.find('.be-input-number__down').trigger('mousedown')
        document.dispatchEvent(mousedown)
        await nextTick()
        expect(wrapper.find('input').element.value).toEqual('0')
    })
    test('props-render-pre-next', async () => {
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num">
                <template #next><span id="test_next">next</span></template>
                <template #pre><span id="test_pre">pre</span></template>
                </BeInputNumber>`,
            setup() {
                const num = ref(0)
                return {
                    num,
                }
            },
        })
        expect(wrapper.find('#test_next').exists()).toBeTruthy()
        expect(wrapper.find('#test_pre').exists()).toBeTruthy()
    })
    test('props-render-exceed', async () => {
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num" max="10">
                <template #next><span id="test_next">next</span></template>
                <template #pre><span id="test_pre">pre</span></template>
                </BeInputNumber>`,
            setup() {
                const num = ref(11)
                return {
                    num,
                }
            },
        })
        expect(wrapper.find('.be-input-number__limit').exists()).toBeTruthy()
    })
    test('props-render-max', async () => {
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num" max="10">
                </BeInputNumber>
            `,
            setup() {
                const num = ref(11)
                return {
                    num,
                }
            },
        })
         wrapper.find('.be-input-number__up').trigger('click')
        expect(wrapper.vm.num).toEqual(10)
    })
    test('props-render-min', async () => {
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num" min="10">
                </BeInputNumber>
            `,
            setup() {
                const num = ref(10)
                return {
                    num,
                }
            },
        })
        wrapper.find('.be-input-number__down').trigger('click')
        expect(wrapper.vm.num).toEqual(10)
    })
    test('props-render-keyboard', async () => {
        const handlePressEnterJest = jest.fn()
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num" ref="BeInputNumbers"
                               @pressEnter="handlePressEnterJest">
                </BeInputNumber>`,
            setup() {
                const curInst = getCurrentInstance()
                const num = ref(1)
                return {
                    num,
                    curInst,
                    handlePressEnterJest,
                }
            },
        })
        debugger
        await wrapper.vm.curInst.refs.BeInputNumbers.focus()
        let event = new KeyboardEvent('keydown', {'key': 'Enter'});
        await wrapper.vm.curInst.refs.BeInputNumbers.$el.dispatchEvent(event);
        wrapper.find('input').trigger('keydown',{'key': 'Enter'})
        expect(handlePressEnterJest).toBeCalled()
    })
})
describe('test-be-input-number-event', () => {
    test('event:change', async () => {
        const handleChangeJest = jest.fn()
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num" ref="BeInputNumbers"
                               @change="handleChange">
                </BeInputNumber>`,
            setup() {
                const num = ref(1)
                const handleChange = (val:string): void => {
                    handleChangeJest(val)
                }
                return {
                    num,
                    handleChange,
                }
            },
        })
        const el = wrapper.find('input').element
        const simulateEvent = (text:string, event:string) => {
            el.value = text
            el.dispatchEvent(new Event(event))
        }
        simulateEvent('2', 'change')
        await asyncExpect(() => {
            expect(handleChangeJest).toBeCalled()
        }, 500)
    })
    test('event:step',  () => {
        const handleStepJest = jest.fn()
        const wrapper =  _mount({
            template: `
                <BeInputNumber v-model="num" ref="BeInputNumbers"
                               @step="handleStepJest">
                </BeInputNumber>`,
            setup() {
                const num = ref(1)
                return {
                    num,
                    handleStepJest,
                }
            },
        })
        wrapper.find('.be-input-number__up').trigger('click');
        expect(handleStepJest).toBeCalled()
        wrapper.find('.be-input-number__down').trigger('click');
        expect(handleStepJest).toBeCalled()
    })
    test('event:pressEnter', async () => {
        const handlePressEnterJest = jest.fn()
        const wrapper = await mount(BeInputNumber, {
            props: {
                size: 'mini',
                keyboard:true,
                onPressEnter:handlePressEnterJest
            },
        })
        await wrapper.vm.focus()
        let event = new KeyboardEvent('keydown', {'key': 'Enter'});
        await wrapper.vm.$el.dispatchEvent(event);
        wrapper.find('input').trigger('keydown',{'key': 'Enter'})
        expect(handlePressEnterJest).toBeCalled()
    })
})
/**
 * 测试公共方法
 */
describe('test-be-input-number-public-function', () => {
    test('public-function-focus-blur-select', async () => {
        const handleFocusJest = jest.fn()
        const handleBlurJest = jest.fn()
        const handleSelectJest = jest.fn()
        const wrapper = await _mount({
            template: `
                <BeInputNumber v-model="num" ref="BeInputNumbers"
                               @select="handleSelect"
                               @focus="handleFocus"
                               @blur="handleBlur">
                </BeInputNumber>`,
            setup() {
                const curInst = getCurrentInstance()
                const num = ref(1)
                const handleFocus = (): void => {
                    handleFocusJest()
                }
                const handleBlur = (): void => {
                    handleBlurJest()
                }
                const handleSelect = (): void => {
                    handleSelectJest()
                }
                const manualFocus = (): void => {
                    curInst && (curInst.refs.BeInputNumbers as IInputNumTest).focus()
                }
                const manualBlur = (): void => {
                    curInst && (curInst.refs.BeInputNumbers as IInputNumTest).blur()
                }
                const manualSelect = (): void => {
                    curInst && (curInst.refs.BeInputNumbers as IInputNumTest).select()
                }
                return {
                    num,
                    manualFocus,
                    manualBlur,
                    manualSelect,
                    handleFocus,
                    handleBlur,
                    handleSelect,
                }
            },
        })
        wrapper.vm.manualFocus()
        await nextTick()
        expect(handleFocusJest).toBeCalled()
        wrapper.vm.manualBlur()
        await nextTick()
        expect(handleBlurJest).toBeCalled()
        wrapper.vm.manualSelect()
        await nextTick()
        expect(handleSelectJest).toBeCalled()
    })
})
