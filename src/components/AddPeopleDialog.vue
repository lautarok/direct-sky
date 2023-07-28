<style scoped>
  .add_people_dialog {
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 75%);
    backdrop-filter: blur(3px);
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: show ease .2s;
  }

  .add_people_dialog > .box {
    width: 400px;
    max-width: calc(100% - 25px);
    background-color: var(--background-color);
    border-radius: 5px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    animation: showBox ease .2s;
  }

  .add_people_dialog > .box > .title {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
    color: var(--text-color);
  }

  .add_people_dialog > .box > .title > span {
    font-size: 14px;
    color: var(--text-color);
    opacity: .8;
  }

  .add_people_dialog > .box > nav {
    width: 100%;
    margin-top: 15px;
  }

  .add_people_dialog.close,
  .add_people_dialog.close > .box {
    animation-direction: reverse;
  }

  .add_people_dialog.close {
    opacity: 0;
  }

  .add_people_dialog.close > .box {
    transform: translateY(50px);
  }

  .error {
    margin-bottom: 0;
    margin-top: 15px;
  }

  @keyframes show {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes showBox {
    0% {
      transform: translateY(50px);
    }

    100% {
      transform: translateY(0);
    }
  }
</style>

<template>
  <div :key='hideAnimated ? 1 : 0' :class='{add_people_dialog: true, close: hideAnimated}' @click='handleClose'>
    <form class='box' @click.stop @submit.prevent='submitMessage'>
      <IconButton @click='handleClose' :absolute='["15px", "15px"]'>
        <Cross />
      </IconButton>
      <div class='title'>
        <h2>Write a message</h2>
        <span>To add a new contact</span>
      </div>
      <TextField
        type='email'
        label='People email'
        placeholder='Ej: lautaro@google.com'
        v-model='toEmail'
      />
      <TextField
        type='text'
        label='Message'
        placeholder='Write here...'
        v-model='message'
      />
      <span class='error' v-if='error'>{{ error }}</span>
      <nav>
        <Button :loading='loading' width='100%' :primary='true' value='Continue' />
      </nav>
    </form>
  </div>
</template>

<script setup lang='ts'>
  import TextField from './TextField.vue';
  import Button from './Button.vue';
  import IconButton from './IconButton.vue';
  import Cross from './icons/Cross.vue';
  import { sendMessage } from '@/utils/api';
</script>

<script lang='ts'>
  export default {
    emits: ['close', 'room'],

    data() {
      return {
        hideAnimated: false,
        loading: false,
        error: '',
        toEmail: '',
        message: ''
      }
    },

    methods: {
      handleClose() {
        if(this.hideAnimated) return;
        this.hideAnimated = true;
        setTimeout(() => this.$emit('close'), 200);
      },

      async submitMessage() {
        if(this.loading) return;
        this.error = '';
        this.loading = true;

        try {
          const result = await sendMessage({
            toEmail: this.toEmail,
            message: this.message
          })

          if(result.status === 401) {
            localStorage.removeItem('user_data');
            this.$router.push('/signin');
            return;
          } else if(result.status === 404) {
            this.error = 'User not found';
            this.loading = false;
            return;
          } else if(result.status !== 201) {
            this.error = result.body.message[0];
            this.loading = false;
            return;
          }

          this.$emit('room', result.body);
          this.handleClose();
        } catch(error) {
          this.error = error as string;
          this.loading = false;
        }
      }
    }
  }
</script>