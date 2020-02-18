import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import axios from 'axios'
import store from './components/Store'
import snackbar from './components/Snackbar'
import VueSlider from 'vue-slider-component'
import VueSocketIO from 'vue-socket.io'
import Autocomplete from 'v-autocomplete'
import playSound from './components/playSound'
import 'vue-slider-component/theme/antd.css'
import 'v-autocomplete/dist/v-autocomplete.css'
require('../assets/css/main.scss')

const auth = JSON.parse(localStorage.getItem('auth'))

moment.locale('es')

if (auth) {
  axios.defaults.headers.common['Authorization'] = auth.token
}

Vue.prototype.$http = axios
Vue.use(Autocomplete)
Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV=='development',
  connection: process.env.ENDPOINT,
  options: {query: '&token=' + (auth?auth.token:'')}
}))

new Vue({
  el: '#app',
  router,
  store,
  watch: {
    '$route' (to, from) {
      this.processing = false
    }
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn
    },
    auth: function() {  
      return this.$store.state.auth
    }
  },
  created: function() {
    this.getProjectsUsers()
  },
  sockets: {
    users: function (data) {
      this.onlineUsers = JSON.parse(JSON.stringify(data))
      //this.onlineUsers()
    },
    chat_line: function(data){
      this.chatLine(data)
    },
    chat_users: function (data) {
      this.chatUsers = JSON.parse(JSON.stringify(data))
      this.showChatUsers()
    }
  },
  methods: {
    getProjectsUsers: function(){
      let t = this
      axios.get( t.$root.endpoint + '/users', {}).then((res) => {
        res.data.forEach(item => {
          t.users[item._id] = {
            name: item.name,
            email: item.email
          }
        })
        t.loading = false
      }).catch(err => {
        t.loading = false
        if(err){
         snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        localStorage.removeItem('account')
        this.$router.push("/login");
      });
    },
    tosAgree: function(){
      localStorage.setItem("tosagree",true)
      document.querySelector('.tosprompt').classList.remove('fadeIn')
      document.querySelector('.tosprompt').classList.add('fadeOut')      
      setTimeout(() => {
        document.querySelector('.tosprompt').parentNode.removeChild(document.querySelector('.tosprompt'))
      },3000)
    },
    chatLine: function(data, sound){
      if(sound==undefined) sound = true
      const box = document.querySelector(".chatbox")
      if(box){
        const owned = this.auth.user._id === data.sender
        const cls = owned ? 'is-pulled-right has-text-right has-background-primary has-text-white' : 'is-pulled-left has-text-left'
        const sender = data.sender === this.auth.user._id ? '' : data.name
        const sender_color = data.sender === 'chatbot' ? 'primary' : 'info'
        const ts = moment(data.created).fromNow(true)
        box.innerHTML+= `<div class="line ${cls}"><strong class="has-text-${sender_color}">${sender}</strong> ${data.line} <span class="is-size-7 has-text-grey">${ts}</span></div>`
        box.scrollTop = box.scrollHeight
        if(sound && data.sender != this.auth.user._id){
          playSound('chat.ogg')
        }
      }
    },
    showOnlineUsers: function(data){
      const box = document.querySelector(".userbox")
      if(box && data){
        data = data.filter(item => item.id)
        data.forEach(item => {
          const name = this.$root.users[item.id].name
          const online = this.$root.onlineUsers.includes(item.id)
          const color = online ? 'success' : 'light'
          box.innerHTML+= `<div class="tag is-${color}"><span>${name}</span></div>`  
        })
      }
    },
    showChatUsers: function(){
      const box = document.querySelector(".roombox")
      if(box){
      }
    },
    chatHistory: function(data){
      if(data){
        data.forEach( line => this.chatLine(line, false))
      }
    },
    convertDates: function(){
      document.querySelectorAll('.convert__dates').forEach(function(el){
        const timestamp = el.innerText.toString().substring(0,8)
        const date = new Date( parseInt( timestamp, 16 ) * 1000 )
        el.innerHTML = moment(date).format(el.getAttribute('date-format')||'LLLL')
        el.classList.add('fadeIn')
      })
    }
  },
  data : {
    ver: '1.0.1',
    endpoint:process.env.ENDPOINT,
    loading:true,
    processing:false,
    chatUsers: {},
    onlineUsers: {},
    users:{}
  },
  render: h => h(App)
})