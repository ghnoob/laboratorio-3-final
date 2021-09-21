<template>
  <div class="d-flex flex-column min-vh-100">
    <div
      class="d-flex flex-column flex-grow-1 main-content"
      :class="{ 'justify-content-center' : inLoginRoute }"
    >
      <header class="position-sticky top-0">
        <div v-if="isLoggedIn">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
              <div class="nav-item dropdown navbar-brand">
                <a
                  class="nav-link dropdown-toggle text-dark"
                  href="#" id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <font-awesome-icon icon="user" />{{ username }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'Login' }">
                      Cerrar Sesión
                    </router-link>
                  </li>
                </ul>
              </div>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <router-link class="nav-link" aria-current="page" :to="{ name: 'Home' }">
                      Inicio
                    </router-link>
                  </li>
                  <li class="nav-item dropdown">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#" id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Transacciones
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li>
                        <router-link class="dropdown-item" :to="{ name: 'Transactions' }">
                          Ver, modificar y eliminar
                        </router-link>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <router-link class="dropdown-item" :to="{ name: 'Buy' }">
                          Comprar
                        </router-link>
                      </li>
                      <li>
                        <router-link class="dropdown-item" :to="{ name: 'Sell' }">
                          Vender
                        </router-link>
                      </li>
                    </ul>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'Wallet' }">Cartera</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'Results' }">Resultados</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <nav v-else-if="!inLoginRoute" class="navbar navbar-light bg-light">
          <router-link class="nav-link" :to="{ name: 'Login' }">Iniciar sesión</router-link>
        </nav>
      </header>
      <main>
        <router-view/>
      </main>
    </div>
    <footer class="footer mt-auto py-3 bg-light text-center">
      <p>Laboratorio de Computación III - Rodrigo Pietnechuk - Trabajo Final</p>
    </footer>
  </div>
</template>

<script>
import exchangeServices from './services/exchangeServices';
import apiServices from './services/apiServices';

export default {
  mounted() {
    this.loadPrices();
    const username = sessionStorage.getItem('username');
    if (username) {
      this.$store.commit('setUsername', username);
      this.pullTransactions();
    }
  },
  methods: {
    async loadPrices() {
      try {
        this.$toast.show('Cargando precios...', { duration: false });
        const prices = await exchangeServices.getPrices();
        this.$store.commit('setPrices', prices);
        this.$toast.clear();
        this.$toast.success('Precios cargados');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },
    async pullTransactions() {
      try {
        this.$toast.show('Cargando...', { duration: false });
        const response = await apiServices.getTransactions(this.username);
        this.$store.commit('setTransactions', response.data);
        this.$toast.clear();
        this.$toast.success('Datos cargados');
      } catch (error) {
        this.$toast.clear();
        this.$toast.error(error.toString());
      }
    },
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    transactions() {
      return this.$store.state.transactions;
    },
    isLoggedIn() {
      return Boolean(this.username);
    },
    inLoginRoute() {
      return this.$route.name === 'Login';
    },
  },
  watch: {
    username(value) {
      if (value) {
        this.pullTransactions();
      }
    },
  },
};
</script>

<style>
a.router-link-exact-active {
  color: #000000 !important;
}

.footer {
  font-size: x-small;
}

@media screen and (min-width: 480px) {
  .footer {
    font-size: small;
  }
}

  @media screen and (min-width: 600px) {
  .footer {
    font-size: medium;
  }
}
</style>
