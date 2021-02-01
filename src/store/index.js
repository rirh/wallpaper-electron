import { createStore } from "vuex";
const store = createStore({
  state: {
    cursor: "latest"
  },
  mutations: {
    updateCursor(state, payload) {
      state.cursor = payload;
    }
  },
  actions: {},
  modules: {}
});

export default store;
