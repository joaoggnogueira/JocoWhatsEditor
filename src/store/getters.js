import getters from "./getters";
import loadsh from "lodash";

export default {
    blocks(state) {
        return state._blocks;
    },
    blockById(state) {
        return (id) => {
            return state._blocks.find((b) => id == b.id);
        }
    },
    coordinates(state) {
        return state._coordinates;
    },
    original_redirects() {
        return (block) => {
            return block.outputs;
        }
    },
    redirects(state) {
        return (block) => {
            block = typeof block == "string" ? getters.blockById(state)(block) : block;
            if (block.type === "user_input") {
                return block.outputs.map((option) => option.redirect);
            } else {
                return block.outputs;
            }
        }
    },
    parsedData(state) {
        let blocks = loadsh.cloneDeep(state._blocks);
        blocks.forEach(block => {
            delete block.interface;
            delete block.output_endpoints;
            delete block.input_endpoint;
            delete block.dom;
            block.screen_position = block.x + " " + block.y;
        });

        const block_begin = state._blocks.find(d => d.type === "begin");
        blocks = blocks.filter(d => d.type !== "begin");
        const flow = {
            default_block_welcome: block_begin.outputs[0]
        };

        return { flow, blocks };
    }
};