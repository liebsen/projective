<template>
  <section class="hero">
    <div class="has-background-light is-custom-breadcrumb">
      <div class="container">
        <div class="column">
          <h6>
            <router-link :to="'/accounts'">
              <span class="icon">              
                <span class="fa fa-user-circle"></span>
              </span>
              <span>Cuentas</span>
            </router-link>
          </h6>
          <h6>
            <span v-html="data._id"></span>
          </h6>
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container">
        <div class="content">
          <div v-show="empty" class="column">
            <div class="notification">
              <p>No existe esta cuenta</p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column" :class="'is-' + $root.layout.cols">
              <section class="card issue">
                <div class="card__title">
                  <span v-show="data.name" v-html="data.name"></span>
                  <span v-show="!data.name">Cuenta sin validar</span>
                </div>
                <div class="card__meta">
                  <div class="card__meta__date">
                    <span v-show="data.name">Miembro desde</span> 
                    <span v-show="!data.name">Invitado</span> 
                    <span class="convert__dates" v-html="data._id"></span>
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
    axios.get( t.$root.endpoint + '/account/' + t.$route.params.id, {}).then((res) => {
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
