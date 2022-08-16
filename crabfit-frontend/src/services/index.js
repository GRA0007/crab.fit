const API_URL = process.env.NODE_ENV === 'production' ? 'https://api-dot-crabfit.uc.r.appspot.com' : 'http://localhost:8080'

const handleError = error => {
  if (error.response && error.response.status) {
    console.error('[Error handler] res:', error.response)
  }
  return Promise.reject(error.response)
}

const api = {
  get: async endpoint => {
    try {
      const response = await fetch(API_URL + endpoint)
      const json = await response.json()
      return Promise.resolve(json)
    } catch (error) {
      return handleError(error)
    }
  },
  post: async (endpoint, data, options = {}) => {
    try {
      const response = await fetch(API_URL + endpoint, data, options)
      return Promise.resolve(response)
    } catch (error) {
      return handleError(error)
    }
  },
  patch: async (endpoint, data) => {
    try {
      const response = await fetch(API_URL + endpoint, data)
      return Promise.resolve(response)
    } catch (error) {
      return handleError(error)
    }
  },
}

export default api
