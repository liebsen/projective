<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content is-flex-column is-vertical">
        <h2>
          <span class="icon">
            <span class="fas fa-info-circle"></span>
          </span> 
          <span>Validando cuenta en <em>FletsApp</em>...</span>
        </h2>
        <h4>Estamos validando tu cuenta en <em>FletsApp</em>.</h4>

        <p></p>
        <p>Por favor espera a ser redirigido...</p>
      </div>
    </div>
  </section>
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
    snackbar('success',"Validando cuenta. Por favor espere a ser redirigido...",30000)
    t.$root.loading = true
    this.$store
      .dispatch("validate", t.$route.params.code)
      .then(() => this.$router.push("/projects"))
      .catch(err => console.log(err));
  },
  data () {
    return {
      code: null
    }
  }
}
</script>
