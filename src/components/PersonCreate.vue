<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Nuevo integrante para <span v-html="data.title"></span></h1>
          <p>Ingresá el email del nuevo integrante</p>
          <div class="field">
            <div class="control">
              <input v-model="data.email" class="input" type="email" placeholder="mariano@projective.app" required>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Agregar</button>
            </div>
          </div>  
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
      t.empty = res.data.milestones == undefined
      //setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      t.$root.loading = false
      if(err){
       t.$root.snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    submit : function(){
      let t = this
      t.$root.processing = true
      axios.put( t.$root.endpoint + '/project', t.data).then((res) => {
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
      data:{}
    }
  }
}
</script>
