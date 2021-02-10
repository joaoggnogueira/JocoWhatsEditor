<template>
  <div class="audiofield">
    <audio class="audio" controls>
      <source :src="content.link" type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
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
.audiofield {
  border-radius: 16px;
  margin: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  border: 1px solid #228a1f;
  .audio {
    max-width: 100%;
  }
}
</style>
