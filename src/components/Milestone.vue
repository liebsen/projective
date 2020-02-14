<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container content">
        <h4>
          <span class="icon is-size-7">
            <span class="fas fa-project-diagram"></span>
          </span> 
          <span>
            <router-link to="/projects">
              <span>Proyectos</span>
            </router-link>
            <span class="icon is-size-7">
              <span class="fas fa-chevron-right"></span>
            </span>
            <span v-html="data.title"></span>
            <span class="icon is-size-7">
              <span class="fas fa-chevron-right"></span>
            </span>
            <span v-html="data.milestones[0][$route.params._id].title"></span>
          </span>
        </h4>
        <div v-show="empty" class="column">
          <div class="notification">
            <p>Todavía no hay cuestiones.</p>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-4" v-for="item in data.milestones[0][$route.params._id].issues">
            <router-link :to="'/milestones/' + item.id">
              <div class="box">
                <h2><span v-html="item.title"></span></h2>
              </div>
            </router-link>
          </div>
        </div>
        <div class="columns">
          <div class="column has-text-centered slideIn">
            <router-link :to="'/milestones/' + data._id + '/create'" class="button is-success">
              <span>Agregar cuestión</span>
            </router-link>
            <a @click="remove(data._id)" class="button is-danger">
              <span>Eliminar objetivo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'
export default {
  name: 'milestone',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params._id){
      t.$root.false = true
      return t.$root.snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/project/' + t.$route.params.project_id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.empty = res.data.issues == undefined
      //setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    remove: function(id){
      let t = this
      swal({
        title: `Eliminar objetivo ${t.data.milestones[0][t.$route.params._id].title}`,
        text: '¿Querés borrar este objetivo?',
        buttons: ["No", "Sí"]
      })
      .then(accept => {
        if (accept) {
          t.$root.loading = true
          axios.delete( t.$root.endpoint + '/milestone/' + t.$route.params.id, {}).then((res) => {
            t.$root.loading = false
            t.$root.snackbar('success',"Se eliminó objetivo " + t.data.milestones[0][t.$route.params._id].title)
            t.$router.push('/projects/' + t.$route.params.project_id)
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
      data:{},
      empty:false
    }
  }
}
</script>
