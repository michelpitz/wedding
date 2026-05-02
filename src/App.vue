<template>
  <v-app>
    <v-app-bar :elevation="isScrolled ? 2 : 0" :color="isScrolled ? 'white' : 'transparent'" fixed>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="font-weight-bold" :class="isScrolled ? 'text-primary' : 'text-white'" style="font-family: 'Playfair Display', serif !important;">
          Michel & Carolina
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <div class="d-none d-sm-flex">
          <v-btn :color="isScrolled ? 'grey-darken-3' : 'white'" variant="text" @click="scrollTo('nossa-historia')">Nossa História</v-btn>
          <v-btn :color="isScrolled ? 'grey-darken-3' : 'white'" variant="text" @click="scrollTo('presentes')">Presentes</v-btn>
        </div>
        <v-app-bar-nav-icon class="d-flex d-sm-none" :color="isScrolled ? 'grey-darken-3' : 'white'" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list>
        <v-list-item @click="scrollTo('nossa-historia'); drawer = false">
          <v-list-item-title>Nossa História</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollTo('presentes'); drawer = false">
          <v-list-item-title>Presentes</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="padding-top: 0px !important;">
      <Hero />
      <div class="bg-surface-variant pt-8 pb-16">
        <TravelMap />
      </div>
      <div class="bg-white pt-8 pb-16">
        <GiftList />
      </div>
    </v-main>

    <v-footer color="primary" class="text-center d-flex flex-column py-6">
      <div class="text-white mb-2" style="font-family: 'Playfair Display', serif !important; font-size: 1.5rem;">
        Michel & Carolina
      </div>
      <div class="text-white text-caption">
        &copy; {{ new Date().getFullYear() }} - Esperamos você no nosso grande dia!
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Hero from './components/Hero.vue'
import TravelMap from './components/TravelMap.vue'
import GiftList from './components/GiftList.vue'

const drawer = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
</style>
