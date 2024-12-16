const state = {
  visitedViews: [],
  cachedViews: [],
  nav: [],
}

const mutations = {
  SET_NAV: (state, nav) => {
    state.nav = nav
  },
  ADD_VISITED_VIEW: (state, view) => {
    if (view.query && Object.keys(view.query).length > 0) {
      view.path = view.path + '?' + new URLSearchParams(view.query).toString()
      view.meta.fixed = false
    }
    if (!state.visitedViews.some((v) => v.path === view.path)) {
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        })
      )
      if (view.meta.cache) {
        state.cachedViews.push(view.path)
      }
    }
  },

  DEL_VISITED_VIEW: (state, path) => {
    const index = state.visitedViews.findIndex((v) => v.path === path)
    if (index > -1) {
      state.visitedViews.splice(index, 1)
    }
  },
  DEL_OTHER_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(
      (v) => v.path === view.path || v.meta.fixed
    )
  },
  DEL_ALL_VIEWS: (state) => {
    state.visitedViews = state.visitedViews.filter((v) => v.meta.fixed)
  },
  MODIFY_VISITED_VIEW_TITLE: (state, view) => {
    const index = state.visitedViews.findIndex((v) => v.path === view.path)
    if (index > -1) {
      state.visitedViews[index].meta.title = view.title
    }
  }
}

const actions = {
  setNav({ commit }, nav) {
    commit('SET_NAV', nav)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  delVisitedView({ commit }, path) {
    commit('DEL_VISITED_VIEW', path)
  },
  delOtherViews({ commit }, view) {
    commit('DEL_OTHER_VIEWS', view)
  },
  delAllViews({ commit }) {
    commit('DEL_ALL_VIEWS')
  },
  modifyVisitedViewTitle({ commit }, view) {
    commit('MODIFY_VISITED_VIEW_TITLE', view)
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
