<template>
  <v-container class="py-12" id="nossa-historia">
    <div class="text-center mb-10">
      <h2 class="text-h3 font-weight-regular mb-4" style="font-family: 'Playfair Display', serif !important;">Nossa Trajetória</h2>
      <p class="text-body-1 text-white">
        O ponto de partida foi o mesmo, mas foi do outro lado do oceano que nos reencontramos. Entre destinos, histórias e descobertas, começamos a escrever nossa jornada juntos. Clique nos marcadores para ver um pouco das nossas aventuras antes do "Sim".
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
        
        <div v-if="isLoading" class="d-flex justify-center align-center" style="height: 500px;">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>
        <v-carousel
          v-else-if="selectedLocation && selectedLocation.photos && selectedLocation.photos.length > 0"
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

        <!-- <v-card-text class="pa-6 bg-white text-center">
          <p class="text-body-1 text-grey-darken-2 mb-0">
            {{ selectedLocation?.text }}
          </p>
        </v-card-text> -->
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
const isLoading = ref(false)
const selectedLocation = ref<Location | null>(null)

const locations: Location[] = [
  { 
    name: 'Brasil', 
    coords: [-14.2350, -51.9253], 
    photos: [], 
    text: 'Nossa casa, onde tudo começou.' 
  },
  { 
    name: 'Alemanha', 
    coords: [51.1657, 10.4515], 
    photos: [], 
    text: 'Muitas cervejas e salsichas.' 
  },
  { 
    name: 'Luxemburgo', 
    coords: [49.8153, 6.1296], 
    photos: [], 
    text: 'Um de nossos primeiros destinos juntos!' 
  },
  { 
    name: 'França', 
    coords: [46.2276, 2.2137], 
    photos: [], 
    text: 'Amor à primeira vista em Paris.' 
  },
  { 
    name: 'Áustria', 
    coords: [47.5162, 14.5501], 
    photos: [], 
    text: 'Paisagens alpinas deslumbrantes.' 
  },
  { 
    name: 'Albânia', 
    coords: [41.1533, 20.1683], 
    photos: [], 
    text: 'Um paraíso escondido nos Bálcãs.' 
  },
  { 
    name: 'Filipinas', 
    coords: [12.8797, 121.7740], 
    photos: [], 
    text: 'Praias paradisíacas e muita paz.' 
  },
  { 
    name: 'Japão', 
    coords: [36.2048, 138.2529], 
    photos: [], 
    text: 'Cultura incrível e comidas deliciosas.' 
  },
  { 
    name: 'Finlândia', 
    coords: [61.9241, 25.7482], 
    photos: [], 
    text: 'A magia da neve e a aurora boreal.' 
  },
  { 
    name: 'Portugal', 
    coords: [39.3999, -8.2245], 
    photos: [], 
    text: 'Vinhos excelentes e muita história.' 
  },
  { 
    name: 'Itália', 
    coords: [41.8719, 12.5674], 
    photos: [], 
    text: 'Romance, massas e monumentos eternos.' 
  },
  { 
    name: 'Espanha', 
    coords: [40.4637, -3.7492], 
    photos: [], 
    text: 'Cultura vibrante e tapas inesquecíveis.' 
  },
  { 
    name: 'Suíça', 
    coords: [46.8182, 8.2275], 
    photos: [], 
    text: 'Montanhas, lagos e muito chocolate.' 
  }
]

const openLocationModal = async (loc: Location) => {
  selectedLocation.value = loc
  dialog.value = true
  
  isLoading.value = true
  try {
    // Chama a nossa Cloudflare Function (backend) que não sofre bloqueio de CORS
    const response = await fetch(`/api/photos?country=${encodeURIComponent(loc.name)}`)
    
    if (response.ok) {
      const urls = await response.json()
      if (Array.isArray(urls) && urls.length > 0) {
        loc.photos = urls
      } else {
        console.warn(`Nenhuma foto encontrada para o país: ${loc.name}`)
      }
    } else {
      const errorText = await response.text()
      console.error('Erro na API do Cloudflare:', response.status, errorText)
    }
  } catch (e) {
    console.error('Erro de rede ao buscar fotos:', e)
  } finally {
    isLoading.value = false
  }
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
