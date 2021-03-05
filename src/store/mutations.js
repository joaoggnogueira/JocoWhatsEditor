import getters from "./getters";
import uuid from "uuid";

function genEmptyBlock(type, x, y) {
    let block = {
        x, y, type, id: uuid.v1(), analytics: {
            enabled: false,
            category: "",
            action: "",
            label: "",
        },
        name: ""
    };

    if (type === "request") {
        block = { ...block };
    } else if (type === "message") {
        block = { ...block, content: [], redirect: [] };
    } else if (type === "user_input") {
        block = { ...block, outputs: [], fallback: [] };
    } else if (type === "redirect") {
        block = { ...block };
    }
    return block;
}

export default {
    load(state) {
        const backup = localStorage.getItem('storedData', state);
        const data = (backup ? JSON.parse(backup) : require("./botdata.json"));
        state._blocks = data.blocks;
        state._flow = data.flow;

        state._blocks.forEach(block => {
            const coordinates = block.screen_position.split(" ");
            block.x = parseInt(coordinates[0]);
            block.y = parseInt(coordinates[1]);
            block.id = block.uuid;
        });

        state._blocks.push({
            type: "begin",
            id: "$BEGIN$",
            x: 0,
            y: 0,
            outputs: [state._flow.default_block_welcome]
        });
        state._intents = data.intents;
        state._coordinates = { translateX: 200, translateY: 100, zoom: 1 };
    },
    readyToFlowchart() {
    },
    backup(state) {
        try {
            localStorage.setItem('storedData', JSON.stringify(getters.parsedData(state)));
            window.alert("Salvo");
        } catch (e) {
            console.error(e);
        }
    },
    pushBlock(state, payload) {
        const block = genEmptyBlock(payload.type, payload.x, payload.y);
        state._blocks.push(block);
        payload.newblock = block;
    },
    detachRedirect(state, payload) {
        if (payload.source.type === "user_input") {
            payload.source.outputs[payload.index].redirect = null;
        } else {
            payload.source.outputs[payload.index] = null;
        }
    },
    removeRedirect(state, payload) {
        if (payload.block.type === "user_input") {
            payload.block.outputs.splice(payload.index, 1);
        } else {
            payload.block.outputs.splice(payload.index, 1);
        }
    },
    addRedirect(state, payload) {
        const block = typeof payload.block == "string" ? getters.blockById(state)(payload.block) : payload.block;
        block.outputs.splice(payload.index, 0, JSON.parse(JSON.stringify(payload.data)));
    },
    connectRedirect(state, payload) {
        if (payload.source.type === "user_input") {
            payload.source.outputs[payload.index].redirect = payload.target.id;
        } else {
            if (!payload.source.outputs) {
                payload.source.outputs = [];
            }
            payload.source.outputs[payload.index] = payload.target.id;
        }
    }
}