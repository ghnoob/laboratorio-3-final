<template>
  <div class="home">
    <h1>Inicio</h1>
    <h2>¿Qué desea hacer?</h2>
    <nav>
      <router-link class="link" :to="{ name: 'Buy' }">Comprar criptomonedas</router-link>
      <router-link class="link" :to="{ name: 'Sell' }">Vender criptomonedas</router-link>
      <router-link class="link" :to="{ name: 'Transactions' }">
        Ver, modificar y eliminar las transacciones realizadas
      </router-link>
      <router-link :to="{ name: 'Wallet' }">Consultar los fondos disponibles</router-link>
      <router-link :to="{ name: 'Results' }">
        Consultar los resultados de las inversiones
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.link {
  padding: 0.3em;
}
a {
  color: #2c3e50;
}
a:visited {
  color: #2c3e50;
}
a:hover {
  color: black;
}
a:active {
  color: #2c3e50;
}

</style>
