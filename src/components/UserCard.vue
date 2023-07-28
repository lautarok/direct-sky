<style scoped>
  .user_card {
    width: 100%;
    padding: 15px;
    border-radius: 5px;
    background-color: var(--accent-color-a20);
    display: grid;
    grid-template-columns: 35px 1fr 20px;
    grid-template-rows: auto;
    gap: 15px;
    text-align: left;
    transition: background-color ease .2s;
    align-items: center;
  }

  .user_card > span {
    width: 35px;
    height: 35px;
    background-color: var(--accent-color);
    color: #FFF;
    font-size: 16px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: 600;
  }

  .user_card > .text {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    color: var(--text-color);
    font-size: 16px;
    font-weight: 500;
  }

  .user_card.dark > .text {
    color: #FFF;
  }
  
  .user_card > .text > span {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .user_card > .text > span:last-child {
    font-size: 12px;
    opacity: .8;
  }

  .user_card > svg {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
    opacity: .8;
  }

  .menu {
    width: 250px;
    background-color: var(--menu-color2);
    position: fixed;
    top: 40px;
    left: 245px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 0;
    overflow: hidden;
    z-index: 99;
  }

  .menu.show {
    height: fit-content;
    box-shadow: 0 0 10px rgb(0 0 0 / 20%);
    padding: 20px;
    padding-top: 30px;
    animation: show ease .2s;
  }

  .menu.hide {
    animation: show ease .2s reverse;
  }

  .menu > .head {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
  }

  .menu > .letter {
    width: 70px;
    height: 70px;
    background-color: var(--accent-color);
    color: #FFF;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 15px;
    box-shadow: 0 0 0 4px var(--accent-color-a30);
    text-transform: uppercase;
  }

  .menu > .nickname,
  .menu > .email {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }

  .menu > .nickname {
    font-size: 18px;
    color: #FFF;
    font-weight: 500;
  }

  .menu > .email {
    font-size: 14px;
    color: #FFF;
    opacity: .8;
    margin-bottom: 20px;
  }

  .menu > button {
    width: 100%;
    padding: 10px;
    color: #FFF;
    background-color: var(--accent-color);
    border-radius: 3px;
    font-weight: 500;
    font-size: 14px;
    transition: background-color ease .2s;
  }

  @media (hover: hover) and (pointer: fine) {
    .user_card:hover {
      background-color: var(--accent-color-a30);
    }

    .menu > button:hover {
      background-color: var(--accent-hover-color);
    }
  }

  @keyframes show {
    0% {
      height: fit-content;
      box-shadow: 0 0 10px rgb(0 0 0 / 20%);
      padding: 20px;
      padding-top: 30px;
      transform: translateY(20px);
      opacity: 0;
    }
    
    100% {
      height: fit-content;
      box-shadow: 0 0 10px rgb(0 0 0 / 20%);
      padding: 20px;
      padding-top: 30px;
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-color-scheme: dark) {
    .menu {
      background-color: #222;
    }
  }

  @media only screen and (max-width: 900px) {
    .menu {
      border-radius: 0;
      width: 260px;
      left: 0;
      top: 0;
      box-shadow: none;
    }

    .menu.show {
      height: 100%;
      padding-top: 70px;
    }

    @keyframes show {
      0% {
        height: 100%;
        padding: 20px;
        padding-top: 70px;
        transform: translateY(20px);
        opacity: 0;
      }
      
      100% {
        height: 100%;
        padding: 20px;
        padding-top: 70px;
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
</style>

<template>
  <button @click.stop='() => toggleMenu()' :class='{user_card: true, dark}'>
    <span>{{ userData().nickname[0] }}</span>
    <div class='text'>
      <span>{{ userData().nickname }}</span>
      <span>{{ userData().email }}</span>
    </div>
    <ChevronRight />
  </button>
  <aside @click.stop :key='menu' :class='{
    menu: true,
    show: menu === "show",
    hide: menu === "hide"
  }'>
    <div class='head'>
      <IconButton :dark='true' @click='toggleMenu("hide")'>
        <Cross />
      </IconButton>
    </div>
    <span class='letter'>{{ userData().nickname[0] }}</span>
    <span class='nickname'>{{ userData().nickname }}</span>
    <span class='email'>{{ userData().email }}</span>
    <button @click='signOut'>Sign out</button>
  </aside>
</template>

<script setup lang='ts'>
  import ChevronRight from './icons/ChevronRight.vue';
  import IconButton from './IconButton.vue';
  import Cross from './icons/Cross.vue';
</script>

<script lang='ts'>
  export default {
    props: ['dark'],

    data() {
      return {
        menu: 'default'
      }
    },

    mounted() {
      window.addEventListener('click', () => this.toggleMenu('hide'))
    },

    unmounted() {
      window.removeEventListener('click', () => this.toggleMenu('hide'))
    },

    methods: {
      toggleMenu(to?: string) {
        if(to === 'hide' && this.menu === 'default') return;
        this.menu = to ?? this.menu === 'show' ? 'hide' : 'show';
      },

      signOut() {
        localStorage.removeItem('user_data');
        this.$router.push('/signin');
      },

      userData() {
        const storedUserData = localStorage.getItem('user_data');
        return JSON.parse(storedUserData ?? '{}');
      }
    }
  }
</script>