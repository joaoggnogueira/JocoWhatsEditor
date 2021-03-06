<template>
  <div
    id="flowchart"
    ref="flowchat"
    @wheel="flowchart_wheel"
    @mousedown="flowchart_mousedown"
    @mouseup="flowchart_mouseup"
    @mousemove="flowchart_mousemove"
    :style="{ backgroundImage: getBackground }"
    :class="{ 'dragging-block': dragging_block ? true : false }"
  >
    <div class="flowchart-content" ref="flowchat_content">
      <Block
        v-for="block in blocks"
        :key="block.id"
        @mousedown="block_mousedown"
        @mouseup="block_mouseup"
        @mousemove="block_mousemove"
        :block="block"
      />
    </div>
    <FlowchartForm
      v-if="edit_block"
      :block="edit_block"
      @onClose="close_edit_form_block"
    />
    <FlowchartControl @addBlock="addBlock" @resetJsPlumb="reset_jsPlumb" />
    <LogFlow />
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import Block from "./Block.vue";
import loadsh from "lodash";
import LogFlow from "./LogFlow";
import FlowchartControl from "./FlowchartControl.vue";
import FlowchartForm from "./FlowchartForm.vue";

import { mapGetters, mapMutations } from "vuex";

const BACKUPS = [];

export default {
  name: "Flowchart",
  components: {
    Block,
    LogFlow,
    FlowchartControl,
    FlowchartForm,
  },
  data: () => ({
    drag_x: 0,
    drag_y: 0,
    last_drag_x: 0,
    last_drag_y: 0,
    dragging: false,
    dragging_block: false,
    flowchat_content: null,
    flowchat: null,
    already_rendered: null,
    edit_block: null,
  }),
  computed: {
    ...mapGetters([
      "blocks",
      "blockById",
      "redirects",
      "original_redirects",
      "coordinates",
    ]),
    getBackground() {
      return `url(${require("../assets/pixel.png")})`;
    },
  },
  mounted() {
    this.flowchat_content = this.$refs.flowchat_content;
    this.flowchat = this.$refs.flowchat;

    this.plumbInstance = this.createJsPlumbInstance();

    this.$eventBus.on("open_edit_form_block", this.open_edit_form_block);
    this.$eventBus.on("remove_endpoint", this.remove_endpoint);
    this.$eventBus.on("remove_block", this.remove_block);
    this.$eventBus.on("create_block_interface", this.create_block_interface);
    this.$eventBus.on("update_endpoints", this.update_endpoints);
    this.$eventBus.on("add_redirect", this.add_redirect);

    document.addEventListener("keyup", this.keyupHandler);
  },
  beforeDestroy() {
    this.destroy_all_connections();
  },
  methods: {
    ...mapMutations([
      "detachRedirect",
      "connectRedirect",
      "removeRedirect",
      "addRedirect",
      "pushBlock",
    ]),
    open_edit_form_block(block) {
      this.edit_block = block;
    },
    close_edit_form_block() {
      setTimeout(() => {
        this.edit_block = null;
      }, 500);
    },
    createJsPlumbInstance() {
      const plumbInstance = jsPlumb.getInstance({
        PaintStyle: {
          strokeWidth: 6,
          stroke: "#228a1f",
          outlineWidth: 1,
        },
        Endpoint: ["Dot", { radius: 0 }],
        EndpointStyle: { fill: "#567567" },
        Connector: ["Bezier", { curviness: 150 }],
        ConnectionsDetachable: true,
        ReattachConnections: true,
      });
      plumbInstance.setContainer(this.flowchat_content);
      plumbInstance.registerConnectionType("example", {
        paintStyle: { stroke: "#228a1f", strokeWidth: 2 },
        hoverPaintStyle: { stroke: "cornflowerblue", strokeWidth: 2 },
      });
      plumbInstance.bind("connection", this.on_connection);
      return plumbInstance;
    },
    addBlock(type) {
      this.coordinates.zoom = 1;
      this.updateFlowchartContent();
      this.plumbInstance.setZoom(this.coordinates.zoom);

      const center = this.get_center_pos();
      const payload = { type, x: center.x, y: center.y };
      this.pushBlock(payload);
      const block = payload.newblock;
      payload.newblock.new = true;
      this.pushHandler({ delete_block: block.id });
      this.$nextTick(() => {
        this.update_endpoints(block);
      });
    },
    source_endpoints(block) {
      const selects = this.plumbInstance.select({ target: block.input_endpoint });
      const sources = [];
      for (let i = 0; i < selects.length; i++) {
        sources.push(selects.get(i).source);
      }
      return sources;
    },
    destroy_all_endpoints_outputs(block) {
      for (let i = 0; i < block.output_endpoints.length; i++) {
        this.plumbInstance.select({ source: block.output_endpoints[i] }).delete();
        this.plumbInstance.unmakeSource({ source: block.output_endpoints[i] });
      }
    },
    render_flowchart() {
      for (let i = 0; i < this.blocks.length; i++) {
        this.update_endpoints(this.blocks[i]);
      }

      for (let i = 0; i < this.blocks.length; i++) {
        this.render_connections(this.blocks[i]);
      }
    },
    render_connections(source) {
      const redirects = this.redirects(source);
      if (redirects) {
        for (let i = 0; i < redirects.length; i++) {
          const redirect = redirects[i];
          if (redirect) {
            this.createConnection(source, redirect, i);
          }
        }
      }
    },
    keyupHandler(event) {
      if (event.ctrlKey && event.code === "KeyZ") {
        this.undoHandler();
      }
    },
    backupHandler(pop) {
      if (pop.type == "backup_context") {
        this.plumbInstance.deleteEveryEndpoint();
        this.plumbInstance.deleteEveryConnection();
        this.blocks.length = 0;
        for (let i = 0; i < pop.blocks.length; i++) {
          this.blocks.push(pop.blocks[i]);
        }
      } else if (pop.type == "move_position") {
        const block = this.blockById(pop.id);
        block.x = pop.x;
        block.y = pop.y;
        this.$nextTick(this.repaintBlockConnections.bind(this, block));
        this.$eventBus.emit("log", "revertendo posição");
      } else if (pop.type == "connect") {
        this.createConnection(pop.source, pop.target, pop.index);
        this.$eventBus.emit("log", "revertendo criação de conexão");
      } else if (pop.type == "detach") {
        this.detachConnection(pop.source, pop.index);
        this.$eventBus.emit("log", "revertendo remoção de conexão");
      } else if (pop.type == "backup_block") {
        this.blocks.push(pop.copy);
        this.$nextTick(() => {
          this.update_endpoints(pop.copy);
        });
        this.$eventBus.emit("log", "revertendo remoção de bloco");
      } else if (pop.type == "backup_endpoint") {
        const block = this.blockById(pop.block);
        this.destroy_all_endpoints_outputs(block);
        this.addRedirect(pop);
        this.$nextTick(() => {
          this.update_endpoints(block);
          this.render_connections(block);
        });
        this.$eventBus.emit("log", "revertendo remoção de ponto de conexão");
      } else if (pop.type == "remove_endpoint") {
        this.remove_endpoint(pop.block, pop.index, true);
        this.$eventBus.emit("log", "revertendo criação de ponto de conexão");
      } else if (pop.type === "delete_block") {
        const block = this.blockById(pop.block);
        this.remove_block(block, true);
        this.$eventBus.emit("log", "revertendo criação de bloco");
      }
    },
    undoHandler() {
      const pop = BACKUPS.pop();
      if (pop) {
        if (Array.isArray(pop)) {
          let i = 0;
          const loop = () => {
            this.backupHandler(pop[i]);
            i++;
            if (i < pop.length) {
              this.$nextTick(loop);
            }
          };
          loop();
        } else {
          this.backupHandler(pop);
        }
      }
    },
    pushHandler(option) {
      if (option.save_context) {
        BACKUPS.push({ blocks: loadsh.cloneDeep(this.blocks), type: "backup_context" });
      } else if (option.save_position) {
        BACKUPS.push({ ...option.save_position, type: "move_position" });
      } else if (option.save_connection) {
        BACKUPS.push({ ...option.save_connection, type: "connect" });
      } else if (option.delete_connection) {
        BACKUPS.push({ ...option.delete_connection, type: "detach" });
      } else if (option.backup_block) {
        const copy = loadsh.cloneDeep(option.backup_block);
        const redirects = this.redirects(copy);
        const changes = [];

        const sources = this.source_endpoints(option.backup_block);
        for (let i = 0; i < sources.length; i++) {
          changes.push({
            source: sources[i].block.id,
            target: copy.id,
            index: sources[i].getAttribute("data-index"),
            type: "connect",
          });
        }
        for (let i = 0; i < redirects.length; i++) {
          if (redirects[i]) {
            changes.push({
              source: copy.id,
              target: redirects[i],
              index: i,
              type: "connect",
            });
            this.detachRedirect({ source: copy, index: i });
          }
        }
        changes.push({ copy: copy, type: "backup_block" });
        BACKUPS.push(changes.reverse());
      } else if (option.delete_block) {
        BACKUPS.push({ block: option.delete_block, type: "delete_block" });
      } else if (option.backup_endpoint) {
        BACKUPS.push({
          block: option.backup_endpoint.block,
          data: loadsh.cloneDeep(option.backup_endpoint.data),
          index: option.backup_endpoint.index,
          type: "backup_endpoint",
        });
      } else if (option.remove_endpoint) {
        BACKUPS.push({
          block: option.remove_endpoint.block,
          index: option.remove_endpoint.index,
          type: "remove_endpoint",
        });
      }
    },
    createConnection(source, target, index) {
      source = typeof source == "string" ? this.blockById(source) : source;
      target = typeof target == "string" ? this.blockById(target) : target;
      this.plumbInstance.connect({
        source: source.output_endpoints[index],
        target: target.input_endpoint,
      });
    },
    detachConnection(source, index) {
      source = typeof source == "string" ? this.blockById(source) : source;
      this.detachRedirect({ source, index });
      this.plumbInstance.select({ source: source.output_endpoints[index] }).delete();
    },
    remove_block(block, preventBackup) {
      if (!preventBackup) this.pushHandler({ backup_block: block });
      const connections = this.plumbInstance.select({ target: block.input_endpoint });
      for (let i = 0; i < connections.length; i++) {
        this.detachRedirect({ source: block, index: i });
      }
      connections.delete();
      const index = this.blocks.findIndex((b) => b === block);
      this.blocks.splice(index, 1);
      for (let i = 0; i < block.output_endpoints.length; i++) {
        const output = block.output_endpoints[i];
        this.plumbInstance.select({ source: output }).delete();
      }
    },
    add_redirect(block, data) {
      this.pushHandler({ remove_endpoint: { block: block.id, index: 0 } });
      this.destroy_all_endpoints_outputs(block);
      this.addRedirect({ block: block.id, data, index: 0 });
      this.$nextTick(() => {
        this.update_endpoints(block);
        this.render_connections(block);
      });
    },
    remove_endpoint(block, index, no_backup) {
      block = typeof block === "string" ? this.blockById(block) : block;
      const redirectingData = this.original_redirects(block);
      if (!no_backup) {
        this.pushHandler({
          backup_endpoint: {
            block: block.id,
            index: index,
            data: redirectingData[index],
          },
        });
      }
      this.destroy_all_endpoints_outputs(block);
      this.removeRedirect({ block, index });

      this.$nextTick(() => {
        this.update_endpoints(block);
        this.render_connections(block);
      });
    },
    on_connection(info, originalEvent) {
      const payload = {
        source: info.source.block,
        target: info.target.block,
        index: info.source.getAttribute("data-index"),
      };
      this.connectRedirect(payload);
      if (originalEvent) {
        this.pushHandler({ delete_connection: payload });
      }
    },
    update_endpoints(block) {
      const outputs = block.interface.get_output_endpoints();
      block.output_endpoints = [];
      if (outputs) {
        outputs.forEach((output) => {
          block.output_endpoints.push(output);
          output.block = block;

          this.plumbInstance.makeSource(output, {
            endpoint: "Blank",
            anchor: [1, 0.5, 0, 0, -6, 0],
            allowLoopback: false,
            connectionsDetachable: true,
            maxConnections: 1,
            connectorOverlays: [
              ["Arrow", { width: 15, length: 15, location: 1, id: "arrow" }],
              [
                "Custom",
                {
                  create: this.create_overlay_arrow,
                  location: 0.5,
                },
              ],
            ],
          });
        });
      }

      const input = block.interface.get_input_endpoints();
      if (input) {
        if (block.input_endpoint) {
          this.plumbInstance.unmakeSource({ source: block.input_endpoint });
        }
        block.input_endpoint = input;
        input.block = block;
        this.plumbInstance.makeTarget(input, {
          endpoint: "Blank",
          anchor: [0, 0.5, 0, 0, 4, 0],
        });
      }
    },
    create_block_interface(block, payload) {
      block.interface = payload;
      this.check_all_blocks_loaded();
    },
    destroy_all_connections() {
      this.plumbInstance.deleteEveryEndpoint();
      this.plumbInstance.deleteEveryConnection();
      this.plumbInstance.unmakeEverySource();
      this.plumbInstance.unmakeEveryTarget();
      this.plumbInstance.destroy();
      this.plumbInstance = this.createJsPlumbInstance();
      this.plumbInstance.setZoom(this.coordinates.zoom);
    },
    check_all_blocks_loaded() {
      let sum = 0;
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].interface) {
          sum++;
        }
      }
      if (sum === this.blocks.length) {
        if (!this.already_rendered) {
          this.render_flowchart();
          this.already_rendered = true;
          this.updateFlowchartContent();
        }
      }
    },
    reset_jsPlumb() {
      this.destroy_all_connections();
      this.render_flowchart();
    },
    create_overlay_arrow(connection) {
      const dom = document.createElement("div");
      dom.style.backgroundImage = `url(${require("@/assets/close.svg")})`;
      dom.className = "deleteCBtn";
      dom.addEventListener("click", () => {
        this.pushHandler({
          save_connection: {
            source: connection.source.block.id,
            target: connection.target.block.id,
            index: connection.source.getAttribute("data-index"),
          },
        });
        this.detachConnection(
          connection.source.block,
          connection.source.getAttribute("data-index")
        );
      });
      return dom;
    },
    block_mousedown(evt, block) {
      if (this.dragging_block && evt) {
        this.block_mouseup(evt, this.dragging_block);
        return;
      }
      if (block.type == "begin") {
        return;
      }
      this.pushHandler({ save_position: block });
      block.dom.classList.add("selected");
      this.drag_x = parseFloat(block.dom.style.left);
      this.drag_y = parseFloat(block.dom.style.top);
      this.last_drag_x = evt.x;
      this.last_drag_y = evt.y;
      this.dragging_block = block;
      evt.stopPropagation();
    },
    block_mouseup(evt, block) {
      if (this.dragging_block == block) {
        this.dragging_block.dom.classList.remove("selected");
        this.updatePosition(this.dragging_block, this.drag_x, this.drag_y, true);

        if (
          Math.abs(this.dragging_block.x - BACKUPS[BACKUPS.length - 1].x) <= 31 &&
          Math.abs(this.dragging_block.y - BACKUPS[BACKUPS.length - 1].y) <= 31
        ) {
          BACKUPS.pop();
        }
        this.dragging_block = false;
        this.plumbInstance.repaintEverything();
      }
    },
    block_mousemove(evt, block) {
      if (this.dragging_block == block) {
        const deltaX = (evt.x - this.last_drag_x) / this.coordinates.zoom;
        const deltaY = (evt.y - this.last_drag_y) / this.coordinates.zoom;
        if (deltaX === 0 && deltaY === 0) {
          return;
        }
        this.drag_x += deltaX;
        this.drag_y += deltaY;
        this.updatePosition(this.dragging_block, this.drag_x, this.drag_y, false);
        this.last_drag_x = evt.x;
        this.last_drag_y = evt.y;
      }
    },
    updatePosition(block, x, y, align) {
      if (align) {
        const chucksize = 32;
        block.dom.style.left = Math.round(x / chucksize) * 32 + "px";
        block.dom.style.top = Math.round(y / chucksize) * 32 + "px";
      } else {
        block.dom.style.left = x + "px";
        block.dom.style.top = y + "px";
      }
      block.x = x;
      block.y = y;
      this.repaintBlockConnections(block);
    },

    repaintBlockConnections(block) {
      if (block.output_endpoints) {
        for (let i = 0; i < block.output_endpoints.length; i++) {
          this.plumbInstance.revalidate(block.output_endpoints[i]);
        }
      }
      if (block.input_endpoint) {
        this.plumbInstance.revalidate(block.input_endpoint);
      }
    },

    updateFlowchartContent() {
      this.flowchat_content.style.transform = `translate(${this.coordinates.translateX}px , ${this.coordinates.translateY}px) scale(${this.coordinates.zoom})`;
      this.flowchat.style.backgroundPosition = `${this.coordinates.translateX}px ${this.coordinates.translateY}px`;
      this.flowchat.style.backgroundSize = `${64 * this.coordinates.zoom}px ${
        64 * this.coordinates.zoom
      }px`;
    },
    get_center_pos() {
      const midX =
        this.coordinates.translateX * (-1) +
        this.flowchat.offsetWidth / 2.0;
      const midY =
        this.coordinates.translateY * (-1) +
        this.flowchat.offsetHeight / 2.0;
      return { x: midX, y: midY };
    },

    flowchart_wheel(evt) {
      const previousZoom = this.coordinates.zoom;
      if (evt.wheelDelta > 0) {
        this.coordinates.zoom += (3 - this.coordinates.zoom) / 20;
      } else {
        this.coordinates.zoom -= (this.coordinates.zoom - 0.25) / 20;
      }

      const posX =
        (evt.x - this.flowchat.parentElement.offsetLeft) / this.flowchat.offsetWidth;
      const posY =
        (evt.y - this.flowchat.parentElement.offsetTop) / this.flowchat.offsetHeight;
      const dX = posX * this.flowchat.offsetWidth - this.coordinates.translateX;
      const dY = posY * this.flowchat.offsetHeight - this.coordinates.translateY;

      const ratio = 1 - this.coordinates.zoom / previousZoom;

      this.coordinates.translateX += dX * ratio;
      this.coordinates.translateY += dY * ratio;

      this.updateFlowchartContent();
      this.plumbInstance.setZoom(this.coordinates.zoom);
    },

    flowchart_mousedown(evt) {
      if (!this.dragging_block) {
        this.last_drag_x = evt.x;
        this.last_drag_y = evt.y;
        this.dragging = true;
      }
    },

    flowchart_mouseup() {
      this.dragging = false;
    },

    move_flowchart(deltaX, deltaY) {
      if (this.dragging) {
        this.coordinates.translateX += deltaX;
        this.coordinates.translateY += deltaY;
        this.updateFlowchartContent();
      }
    },

    flowchart_mousemove(evt) {
      if (this.dragging) {
        const deltaX = evt.x - this.last_drag_x;
        const deltaY = evt.y - this.last_drag_y;
        this.move_flowchart(deltaX, deltaY);
        this.last_drag_x = evt.x;
        this.last_drag_y = evt.y;
      } else if (this.dragging_block) {
        this.block_mousemove(evt, this.dragging_block);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@keyframes newBlock {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@mixin noselected() {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.deleteCBtn {
  width: 16px;
  height: 16px;
  background-color: red;
  background-size: 50% 50%;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 10px;
  z-index: 5;
  line-height: 16px;
  color: white;
  border: 2px solid white;
  cursor: pointer;
}

.subheader-empty {
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: #f6f6f6;
  margin-top: 10px;
  margin-bottom: 10px;
  font-style: italic;
}

#flowchart {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: 64px 64px;
  background-color: #6bb297;

  &.dragging-block {
    .jtk-connector {
      z-index: 1;
    }
    .jtk-overlay {
      z-index: 1;
    }
    .flowchart-control {
      z-index: -1;
    }
  }

  > .flowchart-content {
    position: absolute;
    left: 0px;
    top: 0px;

    > .block {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      z-index: 2;
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
      border-radius: 16px;
      &.newBlock {
        animation: newBlock 0.5s ease-out 0s 1 normal forwards;
      }

      &.selected {
        z-index: 11;
      }

      &:hover > .content {
        cursor: grab;
      }

      > .header {
        @include noselected();
        flex: 1;
        background: white;
        max-height: 48px;
        min-height: 48px;
        border-bottom: 2px;
        text-align: center;
        color: rgb(129, 129, 129);
        line-height: 48px;
        z-index: 12;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        > .fa-pen {
          position: absolute;
          right: 16px;
          cursor: pointer;
          &:hover {
            color: black;
          }
        }
      }

      > .content {
        z-index: 11;
        flex: 2;
        background: #ffffffdd;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        border: 4px solid white;

        .input,
        .output {
          @include noselected();
          color: rgb(95, 95, 95);
          display: flex;
          align-items: center;
          font-size: 12px;
        }
        .input {
          flex-direction: row;
          .dot {
            width: 12px;
            height: 12px;
            border: 4px solid #228a1f;
            margin-right: 6px;
          }
        }
        .output {
          flex-direction: row-reverse;
          .dot {
            background: #228a1f;
            margin-left: 6px;
          }
        }
        .field {
          padding: 8px;
        }
        .dot {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          display: inline;
          cursor: default;
        }
        .fas {
          margin-left: 8px;
          margin-right: 8px;
        }
      }
    }
  }

  .jtk-connector,
  .jtk-endpoint {
    z-index: 4;
  }
}
</style>
