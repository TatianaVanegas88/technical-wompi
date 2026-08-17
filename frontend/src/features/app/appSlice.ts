import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  stock: number

  customerName: string
  email: string
  phone: string

  address: string
  city: string
  deliveryNotes: string

  paymentStatus: string
  message: string
  transactionId: string
}

const initialState: AppState = {
  stock: 10,

  customerName: '',
  email: '',
  phone: '',

  address: '',
  city: '',
  deliveryNotes: '',

  paymentStatus: '',
  message: '',
  transactionId: '',
}

const appSlice = createSlice({
  name: 'app',

  initialState,

  reducers: {
    setStock: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.stock = action.payload
    },

    setCustomerName: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.customerName = action.payload
    },

    setEmail: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.email = action.payload
    },

    setPhone: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.phone = action.payload
    },

    setAddress: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.address = action.payload
    },

    setCity: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.city = action.payload
    },

    setDeliveryNotes: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.deliveryNotes = action.payload
    },

    setPaymentStatus: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.paymentStatus = action.payload
    },

    setMessage: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.message = action.payload
    },

    setTransactionId: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.transactionId = action.payload
    },
  },
})

export const {
  setStock,
  setCustomerName,
  setEmail,
  setPhone,
  setAddress,
  setCity,
  setDeliveryNotes,
  setPaymentStatus,
  setMessage,
  setTransactionId,
} = appSlice.actions

export default appSlice.reducer