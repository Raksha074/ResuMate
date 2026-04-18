import axios from 'axios'

const api = axios.create({
    // Ensure this matches exactly
    baseURL: import.meta.env.VITE_BASE_URL || 'https://resumate-sva4.onrender.com/api'
})

export default api