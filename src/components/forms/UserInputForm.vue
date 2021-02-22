<template>
  <div class="form-control">
    <div class="header">
      <font-awesome-icon icon="times" @click="$emit('onClose')" />
      <div class="title">Edição de Entrada de Usuário</div>
      <div class="flex-filler"></div>
      <div class="btn" @click="removeBlock">Excluir bloco</div>
    </div>
    <div class="content">
      <div class="btn-add-content" @click="addIntent">
        <font-awesome-icon icon="plus" /> Nova Intenção
      </div>
      <OptionInputForm
        v-for="option in block.options"
        :key="option.name"
        :option="option"
        @remove="remove"
        :locked="false"
      />
    </div>
  </div>
</template>
<script>
import OptionInputForm from "./forms_fields/OptionInputForm.vue";

export default {
  props: {
    block: Object,
  },
  components: {
    OptionInputForm,
  },
  methods: {
    removeBlock() {
      this.$eventBus.emit("remove_block", this.block);
      this.$emit("onClose");
    },
    addIntent() {
      const name = "Opção " + parseInt(Math.random() * 10000);

      this.$eventBus.emit("add_redirect", this.block, {
        name: name,
        synonyms: [name],
        redirect: null,
      });
    },
    remove(option) {
      const index = this.block.options.indexOf(option);
      this.$eventBus.emit("remove_endpoint", this.block, index);
    },
  },
};
</script>
<style lang="scss"></style>
