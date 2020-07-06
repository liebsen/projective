<template>
  <section class="hero">
    <div class="has-background-light">
      <div class="container">
        <div class="column">
          <h6>
            <a to="#" @click="$root.setCols">
              <span class="icon">              
                <span class="fa fa-project-diagram"></span>
              </span>
              <span>Proyectos</span>
            </a>
          </h6>
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container">
        <div class="content">
          <h1 v-if="$root.auth.user">Hola, <span v-html="$root.auth.user.name"></span></h1>
          <div v-show="empty" class="column">
            <div class="notification">
              <p>Todavía no creaste ningún proyecto.</p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column" :class="'is-' + $root.layout.cols" v-for="item in data">
              <section class="card" :class="{ 'is-complete': item.progress === 100 }">
                <router-link :to="'/projects/' + item._id">
                  <div class="card__title">
                    <span v-html="item.title"></span>
                    <!--pre v-html="item"></pre-->
                  </div>
                </router-link>
                <div class="card__meta" :style="'background: linear-gradient(to right,' + getProgressColour(item.progress) + ' ' + item.progress + '%,#fff ' + item.progress + '%);'">
                  <div class="card__meta__date">
                    <span>Creado</span> <span class="convert__dates" v-html="item._id"></span>
                  </div>
                </div>
                <footer class="card-footer">
                  <router-link :to="'/projects/' + item._id + '/share'" class="card-footer-item">
                    <span>Compartir</span>
                  </router-link>
                  <router-link :to="'/projects/' + item._id + '/edit'" class="card-footer-item">
                    <span>Editar</span>
                  </router-link>
                </footer>
              </section>
            </div>
          </div>
          <div class="columns">
            <div class="column has-text-centered slideIn">
              <router-link to="/projects/create" class="button is-success">
                <span>Crear nuevo proyecto</span>
              </router-link>
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
import moment from 'moment'
import snackbar from './Snackbar'
export default {
  name: 'projects',
  mounted: function(){
    this.$root.loading = true
    axios.get( this.$root.endpoint + '/projects', {}).then((res) => {
      this.data = res.data
      let ids = []
      this.data.forEach(item => {
        let progress = 0
        let tasks = item.tasks || []
        ids.push(item._id)
        tasks.forEach(task => {
          progress+= task.extra && task.extra.progress ? task.extra.progress: 0
        })
        this.$root.projects = ids
        item.progress = progress / tasks.length
      })
      this.data.sort((a, b) => {
        if ( a.progress < b.progress ){
          return -1
        }
        if ( a.progress > b.progress ){
          return 1
        }
        return 0
      })
      this.data.empty = Object.keys(res.data).length ? false : true
      this.$root.loading = false
      setTimeout(() => this.$root.convertDates(), 250)
    }).catch(err => {
      this.$root.loading = false
      if(err){
       snackbar('error',"Hubo un Error al solicitar datos: " + err, 30000)
      }
    })
  },
  methods: {
    getProgressColour (progress) {
      let colour = this.progressColour
      if (progress === 100) {
        colour = '#eef'
      }
      return colour        
    }
  },
  data () {
    return {
      progressColour: 'rgb(179, 214, 255)',
      data:{},
      empty:false
    }
  }
}
</script>