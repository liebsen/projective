<template>
  <div>
    <div class="container has-actions content is-flex-column is-vertical">
      <div class="column">
        <h2>
          <span class="icon">
            <span class="fas fa-cog"></span>
          </span> 
          <span>Configuración</span>
        </h2>
        <h4>Indica cuales son tus preferencias</h4>
        <p>Por favor ingresa tus datos de preferencias para tus cotizaciones.</p>
      </div>
      <form class="form has-text-left fadeIn" @submit.prevent="submit">
        <div class="columns">
          <div class="column">
            <h6>
              <span class="icon">
                <span class="fas fa-route"></span>
              </span>  
              <span>Ruta</span>
            </h6>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Mínimo de distancia</label>
              <div class="control">
                <input @click="showAltText('route_min')" class="input" v-model="data.route.min" type="number" placeholder="Min" autofocus required>
                <vue-slider
                  ref="route_min"
                  v-model="data.route.min"
                  v-bind="slider.options.route"
                ></vue-slider>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Máximo de distancia</label>
              <div class="control">
                <input @click="showAltText('route_max')" class="input" type="number" v-model="data.route.max" placeholder="Max" required>
                <vue-slider
                  ref="route_max"
                  v-model="data.route.max"
                  v-bind="slider.options.route"
                ></vue-slider>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Precio de distancia mínima</label>
              <div class="control">
                <input @click="showAltText('route_price')" class="input" v-model="data.route.price" type="number" placeholder="Precio" autofocus required>
                <vue-slider
                  ref="route_price"
                  v-model="data.route.price"
                  v-bind="slider.options.price"
                ></vue-slider>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Precio por km adicional</label>
              <div class="control">
                <input @click="showAltText('route_karma')" class="input" type="number" v-model="data.route.karma" placeholder="Karma" required>
                <vue-slider
                  ref="route_karma"
                  v-model="data.route.karma"
                  v-bind="slider.options.karma"
                ></vue-slider>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <h6>
              <span class="icon">
                <span class="fas fa-weight"></span>
              </span>
              <span>Carga</span>
            </h6>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Mínimo de la carga</label>
              <div class="control">
                <input @click="showAltText('cargo_min')" class="input" v-model="data.cargo.min" type="number" placeholder="Min" autofocus required>
                <vue-slider
                  ref="cargo_min"
                  v-model="data.cargo.min"
                  v-bind="slider.options.cargo"
                ></vue-slider>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Máximo de la carga</label>
              <div class="control">
                <input @click="showAltText('cargo_max')" class="input" type="number" v-model="data.cargo.max" placeholder="Max" required>
                <vue-slider
                  ref="cargo_max"
                  v-model="data.cargo.max"
                  v-bind="slider.options.cargo"
                ></vue-slider>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Precio de la carga mínima</label>
              <div class="control">
                <input @click="showAltText('cargo_price')" class="input" v-model="data.cargo.price" type="number" placeholder="Precio" autofocus required>
                <vue-slider
                  ref="cargo_price"
                  v-model="data.cargo.price"
                  v-bind="slider.options.price"
                ></vue-slider>
              </div>
            </div>
          </div>
          <div class="column">

            <div class="field">
              <label class="label">Precio por kg adicional</label>
              <div class="control">
                <input @click="showAltText('cargo_karma')" class="input" type="number" v-model="data.cargo.karma" placeholder="Karma" required>
                <vue-slider
                  ref="cargo_karma"
                  v-model="data.cargo.karma"
                  v-bind="slider.options.karma"
                ></vue-slider>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <hr>

      <form class="form has-text-left fadeIn">
        <div class="columns">
          <div class="column">
            <h6 class="has-text-dark">
              <span class="icon">
                <span class="fas fa-money-check"></span>
              </span>  
              <span>Previsualización de costos</span>
            </h6>
            <div class="field is-horizontal">
              <div class="field-body">
                <div class="field">
                  <label class="label">Distancia de la ruta</label>
                  <div class="control">
                    <input @change="calcPreview" class="input" v-model="preview.route" type="number" placeholder="15" autofocus required>
                    <vue-slider 
                      ref="prev_route"
                      v-model="preview.route"
                      v-bind="slider.options.route"
                    ></vue-slider>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Peso de la carga</label>
                  <div class="control">
                    <input @change="calcPreview" class="input" type="number" v-model="preview.cargo" placeholder="200" required>
                    <vue-slider 
                      ref="prev_cargo"
                      v-model="preview.cargo"
                      v-bind="slider.options.cargo"
                    ></vue-slider>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Costos</label>
                  <div class="control">
                    <input class="input button is-info has-text-right" type="text" placeholder="0ARS total" readonly :value="'Ruta ' + preview.routes">
                    <input class="input button is-warning has-text-right" type="text" placeholder="0ARS total" readonly :value="'Carga ' + preview.cargos">
                    <input class="input button is-success has-text-right" type="text" placeholder="0ARS total" readonly :value="'Total ' + preview.total">
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <label class="label">&nbsp;</label>
                    <button type="button" @click="calcPreview" class="button is-success" :class="{'is-loading' : $root.loading}">Calcular</button>
                  </div>
                </div>
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
  name: 'settings',
  mounted: function(){
    var t = this
    t.findall()
  },
  watch: {
    // a computed getter
    data: function () {
      console.log("1---")
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
      this.$root.loading = true
      axios.post( this.$root.endpoint + '/settings', this.data ).then((res) => {
        if(res.data.status==='success'){
          this.$root.snackbar('success','Tu configuración fue actualizada con éxito.',10000)
        } else {
          this.$root.snackbar('danger','Tu configuración no pudo ser actualizada. Por favor intentá nuevamente en unos instantes.')
        }
        this.$root.loading = false
      })
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
