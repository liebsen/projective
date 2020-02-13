<template>
  <div>
    <div class="container has-actions content is-flex-column is-vertical">
      <div class="column">
        <h2>
          <span class="icon">
            <span class="fas fa-cog"></span>
          </span> 
          <span>Configuración de Ubicación</span>
        </h2>
        <h4>Indica cuales son tus preferencias de ubicación.</h4>
        <p>Por favor ingresa tus datos de preferencias para tus cotizaciones.</p>
      </div>
      <form class="form has-text-left fadeIn" @submit.prevent="submit">
        <div class="columns">
          <div class="column">
            <h6>
              <span class="icon">
                <span class="fas fa-route"></span>
              </span>  
              <span>Ubicación</span>
            </h6>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Mínimo de distancia</label>
              <div class="control">
                <input class="input" v-model="data.address" type="text" placeholder="Escribe tu dirección y selecciona de la lista" autofocus required>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Radio de entrega</label>
              <div class="control">
                <input class="input" type="number" v-model="data.radio" placeholder="Radio de entrega" required>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="columns actions navbar is-fixed-bottom is-vbaseline has-text-centered">
      <div class="column has-text-centered">
         <button type="button" @click="submit" class="button is-link is-medium" :class="{'is-loading' : $root.loading}">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'configuracion-ubicacion',
  mounted: function(){
    var t = this
    t.findall()
  },
  watch: {
    // a computed getter
    data: function () {
      this.calcPreview()
    },
    deep: true
  },
  components: {
    VueSlider
  },
  methods : {
    getTotal:function(){
      console.log("getTotal")
      console.log(this.preview)
    },
    findall : function(){
      var t = this
      t.$root.loading = true
      axios.post( t.$root.endpoint + '/data', {}).then((res) => {
        if(res.data.data.settings)
          t.data = res.data.data.settings
        t.$root.loading = false
      }).catch(err => {
        if(err){
         t.$root.snackbar('error',"Error.",30000)
         t.$root.loading = false
        }
      })
    },
    submit : function(){

      /*
      this.$root.loading = true
      axios.post( this.$root.endpoint + '/settings', this.data ).then((res) => {
        if(res.data.status==='success'){
          this.$root.snackbar('success','Tu configuración fue actualizada con éxito.',10000)
        } else {
          this.$root.snackbar('danger','Tu configuración no pudo ser actualizada. Por favor intentá nuevamente en unos instantes.')
        }
        this.$root.loading = false
      })*/
    },
    showAltText: function(name){
      this.$root.snackbar('success',this.texts[name],5000)
    },
    calcPreview: function(){
      let distance = parseFloat(this.preview.route,10) // in km
      var delta = distance - parseFloat(this.data.route.min,10);

      if(delta < 0){
        delta = 0;
      }

      let dpart = parseFloat(this.data.route.price,10) + delta * parseFloat(this.data.route.karma,10);

      // weight 
      delta = parseFloat(this.preview.cargo,10) - parseFloat(this.data.cargo.min,10);

      if(delta < 0){
        delta = 0;
      }

      let wpart = parseFloat(this.data.cargo.price,10) + delta * parseFloat(this.data.cargo.karma,10);
      this.preview.routes = dpart;
      this.preview.cargos = wpart;
      this.preview.total = parseFloat(Math.round(dpart + wpart)).toFixed(2);
      this.preview.text = [Math.round(dpart),'+',Math.round(wpart),'=', Math.round(this.preview.total),'ARS'].join(' ')

      console.log(this.preview.text)
    }
  },
  data () {
    return {
      data:{
        route:{
          min: 0,
          max: 0,
          price: 0,
          karma: 0
        },
        cargo:{
          min: 0,
          max: 0,
          price: 0,
          karma: 0
        }
      },
      preview : {
        route: 0,
        cargo: 0,
        total: 0
      },
      texts: {
        route_min:'Establece la distancia que consideras mínima',
        route_max:'Establece la distancia que consideras máxima',
        route_price:'Establece el precio de la distancia mínima',
        route_karma:'Establece el precio por km adicional al mínimo',
        cargo_min:'Establece peso de carga que consideras mínimo',
        cargo_max:'Establece peso de carga que consideras máximo',
        cargo_price:'Establece el precio del peso de carga mínimo',
        cargo_karma:'Establece el precio por peso de carga adicional al mínimo',
      },
      slider : {
        options: {
          karma : {
            dotSize: 14,
            min: 0,
            max: 100
          },
          price : {
            dotSize: 14,
            min: 0,
            max: 3000
          },
          cargo: {
            dotSize: 14,
            min: 0,
            max: 500
          },
          route: {
            dotSize: 14,
            min: 0,
            max: 100
          }
        }
      },
      acceptTerms: false,
      msg: 'Welcome to FletsApp'
    }
  }
}
</script>
