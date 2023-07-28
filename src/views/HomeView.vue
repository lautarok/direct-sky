<style scoped>
  main {
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-template-rows: 100%;
    position: relative;
    width: 100%;
    height: 100%;
  }

  main > .content {
    position: relative;
    width: 100%;
    height: 100%;
    transition: filter ease .2s;
  }

  main > .content > .first_message {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 50px calc(50% - 200px);
    gap: 30px;
  }

  main > .content > .first_message > h1 {
    color: var(--text-color);
    font-weight: 600;
  }

  main > .content > .first_message > form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  main > .content > .first_message > form > nav {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  main > .content > .layout > .rooms_menu {
    width: 100%;
    background-color: var(--primary-color-a20);
    padding: 25px 0;
    display: flex;
    flex-direction: column;
  }

  main > .content > .layout > .rooms_menu > button:first-child {
    margin-left: 14px;
    margin-bottom: 10px;
    display: none;
  }

  main > .content > .layout > .rooms_menu > .h_padding {
    padding: 0 25px;
    margin-bottom: 25px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  main > .content > .layout > .rooms_menu > .h_padding > span {
    color: var(--text-color);
    font-size: 20px;
    font-weight: 500;
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 100%;
  }

  main > .content > .layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 100%;
    width: 100%;
    height: 100%;
  }

  @media (prefers-color-scheme: dark) {
    main > .content > .layout > .rooms_menu {
      background-color: #151515;
    }
  }

  @media screen and (max-width: 1100px) {
    main {
      grid-template-columns: 1fr;
    }

    main > .content.blur {
      filter: blur(3px);
    }

    main > .content > .layout {
      grid-template-columns: 330px 1fr;
    }

    main > .content > .layout > .rooms_menu > button:first-child {
      display: flex;
    }
  }

  @media screen and (max-width: 900px) {
    main > .content > .layout {
      grid-template-columns: 1fr;
    }

    main > .content > .first_message {
      padding: 25px;
    }
  }
</style>

<template>
  <main @click='openSideMenu = false'>
    <SideMenu :open='openSideMenu' @close='openSideMenu = false' />
    <div :class='{content: true, blur: openSideMenu}'>
      <h1 v-if='criticalError'>CRITICAL ERROR</h1>
      <Loader v-else-if='loadingRooms' />
      <div v-else-if='rooms.length <= 0' class='first_message'>
        <h1>Send your first message</h1>
        <form @submit.prevent='submitMessage'>
          <TextField
            type='email'
            label='To email'
            placeholder='Ej: example@directsky.com'
            v-model='toEmail'
          />
          <TextField
            type='text'
            label='Your message'
            placeholder='Write here...'
            v-model='message'
          />
          <span class='error' v-if='messageError'>{{ messageError }}</span>
          <nav>
            <Button
              :loading='messageLoading'
              :primary='true'
              type='submit'
              value='Continue'
            />
          </nav>
        </form>
      </div>
      <div class='layout' v-else>
        <div class='rooms_menu'>
          <IconButton @click.stop='openSideMenu = true'>
            <LeftMenu />
          </IconButton>
          <div class='h_padding'>
            <span>Contacts</span>
            <Button
              width='100%'
              :primary='true'
              value='Add people'
              @click='toggleAddPeopleDialog'
            />
          </div>
          <RoomCard
            v-for='room in rooms'
            @select='selectedRoom = room'
            :selected='selectedRoom?.id === room.id'
            :nickname='room.withUser.nickname'
            :message='room.lastMessage.message'
            :date='room.lastMessage.date'
          />
        </div>
        <ChatBox
          :room='selectedRoom'
          :addedMessages='messages'
          @close='selectedRoom = null'
          @room='setRoom'
        />
      </div>
    </div>
    <AddPeopleDialog
      @room='room => setRoom(room, true)'
      @close='toggleAddPeopleDialog'
      v-if='addPeopleDialog'
    />
  </main>
</template>

<script lang='ts' setup>
  import SideMenu from '../components/SideMenu.vue';
  import Loader from '../components/Loader.vue';
  import TextField from '../components/TextField.vue';
  import Button from '../components/Button.vue';
  import RoomCard from '../components/RoomCard.vue';
  import { rooms as roomsApi, sendMessage } from '../utils/api';
  import AddPeopleDialog from '@/components/AddPeopleDialog.vue';
  import ChatBox from '@/components/ChatBox.vue';
  import IconButton from '@/components/IconButton.vue';
  import LeftMenu from '@/components/icons/LeftMenu.vue';
</script>

<script lang='ts'>
  export default {
    data() {
      return {
        rooms: [] as any[],
        loadingRooms: true,
        loadingWs: false,
        criticalError: false,
        messageError: '',
        messageLoading: false,
        toEmail: '',
        message: '',
        addPeopleDialog: false,
        selectedRoom: null as any,
        messages: [] as any[],
        openSideMenu: false
      }
    },

    beforeCreate() {
      if(!localStorage.getItem('user_data')) {
        this.$router.replace('/signin');
      }
    },

    async mounted() {
      await this.loadWs();
      await this.loadRooms();
    },

    methods: {
      async loadWs() {
        const ws = new WebSocket(
          !import.meta.env.PROD ? 'ws://localhost:3000/'
            : 'wss://direct-sky-backend.onrender.com'
        );

        const storedUserData = localStorage.getItem('user_data'),
          userData = JSON.parse(storedUserData || '{}');

        ws.addEventListener('open', () => {
          ws.send(JSON.stringify({
            event: 'receiveMessages',
            data: {
              token: userData.token,
              sessionUUID: sessionStorage.getItem('session_uuid')
            }
          }));
        });

        ws.addEventListener('message', message => {
          try {
            const response = JSON.parse(message.data);

            if(response.error) {
              this.criticalError = true;
            } else if(response.id) {
              this.setRoom(response);
              if(this.selectedRoom && this.selectedRoom.id === response.id) {
                this.messages.push(response.lastMessage);
              }
            }
          } catch {
            this.criticalError = true;
          }
        });

        ws.addEventListener('close', () => this.criticalError = true);
        ws.addEventListener('error', () => this.criticalError = true);
      },

      async loadRooms() {
        const result = await roomsApi();

        if(result.status === 401) {
          localStorage.removeItem('user_data');
          this.$router.push('/signin');
        } else if(result.status !== 200) {
          this.criticalError = true;
        }
        
        this.loadingRooms = false;
        this.rooms = [...result.body];
      },

      async submitMessage() {
        if(this.messageLoading) return;
        this.messageError = '';
        this.messageLoading = true;

        try {
          const result = await sendMessage({
            toEmail: this.toEmail,
            message: this.message
          })

          if(result.status === 401) {
            localStorage.removeItem('user_data');
            this.$router.push('/signin');
            return;
          } else if(result.status !== 201) {
            this.messageError = result.body.message[0];
            this.messageLoading = false;
            return;
          }

          this.rooms = [result.body];
        } catch(error) {
          this.messageError = error as string;
          this.messageLoading = false;
        }
      },

      toggleAddPeopleDialog() {
        this.addPeopleDialog = !this.addPeopleDialog;
      },

      setRoom(room: any, autoSelect?: boolean) {
        const matchRoomIndex = this.rooms.map(room => room.id).indexOf(room.id);

        if(matchRoomIndex >= 0) {
          this.rooms[matchRoomIndex] = {
            ...this.rooms[matchRoomIndex],
            lastMessage: room.lastMessage
          };
        } else {
          this.rooms.unshift(room);
        }

        if(autoSelect) this.selectedRoom = room;

        this.rooms.sort((a, b) => (
          new Date(b.lastMessage.date).getTime()
            - new Date(a.lastMessage.date).getTime()
        ));
      }
    }
  }
</script>