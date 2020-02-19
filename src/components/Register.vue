<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white">
        <form v-show="!codeChecked" class="form has-text-centered slideIn" @submit.prevent="validate">
          <h1>Empezá hoy con Projective</h1>
          <p>Ingresá tu cupón de invitación</p>
          <div class="field">
            <div class="control">
              <input v-model="data.code" class="input" type="text" placeholder="Código de invitación" required autofocus>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Validar cupón</button>
            </div>
          </div>  
        </form>

        <form v-show="codeChecked" class="form has-text-centered slideIn" @submit.prevent="submit">
          <h1>Ingresá tus datos</h1>
          <p>Te enviaremos un correo para que valides tu cuenta.</p>
          <div class="field">
            <div class="control">
              <input v-model="data.name" class="input is-success" type="text" placeholder="¿Cómo te llamas?" required autofocus>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input v-model="data.password" class="input is-danger" type="password" placeholder="Contraseña" required>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" v-model="acceptTerms">
                Acepto los <router-link to="/terminos">Términos y condiciones</router-link>
              </label>
            </div>
          </div>
          <div class="field">
            <div class="control has-text-centered">
              <button type="submit" class="button is-link is-medium" :class="{'is-loading' : $root.processing}">Empezar a usar Projective</button>
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
  name: 'register',
  methods: {
    validate: function(){
      var t = this
      t.$root.processing = true
      axios.post( t.$root.endpoint + '/account/validate_code', t.data).then((res) => {
        t.$root.processing = false
        t.codeChecked = t.data
        snackbar('success',"Código verificado exitosamente. Ahora podés registrarte.",5000)
      }).catch(err => {
        t.$root.processing = false
        if(err){
          t.codeChecked = false
          if(err.response.status === 404){
            snackbar('error',"Error. El Código <em>" + t.data.code + "</em> es inválido. Probá con otro código.",30000)
          } else if(err.response.status === 500){
            snackbar('error',"Hubo un error al verificar código.")
          }
        }
      })
    },
    submit: function() {
      var t = this
      if(!t.acceptTerms)
        return snackbar('error',"Tenés que aceptar nuestros términos y condiciones para crear una cuenta") 
      t.$root.processing = true
      this.$store
        .dispatch("register", t.data)
        .then(() => this.$router.push("/register-success"))
        .catch(err => console.log(err));
    }
  },
  data() {
    return {
      acceptTerms: false,
      codeChecked: false,
      data: {
        code: this.$route.params.code
      }
    };
  },
}
</script>