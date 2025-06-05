<template>
  <v-carousel v-if="productList.length > 0" show-arrows="hover" continuous cycle>
    <v-carousel-item v-for="product in productList"
      :key="product.id"
      :src="product.image"
      aspect-ratio="4/3"
      cover
    ></v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import type { Product } from '@/types/interface';
interface Props {
  products: Product[];
}
const props = defineProps<Props>();
const productList = computed((): Product[] => {
  return props.products.slice(0, 5);
})
const { mobile, lgAndDown } = useDisplay();
const height = computed(() => lgAndDown.value ? '300' : '600');
</script>

<style scoped lang="scss">
  
</style>