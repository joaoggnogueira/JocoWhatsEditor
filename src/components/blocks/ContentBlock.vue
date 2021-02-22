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
          <div class="dot endpoint-source" ref="output" data-index="0" @mousedown.stop></div>
          saída
        </div>
      </div>
      <component :is="c.component" v-for="c in block.content" :key="c.cid" :content="c" />
    </div>
  </div>
</template>
<script>
import ImageBlockPrewie from "./blocks_prewie/ImageBlockPrewie.vue";
import TextBlockPrewie from "./blocks_prewie/TextBlockPrewie.vue";
import DocBlockPrewie from "./blocks_prewie/DocBlockPrewie.vue";
import VideoBlockPrewie from "./blocks_prewie/VideoBlockPrewie.vue";
import AudioBlockPrewie from "./blocks_prewie/AudioBlockPrewie.vue";

export default {
  data: () => ({
    dom: null,
  }),
  components: {
    ImageBlockPrewie,
    TextBlockPrewie,
    DocBlockPrewie,
    VideoBlockPrewie,
    AudioBlockPrewie,
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
          image: "ImageBlockPrewie",
          text: "TextBlockPrewie",
          document: "DocBlockPrewie",
          audio: "AudioBlockPrewie",
          video: "VideoBlockPrewie",
        }[d.type];
        d.cid = d.cid || this.$uuid.v1();
      });
    },
  },
  mounted() {
    this.dom = this.$refs.dom;
    this.block.dom = this.$refs.dom;
    this.$eventBus.emit("create_block_interface", this.block, {
      get_input_endpoints: () => this.$refs.input,
      get_output_endpoints: () => [this.$refs.output],
    });
  },
};
</script>
