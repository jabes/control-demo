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
             placeholder="Enter your reminder.."
             v-model="todo.message"
             required>
      <button class="btn secondary-white" v-on:click="add(todo.message)">Add</button>
    </form>

    <ul class="list-style-none margin-0 padding-0">
      <li class="flex items-center margin-bottom-100"
          v-for="todo in todos"
          v-bind:class="{ 'opacity-50': todo.completed }">
        <input type="checkbox"
               v-bind:checked="todo.completed"
               v-on:change="toggle(todo.id, todo.completed)">
        <span class="font-size-18 margin-left-100 margin-right-100"
              v-bind:class="{ 'text-decoration-line-through': todo.completed }">{{ todo.message }}</span>
        <button class="trash" v-on:click="remove(todo.id)" v-html="icons.trash"></button>
      </li>
    </ul>

  </div>
</template>

<script>
  import Todos from '../services/todos';

  export default {
    data() {
      return {
        todo: {
          message: '',
        },
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
      add(message) {
        const context = this.$root;
        if (message.length > 0) {
          Todos.insert(context, message);
        }
        this.todo.message = '';
      },
      remove(id) {
        const context = this.$root;
        Todos.remove(context, id);
      },
      toggle(id, completed) {
        const context = this.$root;
        Todos.update(context, id, {
          completed: !completed
        });
      },
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
    width 30px
    height 30px
    margin 0
    padding 0
    border-radius 5px
    background $color-bg
    border none
    cursor pointer

  .trash
    $color-off = $colors['white']
    $color-on = $colors['red']
    cursor pointer
    border none
    background transparent
    width 20px
    height 20px
    padding 0
    margin 0
    color $color-off
    &:hover
      color $color-on


</style>
