import api from './api'

const USERS_STORAGE_KEY = 'real_estate_ai_users'
const SAVED_PROPERTIES_STORAGE_KEY = 'real_estate_ai_saved_properties'

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const getSavedProperties = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_PROPERTIES_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const saveSavedProperties = (properties) => {
  localStorage.setItem(SAVED_PROPERTIES_STORAGE_KEY, JSON.stringify(properties))
}

// Auth APIs
export const authService = {
  login: async (email, password) => {
    const users = getStoredUsers()
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: `demo-token-${user.id}`,
    }
  },

  signup: async (name, email, password) => {
    const users = getStoredUsers()
    const existingUser = users.find((item) => item.email.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password,
    }
    users.push(user)
    saveStoredUsers(users)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: `demo-token-${user.id}`,
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Property APIs
export const propertyService = {
  getBuyProperties: async (filters) => {
    const response = await api.get('/properties/buy', { params: filters })
    return response.data
  },

  getRentProperties: async (filters) => {
    const response = await api.get('/properties/rent', { params: filters })
    return response.data
  },

  getPropertyDetails: async (id) => {
    const response = await api.get(`/properties/${id}`)
    return response.data
  },

  saveProperty: async (propertyId) => {
    return { success: true, propertyId }
  },

  getSavedProperties: async () => {
    return getSavedProperties()
  },

  persistSavedProperties: async (properties) => {
    saveSavedProperties(properties)
    return { success: true }
  },

  removeSavedProperty: async (propertyId) => {
    return { success: true, propertyId }
  },
}

// Chat API
export const chatService = {
  sendMessage: async (message) => {
    const response = await api.post('/chat', { message })
    return response.data
  },

  getHistory: async () => {
    const response = await api.get('/chat/history')
    return response.data
  },

  clearHistory: async () => {
    const response = await api.delete('/chat/history')
    return response.data
  },
}
