<template>
  <v-container class="py-16" id="presentes">
    <div class="text-center mb-12">
      <h2 class="text-h3 font-weight-regular mb-6" style="font-family: 'Playfair Display', serif !important;">Lista de Presentes</h2>
      <p class="text-body-1 text-grey-darken-1 max-w-800 mx-auto">
        Para quem desejar contribuir com este novo capítulo, preparamos com carinho uma lista de presentes que nos ajudará a montar nosso primeiro lar.
      </p>
    </div>

    <v-row>
      <v-col v-for="gift in gifts" :key="gift.id" cols="12" sm="6" md="4">
        <v-card class="h-100 d-flex flex-column rounded-xl" elevation="2">
          <v-card-item class="pt-6">
            <v-card-title class="text-h6 font-weight-regular">{{ gift.title }}</v-card-title>
            <v-card-subtitle v-if="gift.amount === 0" class="text-primary font-weight-bold mt-1"> {{ gift.description }}</v-card-subtitle>
            <v-card-subtitle v-else class="text-primary font-weight-bold mt-1 text-h6">€ {{ gift.amount.toFixed(2).replace('.', ',') }} (R$ {{ Math.round(gift.amount * 5.85) }})</v-card-subtitle>
          </v-card-item>
          
          
          <v-card-actions class="pa-4 pt-0">
            <v-btn
              color="primary"
              variant="flat"
              block
              rounded="pill"
              @click="openPixModal(gift)"
            >
              Presentear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Dialog -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card class="rounded-xl pa-4">
        <div class="d-flex justify-end">
          <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
        </div>
        
        <v-card-text class="pt-0 text-center">
          <h3 class="text-h5 font-weight-regular mb-2" style="font-family: 'Playfair Display', serif !important;">
            Obrigado pelo carinho!
          </h3>
          <p class="mb-8 text-grey-darken-1">
            Você escolheu: <strong>{{ selectedGift?.title }}</strong> no valor de € {{ selectedGift?.amount.toFixed(2).replace('.', ',') }} (R$ {{ selectedGift ? Math.round(selectedGift.amount * 5.85) : '0' }}).
          </p>

          <v-row>
            <!-- Pix Section -->
            <v-col cols="12" md="6" class="d-flex flex-column align-center payment-col">
              <v-icon size="40" color="primary" class="mb-2">mdi-qrcode-scan</v-icon>
              <h4 class="text-h6 font-weight-regular mb-4">Pix (Brasil)</h4>
                    
              <div class="text-left w-100 mt-2 mb-6 text-body-2 text-grey-darken-2">
                <p class="mb-1"><strong>Banco:</strong> NUBANK</p>
                <p class="mb-1"><strong>Titular:</strong> Michel Petry Pitz</p>
                <p class="mb-1"><strong>Chave PIX:</strong> 067.153.749-02</p>

              </div>
              
              <div class="w-100 mt-auto">
                <p class="text-caption text-grey-darken-1 mb-1 text-left">Chave PIX:</p>
                <v-text-field
                  v-model="pixKey"
                  readonly
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi-content-copy"
                  @click:append-inner="copyKey(pixKey, 'Pix')"
                  hide-details
                ></v-text-field>
              </div>
            </v-col>

            <v-divider :vertical="$vuetify.display.mdAndUp" class="d-none d-md-block"></v-divider>
            <v-divider class="d-md-none my-6 w-100"></v-divider>

            <!-- IBAN Section -->
            <v-col cols="12" md="6" class="d-flex flex-column align-center payment-col">
              <v-icon size="40" color="primary" class="mb-2">mdi-bank</v-icon>
              <h4 class="text-h6 font-weight-regular mb-4">Transferência (Europa)</h4>
              
              <div class="text-left w-100 mt-2 mb-6 text-body-2 text-grey-darken-2">
                <p class="mb-1"><strong>Banco:</strong> BIL BANK</p>
                <p class="mb-1"><strong>Titular:</strong> Michel Petry Pitz</p>
                <p class="mb-1"><strong>BIC/SWIFT:</strong> BILLLULL</p>
              </div>
              
              <div class="w-100 mt-auto">
                <p class="text-caption text-grey-darken-1 mb-1 text-left">IBAN:</p>
                <v-text-field
                  v-model="ibanKey"
                  readonly
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi-content-copy"
                  @click:append-inner="copyKey(ibanKey, 'IBAN')"
                  hide-details
                ></v-text-field>
              </div>
            </v-col>
          </v-row>

          <v-snackbar v-model="snackbar" timeout="2000" color="success">
            {{ snackbarMessage }}
          </v-snackbar>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Gift {
  id: number
  title: string
  description: string
  amount: number
}

const gifts = ref<Gift[]>([
  {
    id: 1,
    title: 'Abajur alto',
    description: '',
    amount: 50
  },
  {
    id: 2,
    title: 'Travesseiros',
    description: '',
    amount: 70
  },
  {
    id: 3,
    title: 'Mesa sacada',
    description: '',
    amount: 80
  },
  {
    id: 4,
    title: 'Mesa de centro',
    description: '',
    amount: 90
  },
  {
    id: 5,
    title: 'Mesa de escritório',
    description: '',
    amount: 100
  },
  {
    id: 6,
    title: 'Sofá da sacada',
    description: '',
    amount: 100
  },
  {
    id: 7,
    title: 'Poltrona leitura',
    description: '',
    amount: 120
  },
  {
    id: 8,
    title: 'Roupa de cama de algodão egípcio',
    description: '',
    amount: 180
  },
  {
    id: 9,
    title: 'Tapete da sala',
    description: '',
    amount: 300
  },
  {
    id: 10,
    title: 'Cadeiras mesa de jantar',
    description: '',
    amount: 340
  },
  {
    id: 11,
    title: 'Cama',
    description: '',
    amount: 450
  },
  {
    id: 12,
    title: 'Colchão',
    description: '',
    amount: 480
  },
  {
    id: 13,
    title: 'Aspirador Dyson',
    description: '',
    amount: 800
  },
  {
    id: 14,
    title: 'Sofá',
    description: '',
    amount: 1000
  },
  {
    id: 15,
    title: 'TV',
    description: '',
    amount: 1000
  },  {
    id: 16,
    title: 'Presente livre',
    description: 'Contribuição casa nova e lual de mel.',
    amount: 0
  },
])

const dialog = ref(false)
const selectedGift = ref<Gift | null>(null)
const pixKey = ref('067.153.749-02')
const ibanKey = ref('LU51 0025 1835 9700 2400')
const snackbar = ref(false)
const snackbarMessage = ref('')

const openPixModal = (gift: Gift) => {
  selectedGift.value = gift
  dialog.value = true
}

const copyKey = async (key: string, type: string) => {
  try {
    await navigator.clipboard.writeText(key)
    snackbarMessage.value = `Chave ${type} copiada com sucesso!`
    snackbar.value = true
  } catch (err) {
    console.error('Failed to copy!', err)
  }
}
</script>

<style scoped>
.max-w-800 {
  max-width: 800px;
}
.payment-col {
  padding: 0 24px;
}
@media (max-width: 960px) {
  .payment-col {
    padding: 0 12px;
  }
}
</style>
