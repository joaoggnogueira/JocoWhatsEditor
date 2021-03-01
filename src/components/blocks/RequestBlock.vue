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
      Requisição
      <font-awesome-icon icon="pen" @click="edit" />
    </div>
    <div class="content">
      <div class="row-between">
        <div class="input field">
          <div class="dot endpoint-target" ref="input" @mousedown.stop></div>
          entrada
        </div>
        <div class="output field">
          <div
            class="dot endpoint-source"
            ref="outputA"
            data-index="0"
            @mousedown.stop
          ></div>
          Sucesso
        </div>
      </div>
      <div class="row-between">
        <div class="flex-filler"></div>
        <div class="output field">
          <div
            class="dot endpoint-source"
            ref="outputB"
            data-index="1"
            @mousedown.stop
          ></div>
          Falha
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
  },
  mounted() {
    this.dom = this.$refs.dom;
    this.block.dom = this.$refs.dom;
    this.$eventBus.emit("create_block_interface", this.block, {
      get_input_endpoints: () => this.$refs.input,
      get_output_endpoints: () => [this.$refs.outputA, this.$refs.outputB],
    });
  },
};
</script>
