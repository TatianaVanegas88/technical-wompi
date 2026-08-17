import { describe, test, expect } from '@jest/globals'
import reducer, {
  setStock,
  setCustomerName,
} from './appSlice'

describe('appSlice', () => {
  test('debe cambiar el stock', () => {
    const initialState = reducer(undefined, {
      type: '@@INIT',
    })

    const state = reducer(
      initialState,
      setStock(5),
    )

    expect(state.stock).toBe(5)
  })

  test('debe guardar el nombre del cliente', () => {
    const initialState = reducer(undefined, {
      type: '@@INIT',
    })

    const state = reducer(
      initialState,
      setCustomerName('Tatiana'),
    )

    expect(state.customerName).toBe('Tatiana')
  })
})