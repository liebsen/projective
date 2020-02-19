<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <h1>Compartir proyecto <span v-html="data.title"></span></h1>
        <div v-show="showExisting" class="field">
          <p>Elegí la persona de la lista con la que querés compartir el proyecto o <a @click="showExisting = false">agregalo si no existe.</a></p>
          <label class="label">Seleccioná el nuevo integrante</label>
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
            <button type="button" @click="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Compartir</button>
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
      let t = this
      t.$root.processing = true
      axios.post( t.$root.endpoint + '/project/share', {
        id: t.$route.params.id,
        exists: t.showExisting,
        user: t.item,
        data: t.data
      }).then((res) => {
        t.data = res.data
        t.$root.processing = false
        snackbar('success','Invitaste un nuevo integrante a un proyecto')
        t.$router.push('/projects')
      }).catch(err => {
        t.$root.processing = false
        if(err.response.status === 402){
          snackbar('error',`Tenés que ingresar una cuenta existente. Para agregar a ${t.data.email} presioná  en <strong>agregalo si no existe</strong>`,30000)
        } else if(err.response.status === 403){
          snackbar('error',`Ya existe una cuenta registrada con el email ${t.data.email}. Probá con otro.`,30000)
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
