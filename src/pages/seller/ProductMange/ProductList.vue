<template>
  <v-row>
    <template v-for="{ id, quantity, price, name, sellUserId, image } in productList" :key="id">
      <v-col sm="6" lg="4">
        <div class="bg-white rounded-lg">
          <v-img :src="Apple" width="100%" aspect-ratio="1/1" rounded="t-lg"/>
          <div class="pa-5">
            <h3 class="mb-3">{{ name }}</h3>
            <div>NT$ {{ formatNumberWithCommas(price) }}</div>
            <div class="d-flex mb-5">
              <span>庫存:</span>
              <span>{{ quantity }}</span>
              <span class="ms-auto">銷量:</span>
              <span>123</span>
            </div>
            <div class="d-flex ga-3">
              <v-btn class="flex-grow-1">編輯</v-btn>
              <v-btn class="flex-grow-1">下架</v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
  import Apple from '@/../public/image/Apple.png';
  import type { Product } from '@/types/interface';
  import { formatNumberWithCommas } from '@/utils/index';
  interface Props {
    productList: Product[]
  }
  const props = defineProps<Props>();
</script>