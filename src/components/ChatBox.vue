<style scoped>
  .chat_box {
    width: 100%;
    height: 100%;
  }

  .chat_box > .no_room {
    width: 100%;
    height: 100%;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: var(--primary-color);
    flex-direction: column;
    gap: 20px;
  }
  .chat_box > .no_room > h1 {
    opacity: .5;
  }

  .chat_box > .layout {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    padding: 30px;
  }

  .chat_box > .layout > .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: solid 1px var(--primary-color-a20);
  }

  .chat_box > .layout > .head > .user {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .chat_box > .layout > .head > .user > button:first-child {
    display: none;
  }

  .chat_box > .layout > .head > .user > .letter {
    width: 40px;
    height: 40px;
    font-size: 16px;
    color: #FFF;
    background-color: var(--primary-color);
    border-radius: 50%;
    text-transform: uppercase;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chat_box > .layout > .head > .user > .text {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 3px;
    line-height: 1;
    color: var(--text-color);
  }

  .chat_box > .layout > .head > .user > .text > span {
    font-size: 16px;
    font-weight: 500;
  }

  .chat_box > .layout > .head > .user > .text > span:last-child {
    font-size: 14px;
    font-weight: 400;
  }

  .chat_box > .layout > .messages {
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column-reverse;
    padding: 40px 0;
    padding-right: 10px;
    gap: 20px;
    position: relative;
  }

  .chat_box > .layout > form {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
    align-items: center;
    gap: 15px;
    padding-top: 15px;
    border-top: solid 1px var(--primary-color-a20);
  }

  .chat_box > .layout > form > .message_field {
    width: 100%;
    min-height: 50px;
    max-height: 150px;
    font-size: 14px;
    color: var(--text-color);
    background-color: var(--primary-color-a20);
    border-radius: 5px;
    line-height: 17px;
    padding: 16.5px;
    overflow-x: hidden;
    overflow-y: auto;
    cursor: text;
  }

  .chat_box > .layout > form > .message_field > span {
    background-color: transparent;
  }

  .chat_box > .layout > form > .message_field:empty::before {
    content: 'Write here...';
    font-size: 14px;
    color: var(--text-color);
    opacity: .8;
  }

  @media only screen and (max-width: 900px) {
    .chat_box {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      background-color: var(--background-color);
    }

    .chat_box.show {
      display: block;
    }

    .chat_box > .layout > .head > .user {
      gap: 10px;
    }

    .chat_box > .layout > .head > .user > button:first-child {
      display: flex;
    }
  }

  @media (prefers-color-scheme: dark) {
    .chat_box > .layout > form > .message_field {
      background-color: rgb(255 255 255 / 10%);
    }
  }

  @media only screen and (max-width: 700px) {
    .chat_box > .layout {
      padding: 15px;
    }
  }

  @media only screen and (min-width: 1900px) {
    .chat_box > .layout {
      padding: 30px calc(50% - 700px);
    }
  }
</style>

<template>
  <div :class='{chat_box: true, show: room}'>
    <div class='no_room' v-if='!room'>
      <Logo />
      <h1>Select people to chat</h1>
    </div>
    <div class='layout' v-else>
      <div class='head'>
        <div class='user'>
          <IconButton @click='$emit("close")'>
            <Cross />
          </IconButton>
          <span class='letter'>{{ room.withUser.nickname[0] }}</span>
          <div class='text'>
            <span>{{ room.withUser.nickname }}</span>
            <span>{{ room.withUser.email }}</span>
          </div>
        </div>
      </div>
      <div class='messages' ref='messagesContainer'>
        <Loader v-if='loadingMessages' />
        <Message
          v-else
          v-for='message in parsedMessages'
          :data='message'
        />
      </div>
      <form ref='messageForm' @submit.prevent='submitMessage'>
        <div
          ref='messageField'
          class='message_field'
          contentEditable='plaintext-only'
          @keypress.enter.prevent='submitMessage'
          @keypress.enter.shift=''
        ></div>
        <Button
          :loading='loading'
          :primary='true'
          value='Send'
          height='50px'
          padding='0 20px'
        />
      </form>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import Logo from './Logo.vue';
  import Button from './Button.vue';
  import Message from './Message.vue';
  import Loader from './Loader.vue';
  import { sendMessage, roomMessages } from '@/utils/api';
  import IconButton from './IconButton.vue';
  import Cross from './icons/Cross.vue';
</script>

<script lang='ts'>
  export default {
    props: ['room', 'addedMessages'],
    emits: ['close', 'room'],

    data() {
      return {
        loading: false,
        loadingMessages: true,
        messages: [] as any[]
      }
    },

    watch: {
      room: async function(value) {
        if(!value) {
          this.loading = false;
          return;
        }
        await this.fetchMessages();
        this.scrollToBottom();
      }
    },

    computed: {
      parsedMessages() {
        let data = [] as any[],
          prevDate = 0,
          prevEmail = '';

        [...this.messages, ...this.addedMessages].sort((a, b) => (
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )).forEach(message => {
          const time = new Date(message.date).getTime();

          if(time - prevDate < 180000 && prevEmail === message.from.email) {
            data[data.length - 1].messages.push(message.message);
            data[data.length - 1].date = message.date;
          } else {
            data.push({
              ...message,
              messages: [message.message]
            });
          }

          prevDate = time;
          prevEmail = message.from.email;
        });

        return data.sort((a, b) => (
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
    },

    methods: {
      scrollToBottom() {
        const messagesContainer = this.$refs.messagesContainer as HTMLDivElement | undefined;
        if(!messagesContainer) return;
        const lastChild = messagesContainer.querySelector('div:last-child');
        if(!lastChild) return;
        setTimeout(() => {
          messagesContainer.scrollTo({
            top: lastChild.clientTop + 300,
            behavior: 'smooth'
          });
        }, 1);
      },

      async fetchMessages() {
        const result = await roomMessages(this.room.id);

        if(result.status === 401) {
          localStorage.removeItem('user_data');
          this.$router.push('/signin');
        } else if(result.status !== 200) {
          return;
        }
        
        this.messages = result.body;
        this.loadingMessages = false;

        this.$emit('room', {
          ...this.room,
          lastMessage: this.messages[0]
        });
      },

      async submitMessage() {
        const message = (this.$refs.messageField as HTMLDivElement).innerText;

        if(this.loading || this.loadingMessages || !message.trim()) return;
        this.loading = true;

        const result = await sendMessage({
          toEmail: this.room.withUser.email,
          message
        })

        if(result.status === 401) {
          localStorage.removeItem('user_data');
          this.$router.push('/signin');
          return;
        } else if(result.status !== 201) {
          this.loading = false;
          return;
        }

        const storedUserData = localStorage.getItem('user_data');

        const userData = JSON.parse(storedUserData || '{}');

        const messageData = {
          date: new Date().toISOString(),
          from: {
            email: userData.email,
            nickname: userData.nickname
          },
          message
        }

        this.messages.push(messageData);

        this.$emit('room', {
          ...this.room,
          lastMessage: messageData
        });

        (this.$refs.messageField as HTMLDivElement).innerText = '';
        this.loading = false;

        this.scrollToBottom();
      }
    }
  }
</script>