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
  options: {query: '&token=' + (auth?auth.user._id:'')}
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
  sockets: {
    users: function (data) {
      this.users = data
      this.$emit("onlineUsers", data)
    },
    chat_line: function(data){
      console.log("chatline: " + data)
      this.$emit("chatLine", data)
    }
  },
  methods: {
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
    endpoint:process.env.ENDPOINT,
    loading:false,
    processing:false,
    users: {}
  },
  render: h => h(App)
})