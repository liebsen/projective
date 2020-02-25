<template>
  <section class="hero">
    <div class="has-background-light">
      <div class="container">
        <div class="column">
          <h6>
            <router-link :to="'/projects/' + data._id">
              <span class="icon">              
                <span class="fa fa-project-diagram"></span>
              </span>
              <span v-html="data.title"></span>
            </router-link>
          </h6>
          <h6>
            <span v-html="data.tasks.title"></span>
          </h6>
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container">
        <div class="content">
          <div class="columns">
            <div class="column">            
              <div class="columns">
                <div v-show="empty" class="column">
                  <div class="notification has-background-white">
                    <p>Todavía no hay cuestiones sobre <span v-html="data.tasks.title"></span></p>
                  </div>
                </div>
              </div>
              <div class="columns is-multiline">
                <div class="column" :class="'is-' + $root.layout.cols" v-for="item in data.tasks.issues">
                  <router-link :to="'/issues/' + item.id">
                    <section class="card task">
                      <div class="card__title">
                        <span v-html="item.title"></span>
                      </div>
                      <div class="card__meta">
                        <div class="card__meta__date">
                          <span>Creado</span> <span class="convert__dates" v-html="item.id"></span>
                        </div>
                      </div>
                    </section>
                  </router-link>
                </div>
              </div>
              <div class="columns" v-if="data.tasks.extra">
                <div class="column">
                  <progress class="progress is-success" :value="data.tasks.extra.progress" max="100"><span v-html="data.tasks.extra.progress"></span>%</progress>
                  <div class="table-container">
                    <table class="table is-fullwidth">
                      <tr>
                        <td class="has-background-light">Descripción</td>
                        <td><span v-html="data.tasks.extra.text"></span></td>
                      </tr>
                      <tr>
                        <td class="has-background-light">Entrega</td>
                        <td><span v-html="data.tasks.extra.due_date"></span></td>
                      </tr>
                      <tr>
                        <td class="has-background-light">Enlace</td>
                        <td><a :href="data.tasks.extra.link" target="_blank"><span v-html="data.tasks.extra.link"></span></a></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <div class="columns" v-else>
                <div class="column">
                  <div class="notification has-background-primary">
                    <span class="icon">
                      <span class="fas fa-bullhorn"></span>
                    </span>
                    <span>Sin detalles</span>
                  </div>
                </div>
              </div>
              <div class="columns" v-if="data.tasks.managers">
                <div class="column">
                  <div class="table-container">
                    <table class="table is-fullwidth">
                      <tr>
                        <td class="has-background-light">Responsable(s)</td>
                        <td>
                          <span v-for="manager in data.tasks.managers" v-html="$root.users[manager.id].name"></span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <div class="columns" v-else>
                <div class="column">
                  <div class="notification has-background-primary">
                    <span class="icon">
                      <span class="fas fa-bullhorn"></span>
                    </span>
                    <span>Sin asignación</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="userbox">
                <router-link v-if="$root.users[user.id]" v-for="(user, index) in data.accounts" :to="'/accounts/' + user.id" class="fadeIn" :key="index">
                  <span class="button is-small is-light is-rounded has-text-success">
                    <span class="tag has-background-success fadeIn"></span>
                    <strong v-html="$root.users[user.id].name"></strong>
                  </span>
                </router-link>
              </div>
              <div class="column chatbox-container is-borderless-radius-down has-background-light">
                <div class="chatbox fadeIn">
                  <div v-for="line in chatLines" class="chatline">
                    <div class="chatbubble" :class="{ 'is-pulled-right has-text-right has-background-light' : line.owned, 'is-pulled-left has-text-left has-background-white' : !line.owned, 'has-background-primary' : line.sender === 'bot' }">
                      <strong v-if="line.sender != 'bot'" v-html="line.sender"></strong>
                      <span v-html="line.text" :class="{ 'has-text-grey' : line.sender === 'bot' }"></span>
                      <span v-if="line.sender != 'bot'" v-html="line.ts" class="is-size-7 has-text-grey"></span>
                    </div>
                  </div>
                </div>
              </div>        
              <div class="">
                <form @submit.prevent="sendChat">
                  <div class="field has-addons">
                    <p class="control is-expanded">
                      <input class="input is-borderless-radius-up is-fullwidth" v-model="chat" type="text" placeholder="Ingresa tu mensaje" />
                    </p>
                    <p class="control">
                      <button type="submit" class="button is-borderless-radius-up is-square is-success">
                        <span class="icon">
                          <span class="fas fa-arrow-up"></span>
                        </span>
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column has-text-centered slideIn">
              <router-link :to="'/issues/' + $route.params.id + '/create'" class="button is-success">
                <span>Cuestionar</span>
              </router-link>
              <router-link :to="'/tasks/' + $route.params.id + '/edit'" class="button is-info">
                <span>Editar</span>
              </router-link>
              <a @click="remove" class="button is-danger">
                <span>Eliminar <!--span v-html="data.tasks.title"></span--></span>
              </a>
            </div>
          </div>
          <!--pre v-html="data"></pre-->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'
