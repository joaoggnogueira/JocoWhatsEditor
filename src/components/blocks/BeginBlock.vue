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
    <div class="header">Início</div>
    <div class="content">
      <div class="row-between">
        <div class="flex-filler"></div>
        <div class="output field">
          <div class="dot endpoint-source" ref="output" data-index="0" @mousedown.stop></div>
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
    this.$eventBus.emit("create_block_interface", this.block, {
      get_input_endpoints: () => null,
      get_output_endpoints: () => [this.$refs.output],
    });
  },
};
</script>
