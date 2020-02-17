<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container">
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
          <ul>
            <li><a href="/projects">Proyectos</a></li>
          </ul>
        </nav>
        <div class="content is-flex-column is-vertical">
          <h1>Hola, <span v-html="$root.account.name"></span></h1>
          <div v-show="empty" class="column">
            <div class="notification">
              <p>Todavía no creaste ningún proyecto.</p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-6" v-for="item in data">
              <router-link :to="'/projects/' + item._id">
                <section class="card">
                  <div class="card__title">
                    <span v-html="item.title"></span>
                    <!--pre v-html="item"></pre-->
                  </div>
                  <div class="card__meta" :style="'background: linear-gradient(to right,#40e0d0 ' + item.progress + '%,#fff ' + item.progress + '%);'">
                    <div class="card__meta__date">
                      <span>Creado</span> <span class="convert__dates" v-html="item._id"></span>
                    </div>
                  </div>
                </section>
              </router-link>
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

export default {
  name: 'projects',
  mounted: function(){
    let t = this
    t.$root.loading = true
    axios.get( t.$root.endpoint + '/projects', {}).then((res) => {
      t.data = res.data
      t.data.forEach(item => {
        let progress = 0
        let tasks = item.tasks||[]
        tasks.forEach(task => {
          progress+= task.extra && task.extra.progress ? task.extra.progress: 0
        })
        item.progress = progress / tasks.length
      })
      t.data.empty = Object.keys(res.data).length?false:true
      t.$root.loading = false
      setTimeout(() => t.$root.convertDates(),250) 
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
      }
    })
  },
  data () {
    return {
      data:{},
      empty:false
    }
  }
}
</script>