<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content">
        <h4>
          <span class="icon">
            <span class="fas fa-truck"></span>
          </span> 
          <span><span v-html="data.datos.nombre"></span></span>
        </h4>
        <div class="columns"> 
          <div class="column"> 
            <!--span class="has-text-info" v-html="data.createdAt"></span><br-->
            <table class="table">
              <tbody>
                <tr v-show="data.datos && data.datos.comentarios" class="notification">
                  <td>
                    <span class="icon">
                      <span class="fas fa-comments"></span>
                    </span>              
                  </td>
                  <td>
                    <span v-html="data.datos.comentarios"></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-calendar"></span>
                    </span>
                  </td>
                  <td>
                    <span>{{data.createdAt | formatDate}}</span></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-clock"></span>
                    </span>
                  </td>
                  <td>
                    <span>{{data.createdAt | formatHour}}</span>
                  </td>
                </tr>
                <tr v-if="data.datos">
                  <td>
                    <span class="icon">
                      <span class="fas fa-mobile-alt"></span>
                    </span>
                  </td>
                  <td>
                    <a :href="'tel:' + data.datos.telefono">
                      <span class="has-text-dark" v-html="data.datos.telefono"></span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-map-marker-alt"></span>
                    </span>
                  </td>
                  <td>
                    <span class="has-text-dark" v-html="data.ruta.from.formatted_address"></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-map-marker-alt"></span>
                    </span>
                  </td>
                  <td>
                    <span class="has-text-dark" v-html="data.ruta.to.formatted_address"></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-weight"></span>
                    </span>
                  </td>
                  <td>
                    <span class="has-text-dark">
                      <span v-html="data.carga.peso"></span><span>KG</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-route"></span>
                    </span>    
                  </td>
                  <td>
                    <span class="has-text-dark" v-html="data.ruta.distance.text"></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-stopwatch"></span>
                    </span>    
                  </td>
                  <td>
                    <span class="has-text-dark" v-html="data.ruta.duration.text"></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="icon">
                      <span class="fas fa-truck-loading"></span>
                    </span>    
                  </td>
                  <td>
                    <span v-show="data.carga.service" class="has-text-success">
                      <span class="icon">
                        <span class="fa fa-check"></span>
                      </span>
                      <span>Con servicio de carga / descarga</span>
                    </span>
                    <span v-show="!data.carga.service" class="has-text-danger">
                      <span class="icon">
                        <span class="fa fa-times"></span>
                      </span>
                      <span>Sin servicio de carga / descarga</span>
                    </span>
                  </td>
                </tr>
                <tr class="has-background-success has-text-white">
                  <td>
                    <span class="icon">
                      <span class="fas fa-money-check-alt"></span>
                    </span>
                  </td>
                  <td>
                    <span>
                      <span v-html="data.estimate.amount"></span>
                      <span v-html="data.estimate.currency"></span>
                    </span>
                    <span v-if="data.mercadopago" class="has-text-warning" v-html="data.mercadopago.status"></span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          <div class="column">
            <div id='map'></div>
          </div>          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'preference',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.preference){
      return t.$root.snackbar('error',"No preference param.")
    }
    axios.post( t.$root.endpoint + '/preference', {
      id:t.$route.params.preference
    }).then((res) => {
      t.$root.loading = false
      t.data = res.data.preference

      t.initMap()
      t.map.on('load', function() {
        t.createRoute()
        t.createOrigMarker()
        t.createDestMarker()
        t.$root.loading = false
      });
      setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    initMap : function(){
      var t = this
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluZnJlZSIsImEiOiJ5ZFd0U19vIn0.Z7WBxuf0QKPrdzv2o6Mx6A';
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [t.data.ruta.from.lng, t.data.ruta.from.lat],
        zoom:14
      });

      map.addControl(new mapboxgl.FullscreenControl())       
      t.map = map   
    },
    createRoute: function(){
      var t = this
      var mapLayer = t.map.getLayer('coordinates');
      if(typeof mapLayer !== 'undefined') {
        t.map.removeLayer('coordinates').removeSource('coordinates');        
      }
      t.map.addLayer({
        "id": "coordinates",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": t.data.ruta.coordinates
            }
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#1496ed",
          "line-width": 8
        }
      })
      var bounds = t.data.ruta.coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(t.data.ruta.coordinates[0], t.data.ruta.coordinates[0]));

      t.map.fitBounds(bounds,{
        padding:50, 
        offset:[0,0]
      })
    },
    createOrigMarker : function(){
      var t = this
      var mapLayer = t.map.getLayer('orig');

      if(typeof mapLayer !== 'undefined') {
        t.map.removeImage('orig')
        t.map.removeLayer('orig').removeSource('orig');        
      }

      t.map.loadImage('/static/img/orig.png', function(error, image) {
        if (error) throw error;
        t.map.addImage('orig', image);
        t.map.addLayer({
          "id": "orig",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [t.data.ruta.from.lng, t.data.ruta.from.lat]
                }
              }]
            }
          },
          "layout": {
            "icon-image": "orig",
            "icon-size": 0.25
          }
        });
      });
    },
    createDestMarker : function(){
      var t = this
      var mapLayer = t.map.getLayer('dest');

      if(typeof mapLayer !== 'undefined') {
        t.map.removeImage('dest')
        t.map.removeLayer('dest').removeSource('dest');        
      }

      t.map.loadImage('/static/img/dest.png', function(error, image) {
        if (error) throw error;
        t.map.addImage('dest', image);
        t.map.addLayer({
          "id": "dest",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [t.data.ruta.to.lng, t.data.ruta.to.lat]
                }
              }]
            }
          },
          "layout": {
            "icon-image": "dest",
            "icon-size": 0.25
          }
        });
      });
    }
  },
  data () {
    return {
      map:null,
      data:{
        datos:{},
        carga:{},
        estimate:{},
        ruta: {
          distance:{},
          duration:{},
          coordinates:[],
          from:{
            formatted_address:'',
            lat:'',
            lng:''
          },
          to:{
            formatted_address:'',
            lat:'',
            lng:''        
          }
        }
      }     
    }
  }
}
</script>
