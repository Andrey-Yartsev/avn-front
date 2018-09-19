'use strict'

import Store from '@/store'
import BrowserStore from 'store'

const Auth = {
  get loggedIn () {
    return Store.state.auth.user
  },

  logout (to, from, next) {
    if (!Auth.loggedIn) {
      return next('/login')
    }

    Store.dispatch('AUTH_LOGOUT', {
      next
    })
  },

  authenticate (data = null) {
    Store.dispatch('AUTH_REQUEST', data)
  },

  requireAuth (to, from, next) {
    if (Auth.loggedIn) {
      return next()
    }

    const data = BrowserStore.get('user')

    if (!data) {
      return next({
        path: '/login'
      })
    }

    Store.dispatch('AUTH_SET_USER', {
      next,
      user: data
    })
  },

  requireNonAuth (to, from, next) {
    if (Auth.loggedIn) {
      return next({
        path: '/'
      })
    }
    next()
  }

}

export default Auth
