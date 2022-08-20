const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.crab.fit' : 'http://localhost:8080'

const handleError = error => {
  if (error && error.status) {
    console.error('[Error handler] res:', error)
  }
  return Promise.reject(error)
}

const api = {
  get: async endpoint => {
    try {
      const response = await fetch(API_URL + endpoint)
      if (!response.ok) {
        throw response
      }
      const json = await response.json()
      return Promise.resolve(json)
    } catch (error) {
      return handleError(error)
    }
  },
  post: async (endpoint, data, options = {}) => {
    try {
      const response = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        ...options
      })
      if (!response.ok) {
        throw response
      }
      const json = await response.json()
      return Promise.resolve(json)
    } catch (error) {
      return handleError(error)
    }
  },
  patch: async (endpoint, data, options = {}) => {
    try {
      const response = await fetch(API_URL + endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        ...options
      })
      if (!response.ok) {
        throw response
      }
      const json = await response.json()
      return Promise.resolve(json)
    } catch (error) {
      return handleError(error)
    }
  },
}

export default api
