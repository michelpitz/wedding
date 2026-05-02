<template>
  <v-container fluid class="hero-container pa-0">
    <v-img
      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
      cover
      class="hero-image d-flex align-center justify-center text-center"
      gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.7)"
    >
      <div class="text-white px-4">
        <h1 class="text-h3 text-sm-h2 font-weight-regular mb-4 font-italic" style="font-family: 'Playfair Display', serif !important;">
          Carolina Lopes Monteiro <br>&amp;<br> Michel Petry Pitz
        </h1>
        <p class="text-h6 text-sm-h5 font-weight-light mb-6">
          03 de Julho de 2026, às 3:15pm. Ville d'Esch-sur-Alzette, Luxemburgo
        </p>
        <p class="text-subtitle-1 text-sm-h6 font-weight-light max-w-600 mx-auto">
          Convidamos você para celebrar conosco a união de nossas vidas.
        </p>
      </div>
    </v-img>
  </v-container>
</template>

<script setup lang="ts">
// Hero component logic
</script>

<style scoped>
.hero-container {
  height: 100vh;
}
.hero-image {
  height: 100%;
  width: 100%;
}
.max-w-600 {
  max-width: 600px;
}
</style>
