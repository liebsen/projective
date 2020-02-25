<template>

  <div class="columns has-text-centered photo photo4">
    <div class="column">
      <div class="main-box content slideIn">
        <h1>Solo un paso más</h1>
        <h4>Revisá tu correo para completar el registro.</h4>

        <p>Te enviamos un email con un link para actives tu cuenta. Esperamos que tengas una excelente experiencia y resultados.</p>
        <p>
          <span>Bienvenido a Projective.</span>
        </p>
        <router-link class="button is-info is-large is-success" to="/login" v-if="!$root.isLoggedIn">
          <span>Iniciar sesión</span>  
        </router-link>
        <!--router-link class="button is-info is-large is-info" to="/register" v-if="!$root.isLoggedIn">
          <span>Crear cuenta</span>  
        </router-link-->
        <router-link class="button is-success is-large" to="/projects" v-if="$root.isLoggedIn">
          <span>Mis proyectos</span>  
        </router-link>
      </div>
    </div>
  </div>    
</template>

<script>

export default {
  name: 'register-success',
  mounted: function(){
  },
  data () {
    return {
    }
  }
}
</script>
