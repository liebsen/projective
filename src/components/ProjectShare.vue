<template>
  <div class="columns is-centered has-text-centered photo photo3">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <h1>Compartir <span v-html="data.title"></span></h1>
        <div v-show="showExisting" class="field">
          <p>Elegí la persona de la lista con la que querés compartir el proyecto.<p>
          <label class="label">Seleccioná o ingresá email</label>
          <div class="control">
            <v-autocomplete input-class="input" :items="items" v-model="item" :get-label="getLabel" :component-item="template" :auto-select-one-item="false" @update-items="updateItems"></v-autocomplete>
          </div>
        </div>
        <div v-show="!showExisting" class="field">
          <p>Ingresá el email de la persona con la que querés compartir el proyecto o <a @click="showExisting = true">selecioná uno existente.</a></p>

          <label class="label">Agregar email del nuevo integrante</label>
          <div class="control">
            <input v-model="data.email" class="input" type="email" placeholder="mariano@projective.app" required>
          </div>
        </div>
        <div class="field">
          <div class="control has-text-centered">
            <button type="button" @click="submit" class="button is-link" :class="{'is-loading' : $root.processing}">Compartir</button>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ItemTemplate from './ItemTemplate.vue'
import snackbar from './Snackbar'
export default {
  name: 'projects_share',
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
      //setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    getLabel (item) {
      if(item)
      return item.name
    },
    updateItems (text) {
      let t = this
      t.$root.processing = true
      axios.post( t.$root.endpoint + '/users/search', {text: text}).then( (res) => {
        this.items = res.data
        t.$root.processing = false
      })
    },
    submit : function(){
      let input = document.querySelector('.v-autocomplete-input-group > input').value
      var email = /\S+@\S+\.\S+/;
      let exists = true
      let ready = false

      if (!this.item) {
        if (email.test(input)) {
          exists = false
          this.data.email = input
        } else {
          return snackbar('error', 'Para compartir elegí de la lista o ingresá email')
        }
      }

      this.$root.processing = true
      axios.post( this.$root.endpoint + '/project/share', {
        id: this.$route.params.id,
        exists: exists,
        user: this.item,
        data: this.data
      }).then((res) => {
        this.data = res.data
        this.$root.processing = false
        snackbar('success','Invitaste un nuevo integrante a un proyecto')
        this.$router.push('/projects')
      }).catch(err => {
        this.$root.processing = false
        if(err.response.status === 402){
          snackbar('error',`Tenés que ingresar una cuenta existente. Para agregar a ${this.data.email} presioná  en <strong>agregalo si no existe</strong>`,30000)
        } else if(err.response.status === 403){
          snackbar('error',`Ya existe una cuenta registrada con el email ${this.data.email}. Probá con otro.`,30000)
        } else {
          snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
    }
  },
  data () {
    return {
      data:{},
      showExisting: true,
      item: {_id: 0, name: '', registration_date: ''},
      items: [],
      template: ItemTemplate
    }
  }
}
</script>
