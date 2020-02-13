<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form has-text-left fadeIn" @submit.prevent="submit">
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
            <div class="control">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Iniciar sesión</button>
            </div>
          </div>  
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    submit : function(){
      let email = this.data.email;
      let password = this.data.password;
      this.$root.processing = true
      this.$store
        .dispatch("login", { email, password })
        .then(() => {
          this.$root.snackbar('success',"Sesión iniciada correctamente. Redirigiendo...")
          this.$root.processing = false
          setTimeout(() => {
            this.$router.push("/panel")
          },3000)
        })
        .catch(err => {
          this.$root.processing = false
          if(err.response){
            if(err.response.status === 404){
              this.$root.snackbar('error',"Ese nombre de usuario no existe")
            } else if(err.response.status === 401){
              this.$root.snackbar('error',"La constraseña es incorrecta")
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
