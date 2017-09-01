<template>
  <div class="container">

    <div class="flex items-center">
      <div class="flex-auto">
        <h1>Dashboard</h1>
      </div>
      <div class="flex-none">
        <router-link :to="{ name: 'logout' }">Logout</router-link>
      </div>
    </div>

    <form class="margin-top-200 margin-bottom-300"
          v-on:submit.prevent>
      <input type="text"
             name="todo"
             placeholder="Enter your reminder.."
             v-model="todo"
             required>
      <button class="btn secondary-white" v-on:click="submit()">Add</button>
    </form>

    <ul class="list-style-none margin-0 padding-0">
      <li class="flex items-center margin-bottom-100" v-for="todo in todos">
        <input type="checkbox">
        <span class="margin-left-100 margin-right-100">{{ todo }}</span>
        <button class="trash" v-on:click="remove()" v-html="icons.trash"></button>
      </li>
    </ul>

  </div>
</template>

<script>
  import Todos from '../services/todos';

  export default {
    data() {
      return {
        todo: '',
        icons: {
          trash: require('!!svg-inline-loader!../images/trash.svg')
        }
      }
    },
    mounted() {
      const context = this.$root;
      Todos.get(context);
    },
    computed: {
      todos() {
        return this.$store.state.todos
      }
    },
    methods: {
      submit() {
        const context = this.$root;
        if (this.todo.length > 0) {
          Todos.insert(context, this.todo);
        }
        this.todo = '';
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import "../styles/variables.styl"

  input[type=text]
    $color-text = $colors['grey']
    $color-bg = $colors['white']
    display inline-block
    width 500px
    margin 0
    padding .75em
    border-radius 5px
    font-size 18px
    color $color-text
    background $color-bg
    border none

  input[type=checkbox]
    $color-bg = $colors['white']
    display inline-block
    width 20px
    height 20px
    margin 0
    padding 0
    border-radius 5px
    background $color-bg
    border none

  .trash
    $color = $colors['white']
    border none
    background transparent
    width 30px
    height 30px
    padding 0
    margin 0
    vertical-align middle
    color $color
    fill $color


</style>
