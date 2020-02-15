<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
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
          <div v-show="data.tasks.extra" class="column">
            <div class="notification">
              <pre v-html="data.tasks.extra"></pre>
            </div>
          </div>

          <div v-show="!data.tasks.extra" class="column">
            <div class="notification">
              <p>Todavía no hay detalles</p>
            </div>
          </div>

          <div v-show="empty" class="column">
            <div class="notification">
              <p>Todavía no hay cuestiones sobre <span v-html="data.tasks.title"></span></p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-4" v-for="item in data.tasks.issues">
              <router-link :to="'/issues/' + item.id">
                <div class="box">
                  <h2><span v-html="item.title"></span></h2>
                </div>
              </router-link>
            </div>
          </div>
          <div class="columns">
            <div class="column has-text-centered slideIn">
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
export default {
  name: 'task',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.id){
      t.$root.false = true
      return t.$root.snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/task/' + t.$route.params.id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.empty = res.data.tasks.issues == undefined
      //setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
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
            t.$root.snackbar('success',"Se eliminó objetivo "  )
            t.$router.push('/projects/' + t.data._id)
          }).catch(err => {
            t.$root.loading = false
            if(err){
             t.$root.snackbar('error',"Error " + err)
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
      empty:false
    }
  }
}
</script>
