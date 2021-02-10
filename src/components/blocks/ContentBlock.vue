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
      Conteúdo
      <font-awesome-icon icon="pen" @click="edit" />
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
      <component :is="c.component" v-for="c in block.content" :key="c.cid" :content="c" />
    </div>
  </div>
</template>
<script>
import ImageField from "./content/ImageField.vue";
import TextField from "./content/TextField.vue";
import DocField from "./content/DocField.vue";
import VideoField from "./content/VideoField.vue";
import AudioField from "./content/AudioField.vue";


export default {
  data: () => ({
    dom: null,
  }),
  components: {
    ImageField,
    TextField,
    DocField,
    VideoField,
    AudioField
  },
  props: {
    block: Object,
  },
  beforeMount() {
    this.processContent();
  },
  beforeUpdate() {
    this.processContent();
  },
  methods: {
    edit() {
      this.$eventBus.emit("open_edit_form_block", this.block);
    },
    processContent() {
      this.block.content.forEach((d) => {
        d.component = {
          image: "ImageField",
          text: "TextField",
          document: "DocField",
          audio: "AudioField",
          video: "VideoField",
        }[d.type];
        d.cid = d.cid || this.$uuid.v1();
      });
    },
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
