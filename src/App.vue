<template>
  <div class="content">
    <div v-if="username.length > 0">
      <header>
        <p class="username">{{ username }}</p>
      </header>
      <nav id="nav">
        <router-link class="link" :to="{ name: 'Home' }">Home</router-link> |
        <router-link class="link" :to="{ name: 'Transactions' }">Transacciones</router-link> |
        <router-link class="link" :to="{ name: 'Wallet' }">Cartera</router-link> |
        <router-link class="link" :to="{ name: 'Results' }">Resultados</router-link> |
        <router-link class="link" :to="{ name: 'Login' }">Cerrar sesión</router-link>
      </nav>
    </div>
    <nav id="nav" v-else-if="$route.name !== 'Login'">
      <router-link class="link" :to="{ name: 'Login' }">Iniciar sesión</router-link>
    </nav>
    <router-view/>
  </div>
  <footer>
    <p>Laboratorio de Computación III - Rodrigo Pietnechuk - Trabajo Final</p>
  </footer>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('setPrices');
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    transactions() {
      return this.$store.state.transactions;
    },
  },
  watch: {
    transactions() {
      this.$toast.clear();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

button {
  background:linear-gradient(to bottom, #77b55a 5%, #72b352 100%);
  background-color:#77b55a;
  border-radius:4px;
  border:1px solid #4b8f29;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:13px;
  font-weight:bold;
  padding:6px 12px;
  text-decoration:none;
  text-shadow:0px 1px 0px #5b8a3c;
  margin: 2px;
}
button:hover {
  background:linear-gradient(to bottom, #72b352 5%, #77b55a 100%);
  background-color:#72b352;
}
button:active {
  position:relative;
  top:1px;
}
button:disabled,
button[disabled]{
  border: 1px solid #999999;
  background: #cccccc;
  color: #666666;
  text-shadow: unset;
  cursor: not-allowed;
}
button:disabled:active,
button[disabled]:active {
  top: 0px;
}
.username {
  text-align: right;
}

table.green-table {
  border: 2px solid #24943a;
  background-color: #d4eed1;
  text-align: center;
  margin: auto;
  cursor: default;
}

table.green-table td,
table.green-table th {
  border: 1px solid #24943a;
  padding: 3px 2px;
}

table.green-table tbody td {
  font-size: 13px;
}

table.green-table thead {
  background: #24943a;
  background: -moz-linear-gradient(top, #5baf6b 0%, #3a9e4d 66%, #24943a 100%);
  background: -webkit-linear-gradient(
    top,
    #5baf6b 0%,
    #3a9e4d 66%,
    #24943a 100%
  );
  background: linear-gradient(to bottom, #5baf6b 0%, #3a9e4d 66%, #24943a 100%);
  border-bottom: 0px solid #444444;
}

table.green-table thead th {
  font-size: 19px;
  font-weight: bold;
  color: #f0f0f0;
  text-align: left;
  border-left: 2px solid #24943a;
}

table.green-table thead th:first-child {
  border-left: none;
}

table.green-table tfoot tr td {
  font-size: 13px;
  font-weight: bold;
}

table.green-table tfoot .links {
  text-align: right;
}

table.green-table tfoot .links a {
  display: inline-block;
  background: #ffffff;
  color: #24943a;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>
