<template>
  <div
    class="block"
    :style="{ left: block.x + 'px', top: block.y + 'px' }"
    :class="{ new: block.new }"
    style="width: 256px"
    @mousedown="$emit('mousedown', $event, block)"
    @mouseup="$emit('mouseup', $event, block)"
    @mousemove="$emit('mousemove', $event, block)"
    ref="dom"
  >
    <div class="header">
      <template v-if="name">{{ name }}</template>
      <span v-else-if="canEdit" @click="edit" class="error-span"
        >Clique aqui para editar</span
      >
      <font-awesome-icon v-if="canEdit" icon="pen" @click="edit" />
    </div>
    <component :is="'c_' + block.type" :block="block"></component>
  </div>
</template>
<script>
import Begin from "./blocks/BeginBlock.vue";
import End from "./blocks/EndBlock.vue";
import Redirect from "./blocks/RedirectBlock.vue";
import Content from "./blocks/ContentBlock.vue";
import UserInput from "./blocks/UserInputBlock.vue";
import Request from "./blocks/RequestBlock.vue";

export default {
  components: {
    c_begin: Begin,
    c_end: End,
    c_redirect: Redirect,
    c_message: Content,
    c_user_input: UserInput,
    c_request: Request,
  },
  props: {
    block: Object,
  },
  computed: {
    canEdit() {
      return ["begin", "end"].indexOf(this.block.type) === -1;
    },
    name() {
      if (this.block.type === "begin") {
        return "Início";
      } else {
        return this.block.name;
      }
    },
  },
  methods: {
    edit() {
      this.$eventBus.emit("open_edit_form_block", this.block);
    },
  },
  mounted() {
    this.block.dom = this.$refs.dom;
  },
};
</script>
<style lang="scss">
@keyframes creatingBlock {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}
.block {
  animation: creatingBlock 0.25s ease-out 0s 1 normal forwards;
}
</style>
