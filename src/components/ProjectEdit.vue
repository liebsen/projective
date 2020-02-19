<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Editar proyecto <span v-html="data.title"></span></h1>
          <p>Ingresá el nombre de tu proyecto</p>
          <div class="field">
            <div class="control">
              <input v-model="data.title" class="input" type="text" placeholder="Nombre del proyecto" required>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Actualizar</button>
            </div>
          </div>  
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import snackbar from './Snackbar'
export default {
  name: 'projects_edit',
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
      setTimeout(() => t.$root.convertDates(),250) 
    }).catch(err => {
      t.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    submit : function(){
      let t = this
      t.$root.processing = true
      axios.post( t.$root.endpoint + '/project', {
        _id: t.data._id,
        title: t.data.title
      }).then((res) => {
        t.data = res.data
        t.$root.processing = false
        snackbar('success','Renombraste un proyecto')
        t.$router.push('/projects')
      }).catch(err => {
        t.$root.processing = false
        if(err){
         snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
    }
  },
  data () {
    return {
      data:{}
    }
  }
}
</script>
