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
  mounted: function() {
    setTimeout(() => {
      this.loadProjects()
      this.loadNotifications()
    },500)
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
    notification: function(data){
      console.log("1")
      console.log(data)
      if(this.projects.includes(data.id) && this.$route.fullPath.indexOf('/tasks/' + data.room) == -1 && data.sender != this.auth.user._id){
        console.log("2")
        this.ncount++
      }
    },
    chat_line: function(data){
      this.$emit("chatLine", data)
    }
  },
  methods: {
    loadProjects: function(){
      axios.get( this.endpoint + '/projects_ids', {}).then((res) => {
        console.log(res.data)
        this.projects = res.data
      }).catch(err => {
        if(err){
         snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
    },
    loadNotifications: function(){
      axios.get( this.endpoint + '/account/notifications/count', {}).then((res) => {
        console.log(res)
        this.ncount = res.data.count
      }).catch(err => {
        if(err){
         snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
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
      document.querySelectorAll('.fromnow__dates').forEach(function(el){
        const date = el.innerText.toString()
        el.innerHTML = moment(date).fromNow(true)
        el.classList.add('fadeIn')
      })
    }
  },
  data : {
    ver: '1.0.1',
    endpoint:process.env.ENDPOINT,
    loading:false,
    processing:false,
    projects:[],
    ncount: 0,
    users: {}
  },
  render: h => h(App)
})