<template>
  <div class="columns has-text-centered photo photo6">
    <div class="column">
      <div class="main-box content slideIn">
        <h1>Revisá tu correo</h1>
        <h4>Te enviamos un email con un link para actives tu cuenta.</h4>
        <p>Esperamos que tengas una excelente experiencia y resultados.</p>
        <p>
          <strong>Bienvenido a Projective.</strong>
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
