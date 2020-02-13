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
              <input v-model="data.email" class="input is-success" type="email" placeholder="Email" required>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input v-model="data.email2" class="input is-success" type="email" placeholder="Confirmar Email" required>
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
export default {
  name: 'register',
  data() {
    return {
      acceptTerms: false,
      codeChecked: false,
      data: {}
    };
  },
  methods: {
    validate: function(){
      var t = this
      t.$root.processing = true
      axios.post( t.$root.endpoint + '/account/validate_code', t.data).then((res) => {
        t.$root.processing = false
        t.codeChecked = t.data
        t.$root.snackbar('success',"Código verificado exitosamente. Ahora podés registrarte.",15000)
        document.querySelectorAll('.is-step').forEach(e => {
          e.style.display = 'none'
        })
        document.querySelector('.is-step-data').style.display = 'block'
      }).catch(err => {
        t.$root.processing = false
        if(err){
          t.codeChecked = false
          if(err.response.status === 403){
            t.$root.snackbar('error',"Error. El email <em>" + t.data.email + "</em> ya se encuentra registrado. Probá con otro email.",30000)
          } else if(err.response.status === 404){
            t.$root.snackbar('error',"Error. El Código <em>" + t.data.code + "</em> es inválido. Probá con otro código.",30000)
          } else if(err.response.status === 500){
            t.$root.snackbar('error',"Hubo un error al verificar código.")
          }
        }
      })
    },
    submit: function() {
      var t = this
      if(t.data.email != t.data.email2)
        return t.$root.snackbar('error',"El email y su confirmación deben coincidir.")
      if(!t.acceptTerms)
        return t.$root.snackbar('error',"Debes aceptar nuestros términos y condiciones para crear una cuenta") 
      t.$root.processing = false
      delete t.data.email2 
      this.$store
        .dispatch("register", t.data)
        .then(() => this.$router.push("/register-success"))
        .catch(err => console.log(err));
    }
  }
}
</script>

<style>
  
  .is-step {
    display: none;
  }

  .is-step:nth-child(1){
    display: block;
  }

</style>