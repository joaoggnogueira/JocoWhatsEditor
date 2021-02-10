<template>
  <div class="prewie">
    <img class="prewie" :src="getPrewie" />
    <div class="caption">{{ content.caption | str_limit(30) }}</div>
  </div>
</template>
<script>
export default {
  props: {
    content: Object,
  },
  computed: {
    getPrewie() {
      return this.content.link;
    },
  },
};
</script>
<style lang="scss" scoped>
.prewie {
  border-radius: 16px;
  margin: 4px;
  img {
    width: calc(100% - 8px);
  }
  .caption {
    position: absolute;
    backdrop-filter: blur(4px);
    height: 40px;
    background: rgba(0, 0, 0, 0.8);
    line-height: 40px;
    margin-top: -40px;
    color: white;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    margin-left: 4px;
    width: calc(100% - 25px);
  }
}
</style>
