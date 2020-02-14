<template>
  <div class="columns has-text-centered photo photo1">
    <div class="column">
      <div class="main-box content slideIn">
        <h1>Hola, somos Projective</h1>
        <p>
          <span>Creá proyectos y seguilos junto a tu equipo</span>
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
    name: 'landing'
  }

</script>
