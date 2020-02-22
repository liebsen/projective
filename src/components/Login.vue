<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form" @submit.prevent="submit">
          <h1>Iniciar Sesión</h1>
          <p>Ingresá tus datos para iniciar sesión</p>
          <div class="field">
            <div class="control">
              <input v-model="data.email" class="input" type="text" placeholder="mariano@projective.app" required>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input v-model="data.password" class="input" type="password" placeholder="********" required>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link" :class="{'is-loading' : $root.processing}">Iniciar sesión</button>
            </div>
          </div>  
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import snackbar from './Snackbar'
export default {
  name: 'login',
  methods: {
    submit : function(){
      let email = this.data.email
      let password = this.data.password
      let t = this
      this.$root.processing = true
      this.$store
        .dispatch("login", { email, password })
        .then(res => {
          snackbar('success',`${res.data.user.name}, qué bueno tenerte de nuevo por acá!`)
          t.$socket.emit('login', res.data.user._id)
          t.$root.processing = false
          setTimeout(() => {
            t.$router.push("/projects")
          },500)
        })
        .catch(err => {
          this.$root.processing = false
          if(err.response){
            if(err.response.status === 404){
              snackbar('error',"El nombre de usuario no existe")
            } else if(err.response.status === 401){
              snackbar('error',"La constraseña es incorrecta")
            }
          }
        });
    }
  },
  data () {
    return {
      data:{}
    }
  }
}
</script>
