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
      <template v-if="block.options.length">
        <OptionInputForm
          v-for="option in block.options"
          :key="option.name"
          :option="option"
          @remove="remove"
          :locked="false"
        />
      </template>
      <template v-else>
        <div class="subheader-empty">Sem tratamento de intenção</div>
      </template>
      <div class="form-fallback">
        <MultipleTextEditor :texts="block.fallback" />
      </div>
      <div class="form-fallback">
        <EventAnalyticsForm :analytics="block.analytics" />
      </div>
    </div>
  </div>
</template>
<script>
import OptionInputForm from "./forms_fields/OptionInputForm.vue";
import MultipleTextEditor from "@/components/MultipleTextEditor.vue";
import EventAnalyticsForm from "./EventAnalyticsForm.vue";

export default {
  props: {
    block: Object,
  },
  components: {
    OptionInputForm,
    MultipleTextEditor,
    EventAnalyticsForm
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
