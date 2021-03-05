<template>
  <div id="app">
    <div class="flowchartParent">
      <Flowchart @open_edit_form_block="open_edit_form_block" />
    </div>
    <FlowchartForm v-if="editBlock" :block="editBlock" @onClose="close" />
  </div>
</template>

<script>
import Flowchart from "./components/Flowchart.vue";
import FlowchartForm from "./components/FlowchartForm.vue";
import store from "@/store";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Flowchart,
    FlowchartForm,
  },
  store,
  mounted() {
    this.loadAndReadyToFlowchart();
  },
  data: () => ({
    editBlock: null,
  }),
  methods: {
    ...mapActions(["loadAndReadyToFlowchart"]),
    open_edit_form_block(block) {
      this.editBlock = block;
    },
    close() {
      this.editBlock = null;
    },
  },
};
</script>

<style lang="scss">
@mixin noselected() {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.error-span{
  color: red;
  font-weight: 100;
}
.transformEasing{
  transition: transform 0.5s ease-out;
}
.flowchartParent {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
}
.v-popper__inner {
  color: #444444 !important;
  font-family: sans-serif;
}
.v-popper--theme-tooltip .v-popper__inner {
  background: #f0f0f0 !important;
  border: 1px solid #dadada !important;
}
.v-popper--theme-tooltip .v-popper__arrow {
  border-color: #cccccc !important;
}

.rotateA90 {
  transform: rotate(-90deg);
}

.row {
  display: flex;
  align-items: center;
  margin: 6px;
  padding: 6px;
}

input {
  padding: 8px;
  margin: 4px;
  border: 1px solid #bbb;
  background: #fff;
  border-radius: 8px;
}

input.input-error{
  border: 1px solid red;
  color: red;
  background: rgba(255, 0, 0, 0.233);
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-center {
  justify-content: space-around;
  display: flex;
  align-items: center;
}

.flex-filler {
  flex-grow: 2;
}

.btn-add-content {
  flex-grow: 2;
  background: #eeeeee;
  color: black;
  border-radius: 5px;
  min-height: 30px;
  line-height: 30px;
  margin: 4px;
  font-size: 14px;
  padding: 4px;
  cursor: pointer;
  &:hover {
    background: #4bb147;
  }
}

.btn-bullet {
  margin: 0px 4px;
  flex-grow: 1;
  max-width: 50px;
  height: 20px;
  line-height: 22px;
  background: #dddddd;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  @include noselected();
  &:hover {
    background: #eee;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
  }
}
.btn-left-icon {
  margin: 0px 4px;
  margin-right: 0px;
  flex-grow: 1;
  max-width: 50px;
  height: 30px;
  line-height: 30px;
  background: #dddddd;
  border-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  font-weight: bold;
  cursor: pointer;
  @include noselected();
  &:hover {
    background: #eee;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
  }
}
.input-right {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  margin-left: 0px;
}
.btn {
  margin: 0px 4px;
  flex-grow: 1;
  height: 20px;
  line-height: 22px;
  background: #dddddd;
  font-size: 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  @include noselected();
  &:hover {
    background: #eee;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
  }
}
</style>
