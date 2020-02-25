import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import axios from 'axios'
import store from './components/Store'
import snackbar from './components/Snackbar'
import playSound from './components/playSound'
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
    let layout = JSON.parse(localStorage.getItem('layout'))||null
    if (layout) {
      this.layout = layout
    } else {
      localStorage.setItem('layout', JSON.strngify(this.layout))
    }

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
      if(this.projects.includes(data.id) && this.$route.fullPath.indexOf('/tasks/' + data.room) == -1 && data.sender != this.auth.user._id){
        this.ncount++
        document.title = '(' + this.ncount + ') Projective'
        playSound('pop.mp3')
      }
    },
    chat_line: function(data){
      this.$emit("chatLine", data)
    }
  },
  methods: {
    setCols: function () {
      let columns = document.querySelector('.is-multiline')
      let layout = JSON.parse(localStorage.getItem('layout'))||this.layout 
      let sizes = [12,6,4,3]
      let cols = layout.cols
      let cols_ = sizes.map((a,i) => a === cols ? (sizes[i+1] ? sizes[i+1] : sizes[0]) : false )
      cols_ = cols_.filter(e => e)
      let _cols = cols_[0]

      if (columns) {
        document.querySelectorAll('.is-multiline > .column').forEach(item => {
          item.classList.remove('is-12')
          item.classList.remove('is-3')
          item.classList.remove('is-4')
          item.classList.remove('is-6')
          item.classList.add('is-' + _cols)
        })
        this.layout.cols = _cols
        localStorage.setItem('layout', JSON.stringify(this.layout))
      }
    },
    loadProjects: function(){
      axios.get( this.endpoint + '/projects_ids', {}).then((res) => {
        this.projects = res.data
      }).catch(err => {
        if(err){
         snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
    },
    loadNotifications: function(){
      axios.get( this.endpoint + '/account/notifications/count', {}).then((res) => {
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
        if (el.getAttribute('date-format')) {
          el.innerHTML = moment(date).format(el.getAttribute('date-format')||'LLLL')
        } else {
          el.innerHTML = moment(date).fromNow()
        }
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
    layout: { cols: 12 },
    users: {}
  },
  render: h => h(App)
})