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

const token = localStorage.getItem('token')
const account = localStorage.getItem('account')

moment.locale('es')

if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

Vue.prototype.$http = axios
Vue.use(Autocomplete)
Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV=='development',
  connection: process.env.ENDPOINT,
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
    chat_line: function(data){
      const chatbox = document.querySelector(".chatbox")
      if(chatbox){
        const owned = this.$root.account._id === data.sender
        const cls = owned ? 'is-pulled-right has-text-right has-background-info has-text-white' : 'is-pulled-left has-text-left'
        const sender = data.sender === this.$root.account._id ? '' : data.name
        const sender_color = data.sender === 'chatbot' ? 'primary' : 'info'
        const ts = moment().format('hh:mm a')
        chatbox.innerHTML+= `<div class="line ${cls}"><strong class="has-text-${sender_color}">${sender}</strong> ${data.line} <span class="is-size-7 has-text-grey">${ts}</span></div>`
        chatbox.scrollTop = chatbox.scrollHeight
        if(data.sender != this.$root.account._id){
          playSound('chat.ogg')
        }
      }
    },
    chat_users: function (data) {
      this.chat_users = JSON.parse(JSON.stringify(data))
    }
  },
  methods: {
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
    port:0,
    endpoint:process.env.ENDPOINT,
    account:JSON.parse(account),
    token:token,
    loading:true,
    processing:false,
    verification:false
  },
  render: h => h(App)
})