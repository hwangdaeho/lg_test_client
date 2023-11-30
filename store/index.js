// import jsCookie from 'js-cookie'

export const state = () => ({
  token: null,
  user: {},
  menuList: [
    {
      id: 0,
      icon: 'nav_home',
      name: 'Home',
      url: '/',
      isExpert: false
    },
    {
      id: 1,
      icon: 'nav_setup',
      name: '메뉴1',
      url: '/test',
      isExpert: false
    },
    {
      id: 2,
      icon: 'nav_setup',
      name: '메뉴2',
      url: '/test',
      isExpert: false
    },
    {
      id: 3,
      icon: 'nav_setup',
      name: '메뉴3',
      url: '/test',
      isExpert: false
    }
  ]
})

export const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },
  REMOVE_TOKEN (state) {
    state.token = ''
  },
  SET_USERINFO (state, user) {
    state.user = user
  },
  SET_MENU_LIST (state, val) {
    state.menuList = val
  }
}

export const actions = {
  // async nuxtServerInit ({ commit, dispatch }, { req, route, app, store, redirect }) {
  //   let token
  //
  //   if (req) { // 요청 객체에서 쿠키를 확인하여 토큰 값을 가져옴
  //     if (req.headers.cookie && req.headers.cookie.includes('lg-flex-access-token')) {
  //       console.log('토큰 1111111111')
  //       token = req.headers.cookie.split('lg-flex-access-token=')[1]
  //       if (token !== undefined && token) {
  //         console.log('토큰 2222222')
  //         try {
  //           await store.dispatch('setToken', token) // 토큰 스토어에 저장
  //         } catch (err) { // 토큰 저장에 실패시 로그아웃 액션 실행
  //           await store.dispatch('logout')
  //         }
  //       } else { // 토큰이 유효하지 않으면 삭제하고 로그아웃 액션 실행
  //         console.log('토큰 33333')
  //         await jsCookie.remove('lg-flex-access-token')
  //         await store.commit('REMOVE_TOKEN')
  //         await app.$axios.setToken(false)
  //         // redirect('/auth/login')
  //       }
  //     } else { // 쿠키가 없으면 로그인 페이지로 리다이렉트
  //       console.log('토큰 없음!!!! ', store.state)
  //       await store.dispatch('logout')
  //       await app.$axios.setToken(false)
  //       // await redirect('/auth/login')
  //     }
  //   }
  // },
  async setToken ({ commit, state, dispatch }, payload) {
    this.$axios.setToken(payload, 'Bearer') // 토큰을 스토어에 저장하고 axios 헤더에 토큰 설정
    // await jsCookie.set('lg-flex-access-token', payload)
    await commit('SET_TOKEN', payload)
  },
  async setUserInfo ({ commit }, payload) {
    // 로그인 유저 메뉴 권한 정보 저장
    await commit('SET_USERINFO', payload)
  },
  async logout ({ commit }) {
    await this.$axios.setToken(false)
    // await jsCookie.remove('lg-flex-access-token')
    await commit('REMOVE_TOKEN')
  },
  async setJogStatus ({ commit }, val) {
    await commit('SET_JOG_STATUS', val)
  },
  async setLfdStatus ({ commit }, val) {
    await commit('SET_LFD_STATUS', val)
  },
  async setRoboStatus ({ commit, state }, val) {
    if (state.roboConnected) {
      await commit('SET_ROBO_STATUS', val)
      if (val.timeout) {
        setTimeout(() => {
          commit('SET_ROBO_STATUS', {
            msg: '',
            state: ''
          })
        }, val.timeout)
      }
    }
  },
  async setMenuList ({ commit }, val) {
    await commit('SET_MENU_LIST', val)
  }
}

export const getters = {
  menuList (state) {
    return state.menuList
  },
  userInfo (state) {
    return state.user
  },
  getToken (state) {
    return state.token
  }
}
