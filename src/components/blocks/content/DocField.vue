<template>
  <div class="docfield">
    <div class="icon">
        <font-awesome-icon icon="file-alt" />
    </div>
    <div class="desc">
      <div class="title">{{ content.filename| str_limit(30) }}</div>
      <div class="caption">{{ content.caption | str_limit(50)  }}</div>
    </div>
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
.docfield {
  border-radius: 16px;
  margin: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  border: 1px solid #228a1f;
  > .icon {
    background-color: #228a1f;
    min-width: 52px;
    height: 52px;
    border-radius: 32px;
    background-position: center center;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    line-height: 58px;
    .fa-file-alt{
        color: white;
        font-size: 24px;
    }
  }
  > .desc {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    > .title {
      font-weight: bold;
    }
    > .caption {
      font-size: 12px;
    }
  }
}
</style>
