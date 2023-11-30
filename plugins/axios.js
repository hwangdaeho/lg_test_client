import cookies from 'js-cookie'

export default function ({ $axios, $config, store, app, route, redirect }) {
  $axios.defaults.timeout = 60000
  $axios.defaults.baseURL = $config.API_URL
  // $axios.defaults.withCredentials = true

  const cookieToken = cookies.get('temp-access-token')
  if (cookieToken) { // token 존재시 헤더에 token 추가
    $axios.setHeader('Authorization', `Bearer ${cookieToken}`)
    if (cookieToken !== store.state.token) { // 스토어의 토큰과 쿠키의 토큰이 다른 경우 스토어의 토큰을 갱신
      store.dispatch('setToken', cookieToken)
    }
  }

  $axios.defaults.paramsSerializer = (paramObj) => {
    const params = new URLSearchParams()
    for (const key in paramObj) {
      params.append(key, paramObj[key])
    }
    return params.toString()
  } // 요청 파라미터를 직렬화하기 위한 함수 설정

  $axios.onRequest((config) => {
    const cookieToken = cookies.get('temp-access-token')
    if (cookieToken) { // 쿠키에서 토큰을 가져와서 axios 인스턴스에 토큰 설정
      $axios.setToken(cookieToken, 'Bearer')
      if (cookieToken !== store.state.token) { // 스토어의 토큰과 쿠키의 토큰이 다른 경우 스토어의 토큰을 갱신
        store.dispatch('setToken', cookieToken)
      }
    }
  })
  $axios.onResponse((response) => {
    // 응답받은후 실행되는 함수 설정
  })

  $axios.onError((err) => {
    const { response: res } = err
    const {
      response: {
        data: { message, error }
      }
    } = err
    console.log('axios::', res)
    console.log('err::', error)
    // if (err.statusCode === '코드 넘버') {
    //   return redirect('/auth/login')
    // }
    if (message) {
      console.log('axiosMessage::', message)
    }
  })

  $axios.onResponseError((response) => {
    console.log('axios onResponseError::', response)
  })
}
