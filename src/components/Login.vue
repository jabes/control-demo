<template>
  <div class="container height-100">
    <div class="flex justify-center items-center height-100">
      <div class="flex-none">
        <h1>Login</h1>
        <form v-on:submit.prevent>
          <div class="margin-bottom-200">
            <input name="username"
                   placeholder="Username"
                   v-model="credentials.username">
            <input type="password"
                   name="password"
                   placeholder="Password"
                   v-model="credentials.password">
          </div>
          <div class="vertical-middle">
            <button class="btn primary white margin-right-100" v-on:click="submit()">Login</button>
            <router-link :to="{ name: 'sign-up' }">Sign-up</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import Auth from '../services/auth';

  export default {
    data() {
      return {
        credentials: {
          username: '',
          password: '',
        }
      }
    },
    methods: {
      submit() {
        Auth.login(this.credentials, '/');
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../styles/variables.styl"

  .container
    color $color-white

  input
    display block
    width 300px
    background $color-white
    border none
    padding 20px
    margin 20px 0
    border-radius 5px
    color $color-grey
</style>
