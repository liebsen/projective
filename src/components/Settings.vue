<template>
  <div>
    <div class="container has-actions content is-flex-column is-vertical">
      <div class="column">
        <h2>
          <span class="icon">
            <span class="fas fa-cog"></span>
          </span> 
          <span>Configuración</span>
        </h2>
        <h4>Indica cuales son tus preferencias</h4>
        <p>Por favor ingresa tus datos de preferencias para tus proyectos.</p>
      </div>
    </div>
    <div class="columns actions navbar is-fixed-bottom is-vbaseline has-text-centered">
      <div class="column has-text-centered">
         <button type="button" @click="submit" class="button is-link is-medium" :class="{'is-loading' : $root.loading}">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'settings'
}
</script>
