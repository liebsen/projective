<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content is-flex-column is-vertical">
        <h2>
          <span class="icon">
            <span class="fas fa-ticket-alt"></span>
          </span> 
          <span>La creación de tu cuenta <em>FletsApp</em> ha sido un éxito!</span>
        </h2>
        <h4>Ahora revisa tu correo para poder operar en <em>FletsPanel</em>.</h4>

        <p>Te enviamos un email con un link para actives tu cuenta y puedas empezar a operar con <em>FletsApp</em></p>
        
        <p>Esperamos que tengas una excelente experiencia y resultados</p>        

        <p>¡Bienvenido a <em>FletsApp</em>!</p>        

        <p></p>
        <p>Algunas acciones que puedes tomar a partir de aquí:</p>
        <ul>
        <li>Inicia sesión en <router-link to="/login">FletsPanel</router-link>.</li>
        <li>Comienza hoy a usar FletsApp. <router-link to="/register">Crear una cuenta</router-link>.</li>
        </ul>
      </div>
    </div>
  </section>
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
