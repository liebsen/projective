<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Nuevas cuestiones para <span v-html="data.title"></span></h1>
          <p>Ingresá la cuestión para este objetivo</p>
          <div class="field">
            <div class="control">
              <textarea v-model="data.issue" class="textarea" placeholder="Hay una cuestión con este objetivo..." required></textarea>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Agregar cuestión</button>
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
  name: 'issues_create',
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.milestone_id){
      t.$root.false = true
      return t.$root.snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/milestone/' + t.$route.params.milestone_id, {}).then((res) => {
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
      axios.put( t.$root.endpoint + '/issues/' + t.$route.params.milestone_id, t.data).then((res) => {
        t.data = res.data
        t.$root.processing = false
        t.$root.snackbar('success','Agregaste una cuestión para ' + t.data.title)
        t.$router.push('/milestones/' + t.$route.params.milestone_id)
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
