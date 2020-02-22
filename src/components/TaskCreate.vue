<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Nuevas tareas para <span v-html="data.title"></span></h1>
          <p>Ingresá las tareas separadas por salto de línea</p>
          <div class="field">
            <div class="control">
              <textarea v-model="data.tasks" class="textarea" placeholder="1. Análisis
2. Diseño
3. Desarrollo 
4. etc..." required></textarea>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link" :class="{'is-loading' : $root.processing}">Establecer tareas</button>
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
  name: 'tasks_create',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.project_id){
      t.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/project/' + t.$route.params.project_id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.data.tasks = ''
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
      axios.put( t.$root.endpoint + '/task/' + t.$route.params.project_id, t.data).then((res) => {
        t.data = res.data
        t.$root.processing = false
        snackbar('success','Estableciste nuevos objetivos para ' + t.data.title)
        t.$router.push('/projects/' + t.$route.params.project_id)
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
