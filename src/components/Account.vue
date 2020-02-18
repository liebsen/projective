<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container">
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
          <ul>
            <li>
              <router-link to="/#">
                <span>Cuentas</span>
              </router-link>
            </li>
            <li>
              <router-link :to="'/accounts/' + data._id">
                <span v-html="data._id"></span>
              </router-link>
            </li>
          </ul>
        </nav>
        <div class="content">
          <div v-show="empty" class="column">
            <div class="notification">
              <p>No existe esta cuenta</p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-6">
              <section class="card issue">
                <div class="card__title">
                  <span v-html="data.name"></span>
                </div>
                <div class="card__meta">
                  <div class="card__meta__date">
                    <span>Creado</span> <span class="convert__dates" v-html="data._id"></span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <!--div class="columns">
            <div class="column has-text-centered slideIn">
              <router-link :to="'/issues/' + data.tasks.id + '/create'" class="button is-success">
                <span>Agregar cuestión</span>
              </router-link>
              <a @click="remove(data._id)" class="button is-danger">
                <span>Eliminar cuestión</span>
              </a>
            </div>
          </div-->
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
  name: 'account',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.id){
      t.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/accounts/' + t.$route.params.id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      setTimeout(() => t.$root.convertDates(),250) 
      t.empty = res.data.length == 0
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
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
