<style scoped>
  .room_card {
    width: 100%;
    padding: 15px 25px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-rows: auto;
    gap: 15px;
    align-items: center;
    text-align: left;
    transition: background-color ease .2s;
  }

  .room_card.selected {
    background-color: var(--primary-color-a20);
    cursor: context-menu;
  }

  .room_card > .letter {
    width: 40px;
    height: 40px;
    background-color: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #FFF;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .room_card > .data {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    color: var(--text-color);
    line-height: 1.1;
    gap: 3px;
  }

  .room_card > .data > span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .room_card > .data > span:first-child {
    font-weight: 500;
    grid-column: 1 / span 2;
    font-size: 16px;
  }

  .room_card > .data > span:last-child {
    font-size: 13px;
    opacity: .9;
  }

  .room_card > span:last-child {
    font-size: 12px;
    opacity: .8;
    color: var(--text-color);
  }

  @media (hover: hover) and (pointer: fine) {
    .room_card:not(.selected):hover {
      background-color: var(--primary-color-a10);
    }
  }
</style>

<template>
  <button :class='{room_card: true, selected}' @click='$emit("select")'>
    <span class='letter'>{{ nickname[0] }}</span>
    <div class='data'>
      <span>{{ nickname }}</span>
      <span>{{ message }}</span>
    </div>
    <span>{{ lastMessageDate }}</span>
  </button>
</template>

<script lang='ts'>
import { formatDate } from '@/utils/date';

  let UPDATE_DATE = true,
    updateDateInterval: any;

  export default {
    props: ['nickname', 'message', 'date', 'selected'],
    emits: ['select'],

    watch: {
      date: function() {
        this.lastMessageDate = this.parseDate();
      }
    },

    data() {
      return {
        lastMessageDate: this.parseDate()
      }
    },

    created() {
      updateDateInterval = setInterval(() => {
        if(!UPDATE_DATE) {
          clearInterval(updateDateInterval);
        }
        else this.lastMessageDate = this.parseDate();
      }, 3000);
    },

    unmounted() {
      UPDATE_DATE = false;
    },

    methods: {
      parseDate() {
        return formatDate(this.date);
      }
    }
  }
</script>