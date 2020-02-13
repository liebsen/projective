<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content is-flex-column is-vertical">
        <h4>
          <span class="icon">
            <span class="fas fa-chart-bar"></span>
          </span> 
          <span>Tu Actividad</span>
          <span class="icon">
            <span class="fas fa-angle-right"></span>
          </span>
          <span v-show="$route.params.type === 'preferences'">Preferencias</span>
          <span v-show="$route.params.type === 'approved'">Aprobados</span>
          <span v-show="$route.params.type === 'rejected'">Rechazados</span>

          <span class="icon">
            <span class="fas fa-angle-right"></span>
          </span>

          <span v-show="$route.params.period == 0" class="has-text-info">
            <span>Est<span v-show="$route.params.view === 'week'">a</span><span v-show="$route.params.view === 'month'">e</span>
              <span v-show="$route.params.view === 'week'">Semana</span>
              <span v-show="$route.params.view === 'month'">Mes</span>
            </span>
          </span>
          <span v-show="$route.params.period > 0" class="has-text-info">
            <span>Hace <span v-html="$route.params.period"></span>
              <span v-show="$route.params.view === 'week'">
                Semana<span v-show="$route.params.period > 1">s</span>
              </span>
              <span v-show="$route.params.view === 'month'">
                Mes<span v-show="$route.params.period > 1">es</span>
              </span>
            </span>
          </span>
        </h4>

        <div class="columns is-multiline"> 
          <div class="column is-3" v-for="item in data">
            <router-link :to="'/preference/' + item._id">
              <div class="box">
                <article class="media">
                  <div class="media-content">
                    <div class="content">
                      <div>
                        <span class="icon">
                          <span class="fas fa-clock"></span>
                        </span>
                        <span>{{item.createdAt | formatDate}}</span> <span>{{item.createdAt | formatHour}}</span><br>
                        <!--span class="icon">
                          <span class="fas fa-clock"></span>
                        </span>
                        <span>{{item.createdAt | formatHour}}</span><br-->
                        <div v-if="item.datos">
                          <span class="icon">
                            <span class="fas fa-user"></span>
                          </span>              
                          <a :href="'tel:' + item.datos.telefono">
                            <span class="has-text-dark is-capitalized" v-html="item.datos.nombre"></span>
                          </a>
                        </div>
                        <!--span class="icon">
                          <span class="fas fa-map-marker"></span>
                        </span>
                        <span class="has-text-dark is-size-7" v-html="item.ruta.from.formatted_address"></span><br>
                        <span class="icon">
                          <span class="fas fa-map-marker"></span>
                        </span>
                        <span class="has-text-dark is-size-7" v-html="item.ruta.to.formatted_address"></span><br-->
                        <!--span class="icon">
                          <span class="fas fa-weight"></span>
                        </span>
                        <span class="has-text-dark">
                          <span v-html="item.carga.peso"></span><span>KG</span>
                        </span><br>
                        <span class="icon">
                          <span class="fas fa-route"></span>
                        </span>    
                        <span class="has-text-dark" v-html="item.ruta.distance.text"></span><br>
                        <span class="icon">
                          <span class="fas fa-stopwatch"></span>
                        </span>
                        <span class="has-text-dark" v-html="item.ruta.duration.text"></span><br-->
                        <span class="icon">
                          <span class="fas fa-money-check-alt"></span>
                        </span>              
                        <span class="has-text-dark">
                          <span v-html="item.estimate.amount"></span>
                          <span v-html="item.estimate.currency"></span>
                          <span v-if="item.mercadopago" :class="{ 'has-text-success' : item.mercadopago.status === 'approved','has-text-warning' : item.mercadopago.status === 'in-process','has-text-danger' : item.mercadopago.status === 'rejected' }" v-html="item.mercadopago.status"></span>
                        </span>
                      </div>

                    </div>
                    <!--nav class="level is-mobile">
                      <div class="level-left">
                        <a class="level-item" aria-label="reply">
                          <span class="icon is-small">
                            <i class="fas fa-reply" aria-hidden="true"></i>
                          </span>
                        </a>
                        <a class="level-item" aria-label="retweet">
                          <span class="icon is-small">
                            <i class="fas fa-retweet" aria-hidden="true"></i>
                          </span>
                        </a>
                        <a class="level-item" aria-label="like">
                          <span class="icon is-small">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                          </span>
                        </a>
                      </div>
                    </nav-->
                  </div>
                </article>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'panel-list',
  mounted: function(){
    var t = this
    t.$root.loading = true
    axios.post( t.$root.endpoint + '/panel/list', {
      type : t.$route.params.type,
      view : t.$route.params.view,
      period : parseInt(t.$route.params.period)
    }).then((res) => {
      t.$root.loading = false
      t.data = res.data.data
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
      }
    })
  },
  data () {
    return {
      data:{}
    }
  }
}
</script>

<style>
  .is-item {
    border-bottom: 1px solid #dbdbdb;
  }
  .media-content .content > div {
    overflow: hidden;
  }
</style>