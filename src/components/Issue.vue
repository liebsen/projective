<template>
  <section class="hero">
    <div class="has-background-light">
      <div class="container">
        <div class="column">
          <h6>
            <router-link :to="'/projects/' + data._id">
              <span class="icon">              
                <span class="fa fa-project-diagram"></span>
              </span>
              <span v-html="data.title"></span>
            </router-link>
          </h6>
          <h6>
            <router-link :to="'/tasks/' + data.tasks._id">
              <span v-html="data.tasks.title"></span>
            </router-link> 
            <span v-html="data.tasks.issues.title"></span>
          </h6>
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container">
        <div class="content">
          <div v-show="empty" class="column">
            <div class="notification">
              <p>Todavía no hay cuestiones.</p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column" :class="'is-' + $root.layout.cols">
              <section class="card issue">
                <div class="card__title">
                  <span v-html="data.tasks.issues.title"></span>
                </div>
                <div class="card__meta">
                  <div class="card__meta__date">
                    <span>Creado</span> <span class="convert__dates" v-html="data.tasks.issues.id"></span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="columns">
            <div class="column has-text-centered slideIn">
              <router-link :to="'/issues/' + data.tasks.id + '/create'" class="button is-success">
                <span>Agregar cuestión</span>
              </router-link>
              <a @click="remove(data._id)" class="button is-danger">
                <span>Eliminar cuestión</span>
              </a>
            </div>
          </div>
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
  name: 'issue',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.id){
      t.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/issue/' + t.$route.params.id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      setTimeout(() => t.$root.convertDates(), 1000) 
      //t.empty = res.data.tasks.issues == undefined
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    remove: function(id){
      let t = this
      swal({
        title: `Eliminar cuestión `,
        text: '¿Querés borrar esta cuestión?',
        buttons: ["No", "Sí"]
      })
      .then(accept => {
        if (accept) {
          t.$root.loading = true
          axios.delete( t.$root.endpoint + '/issue/' + t.$route.params.id, {}).then((res) => {
            t.$root.loading = false
            snackbar('success',"Se eliminó cuestión "  )
            t.$router.push('/tasks/' + t.data.tasks.id)
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
      data:{
        tasks: {
          issues: {}
        }
      },
      empty:false
    }
  }
}
</script>