import moment from 'moment'
import snackbar from './Snackbar'
import playSound from './playSound'
export default {
  name: 'task',
  mounted: function(){
    this.$root.loading = true
    //this.$root.$on("onlineUsers", this.showOnlineUsers)
    this.$root.$on("chatLine", this.chatLine)
    if(!this.$route.params.id){
      this.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( this.$root.endpoint + '/task/' + this.$route.params.id, {}).then((res) => {
      this.data = res.data
      this.empty = res.data.tasks.issues == undefined
      this.$socket.emit('join', {
        id:this.$route.params.id, 
        code: this.$root.auth.user._id,
        name:this.$root.auth.user.name
      })
      setTimeout(() => {
        this.$root.convertDates()
        this.chatHistory()
        this.$root.loading = false
      },500) 
    }).catch(err => {
      this.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  beforeDestroy () {
    this.$socket.emit('leave', {
      id:this.$route.params.id, 
      code: this.$root.auth.user._id,
      name:this.$root.auth.user.name
    })
  },
  sockets: {
    user_joins: function(user){
      setTimeout(() => {
        this.chatLines.push({
          text: `<span class="fas fa-arrow-right"></span> ${user}`,
          ts: moment().fromNow(true),
          sender: "bot",
          owned: false
        })
        this.scrollToBottom()
      },1000)
    },
    user_leaves: function(user){
      this.chatLines.push({
        text: `<span class="fas fa-arrow-left"></span> ${user}`,
        ts: moment().fromNow(true),
        sender: "bot",
        owned: false
      })
      this.scrollToBottom()
    }
  },
  methods: {
    scrollToBottom: function(){
      setTimeout(() => {
        const box = document.querySelector(".chatbox-container")
        if(box){
          box.scrollTop = box.scrollHeight  
        }
      },50)
    },
    sendChat: function() {
      let t = this
      if(t.chat.trim()==='') t.chat = '👋'
      t.$socket.emit('send', { 
        room: t.$route.params.id,
        sender: t.$root.auth.user._id,
        name: t.$root.auth.user.name,
        line: t.chat
      })
      t.chat = ''
    },
    chatLine: function(line){
      const box = document.querySelector(".chatbox")
      const owned = this.$root.auth.user._id === line.sender
      this.chatLines.push({
        text: line.line,
        ts: moment(line.created).fromNow(true),
        sender: owned ? '' : line.name,
        owned: owned
      })
      if(!owned) {
        playSound('chat.ogg')
      }
      this.scrollToBottom()
    },
    showOnlineUsers: function(){
      let t = this
      if(t.data.accounts.length){
        var accounts = t.data.accounts.filter(account => account.id)
      }
    },
    showChatUsers: function(){
      const box = document.querySelector(".roombox")
      if(box){
      }
    },
    chatHistory: function(data){
      if(this.data.tasks.chat){
        const box = document.querySelector(".chatbox")
        this.data.tasks.chat.forEach( line => {
          const owned = this.$root.auth.user._id === line.sender
          this.chatLines.push({
            text: line.line,
            ts: moment(line.created).fromNow(true),
            sender: owned ? '' : line.name,
            owned: owned
          })
        })
        this.scrollToBottom()
      }
    },
    remove: function(){
      let t = this
      swal({
        title: `Eliminar tarea `,
        text: '¿Querés borrar esta tarea?',
        dangerMode: true,
        buttons: ["No", "Sí"]
      })
      .then(accept => {
        if (accept) {
          t.$root.loading = true
          axios.delete( t.$root.endpoint + '/task/' + t.$route.params.id, {}).then((res) => {
            t.$root.loading = false
            snackbar('success',"Se eliminó objetivo "  )
            t.$router.push('/projects/' + t.data._id)
          }).catch(err => {
            t.$root.loading = false
            if(err){
             snackbar('error',"Error " + err)
            }
          })
        } else {
          console.log('Clicked on cancel')
        }
      })
    }
  },
  data () {
    return {
      data:{ accounts: {}, tasks: { extra: {}, issues: {}}},
      empty:false,
      onlineUsers:[],
      chatLines:[],
      chat:''
    }
  }
}
</script>