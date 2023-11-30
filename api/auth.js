import store from '@/store'
import http from '@/api/http'

export async function login (email, password) {
  const response = await http.post('/api/manager/login', {
    email,
    password
  })

  if (response.status === 200) {
    store.commit('auth/setToken', response.data.token)
  }

  return response
}
