<style scoped>
  button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-color);
    transition: background-color ease .2s;
  }

  button.dark {
    color: #FFF;
  }

  @media (hover: hover) and (pointer: fine) {
    button:not(.dark):hover {
      background-color: rgb(0 0 0 / 10%);
    }

    button.dark:hover {
      background-color: rgb(255 255 255 / 10%);
    }
  }

  @media (prefers-color-scheme: dark) {
    @media (hover: hover) and (pointer: fine) {
      button:hover {
        background-color: rgb(255 255 255 / 10%) !important;
      }
    }
  }
</style>

<template>
  <button
    type='button'
    :class='{dark}'
    @click='$emit("click", $event)'
    :style='absolute ? {
      position: "absolute",
      right: absolute[1],
      top: absolute[0]
    } : {}'
  >
    <slot />
  </button>
</template>

<script lang='ts'>
  export default {
    props: ['dark', 'absolute'],
    emits: ['click']
  }
</script>