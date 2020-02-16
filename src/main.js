import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import axios from 'axios'
import store from './components/Store'
import snackbar from './components/Snackbar';
import VueSlider from 'vue-slider-component'
import VueSocketIO from 'vue-socket.io'
import Autocomplete from 'v-autocomplete'
import playSound from './components/playSound'

import 'vue-slider-component/theme/antd.css'
import 'v-autocomplete/dist/v-autocomplete.css'
require('../assets/css/main.scss')

moment.locale('es')

Vue.prototype.$http = axios

const token = localStorage.getItem('token')
const account = localStorage.getItem('account')
const endpoint = 'https://projectiveapi.herokuapp.com'
//const endpoint = 'http://localhost:3000'

Vue.use(Autocomplete)

document.cookie = 'X-Authorization=' + token + '; path=/'

if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

Vue.use(new VueSocketIO({
  debug: true,
  connection: endpoint,
  options: {query: '&token=' + token}
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
      return this.$store.getters.isLoggedIn;
    }
  },
  created: function() {
    this.loading = false
  },
  sockets: {
    chat_send: function(data){
      const chatbox = document.querySelector(".chatbox")
      if(chatbox){
        const owned = account.id === data.sender_id
        const cls = owned ? 'is-pulled-right has-text-right has-background-info has-text-white' : 'is-pulled-left has-text-left'
        const sender = data.sender === this.$root.player.code ? '' : data.sender
        const sender_color = data.sender === 'chatbot' ? 'primary' : 'info'
        const ts = moment().format('hh:mm a')
        chatbox.innerHTML+= `<div class="box ${cls}"><strong class="has-text-${sender_color}">${sender}</strong> ${data.line} <span class="is-size-7 has-text-light">${ts}</span></div>`
        chatbox.scrollTop = chatbox.scrollHeight
        if(data.sender != this.$root.player.code){
          playSound('pop.mp3')
        }
      }
    },
    chat_users: function (data) {
      this.chat_users = JSON.parse(JSON.stringify(data))
    }
  },
  methods: {
    token : function(){
      return JSON.parse(localStorage.getItem('token')) || {}
    },
    account : function(){
      return JSON.parse(localStorage.getItem('account')) || {}
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        localStorage.removeItem('account')
        this.$router.push("/login");
      });
    },
    snackbar : function(messageType,message,timeout){
      if(timeout===undefined) timeout = 5000
      this.messageType = messageType
      this.message = message
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--is-inactive')
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--success')
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--error')
      document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--default')

      document.querySelector('.ui-snackbar').classList.add('ui-snackbar--' + messageType)
      document.querySelector('.ui-snackbar').classList.add('ui-snackbar--is-active')
      setTimeout(() => {
        document.querySelector('.ui-snackbar').classList.remove('ui-snackbar--is-active')
        document.querySelector('.ui-snackbar').classList.add('ui-snackbar--is-inactive')
      },timeout)
    },
    tosAgree: function(){
      localStorage.setItem("tosagree",true)
      document.querySelector('.tosprompt').classList.remove('fadeIn')
      document.querySelector('.tosprompt').classList.add('fadeOut')      
      setTimeout(() => {
        document.querySelector('.tosprompt').parentNode.removeChild(document.querySelector('.tosprompt'))
      },3000)
    },
    convertDates: function(){
      document.querySelectorAll('.convert-date').forEach(function(el){
        const timestamp = el.innerText.toString().substring(0,8)
        const date = new Date( parseInt( timestamp, 16 ) * 1000 )
        el.innerHTML = moment(date).format(el.getAttribute('date-format')||null)
      })
    }
  },
  data : {
    ver: '1.0.1',
    port:0,
    endpoint:endpoint,
    account:account,
    token:token,
    loading:true,
    processing:false,
    verification:false,
    message:'',
    typeMessage:''
  },
  render: h => h(App)
})