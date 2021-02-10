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
      Fluxo
      <font-awesome-icon icon="pen" />
    </div>
    <div class="content">
      <div class="row-between">
        <div class="input field">
          <div class="dot endpoint-target" ref="input" @mousedown.stop></div>
          entrada
        </div>
        <div class="output field">
          <div class="dot endpoint-source" ref="output" @mousedown.stop></div>
          saída
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
  mounted() {
    this.dom = this.$refs.dom;
    this.block.dom = this.$refs.dom;
    this.$eventBus.emit("set_endpoints", this.block, this.$refs.input, [
      this.$refs.output,
    ]);
  },
};
</script>
