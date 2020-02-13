<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content is-flex-column is-vertical">
        <h2>
          <span class="icon has-text-success">
            <span class="fas fa-check"></span>
          </span> 
          <span>Cuenta creada</span>
        </h2>
        <h4>Revisá tu correo para poder trabajar con <em>Projective</em>.</h4>

        <p>Te enviamos un email con un link para actives tu cuenta y puedas empezar a crear con  <em>Projective</em>. Esperamos que tengas una excelente experiencia y resultados</p>
        
        <p>¡Bienvenido a <em>Projective</em>!</p>        

        <p></p>
        <p>Algunas acciones que puedes tomar a partir de aquí:</p>
        <ul>
        <li>Andá a <router-link to="/">inicio</router-link>.</li>
        <li>Iniciá sesión en <router-link to="/login">Projective</router-link>.</li>
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
