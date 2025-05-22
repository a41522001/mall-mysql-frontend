<template>
  <v-carousel show-arrows="hover" continuous cycle :height="height">
    <v-carousel-item v-for="img in imgList"
      :src="img"
      cover
    ></v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Apple from '@/../public/image/Apple.png'
import Banana from '@/../public/image/Banana.png'
import Cherry from '@/../public/image/Cherry.png'
import Fish from '@/../public/image/Fish.png'
import Strawberry from '@/../public/image/Strawberry.png'
import { useDisplay } from 'vuetify';
const { mobile, lgAndDown } = useDisplay();
const imgList = reactive([Apple, Banana, Cherry, Fish, Strawberry]);
const height = computed(() => lgAndDown.value ? '300' : '600');
</script>

<style scoped lang="scss">
  
</style>