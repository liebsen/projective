<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container content is-flex-column is-vertical">
        <h2>
          <span class="icon">
            <span class="fas fa-info-circle"></span>
          </span> 
          <span>Acerca de <em>Projective</em></span>
        </h2>
        <h4>Ofrecemos servicios de planificación y seguimiento de proyectos digitales</h4>

        <br><br> 
        <p><em>Projective</em> agiliza y acelera los tiempos de desarrollo de tus proyectos</p>

        <p>Gracias a nuestros esquemas simplificados podés contar con el seguimiento preciso y concreto de cada uno de tus proyectos digitales.</p>        

        <p>Registrate usando tu código de invitación y agregá a los integrantes de tu proyecto a participar de esta plataforma colaborativa gratuita para empezar a disfrutar de Projective y agregar valor a tus proyectos digitales.</p>

        <br><br> 
        <p>Algunas acciones que puedes tomar a partir de aquí:</p>
        <ul>
        <li>Volver a <router-link to="/">inicio</router-link>.</li>
        <li>Comienza hoy a usar Projective. <router-link to="/register">Comenzar</router-link>.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'about',
  mounted: function(){
  },
  data () {
    return {
    }
  }
}
</script>
