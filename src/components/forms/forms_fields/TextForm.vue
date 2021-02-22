<template>
  <div class="form">
    <div class="header" @click="show = !show">
      <div class="header-btn">
        <font-awesome-icon :class="{ rotateA90: !show }" icon="chevron-down" />
      </div>
      <div class="title">Texto</div>
      <div class="flex-filler"></div>
      <div
        class="header-btn"
        @click.stop="$emit('remove', content)"
      >
        <font-awesome-icon icon="trash" />
      </div>
    </div>
    <div class="content" :class="{ show: show }">
      <MultipleTextEditor :texts="content.text"/>
      <div class="label">
        Acima existem as variações de texto, umas delas será escolhida aleatóriamente para
        ser enviada ao usuário
      </div>
    </div>
  </div>
</template>
<script>


import MultipleTextEditor from "@/components/MultipleTextEditor.vue";

export default {
  props: {
    content: Object,
  },
  components:{
    MultipleTextEditor
  },
  data: () => ({
    show: true,
  }),
};
</script>
