<template>
  <div
    class="block"
    :style="{ left: block.x + 'px', top: block.y + 'px' }"
    style="width: 256px"
    @mousedown="$emit('mousedown', $event, block)"
    @mouseup="$emit('mouseup', $event, block)"
    @mousemove="$emit('mousemove', $event, block)"
    ref="dom"
  >
    <div class="header">
      User Input
      <font-awesome-icon icon="pen" @click="edit" />
    </div>
    <div class="content">
      <div class="row-between">
        <div class="input field">
          <div class="dot endpoint-target" ref="input" @mousedown.stop></div>
          entrada
        </div>
      </div>
      <div
        class="row-between"
        v-for="(option) in block.options"
        :key="option.name"
      >
        <div class="flex-filler"></div>
        <div class="output field">
          <div class="dot endpoint-source" ref="outputs" @mousedown.stop></div>
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    dom: null,
  }),
  props: {
    block: Object,
  },
  methods: {
    edit() {
      this.$eventBus.emit("open_edit_form_block", this.block);
    },
    updateEndpoints() {},
  },
  mounted() {
    this.dom = this.$refs.dom;
    this.block.dom = this.$refs.dom;
    this.$eventBus.emit("set_endpoints", this.block, this.$refs.input, this.$refs.outputs);
  },
};
</script>
