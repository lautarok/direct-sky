<style scoped>
  .loader {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity ease .2s .2s;
    color: var(--primary-color);
  }

  .loader.hide {
    opacity: 0;
    transition: none;
  }
  
  .loader.dark {
    color: #FFF;
  }

  .loader > svg {
    width: 70px;
    height: 70px;
  }

  .loader.s > svg {
    width: 22px;
    height: 22px;
  }
</style>

<template>
  <div :class='{loader: true, dark, hide, s: size === "s"}'>
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 38 38" stroke="currentColor">
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="2">
          <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
            </path>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang='ts'>
  export default {
    props: ['dark', 'size', 'hide']
  }
</script>