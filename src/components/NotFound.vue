<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content is-flex-column is-vertical">
        <h1 class="title">
          <span>🔌 No se encontró la página</span>
        </h1>
        <h4>No pudimos encontrar lo que buscabas</h4>
        <p>Algunas acciones que podés tomar a partir de aquí:</p>
        <ul>        
        <li>Revisa la URL o andá a <router-link to="/">inicio</router-link>.</li>
        <li>Si creés que se trata de un error <router-link to="/contacto">contactanos</router-link>.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      msg: 'Welcome to JetsBooking'
    }
  }
}
</script>
