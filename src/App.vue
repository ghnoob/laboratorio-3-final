<template>
  <div class="content">
    <div v-if="isLoggedIn">
      <header>
        <p class="username">{{ username }}</p>
      </header>
      <nav id="nav">
        <router-link :to="{ name: 'Home' }">Home</router-link> |
        <router-link :to="{ name: 'Transactions' }">Transacciones</router-link> |
        <router-link :to="{ name: 'Login' }">Cerrar sesión</router-link>
      </nav>
    </div>
    <nav id="nav" v-else-if="$route.name !== 'Login'">
      <router-link :to="{ name: 'Login' }">Iniciar sesión</router-link>
    </nav>
    <router-view/>
  </div>
  <footer>
    <p>Laboratorio de Computación III - Rodrigo Pietnechuk - Trabajo Final</p>
  </footer>
</template>

<script>
export default {
  computed: {
    username() {
      return this.$store.state.username;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
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
</style>
