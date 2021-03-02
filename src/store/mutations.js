import getters from "./getters";

export default {
    load(state) {
        const backup = localStorage.getItem('storedData', getters.parsedBlocks(state));
        const data = (backup ? JSON.parse(backup) : require("./botdata.json"));
        state._blocks = data.blocks;
        state._coordinates = data.coordinates || { translateX: 0, translateY: 0, zoom: 1 };
    },
    readyToFlowchart() {
    },
    backup(state) {
        try {
            localStorage.setItem('storedData', JSON.stringify({
                blocks: getters.parsedBlocks(state),
                coordinates: getters.coordinates(state)
            }));
            window.alert("Salvo");
        } catch (e) {
            console.error(e);
        }
    },
    pushBlock(state, payload) {
        state._blocks.push(payload);
        return payload;
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