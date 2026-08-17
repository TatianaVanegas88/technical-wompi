import { useState } from 'react'
import './App.css'

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// ============================================================
// CONFIGURACIÓN
// ============================================================

const WOMPI_API_URL =
  import.meta.env.VITE_WOMPI_API_URL ||
  'https://api-sandbox.co.uat.wompi.dev/v1'

const WOMPI_PUBLIC_KEY =
  import.meta.env.VITE_WOMPI_PUBLIC_KEY

const BACKEND_URL = 'http://localhost:3000'

// ============================================================
// APP
// ============================================================

function App() {
  const dispatch = useDispatch<AppDispatch>()

  // ============================================================
  // REDUX STATE
  // ============================================================

  const {
    stock,
    customerName,
    email,
    phone,
    address,
    city,
    deliveryNotes,
    paymentStatus,
    message,
    transactionId,
  } = useSelector((state: RootState) => state.app)

  // ============================================================
  // ESTADOS LOCALES DE UI
  // ============================================================

  const [showPayment, setShowPayment] = useState(false)

  const [cardNumber, setCardNumber] = useState('')
  const [cvc, setCvc] = useState('')
  const [expMonth, setExpMonth] = useState('')
  const [expYear, setExpYear] = useState('')
  const [cardHolder, setCardHolder] = useState('')

  const [installments, setInstallments] = useState(1)

  const [loading, setLoading] = useState(false)

  // ============================================================
  // PRODUCTO
  // ============================================================

  const product = {
    name: 'Labial Velvet Matte',
    description:
      'Labial de larga duración con acabado mate y textura cremosa. Ideal para uso diario.',
    price: 50000,
  }

  // ============================================================
  // COSTOS
  // ============================================================

  const baseFee = 5000
  const deliveryFee = 8000

  const total =
    product.price +
    baseFee +
    deliveryFee

  // El backend recibe pesos.
  // El backend se encarga de convertir a centavos para Wompi.

  const amount = String(total)

  // ============================================================
  // FORMATEAR DINERO
  // ============================================================

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value)

  const formattedPrice =
    formatCurrency(product.price)

  const formattedBaseFee =
    formatCurrency(baseFee)

  const formattedDeliveryFee =
    formatCurrency(deliveryFee)

  const formattedTotal =
    formatCurrency(total)

  // ============================================================
  // ESPERA
  // ============================================================

  const wait = (ms: number) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms),
    )

  // ============================================================
  // CREAR CUSTOMER
  // ============================================================

  const createCustomer = async () => {
    const response = await fetch(
      `${BACKEND_URL}/customers`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      },
    )

    const text = await response.text()

    let data: any = {}

    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      throw new Error(
        `El backend respondió algo que no es JSON al crear el cliente. HTTP ${response.status}`,
      )
    }

    console.log(
      'Respuesta creación customer:',
      data,
    )

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `No fue posible crear el cliente. HTTP ${response.status}`,
      )
    }

    const customerId =
      data?.data?.id

    if (!customerId) {
      throw new Error(
        'El backend creó el cliente pero no devolvió su ID.',
      )
    }

    return customerId
  }

  // ============================================================
  // CREAR DELIVERY
  // ============================================================

  const createDelivery = async (
    customerId: string,
  ) => {
    const response = await fetch(
      `${BACKEND_URL}/deliveries`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          customerId,
          address: address.trim(),
          city: city.trim(),
          notes: deliveryNotes.trim(),
        }),
      },
    )

    const text = await response.text()

    let data: any = {}

    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      throw new Error(
        `El backend respondió algo que no es JSON al crear el envío. HTTP ${response.status}`,
      )
    }

    console.log(
      'Respuesta creación delivery:',
      data,
    )

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `No fue posible crear la información de entrega. HTTP ${response.status}`,
      )
    }

    const deliveryId =
      data?.data?.id

    if (!deliveryId) {
      throw new Error(
        'El backend creó la entrega pero no devolvió su ID.',
      )
    }

    return deliveryId
  }

  // ============================================================
  // CONSULTAR ESTADO DEL PAGO
  // ============================================================

  const checkPaymentStatus = async (
    id: string,
    attempt = 1,
  ) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/payments/${id}`,
      )

      const data = await response.json()

      console.log(
        'Estado de la transacción:',
        data,
      )

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            'No se pudo consultar el estado del pago.',
        )
      }

      const status =
        data?.data?.status

      // Redux
      dispatch({
        type: 'app/setPaymentStatus',
        payload: status || '',
      })

      // ========================================================
      // APROBADO
      // ========================================================

      if (status === 'APPROVED') {
        dispatch({
          type: 'app/setMessage',
          payload:
            '✅ Pago aprobado correctamente.',
        })

        dispatch({
          type: 'app/setStock',
          payload: Math.max(stock - 1, 0),
        })

        return
      }

      // ========================================================
      // RECHAZADO
      // ========================================================

      if (status === 'DECLINED') {
        dispatch({
          type: 'app/setMessage',
          payload: '❌ Pago rechazado.',
        })

        return
      }

      // ========================================================
      // ERROR
      // ========================================================

      if (status === 'ERROR') {
        dispatch({
          type: 'app/setMessage',
          payload:
            '❌ Ocurrió un error procesando el pago.',
        })

        return
      }

      // ========================================================
      // ANULADO
      // ========================================================

      if (status === 'VOIDED') {
        dispatch({
          type: 'app/setMessage',
          payload:
            '❌ El pago fue anulado.',
        })

        return
      }

      // ========================================================
      // PENDIENTE
      // ========================================================

      if (status === 'PENDING') {
        if (attempt >= 10) {
          dispatch({
            type: 'app/setMessage',
            payload:
              '⏳ El pago continúa pendiente. Consulta el estado más tarde.',
          })

          return
        }

        dispatch({
          type: 'app/setMessage',
          payload: `⏳ Pago pendiente. Verificando... (${attempt}/10)`,
        })

        await wait(2000)

        await checkPaymentStatus(
          id,
          attempt + 1,
        )

        return
      }

      // ========================================================
      // OTROS ESTADOS
      // ========================================================

      dispatch({
        type: 'app/setMessage',
        payload: `Estado de pago recibido: ${
          status || 'DESCONOCIDO'
        }`,
      })
    } catch (error) {
      console.error(
        'Error consultando el pago:',
        error,
      )

      dispatch({
        type: 'app/setMessage',
        payload:
          error instanceof Error
            ? error.message
            : 'No fue posible consultar el estado del pago.',
      })
    }
  }

  // ============================================================
  // CREAR PAGO
  // ============================================================

  const createPayment = async () => {
    dispatch({
      type: 'app/setMessage',
      payload: '',
    })

    dispatch({
      type: 'app/setPaymentStatus',
      payload: '',
    })

    dispatch({
      type: 'app/setTransactionId',
      payload: '',
    })

    // ==========================================================
    // VALIDAR STOCK
    // ==========================================================

    if (stock <= 0) {
      dispatch({
        type: 'app/setMessage',
        payload:
          '❌ No hay unidades disponibles.',
      })

      return
    }

    // ==========================================================
    // VALIDAR CAMPOS
    // ==========================================================

    if (
      !customerName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !cardNumber.trim() ||
      !cvc.trim() ||
      !expMonth.trim() ||
      !expYear.trim() ||
      !cardHolder.trim()
    ) {
      dispatch({
        type: 'app/setMessage',
        payload:
          'Completa todos los datos de pago y entrega.',
      })

      return
    }

    // ==========================================================
    // VALIDAR LLAVE PÚBLICA
    // ==========================================================

    if (!WOMPI_PUBLIC_KEY) {
      dispatch({
        type: 'app/setMessage',
        payload:
          'No se encontró la llave pública de Wompi.',
      })

      return
    }

    setLoading(true)

    try {
      // ========================================================
      // 1. CREAR CUSTOMER
      // ========================================================

      dispatch({
        type: 'app/setMessage',
        payload:
          '⏳ Registrando datos del cliente...',
      })

      const customerId =
        await createCustomer()

      console.log(
        'Customer ID:',
        customerId,
      )

      // ========================================================
      // 2. CREAR DELIVERY
      // ========================================================

      dispatch({
        type: 'app/setMessage',
        payload:
          '⏳ Registrando información de entrega...',
      })

      const deliveryId =
        await createDelivery(
          customerId,
        )

      console.log(
        'Delivery ID:',
        deliveryId,
      )

      // ========================================================
      // 3. NORMALIZAR TARJETA
      // ========================================================

      const cleanCardNumber =
        cardNumber.replace(/\s/g, '')

      const cleanCvc =
        cvc.replace(/\s/g, '')

      const cleanMonth =
        expMonth
          .trim()
          .padStart(2, '0')

      const cleanYear =
        expYear.trim()

      // ========================================================
      // 4. TOKENIZAR TARJETA CON WOMPI
      // ========================================================

      dispatch({
        type: 'app/setMessage',
        payload:
          '⏳ Validando información de pago...',
      })

      const tokenResponse =
        await fetch(
          `${WOMPI_API_URL}/tokens/cards`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${WOMPI_PUBLIC_KEY}`,
            },

            body: JSON.stringify({
              number:
                cleanCardNumber,

              cvc:
                cleanCvc,

              exp_month:
                cleanMonth,

              exp_year:
                cleanYear,

              card_holder:
                cardHolder.trim(),
            }),
          },
        )

      const tokenText =
        await tokenResponse.text()

      let tokenData: any = {}

      try {
        tokenData =
          tokenText
            ? JSON.parse(tokenText)
            : {}
      } catch {
        throw new Error(
          `Wompi respondió algo que no es JSON. HTTP ${tokenResponse.status}`,
        )
      }

      console.log(
        'Respuesta tokenización:',
        tokenData,
      )

      if (!tokenResponse.ok) {
        const reason =
          tokenData?.error?.reason ||
          tokenData?.error?.message ||
          tokenData?.message ||
          `Error tokenizando tarjeta. HTTP ${tokenResponse.status}`

        throw new Error(reason)
      }

      const token =
        tokenData?.data?.id

      if (!token) {
        throw new Error(
          'Wompi no devolvió el token de la tarjeta.',
        )
      }

      console.log(
        'Token generado:',
        token,
      )

      // ========================================================
      // 5. ENVIAR PAGO AL BACKEND
      // ========================================================

      dispatch({
        type: 'app/setMessage',
        payload:
          '⏳ Creando transacción...',
      })

      const paymentResponse =
        await fetch(
          `${BACKEND_URL}/payments`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              amount:
                Number(amount),

              email:
                email.trim(),

              token,

              installments:
                Number(
                  installments,
                ),

              customerId,

              deliveryId,
            }),
          },
        )

      const paymentText =
        await paymentResponse.text()

      let paymentData: any = {}

      try {
        paymentData =
          paymentText
            ? JSON.parse(
                paymentText,
              )
            : {}
      } catch {
        throw new Error(
          `El backend respondió algo que no es JSON. HTTP ${paymentResponse.status}`,
        )
      }

      console.log(
        'Respuesta del backend:',
        paymentData,
      )

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData?.message ||
            paymentData?.error ||
            `Error creando el pago. HTTP ${paymentResponse.status}`,
        )
      }

      // ========================================================
      // 6. OBTENER ID DE WOMPI
      // ========================================================

      const wompiTransactionId =
        paymentData?.data?.id

      // ========================================================
      // 7. OBTENER ID DE TRANSACCIÓN INTERNA
      // ========================================================

      const internalTransactionId =
        paymentData
          ?.internalTransaction
          ?.id

      const id =
        wompiTransactionId ||
        internalTransactionId

      if (!id) {
        throw new Error(
          'El backend creó la transacción pero no devolvió un identificador.',
        )
      }

      dispatch({
        type: 'app/setTransactionId',
        payload: id,
      })

      console.log(
        'ID para consulta:',
        id,
      )

      console.log(
        'Transacción interna:',
        paymentData?.internalTransaction,
      )

      // ========================================================
      // 8. CONSULTAR ESTADO
      // ========================================================

      dispatch({
        type: 'app/setMessage',
        payload:
          '⏳ Pago creado. Verificando estado...',
      })

      await checkPaymentStatus(id)
    } catch (error) {
      console.error(
        'Error completo:',
        error,
      )

      dispatch({
        type: 'app/setMessage',
        payload:
          error instanceof Error
            ? error.message
            : 'No fue posible crear el pago.',
      })
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // PANTALLA DE PRODUCTO
  // ============================================================

  if (!showPayment) {
    return (
      <div className="app">

        <div className="product-page">

          <div className="product-header">

            <div className="logo">
              W
            </div>

            <div>
              <h1>
                Beauty Store
              </h1>

              <p>
                Productos de belleza
              </p>
            </div>

          </div>

          <div className="product-card">

            <div className="product-image">

              <div className="product-icon">
                💄
              </div>

            </div>

            <div className="product-info">

              <span className="product-tag">
                PRODUCTO
              </span>

              <h2>
                {product.name}
              </h2>

              <p className="product-description">
                {product.description}
              </p>

              <div className="product-price">
                {formattedPrice}
              </div>

              <div className="stock-box">

                <span className="stock-icon">
                  📦
                </span>

                <div>

                  <strong>
                    Unidades disponibles
                  </strong>

                  <span>
                    {stock} unidades
                  </span>

                </div>

              </div>

              <button
                className="buy-button"
                onClick={() => {

                  dispatch({
                    type: 'app/setMessage',
                    payload: '',
                  })

                  dispatch({
                    type: 'app/setPaymentStatus',
                    payload: '',
                  })

                  dispatch({
                    type: 'app/setTransactionId',
                    payload: '',
                  })

                  if (stock <= 0) {
                    dispatch({
                      type: 'app/setMessage',
                      payload:
                        '❌ No hay unidades disponibles.',
                    })

                    return
                  }

                  setShowPayment(true)
                }}
                disabled={stock <= 0}
              >
                {stock > 0
                  ? 'Comprar'
                  : 'Producto agotado'}
              </button>

            </div>

          </div>

          <div className="test-info">

            <div>

              <strong>
                Compra de prueba
              </strong>

              <p>
                Esta compra utiliza
                Wompi Sandbox para
                procesar el pago de
                prueba.
              </p>

            </div>

          </div>

        </div>

      </div>
    )
  }

  // ============================================================
  // PANTALLA DE PAGO
  // ============================================================

  return (
    <div className="app">

      <div className="payment-page">

        <button
          className="back-button"
          onClick={() => {

            if (!loading) {
              setShowPayment(false)
            }

          }}
          disabled={loading}
        >
          ← Volver al producto
        </button>

        <div className="card">

          <div className="logo">
            W
          </div>

          <h1>
            Pago Wompi
          </h1>

          <p className="subtitle">
            Completa los datos para
            realizar tu compra
          </p>

          {/* ==================================================
              RESUMEN DE COMPRA
          ================================================== */}

          <div className="order-summary">

            <div className="summary-row">

              <span>
                {product.name}
              </span>

              <strong>
                {formattedPrice}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Tarifa base
              </span>

              <strong>
                {formattedBaseFee}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Envío
              </span>

              <strong>
                {formattedDeliveryFee}
              </strong>

            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">

              <strong>
                Total
              </strong>

              <strong>
                {formattedTotal}
              </strong>

            </div>

          </div>

          <div className="form">

            {/* ==================================================
                DATOS DEL CLIENTE
            ================================================== */}

            <div className="section-title">
              Datos del cliente
            </div>

            <label>
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Nombre y apellido"
              value={customerName}
              onChange={(e) =>
                dispatch({
                  type:
                    'app/setCustomerName',
                  payload:
                    e.target.value,
                })
              }
            />

            <label>
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) =>
                dispatch({
                  type:
                    'app/setEmail',
                  payload:
                    e.target.value,
                })
              }
            />

            <label>
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="Ej: 3001234567"
              value={phone}
              onChange={(e) =>
                dispatch({
                  type:
                    'app/setPhone',
                  payload:
                    e.target.value,
                })
              }
            />

            {/* ==================================================
                INFORMACIÓN DE ENTREGA
            ================================================== */}

            <div className="section-title">
              Información de entrega
            </div>

            <label>
              Dirección
            </label>

            <input
              type="text"
              placeholder="Ej: Calle 100 # 15-20"
              value={address}
              onChange={(e) =>
                dispatch({
                  type:
                    'app/setAddress',
                  payload:
                    e.target.value,
                })
              }
            />

            <label>
              Ciudad
            </label>

            <input
              type="text"
              placeholder="Ej: Bogotá"
              value={city}
              onChange={(e) =>
                dispatch({
                  type:
                    'app/setCity',
                  payload:
                    e.target.value,
                })
              }
            />

            <label>
              Información adicional
            </label>

            <textarea
              className="textarea"
              placeholder="Apartamento, conjunto, indicaciones de entrega..."
              value={deliveryNotes}
              onChange={(e) =>
                dispatch({
                  type:
                    'app/setDeliveryNotes',
                  payload:
                    e.target.value,
                })
              }
            />

            {/* ==================================================
                DATOS DE PAGO
            ================================================== */}

            <div className="section-title">
              Datos de pago
            </div>

            <label>
              💳 Número de tarjeta
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Número de tarjeta"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(
                  e.target.value,
                )
              }
            />

            <label>
              CVC
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="CVC"
              value={cvc}
              onChange={(e) =>
                setCvc(
                  e.target.value,
                )
              }
            />

            <label>
              Mes de vencimiento
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="MM"
              value={expMonth}
              onChange={(e) =>
                setExpMonth(
                  e.target.value,
                )
              }
            />

            <label>
              Año de vencimiento
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="YY"
              value={expYear}
              onChange={(e) =>
                setExpYear(
                  e.target.value,
                )
              }
            />

            <label>
              Nombre del titular
            </label>

            <input
              type="text"
              placeholder="NOMBRE DEL TITULAR"
              value={cardHolder}
              onChange={(e) =>
                setCardHolder(
                  e.target.value,
                )
              }
            />

            {/* ==================================================
                CUOTAS
            ================================================== */}

            <div className="field">

              <label htmlFor="installments">
                Cuotas
              </label>

              <select
                id="installments"
                className="input"
                value={installments}
                onChange={(e) =>
                  setInstallments(
                    Number(
                      e.target.value,
                    ),
                  )
                }
              >

                <option value={1}>
                  1 cuota
                </option>

                <option value={2}>
                  2 cuotas
                </option>

                <option value={3}>
                  3 cuotas
                </option>

                <option value={4}>
                  4 cuotas
                </option>

                <option value={5}>
                  5 cuotas
                </option>

                <option value={6}>
                  6 cuotas
                </option>

              </select>

            </div>

            {/* ==================================================
                BOTÓN PAGAR
            ================================================== */}

            <button
              className="payment-button"
              onClick={
                createPayment
              }
              disabled={loading}
            >
              {loading
                ? 'Procesando...'
                : `Pagar ${formattedTotal}`}
            </button>

          </div>

          {/* ==================================================
              MENSAJE
          ================================================== */}

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {/* ==================================================
              TRANSACCIÓN
          ================================================== */}

          {transactionId && (
            <div className="transaction-info">

              <strong>
                Transacción:
              </strong>

              <br />

              {transactionId}

            </div>
          )}

          {/* ==================================================
              ESTADO
          ================================================== */}

          {paymentStatus && (
            <div className="transaction-info">

              <strong>
                Estado:
              </strong>{' '}

              {paymentStatus}

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default App