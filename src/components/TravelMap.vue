<template>
  <v-container class="py-12" id="nossa-historia">
    <div class="text-center mb-10">
      <h2 class="text-h3 font-weight-regular mb-4" style="font-family: 'Playfair Display', serif !important;">Nossa História pelo Mundo</h2>
      <p class="text-body-1 text-grey-darken-1">
        Clique nos marcadores para ver um pouco das nossas aventuras antes do "Sim".
      </p>
    </div>
    
    <v-card elevation="4" class="map-card overflow-hidden rounded-xl">
      <div id="travel-map" class="map-container"></div>
    </v-card>

    <!-- Location Photos Dialog -->
    <v-dialog v-model="dialog" max-width="800">
      <v-card class="rounded-xl overflow-hidden bg-black">
        <div class="d-flex justify-space-between align-center pa-4 position-absolute w-100" style="z-index: 10; background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);">
          <h3 class="text-h5 text-white font-weight-regular mb-0" style="font-family: 'Playfair Display', serif !important; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
            {{ selectedLocation?.name }}
          </h3>
          <v-btn icon="mdi-close" variant="text" color="white" @click="dialog = false"></v-btn>
        </div>
        
        <v-carousel
          v-if="selectedLocation && selectedLocation.photos.length > 0"
          height="500"
          hide-delimiter-background
          show-arrows="hover"
          theme="dark"
        >
          <v-carousel-item
            v-for="(photo, i) in selectedLocation.photos"
            :key="i"
            :src="photo"
            cover
          ></v-carousel-item>
        </v-carousel>

        <v-card-text class="pa-6 bg-white text-center">
          <p class="text-body-1 text-grey-darken-2 mb-0">
            {{ selectedLocation?.text }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, ref } from 'vue'
import L from 'leaflet'

interface Location {
  name: string
  coords: [number, number]
  photos: string[]
  text: string
}

// Fix for default Leaflet icon paths in Vite
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

const customIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = customIcon

const map = shallowRef<L.Map | null>(null)
const dialog = ref(false)
const selectedLocation = ref<Location | null>(null)

const locations: Location[] = [
  { 
    name: 'Luxemburgo', 
    coords: [49.8153, 6.1296], 
    photos: [
      'https://images.unsplash.com/photo-1579203673539-74d6185dd47e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605051877636-697ee3a44d06?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Um de nossos primeiros destinos juntos!' 
  },
  { 
    name: 'Brasil', 
    coords: [-14.2350, -51.9253], 
    photos: [
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Nossa casa, onde tudo começou.' 
  },
  { 
    name: 'Alemanha', 
    coords: [51.1657, 10.4515], 
    photos: [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Muitas cervejas e salsichas.' 
  },
  { 
    name: 'França', 
    coords: [46.2276, 2.2137], 
    photos: [
      'https://images.unsplash.com/photo-1502602898657-3e9076113846?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Amor à primeira vista em Paris.' 
  },
  { 
    name: 'Bélgica', 
    coords: [50.5039, 4.4699], 
    photos: [
      'https://images.unsplash.com/photo-1549301019-354ec32b8eb9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Chocolates inesquecíveis.' 
  },
  { 
    name: 'Filipinas', 
    coords: [12.8797, 121.7740], 
    photos: [
      'https://images.unsplash.com/photo-1518509562904-a71b120f592c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Praias paradisíacas e muita paz.' 
  },
  { 
    name: 'Japão', 
    coords: [36.2048, 138.2529], 
    photos: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80'
    ], 
    text: 'Cultura incrível e comidas deliciosas.' 
  },
]

const openLocationModal = (loc: Location) => {
  selectedLocation.value = loc
  dialog.value = true
}

onMounted(() => {
  // Initialize map centered roughly to show Europe and some of Asia/Americas
  map.value = L.map('travel-map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxBounds: [
      [-90, -180],
      [90, 180]
    ],
    maxBoundsViscosity: 1.0
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value as L.Map)

  locations.forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map.value as L.Map)
    
    // Bind tooltip for hover label
    marker.bindTooltip(loc.name, {
      direction: 'top',
      offset: [0, -30]
    })
    
    // Open dialog on click instead of standard popup
    marker.on('click', () => {
      openLocationModal(loc)
    })
  })
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.map-card {
  border: 1px solid rgba(0,0,0,0.05);
}

.map-container {
  height: 500px;
  width: 100%;
  z-index: 1; /* Keep map below Vuetify dialogs/overlays */
}

@media (max-width: 600px) {
  .map-container {
    height: 400px;
  }
  
  :deep(.v-carousel) {
    height: 300px !important;
  }
}
</style>
