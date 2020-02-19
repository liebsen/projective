<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Editar tarea <span v-html="data.tasks.title"></span></h1>
          <p>Ingresá los datos de esta tarea</p>
          <div class="field">
            <div class="control">
              <input class="input" v-model="data.tasks.title" type="text" placeholder="Título de la tarea">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <datepicker input-class="input" v-model="extra.due_date" name="due_date"></datepicker>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <vue-slider v-model="extra.progress" /></vue-slider>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" v-model="extra.link" type="text" placeholder="Link de la tarea">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea v-model="extra.text" class="textarea" placeholder="" required></textarea>
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
    this.$root.loading = true
    if(!this.$route.params.id){
      this.$root.false = true
      return snackbar('error',"No preference param.")
    }
    axios.get( this.$root.endpoint + '/task/' + this.$route.params.id, {}).then((res) => {
      this.$root.loading = false
      this.data = res.data
      this.extra = res.data.tasks.extra||{}
      this.empty = res.data.tasks == undefined
      //setTimeout(function(){ t.$root.convertDates() },100)      
    }).catch(err => {
      this.$root.loading = false
      if(err){
       snackbar('error',"Error " + err)
      }
    })
  },
  methods: {
    submit : function(){
      this.$root.processing = true
      axios.post( this.$root.endpoint + '/task/' + this.$route.params.id, {
        title: this.data.tasks.title,
        extra: this.extra
      }).then((res) => {
        this.data = res.data
        this.$root.processing = false
        snackbar('success','Editaste una tarea')
        this.$router.push('/tasks/' + this.$route.params.id)
      }).catch(err => {
        this.$root.processing = false
        if(err){
         snackbar('error',"Hubo un Error al solicitar datos: " + err,30000)
        }
      })
    }
  },
  data () {
    return {
      data:{ tasks: {}},
      extra:{}
    }
  }
}
</script>
