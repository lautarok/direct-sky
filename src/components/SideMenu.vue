<style scoped>
  aside {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px 0;
    background-color: var(--menu-color);
    background-size: cover;
    z-index: 999;
  }

  aside > .h_padding {
    padding: 0 25px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    color: #FFF;
    font-size: 14px;
  }

  aside > .h_padding > span {
    opacity: .7;
  }

  aside > .h_padding > .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  aside > .h_padding > .head > button:last-child {
    display: none;
  }

  aside > nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  aside > nav > a {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #FFF;
    padding: 14px 25px;
    transition: background-color ease .2s;
  }

  aside > nav > a > svg {
    width: 16px;
    height: 16px;
    color: #FFF;
  }

  aside > nav > a.selected {
    cursor: context-menu;
    background-color: var(--accent-color);
  }

  @media (hover: hover) and (pointer: fine) {
    aside > nav > a:not(.selected):hover {
      background-color: rgb(255 255 255 / 10%);
    }
  }

  @media (prefers-color-scheme: dark) {
    aside {
      background-color: #111;
    }
  }

  @media only screen and (max-width: 1100px) {
    aside {
      position: fixed;
      width: 260px;
      max-width: 90vw;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      opacity: 0;
      transition: transform ease .2s, opacity ease .2s;
    }

    aside.open {
      transform: translateX(0);
      opacity: 1;
    }

    aside > .h_padding > .head > button:last-child {
      display: flex;
    }
  }
</style>

<template>
  <aside :class='{open}' @click.stop>
    <div class='h_padding'>
      <div class='head'>
        <Logo :dark='true' size='m' />
        <IconButton :dark='true' @click='$emit("close")'>
          <Cross />
        </IconButton>
      </div>
      <UserCard :dark='true' />
    </div>
    <nav>
      <a class='selected'>
        <Planet />
        <span>Home</span>
      </a>
      <a href='https://github.com/lautarok/direct-sky' target='_blank'>
        <GitHub />
        <span>Repository</span>
      </a>
    </nav>
    <div class='h_padding'>
      <span>Only the security of your access password is guaranteed, do not use this service to send private or confidential messages</span>
    </div>
  </aside>
</template>

<script lang='ts' setup>
  import UserCard from './UserCard.vue';
  import Logo from './Logo.vue';
  import GitHub from './icons/GitHub.vue';
  import Planet from './icons/Planet.vue';
  import IconButton from './IconButton.vue';
  import Cross from './icons/Cross.vue';
</script>

<script lang='ts'>
  export default {
    props: ['open'],
    emits: ['close']
  }
</script>