<template>
  <div class="columns is-centered has-text-centered photo photo2">
    <div class="column is-4-desktop is-3-widescreen">
      <div class="content main-box has-background-white slideIn">
        <form class="form">
          <h1>Esperá un momento</h1>
          <p>Estamos validando cuenta en <strong>Projective</strong></p>
          <p>Por favor, esperá a ser redirigido...</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import snackbar from './Snackbar'
export default {
  name: 'validate',
  mounted: function(){
    var t = this
    if(!t.$route.params.code){
      return t.$router.params.push('/')
    }
    setTimeout(() => {
      this.$store
        .dispatch("validate", t.$route.params.code)
        .then(() => this.$router.push("/projects"))
        .catch(err => console.log(err))
    },5000)
  },
  data () {
    return {
      code: null
    }
  }
}
</script>
