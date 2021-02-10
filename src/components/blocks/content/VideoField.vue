<template>
  <div class="videofield">
    <video class="video" controls>
      <source :src="content.link" type="video/mp4" />
    </video>
    <div class="caption">{{ content.caption | str_limit(50) }}</div>
  </div>
</template>
<script>
export default {
  props: {
    content: Object,
  },
};
</script>
<style lang="scss" scoped>
.videofield {
  border-radius: 16px;
  margin: 4px;
  padding: 8px;
  display: flex;
  align-items: stretch;
  border: 1px solid #228a1f;
  display: flex;
  flex-direction: column;
  .video {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
  }
  .caption {
    height: 25px;
    line-height: 25px;
    z-index: 2;
  }
}
</style>
