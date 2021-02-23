import getters from "./getters";

export default {
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
}