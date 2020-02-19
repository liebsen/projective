<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Nuevo Proyecto</h1>
          <p>Ingresá el nombre de tu proyecto</p>
          <div class="field">
            <div class="control">
              <input v-model="data.title" class="input" type="text" placeholder="Nombre del proyecto" required>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Crear</button>
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
  name: 'projects_create',
  methods: {
    submit : function(){
      let t = this
      t.$root.processing = true
      axios.put( t.$root.endpoint + '/project', t.data).then((res) => {
        t.data = res.data
        t.$root.processing = false
        snackbar('success','Creaste un nuevo proyecto')
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
