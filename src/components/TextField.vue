<style scoped>
  .text_field {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: text;
  }

  .text_field > span {
    font-size: 14px;
    line-height: 1;
    color: var(--text-color);
  }

  .text_field > .box {
    width: 100%;
    height: 50px;
    background-color: var(--primary-color-a10);
    border-radius: 3px;
    padding: 0 15px;
    transition: box-shadow ease .2s, border-color ease .2s;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: center;
  }

  .text_field > .box:focus-within {
    box-shadow: 0 0 0 2px var(--primary-color-a50);
    border-color: var(--primary-color);
  }

  .text_field > .box > svg {
    width: 16px;
    height: 16px;
    color: var(--text-color);
    opacity: .7;
  }

  .text_field > .box > input {
    font-size: 14px;
    color: var(--text-color);
  }

  @media (prefers-color-scheme: dark) {
    .text_field > .box {
      background-color: rgb(255 255 255 / 10%);
    }
  }
</style>

<template>
  <div class='text_field' @click='focus'>
    <span>{{ label }}</span>
    <div class='box'>
      <Mention v-if='type === "email"' />
      <Heart v-else-if='type === "text"' />
      <Key v-else-if='type === "password"' />
      <PaperAirplane v-else />
      <input
        ref='input'
        autocomplete='off'
        :type='type'
        :placeholder='placeholder'
        :autofocus='autofocus'
        :value='modelValue'
        @input='$emit("update:modelValue", ($event.target as HTMLInputElement).value)'
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
  import Mention from './icons/Mention.vue';
  import PaperAirplane from './icons/PaperAirplane.vue';
  import Heart from './icons/Heart.vue';
  import Key from './icons/Key.vue';
</script>

<script lang='ts'>
  export default {
    props: ['type', 'label', 'placeholder', 'autofocus', 'modelValue'],
    emits: ['update:modelValue'],

    methods: {
      focus() {
        (this.$refs.input as HTMLInputElement).focus();
      }
    }
  }
</script>