// import cookies from 'js-cookie'

// async function getUserInfo (axios, store) { // 메뉴 권한
//   try {
//     const { data: { data } } = await axios.get('api/manager/auth')
//     await store.dispatch('setUserInfo', data) // 'setUserInfo' 액션 호출하여 사용자 메뉴 권한 정보 저장
//   } catch (err) {
//     console.log(err)
//     await store.dispatch('logout')
//   }
// }

export default async (app) => {
  // if (process.client) { // 클라이언트 사이드에서만 실행
  //   const cookieToken = cookies.get('lg-flex-access-token')
  //   if (cookieToken) { // 토큰 존재
  //     await app.store.dispatch('setToken', cookieToken)
  //     await getUserInfo(app.$axios, app.store)
  //   }
  // }
}
