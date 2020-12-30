import { createStore } from "vuex";

export default createStore({
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
