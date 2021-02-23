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
    parsedBlocks(state){
        const blocks = loadsh.cloneDeep(state._blocks);
        blocks.forEach(block => {
            delete block.interface;
            delete block.output_endpoints;
            delete block.input_endpoint;
            delete block.dom;
            delete block.component;
        });
        return blocks;
    }
};