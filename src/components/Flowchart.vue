<template>
  <div
    id="flowchart"
    ref="flowchat"
    @wheel="flowchart_wheel"
    @mousedown="flowchart_mousedown"
    @mouseup="flowchart_mouseup"
    @mousemove="flowchart_mousemove"
    :style="{ backgroundImage: getBackground }"
  >
    <div
      class="flowchart-content"
      ref="flowchatContent"
      :class="{ 'dragging-block': draggingBlock ? true : false }"
    >
      <component
        :is="block.component"
        v-for="block in blocks"
        :key="block.id"
        @mousedown="block_mousedown"
        @mouseup="block_mouseup"
        @mousemove="block_mousemove"
        :block="block"
      />
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import Begin from "./blocks/BeginBlock.vue";
import End from "./blocks/EndBlock.vue";
import Redirect from "./blocks/RedirectBlock.vue";
import Content from "./blocks/ContentBlock.vue";
import UserInput from "./blocks/UserInputBlock.vue";
import loadsh from "lodash";

export default {
  name: "Flowchart",
  props: {
    blocks: Array,
  },
  components: {
    Begin,
    End,
    Redirect,
    Content,
    UserInput,
  },
  data: () => ({
    dragX: 0,
    dragY: 0,
    lastDragX: 0,
    lastDragY: 0,
    translateX: 0,
    translateY: 0,
    dragging: false,
    draggingBlock: false,
    zoom: 1,
    flowchatContent: null,
    flowchat: null,
    backups: [],
  }),
  watch: {
    blocks() {
      this.$nextTick(this.revalidadeConnections);
    },
  },
  mounted() {
    this.plumbInstance = jsPlumb.getInstance({
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

    this.flowchatContent = this.$refs.flowchatContent;
    this.flowchat = this.$refs.flowchat;

    this.plumbInstance.setContainer(this.flowchatContent);
    this.plumbInstance.registerConnectionType("example", {
      paintStyle: { stroke: "#228a1f", strokeWidth: 2 },
      hoverPaintStyle: { stroke: "cornflowerblue", strokeWidth: 2 },
    });

    this.plumbInstance.bind("connection", this.on_connection);
    this.$eventBus.on("set_endpoints", this.set_endpoints);
    this.$eventBus.on("open_edit_form_block", this.open_edit_form_block);
    this.$eventBus.on("remove_endpoint", this.remove_endpoint);
    this.$eventBus.on("remove_block", this.remove_block);

    document.addEventListener("keyup", this.keyupHandler);
  },
  methods: {
    revalidadeConnections() {
      for (let i = 0; i < this.blocks.length; i++) {
        const block = this.blocks[i];
        if (block.type === "user_input") {
          block.redirect = block.options.map((option) => option.redirect);
        }
        if (block.redirect) {
          for (let j = 0; j < block.redirect.length; j++) {
            const next = block.redirect[j];
            if (next) {
              const input = this.blocks.find((b) => b.id == next);
              this.plumbInstance.connect({
                source: block.output_endpoints[j],
                target: input.input_endpoint,
              });
            }
          }
        }
      }
    },
    keyupHandler(event) {
      if (event.ctrlKey && event.code === "KeyZ") {
        this.undoHandler();
      }
    },
    undoHandler() {
      const pop = this.backups.pop();
      if (pop) {
        this.plumbInstance.deleteEveryEndpoint();
        this.plumbInstance.deleteEveryConnection();
        this.blocks.length = 0;
        for (let i = 0; i < pop.length; i++) {
          this.blocks.push(pop[i]);
        }
      }
    },
    pushHandler() {
      this.backups.push(loadsh.cloneDeep(this.blocks));
    },
    open_edit_form_block(block) {
      this.$emit("open_edit_form_block", block);
    },
    connect_endpoints(source, target_id) {
      const block = this.blocks.find((block) => block.id == target_id);
      this.plumbInstance.connect({
        source: source,
        target: block.input_endpoint,
      });
    },
    remove_block(block) {
      this.pushHandler();
      const connections = this.plumbInstance.select({ target: block.input_endpoint });
      for (let i = 0; i < connections.length; i++) {
        const connection = connections.get(i);
        const source = connection.source;
        source.block.redirect[source.redirectIndex] = null;
        if (source.block.type === "user_input") {
          source.block.options[source.redirectIndex].redirect = null;
        }
        this.plumbInstance.deleteConnection(connection);
      }
      const index = this.blocks.findIndex((b) => b === block);
      this.blocks.splice(index, 1);
      for (let i = 0; i < block.output_endpoints.length; i++) {
        const output = block.output_endpoints[i];
        this.plumbInstance.select({ source: output }).delete();
      }
    },
    remove_endpoint(block, index) {
      this.plumbInstance.select({ source: block.output_endpoints[index] }).delete();
      block.output_endpoints.splice(index, 1);
      block.redirect.splice(index, 1);
      if (block.type === "user_input") {
        block.options.splice(index, 1);
      }

      this.$nextTick(() => {
        for (let i = 0; i < block.output_endpoints.length; i++) {
          block.output_endpoints[i].redirectIndex = i;
          this.plumbInstance.revalidate(block.output_endpoints[i]);
        }
      });
    },
    on_connection(info) {
      const block = info.source.block;
      if (!block.redirect) {
        block.redirect = [];
      }
      block.redirect[info.source.redirectIndex] = info.target.block.id;
      if (block.type === "user_input") {
        block.options[info.source.redirectIndex].redirect = info.target.block.id;
      }
    },
    //input is DOM Elements, outputs is Map
    set_endpoints(block, input, outputs) {
      if (outputs) {
        block.output_endpoints = [];
        outputs.forEach((output, index) => {
          block.output_endpoints.push(output);
          output.block = block;
          output.redirectIndex = index;

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
      if (input) {
        block.input_endpoint = input;
        input.block = block;

        this.plumbInstance.makeTarget(input, {
          endpoint: "Blank",
          anchor: [0, 0.5, 0, 0, 4, 0],
          allowLoopback: false,
          connectionsDetachable: true,
          connectorOverlays: [
            ["Arrow", { width: 15, length: 15, location: 1, id: "arrow" }],
          ],
        });
      }
    },
    create_overlay_arrow(connection) {
      const dom = document.createElement("div");
      dom.style.backgroundImage = `url(${require("@/assets/close.svg")})`;
      dom.className = "deleteCBtn";
      dom.addEventListener("click", () => {
        const block = connection.source.block;
        block.redirect[connection.source.redirectIndex] = null;
        if (block.type === "user_input") {
          block.options[connection.source.redirectIndex].redirect = null;
        }
        this.plumbInstance.deleteConnection(connection);
      });
      return dom;
    },
    block_mousedown(evt, block) {
      if (this.draggingBlock) {
        this.block_mouseup(evt, this.draggingBlock);
        return;
      }
      block.dom.classList.add("selected");
      this.dragX = parseFloat(block.dom.style.left);
      this.dragY = parseFloat(block.dom.style.top);
      this.lastDragX = evt.x;
      this.lastDragY = evt.y;
      this.draggingBlock = block;
      evt.stopPropagation();
    },
    block_mouseup(evt, block) {
      if (this.draggingBlock == block) {
        this.draggingBlock.dom.classList.remove("selected");
        this.updatePosition(this.draggingBlock, this.dragX, this.dragY, true);
        this.draggingBlock = false;
        this.plumbInstance.repaintEverything();
      }
    },
    block_mousemove(evt, block) {
      if (this.draggingBlock == block) {
        const deltaX = (evt.x - this.lastDragX) / this.zoom;
        const deltaY = (evt.y - this.lastDragY) / this.zoom;
        if (deltaX === 0 && deltaY === 0) {
          return;
        }
        this.dragX += deltaX;
        this.dragY += deltaY;
        this.updatePosition(this.draggingBlock, this.dragX, this.dragY, false);
        this.lastDragX = evt.x;
        this.lastDragY = evt.y;
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
      this.flowchatContent.style.transform = `translate(${this.translateX}px , ${this.translateY}px) scale(${this.zoom})`;
      this.flowchat.style.backgroundPosition = `${this.translateX}px ${this.translateY}px`;
      this.flowchat.style.backgroundSize = `${64 * this.zoom}px ${64 * this.zoom}px`;
    },

    flowchart_wheel(evt) {
      const previousZoom = this.zoom;
      if (evt.wheelDelta > 0) {
        this.zoom += (3 - this.zoom) / 20;
      } else {
        this.zoom -= (this.zoom - 0.25) / 20;
      }

      const posX =
        (evt.x - this.flowchat.parentElement.offsetLeft) / this.flowchat.offsetWidth;
      const posY =
        (evt.y - this.flowchat.parentElement.offsetTop) / this.flowchat.offsetHeight;
      const dX = posX * this.flowchat.offsetWidth - this.translateX;
      const dY = posY * this.flowchat.offsetHeight - this.translateY;

      const ratio = 1 - this.zoom / previousZoom;

      this.translateX += dX * ratio;
      this.translateY += dY * ratio;

      this.updateFlowchartContent();
      this.plumbInstance.setZoom(this.zoom);
    },

    flowchart_mousedown(evt) {
      if (!this.draggingBlock) {
        this.lastDragX = evt.x;
        this.lastDragY = evt.y;
        this.dragging = true;
      }
    },

    flowchart_mouseup() {
      this.dragging = false;
    },

    move_flowchart(deltaX, deltaY) {
      if (this.dragging) {
        this.translateX += deltaX;
        this.translateY += deltaY;
        this.updateFlowchartContent();
      }
    },

    flowchart_mousemove(evt) {
      if (this.dragging) {
        const deltaX = evt.x - this.lastDragX;
        const deltaY = evt.y - this.lastDragY;
        this.move_flowchart(deltaX, deltaY);
        this.lastDragX = evt.x;
        this.lastDragY = evt.y;
      } else if (this.draggingBlock) {
        // this.block_mouseup(evt, this.draggingBlock);
      }
    },
  },
  computed: {
    getBackground() {
      return `url(${require("../assets/pixel.png")})`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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

#flowchart {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: 64px 64px;
  background-color: #6bb297;

  > .flowchart-content {
    position: absolute;
    left: 0px;
    top: 0px;

    &.dragging-block{
      .jtk-connector{
        z-index: 1;
      }
      .jtk-overlay{
        z-index: 1;
      }
    }

    > .block {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      z-index: 2;
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
      border-radius: 16px;

      &.selected {
        z-index: 3;
      }

      &:hover > .content {
        cursor: grab;
      }

      > .header {
        @include noselected();
        flex: 1;
        background: white;
        max-height: 48px;
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
