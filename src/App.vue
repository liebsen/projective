<template>
  <div>
    <svg v-show="$root.loading" class="spinner-container" viewBox="0 0 44 44">
        <circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4"></circle>
    </svg>
  
    <div class="menu hidden-loading slideDown">
      <div class="menu-container columns is-vcentered is-mobile">

        <router-link v-if="$root.isLoggedIn" class="header-logo" to="/projects">
          <img src="/static/img/p.png" >
        </router-link>

        <router-link class="header-logo" to="/" v-else>
          <img src="/static/img/p.png" >
        </router-link>

        <div class="column menu-secondary has-text-centered">
          <div class="section-tag-container">
            <div class="section-tag columns is-mobile reset-margin">
              <div class="column has-text-right">
                <img class="icon">
              </div>
              <div class="column fadeIn">
                <h3 class="title has-text-left"></h3>
              </div>
            </div>
          </div>
        </div>

        <div class="column menu-primary">
          <div class="menu-bg"></div>
          <div class="menu-burger">
            <svg viewBox="0 0 800 600">
              <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
              <path d="M300,320 L540,320" id="middle"></path>
              <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318)"></path>
            </svg>
          </div>
        </div>        
      </div>

      <div class="menu-items">
        <div>
          <router-link class="has-text-centered" to="/">
            <img src="/static/img/p.png">
          </router-link>

          <div class="menu-links has-text-left">
            <!--router-link to="/terminos">
              <span class="icon">
                <span class="fas fa-balance-scale"></span>
              </span> 
              <span>Términos y condiciones</span>
            </router-link-->

            <router-link to="/about">
              <span class="icon">
                <span class="fas fa-info-circle"></span>
              </span> 
              <span>Acerca de <strong>Projective</strong></span>
            </router-link>

            <router-link to="/settings" v-if="$root.isLoggedIn">
              <span class="icon">
                <span class="fas fa-cog"></span>
              </span> 
              <span>Configuración</span>
            </router-link>

            <router-link to="/login" v-else>
              <span class="icon">
                <span class="fas fa-sign-in-alt"></span>
              </span> 
              <span>Iniciar sesión</span>
            </router-link>

            <router-link to="/register" v-if="!$root.isLoggedIn">
              <span class="icon">
                <span class="fas fa-ticket-alt"></span>
              </span> 
              <span>Cupón de invitación</span>
            </router-link>

            <router-link to="/contacto">
              <span class="icon">
                <span class="fas fa-envelope"></span>
              </span> 
              <span>Contacto</span>
            </router-link>

            <a href="#" @click="logout" v-if="$root.isLoggedIn">
              <span class="icon">
                <span class="fas fa-sign-out-alt"></span>
              </span> 
              <span>Cerrar sesión</span>
            </a>

            <hr v-if="$root.isLoggedIn">
    
            <div class="has-text-centered" v-if="$root.isLoggedIn">
              <router-link class="button is-white is-medium is-outlined" to="/projects">
                <!--span class="icon">
                  <span class="fas fa-chart-bar"></span>
                </span--> 
                <span>Mis proyectos</span>            
              </router-link>
            </div>
          </div>
        </div>
      </div>    
    </div>
    
    <keep-alive v-show="!$root.loading" include="contacto">
      <router-view :key="$route.fullPath" />
    </keep-alive>

    <div class="tosprompt">
      <div class="notification">
        <div class="is-pulled-right">
          <a href="#" @click="$root.tosAgree(this)">
            <span class="icon">
              <span class="fa fa-times"></span>
            </span>
          </a>
        </div>
        <p>
          <span class="has-text-black">
            <span class="fa fa-unlock-alt"></span>&nbsp; 
            <span>Aviso de Privacidad</span>
          </span>
          <span> no compartimos tus datos personales con otros.</span> 
          <a href="https://projective.herokuapp.com/privacidad" target="_blank">Leer más</a>
        </p>
      </div>
    </div>

    <div class="legal-footer has-text-centered">
      <span>©️ 2020 Projective | </span>
      <span v-if="$root.isLoggedIn"><a @click="logout">Cerrar sesión</a></span>
      <span v-else><router-link to="/login">Iniciar sesión</router-link></span>
    </div>

    <div class="ui-snackbar ui-snackbar--is-inactive">
      <p class="ui-snackbar__message"></p>
    </div>

  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'app',
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
}
</script>
