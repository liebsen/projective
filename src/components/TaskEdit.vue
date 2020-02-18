<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Editar tarea <span v-html="data.tasks.title"></span></h1>
          <p>Ingresá los datos de esta tarea</p>
          <div class="field">
            <div class="control">
              <datepicker input-class="input" v-model="update.due_date" name="due_date"></datepicker>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <vue-slider v-model="update.progress" /></vue-slider>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" v-model="update.link" type="text" placeholder="Link de la tarea">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea v-model="update.text" class="textarea" placeholder="" required></textarea>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Actualizar tarea</button>
            </div>
          </div>  
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Datepicker from 'vuejs-datepicker'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import snackbar from './Snackbar'
export default {
  name: 'tasks_edit',
  components: {
    Datepicker,
    VueSlider
  },
  mounted: function(){
    var t = this
    t.$root.loading = true
    if(!t.$route.params.id){
      t.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( t.$root.endpoint + '/task/' + t.$route.params.id, {}).then((res) => {
      t.$root.loading = false
      t.data = res.data
      t.update = res.data.tasks.extra||{}
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
    submit : function(){
      let t = this
      t.$root.processing = true
      axios.post( t.$root.endpoint + '/task/' + t.$route.params.id, t.update).then((res) => {
        t.data = res.data
        t.$root.processing = false
        snackbar('success','Editaste tarea ' + t.data.title)
        t.$router.push('/tasks/' + t.$route.params.id)
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
      data:{ tasks: {}},
      update:{}
    }
  }
}
</script>
