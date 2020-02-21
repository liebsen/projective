<template>
  <section class="hero">
    <div v-show="!$root.loading" class="hero-body">
      <div class="container">
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
          <ul>
            <li><a href="#">Notificaciones</a></li>
          </ul>
        </nav>
        <div class="content">
          <h1 v-if="$root.auth.user">Hola, <span v-html="$root.auth.user.name"></span></h1>
          <div v-show="empty" class="column">
            <div class="notification">
              <p>Todavía no rebibiste notificaciones.</p>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-full" v-for="item in data">
              <section class="card">
                <router-link :to="'/tasks/' + item.room">
                  <div class="card__title">
                    <span v-html="item.extra.project"></span>
                    <span v-html="item.extra.task" class="has-text-grey"></span><br>
                    <span v-html="item.extra.sender" class="has-text-success"></span>
                    <!--pre v-html="item"></pre-->
                  </div>
                </router-link>
                <div class="card__meta">
                  <div class="card__meta__date">
                    <span>Creado</span> <span class="fromnow__dates" v-html="item.created"></span>
                  </div>
                </div>
                <!--footer class="card-footer">
                  <router-link :to="'/notifications/' + item._id + '/share'" class="card-footer-item">
                    <span>Compartir</span>
                  </router-link>
                  <router-link :to="'/notifications/' + item._id + '/edit'" class="card-footer-item">
                    <span>Editar</span>
                  </router-link>
                </footer-->
              </section>
            </div>
          </div>
          <!--div class="columns">
            <div class="column has-text-centered slideIn">
              <router-link to="/notifications/read" class="button is-success">
                <span>Marcar todas como leídas</span>
              </router-link>
            </div>
          </div-->
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
  name: 'notifications',
  mounted: function(){
    let t = this
    t.$root.loading = true
    t.$root.ncount = 0
    axios.get( t.$root.endpoint + '/account/notifications', {}).then((res) => {
      t.data = res.data
      t.$root.loading = false
      setTimeout(() => t.$root.convertDates(),250) 
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
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