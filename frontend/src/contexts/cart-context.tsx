import React, {createContext,useContext,useReducer,useEffect} from 'react';
import {ASSIGNMENT_SEED,calculatePlatformfee} from "@/lib/seed-utils"

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  seller: string
  category: string
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  platformFee: number
  finalTotal: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const platformFee = calculatePlatformfee(totalPrice, ASSIGNMENT_SEED)
    const tax = totalPrice * 0.08 // 8% tax
    const finalTotal = totalPrice + platformFee + tax

    return { totalItems, totalPrice, platformFee, finalTotal }
  }

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      const quantity = action.payload.quantity || 1

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.stock)
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: newQuantity } : item,
        )
        const totals = calculateTotals(updatedItems)
        return {
          ...state,
          items: updatedItems,
          ...totals,
        }
      } else {
        const newItem = { ...action.payload, quantity }
        const updatedItems = [...state.items, newItem]
        const totals = calculateTotals(updatedItems)
        return {
          ...state,
          items: updatedItems,
          ...totals,
        }
      }
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const totals = calculateTotals(updatedItems)
      return {
        ...state,
        items: updatedItems,
        ...totals,
      }
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(Math.max(1, action.payload.quantity), item.stock) }
          : item,
      )
      const totals = calculateTotals(updatedItems)
      return {
        ...state,
        items: updatedItems,
        ...totals,
      }
    }
    case "CLEAR_CART":
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        platformFee: 0,
        finalTotal: 0,
      }
    case "LOAD_CART": {
      const totals = calculateTotals(action.payload)
      return {
        ...state,
        items: action.payload,
        ...totals,
      }
    }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    platformFee: 0,
    finalTotal: 0,
  })

  useEffect(() => {
    const savedCart = localStorage.getItem("marketplace-cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("marketplace-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
