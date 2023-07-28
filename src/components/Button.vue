<style scoped>
  button,
  a {
    height: 40px;
    padding: 0 10px;
    border-radius: 3px;
    transition: background-color ease .15s;
    color: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    position: relative;
  }

  button.primary {
    background-color: var(--primary-color);
    color: #FFF;
    padding: 0 15px;
  }

  button.loading {
    color: transparent;
    cursor: context-menu;
  }

  button.disabled,
  a.disabled {
    opacity: .5;
    cursor: context-menu;
  }

  @media (hover: hover) and (pointer: fine) {

    a:not(.loading, .disabled):hover,
    button:not(.loading, .disabled):hover {
      background-color: var(--primary-color-a10);
    }

    button.primary:not(.loading, .disabled):hover {
      background-color: var(--primary-hover-color);
    }

  }
</style>

<template>
  <button
    :class='{loading, disabled, primary}'
    :style='{width, height, padding}'
    v-if='!to'
    @click='!loading && !disabled ? $emit("click") : null'
    :type='type'
  >
    <span>{{ value }}</span>
    <Loader :hide='!loading' :dark='primary' size='s' />
  </button>
  <RouterLink :class='loading ? "loading" : null' v-if='to' :to='to'>{{ value }}</RouterLink>
</template>

<script lang='ts' setup>
  import { RouterLink } from 'vue-router';
  import Loader from './Loader.vue';
</script>

<script lang='ts'>
  export default {
    props: ['to', 'value', 'loading', 'disabled', 'primary', 'type', 'width', 'height', 'padding'],
    emits: ['click']
  };
</script>