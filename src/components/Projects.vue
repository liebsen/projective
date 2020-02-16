<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
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
            <div class="column is-4" v-for="item in data">
              <router-link :to="'/projects/' + item._id">
                <div class="box">
                  <h2><span v-html="item.title"></span></h2>
                </div>
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
      t.data.empty = Object.keys(res.data).length?false:true
      t.$root.loading = false
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