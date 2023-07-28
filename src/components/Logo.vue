<style scoped>
  .logo {
    width: fit-content;
    height: fit-content;
    display: flex;
    gap: 10px;
    color: var(--primary-color);
    align-items: center;
  }

  .logo.dark {
    color: #FFF;
  }

  .logo > svg {
    width: 24px;
    height: 24px;
    stroke-width: 2.8px;
  }

  .logo.xl > svg {
    width: 30px;
    height: 30px;
  }

  .logo > span {
    font-weight: 500;
    font-size: 24px;
    line-height: 1;
  }

  .logo.xl > span {
    font-size: 30px;
  }

  .logo.m {
    gap: 6.34px;
  }

  .logo.m > span {
    font-size: 16px;
  }

  .logo.m > svg {
    width: 16px;
    height: 16px;
  }
</style>

<template>
  <div :class='{logo: true, dark, xl: size === "xl", m: size === "m"}'>
    <PaperAirplane />
    <span>Direct Sky</span>
  </div>
</template>

<script setup lang='ts'>
  import PaperAirplane from './icons/PaperAirplane.vue';
</script>

<script lang='ts'>
  export default {
    props: ['dark', 'size']
  }
</script>