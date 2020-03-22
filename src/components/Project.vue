<template>
  <section class="hero">
    <div class="has-background-light">
      <div class="container">
        <div class="column">
          <h6>
            <router-link to="/projects">
              <span class="icon">              
                <span class="fa fa-project-diagram"></span>
              </span>
              <span>Proyectos</span>
            </router-link>
          </h6>
          <h6>
           <span v-html="data.title"></span>
          </h6>
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container">
        <div class="content">
          <div v-show="empty" class="column">
            <div class="notification">
              <p>Todavía no estableciste ninguna tarea</p>
            </div>
          </div>
          <div v-if="!empty" class="columns is-multiline">
            <div class="column" :class="'is-' + $root.layout.cols" v-for="item in data.tasks">
              <section class="card task">
                <router-link :to="'/tasks/' + item.id">
                  <div class="card__title">
                    <span v-html="item.title"></span>
                    <!--pre v-html="item"></pre-->
                  </div>
                </router-link>
                <div class="card__meta" :style="'background: linear-gradient(to right, ' + getProgressColour(item.extra.progress) + ' ' + (item.extra ? item.extra.progress : 0 ) + '%,#fff ' + (item.extra ? item.extra.progress : 0 ) + '%);'">
                  <div class="card__meta__date">
                    <span>Creado</span> <span class="convert__dates" v-html="item.id"></span>
                  </div>
                </div>
                <footer class="card-footer">
                  <router-link :to="'/tasks/' + item.id + '/share'" class="card-footer-item">
                    <span>Asignar</span>
                  </router-link>
                  <router-link :to="'/tasks/' + item.id + '/edit'" class="card-footer-item">
                    <span>Editar</span>
                  </router-link>
                </footer>
              </section>
            </div>
          </div>
          <div class="columns">
            <div class="column has-text-centered slideIn">
              <!--router-link :to="'/projects/' + $route.params.id + '/share'" class="button is-success">
                <span>Compartir</span>
              </router-link>
              <router-link :to="'/projects/' + $route.params.id + '/name'" class="button is-info">
                <span>Renombrar</span>
              </router-link-->
              <router-link :to="'/tasks/' + $route.params.id + '/create'" class="button is-info">
                <span>Tareas</span>
              </router-link>
              <a @click="remove(data._id)" class="button is-danger">
                <span>Eliminar</span>
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
  name: 'project',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.id){
      t.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/project/' + t.$route.params.id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.empty = res.data.tasks == undefined
      setTimeout(() => t.$root.convertDates(), 1000) 
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    remove: function(id){
      var t = this
      swal({
        title: `Eliminar proyecto ${t.data.title}`,
        text: '¿Querés borrar este proyecto?',
        dangerMode: true,
        buttons: ["No", "Sí"]
      })
      .then(accept => {
        if (accept) {
          t.$root.loading = true
          axios.delete( t.$root.endpoint + '/project/' + t.data._id, {}).then((res) => {
            t.$root.loading = false
            snackbar('success',"Se eliminó proyecto " + t.data.title)
            t.$router.push('/projects')
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
  methods: {
    getProgressColour (progress) {
      let colour = this.progressColour
      if (progress === 100) {
        colour = '#46b3e6'
      }
      return colour        
    }
  },
  data () {
    return {
      progressColour: '#6decb9',
      data:{},
      empty:false
    }
  }
}
</script>
