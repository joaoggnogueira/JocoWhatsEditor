import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getters = {
  blocks(state) {
    return state._blocks;
  },
  blockById(state) {
    return (id) => {
      return state._blocks.find((b) => id == b.id);
    }
  },
  original_redirects() {
    return (block) => {
      if (block.type === "user_input") {
        return block.options;
      } else {
        return block.redirect;
      }
    }
  },
  redirects(state) {
    return (block) => {
      block = typeof block == "string" ? getters.blockById(state)(block) : block;
      if (block.type === "user_input") {
        return block.options.map((option) => option.redirect);
      } else {
        return block.redirect;
      }
    }
  },
}

export default new Vuex.Store({
  state: {
    _blocks: []
  },
  mutations: {
    load(state) {
      const data = require("./botdata.json");
      state._blocks = data.blocks;
    },
    readyToFlowchart() {
    },
    detachRedirect(state, payload) {
      if (payload.source.type === "user_input") {
        payload.source.options[payload.index].redirect = null;
      } else {
        payload.source.redirect[payload.index] = null;
      }
    },
    removeRedirect(state, payload) {
      if (payload.block.type === "user_input") {
        payload.block.options.splice(payload.index, 1);
      } else {
        payload.block.redirect.splice(payload.index, 1);
      }
    },
    addRedirect(state, payload) {
      const block = typeof payload.block == "string" ? getters.blockById(state)(payload.block) : payload.block;
      let targetarray = false;
      if (block.type == "user_input") {
        targetarray = block.options;
      } else {
        targetarray = block.redirects;
      }
      targetarray.splice(payload.index, 0, JSON.parse(JSON.stringify(payload.data)));
    },
    connectRedirect(state, payload) {
      if (payload.source.type === "user_input") {
        payload.source.options[payload.index].redirect = payload.target.id;
      } else {
        if (!payload.source.redirect) {
          payload.source.redirect = [];
        }
        payload.source.redirect[payload.index] = payload.target.id;
      }
    }
  },
  getters: {
    ...getters
  },
  setters: {

  },
  actions: {
    loadAndReadyToFlowchart(context) {
      return new Promise((res) => {
        context.commit("load");
        context.commit("readyToFlowchart");
        res(true);
      });
    }
  },
  modules: {
  }
})
