<style scoped>
  main {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    grid-template-rows: 100%;
  }

  main > section {
    background-image: url('../assets/bg-1.svg');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    padding: 15%;
    gap: 50px;
  }

  main > section > h1 {
    color: #FFF;
  }

  main > section > .goals {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #FFF;
  }

  main > section > .goals > h4:first-child {
    margin-bottom: 10px;
  }

  main > section > .goals > h4:last-child {
    margin-top: 10px;
  }

  main > section > .goals > .goal {
    width: fit-content;
    background-color: var(--accent-color-a30);
    padding: 5px 10px;
    font-size: 20px;
    line-height: 1;
  }

  main > section > a {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 14px;
    color: #FFF;
    letter-spacing: 1px;
    padding: 10px 20px;
    border-radius: 3px;
    background-color: rgb(255 255 255 / 10%);
    transition: background-color ease .2s;
  }

  main > section > a > svg {
    width: 16px;
    height: 16px;
  }

  main > .content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  main > .content > form {
    position: absolute;
    width: 100%;
    height: 0;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    justify-content: center;
    justify-items: flex-start;
    flex-direction: column;
    opacity: 0;
  }

  main > .content > form.default,
  main > .content > form.show {
    height: 100%;
    opacity: 1;
    padding: 50px calc(50% - 200px);
    gap: 10px;
  }

  main > .content > form.show {
    animation: show ease .6s;
  }

  main > .content > form.hide {
    animation: hide ease .3s;
  }

  main > .content > form > h4 {
    opacity: .8;
    color: var(--text-color);
  }

  main > .content > form > .fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 35px;
    margin-bottom: 20px;
  }

  main > .content > form > nav {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
  }

  @media (hover: hover) and (pointer: fine) {
    main > section > a:hover {
      background-color: var(--accent-color);
    }
  }

  @keyframes hide {
    0% {
      opacity: 1;
      transform: translateX(0);
      height: 100%;
      padding: 50px calc(50% - 200px);
      gap: 10px;
    }
    
    100% {
      transform: translateX(40px);
      opacity: 0;
      height: 100%;
      padding: 50px calc(50% - 200px);
      gap: 10px;
    }
  }

  @keyframes show {
    0% {
      transform: translateX(-40px);
      opacity: 0;
    }

    50% {
      transform: translateX(-40px);
      opacity: 0;
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media only screen and (max-width: 1000px) {
    main {
      display: inline;
    }

    main > section {
      display: none;
    }
  }

  @media only screen and (max-width: 450px) {
    main > .content > form.default,
    main > .content > form.show {
      height: 100%;
      opacity: 1;
      padding: 50px 25px;
      gap: 10px;
    }

    @keyframes hide {
      0% {
        opacity: 1;
        transform: translateX(0);
        height: 100%;
        padding: 50px 25px;
        gap: 10px;
      }
      
      100% {
        transform: translateX(40px);
        opacity: 0;
        height: 100%;
        padding: 50px 25px;
        gap: 10px;
      }
    }
  }
</style>

<template>
  <main>
    <div class='content'>
      <form novalidate @submit.prevent='submitLogin' :class='{
        show: show === "signin",
        default: show === "default",
        hide: show === "register"
      }'>
        <Logo />
        <h4>Sign in</h4>
        <div class='fields'>
          <TextField
            label='Email'
            type='email'
            placeholder='Ej: lautaro@google.com'
            :autofocus='true'
            v-model='email'
          />
          <TextField
            label='Password'
            type='password'
            placeholder='Your private password'
            v-model='password'
          />
        </div>
        <span class='error' v-if='error'>{{ error }}</span>
        <nav>
          <Button
            :disabled='loading'
            value='Create an account'
            @click='setForm("register")'
            type='button'
          />
          <Button
            value='Sign in now'
            :primary='true'
            :loading='loading'
            type='submit'
          />
        </nav>
      </form>
      <form novalidate @submit.prevent='submitRegister' :class='{
        show: show === "register",
        hide: show === "signin"
      }'>
        <Logo />
        <h4>Create an account</h4>
        <div class='fields'>
          <TextField
            label='Nickname'
            type='text'
            placeholder='Ej: lautarok_2004'
            :autofocus='true'
            v-model='nickname'
          />
          <TextField
            label='Email'
            type='email'
            placeholder='Ej: lautaro@google.com'
            :autofocus='true'
            v-model='email'
          />
          <TextField
            label='Password'
            type='password'
            placeholder='Your private password'
            v-model='password'
          />
        </div>
        <span class='error' v-if='error'>{{ error }}</span>
        <nav>
          <Button
            :disabled='loading'
            value='Sign in'
            @click='setForm("signin")'
            type='button'
          />
          <Button
            :loading='loading'
            value='Register now'
            :primary='true'
            type='submit'
          />
        </nav>
      </form>
    </div>
    <section>
      <h1>Hello.</h1>
      <div class='goals'>
        <h4>Next goals to meet</h4>
        <h4 class='goal'>Use Pinia for state management</h4>
        <h4 class='goal'>Allow line breaks when typing a message</h4>
        <h4>Remember that this project is open source and you can help contribute</h4>
      </div>
      <a href='https://github.com/lautarok/direct-sky' target='_blank'>
        <GitHub />
        <span>View in GitHub</span>
      </a>
    </section>
  </main>
</template>

<script lang='ts' setup>
  import { login, register } from '@/utils/api';
  import Logo from '../components/Logo.vue';
  import GitHub from '../components/icons/GitHub.vue';
  import TextField from '../components/TextField.vue';
  import Button from '../components/Button.vue';
</script>

<script lang='ts'>

  export default {
    beforeCreate() {
      if(localStorage.getItem('user_data')) {
        this.$router.replace('/home');
      }
    },

    data() {
      return {
        email: '',
        password: '',
        nickname: '',
        loading: false,
        error: '',
        show: 'default'
      }
    },

    methods: {
      async setForm(to: string) {
        if(this.loading) return;
        this.password = '';
        setTimeout(() => {
          this.show = to
        }, this.error ? 300 : 0);
        this.error = '';
      },

      async submitLogin() {
        if(this.loading) return;
        this.error = '';
        this.loading = true;

        try {
          const result = await login({
            email: this.email,
            password: this.password
          });

          if(result.status !== 201) {
            this.loading = false;
            this.error = result.body.message[0];
            return;
          }

          localStorage.setItem('user_data', JSON.stringify({
            ...result.body
          }));

          this.$router.push('/home');
        } catch(error) {
          this.error = error as string;
          this.loading = false;
        }
      },
      
      async submitRegister() {
        if(this.loading) return;
        this.error = '';
        this.loading = true;

        try {
          const result = await register({
            nickname: this.nickname,
            email: this.email,
            password: this.password
          });

          if(result.status !== 201) {
            this.loading = false;
            this.error = result.body.message[0];
            return;
          }

          localStorage.setItem('user_data', JSON.stringify({
            ...result.body
          }));

          this.$router.push('/home');
        } catch(error) {
          this.error = error as string;
          this.loading = false;
        }
      }
    }
  }
</script>