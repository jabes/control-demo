<template>
  <div class="container height-100">
    <div class="flex justify-center items-center height-100">
      <div class="flex-none">
        <h1>Sign-up</h1>
        <form v-on:submit.prevent>
          <div class="margin-bottom-200">
            <input name="username"
                   placeholder="Username"
                   v-model="credentials.username">
            <input type="password"
                   name="password"
                   placeholder="Password"
                   v-model="credentials.password">
            <input type="password"
                   name="password_confirm"
                   placeholder="Confirm password"
                   v-model="credentials.password_confirm">
          </div>
          <div class="vertical-middle">
            <button class="btn primary white margin-right-100" v-on:click="submit()">Sign-up</button>
            <router-link :to="{ name: 'login' }">Login</router-link>
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
          password_confirm: '',
        }
      }
    },
    methods: {
      submit() {
        Auth.signup(this.credentials, '/');
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
