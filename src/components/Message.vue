<style scoped>
  .row {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    gap: 15px;
    padding-right: 25%;
  }

  .row.from_me {
    grid-template-columns: 1fr auto;
    padding-right: 0;
    padding-left: 25%;
  }

  .row > .letter {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: var(--primary-color-a20);
    color: var(--primary-color);
    font-weight: 500;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 6px;
    text-transform: uppercase;
  }

  .row.from_me > .letter {
    grid-column: 2;
    color: var(--accent-color);
    background-color: var(--accent-color-a20);
  }

  .row > .message {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .row.from_me > .message {
    grid-column: 1;
    grid-row: 1;
    align-items: flex-end;
  }

  .row > .message > .box {
    width: fit-content;
    background-color: var(--primary-color-a20);
    padding: 15px;
    border-radius: 3px;
    color: var(--text-color);
  }

  .row.from_me > .message > .box {
    background-color: var(--accent-color-a20);
  }

  .row > .message > .hour {
    font-size: 13px;
    color: var(--text-color);
    opacity: .9;
  }
</style>

<template>
  <div :class='{row: true, from_me: data.from.email === myEmail}'>
    <span class='letter'>{{ data.from.nickname[0] }}</span>
    <div class='message'>
      <div class='box' v-for='message in data.messages'>
        <span>{{ message }}</span>
      </div>
      <span class='hour'>{{ parsedDate }}</span>
    </div>
  </div>
</template>

<script lang='ts'>
import { formatDate } from '@/utils/date';

  let UPDATE_DATE = true,
    updateDateInterval: number;

  export default {
    props: ['data'],

    data() {
      return {
        parsedDate: ''
      }
    },

    mounted() {
      updateDateInterval = setInterval(() => {
        if(!UPDATE_DATE) clearInterval(updateDateInterval);
        else this.parsedDate = formatDate(this.data.date);
      });
    },

    computed: {
      myEmail() {
        const storedUserData = localStorage.getItem('user_data');
        if(!storedUserData) return;

        const userData = JSON.parse(storedUserData);

        return userData.email;
      }
    }
  }
</script>