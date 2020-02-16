<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <h1>Nuevo integrante para <span v-html="data.title"></span></h1>
        <div v-show="showExisting" class="field">
          <p>Elegí la persona de la lista o <a @click="showExisting = false">agregalo si no existe.</a></p>
          <label class="label">Seleccioná el nuevo integrante</label>
          <div class="control">
            <v-autocomplete input-class="input" :items="items" v-model="item" :get-label="getLabel" :component-item='template' @update-items="updateItems"></v-autocomplete>
          </div>
        </div>
        <div v-show="!showExisting" class="field">
          <p>Ingresá el email de la persona o <a @click="showExisting = true">selecioná uno existente.</a></p>

          <label class="label">Agregar email del nuevo integrante</label>
          <div class="control">
            <input v-model="data.email" class="input" type="email" placeholder="mariano@projective.app" required>
          </div>
        </div>
        <div class="field">
          <div class="control has-text-centered">
            <button type="button" @click="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Agregar</button>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ItemTemplate from './ItemTemplate.vue'
export default {
  name: 'persons_create',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.project_id){
      t.$root.false = true
      return t.$root.snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/project/' + t.$route.params.project_id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.empty = res.data.tasks == undefined
      //setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Error " + err)
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
      axios.post( t.$root.endpoint + '/person/search', {text: text}).then( (res) => {
        this.items = res.data
        t.$root.processing = false
      })
    },
    submit : function(){
      let t = this
      console.log("submm")
      t.$root.processing = true
      t.item.title = t.data.title
      let action = t.showExisting ? 'assign' : 'create'
      let data = t.showExisting ? t.item : t.data

      axios.post( t.$root.endpoint + '/person/' + action, data).then((res) => {
        t.data = res.data
        t.$root.processing = false
        t.$root.snackbar('success','Agregaste un nuevo integrante a un proyecto')
        t.$router.push('/projects')
      }).catch(err => {
        t.$root.processing = false
        if(err){
         t.$root.snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
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
