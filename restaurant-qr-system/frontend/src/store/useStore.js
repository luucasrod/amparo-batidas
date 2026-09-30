import create from 'zustand';

export const useStore = create((set) => ({
  // Auth state
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  token: localStorage.getItem('token'),

  // Order state
  currentOrder: null,
  currentTable: null,
  sessionId: null,
  customerName: '',

  // UI state
  loading: false,
  error: null,
  success: null,

  // Actions
  setAuthenticated: (isAuth, user, token) =>
    set({ isAuthenticated: isAuth, user, token }),

  setCurrentOrder: (order) => set({ currentOrder: order }),

  setCurrentTable: (table) => set({ currentTable: table }),

  setSessionId: (sessionId) => set({ sessionId }),

  setCustomerName: (name) => set({ customerName: name }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSuccess: (success) => set({ success }),

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ success: null }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      currentOrder: null,
      currentTable: null,
      sessionId: null,
      customerName: '',
    }),
}));
