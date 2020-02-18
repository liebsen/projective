<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container">
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
          <ul>
            <li>
              <router-link to="/projects">
                <span>Proyectos</span>
              </router-link>
            </li>
            <li>
              <router-link :to="'/projects/' + data._id">
                <span v-html="data.title"></span>
              </router-link>
            </li>
            <li class="is-active">
              <a href="#" aria-current="page">
                <span v-html="data.tasks.title"></span>
              </a>
            </li>
          </ul>
        </nav>
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
                <div class="column is-full" v-for="item in data.tasks.issues">
                  <router-link :to="'/issues/' + item.id">
                    <section class="card task">
                      <div class="card__title">
                        <span v-html="item.title"></span>
                      </div>
                      <div class="card__meta">
                        <div class="card__meta__date">
                          <span>Creado</span> <span class="convert__dates" v-html="item._id"></span>
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
                  <div class="notification has-background-white">
                    <p>Todavía no hay detalles</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="userbox"></div>
              <div class="column has-text-left has-background-white chatbox-container">
                <div class="columns">
                  <div class="column chatbox"></div>
                </div>
                <form @submit.prevent="sendChat">
                  <div class="field has-addons">
                    <div class="control">
                      <input class="input is-rounded" v-model="chat" type="text" placeholder="Ingresa tu mensaje" />
                    </div>
                    <div class="control">
                      <button type="submit" class="button is-info is-rounded">
                        <span class="icon">
                          <span class="fas fa-arrow-up"></span>
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>        
            </div>
          </div>
          <div class="columns">
            <div class="column has-text-centered slideIn">
              <router-link :to="'/tasks/' + $route.params.id + '/assign'" class="button is-info">
                <span>Asignar</span>
              </router-link>
              <router-link :to="'/tasks/' + $route.params.id + '/edit'" class="button is-success">
                <span>Editar</span>
              </router-link>
              <router-link :to="'/issues/' + $route.params.id + '/create'" class="button is-success">
                <span>Agregar cuestión</span>
              </router-link>
              <a @click="remove" class="button is-danger">
                <span>Eliminar tarea <span v-html="data.tasks.title"></span></span>
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
import snackbar from './Snackbar'
export default {
  name: 'task',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.id){
      t.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/task/' + t.$route.params.id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.empty = res.data.tasks.issues == undefined
      t.$socket.emit('chat_join', {
        id:t.$route.params.id, 
        code: t.$root.auth.user._id
      })
      setTimeout(() => {
        t.$root.convertDates()
        t.$root.chatHistory(res.data.tasks.chat)
        t.$root.showOnlineUsers(res.data.accounts)
      },250) 
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    sendChat: function() {
      let t = this
      if(t.chat.trim()==='') t.chat = '👋'
      t.$socket.emit('chat_send', { 
        room: t.$route.params.id,
        sender: t.$root.auth.user._id,
        name: t.$root.auth.user.name,
        line: t.chat
      })
      t.chat = ''
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
      data:{ tasks: { extra: {}, issues: {}}},
      empty:false,
      chat:''
    }
  }
}
</script>
