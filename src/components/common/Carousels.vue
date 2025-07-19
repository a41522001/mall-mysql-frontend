<template>
  <div v-if="productList.length > 0" ref="swiperRef" class="swiper">
    <div class="swiper-wrapper">
      <template v-for="product in productList" :key="product.id">
        <div class="swiper-slide">
          <img class="swiper-img" :src="product.image" />
        </div>
      </template>
    </div>
    <div ref="swiperPaginationRef" class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { Product } from "@/types/interface";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "swiper/scss";

interface Props {
  products: Product[];
}
const props = defineProps<Props>();
const productList = computed((): Product[] => {
  const products = [...props.products].reverse();
  return products.slice(0, 5);
});
const swiperRef = ref();
const swiperPaginationRef = ref();
watch(productList, (val) => {
  if (val.length > 0) {
    nextTick(() => {
      new Swiper(swiperRef.value, {
        modules: [Navigation, Pagination, Autoplay],
        autoplay: true,
        loop: true,
        pagination: {
          el: swiperPaginationRef.value,
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    });
  }
});
</script>

<style scoped lang="scss">
.swiper-img {
  aspect-ratio: 16/9;
  object-fit: cover;
  width: 100%;
}

.swiper-button-next,
.swiper-button-prev {
  color: rgba(0, 0, 0, 0.8);
  width: 10px;
}

.swiper-pagination :deep(.swiper-pagination-bullet) {
  width: 1.75rem;
  height: 1.75rem;
  position: relative;
  background-color: transparent;
  border: 20px solid transparent;
  &:hover,
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &::after {
    content: "";
    position: absolute;
    width: 1rem;
    height: 1rem;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.swiper-pagination :deep(.swiper-pagination-bullet-active) {
  background-color: rgba(0, 0, 0, 0.6);
}

@media (max-width: 768px) {
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 1.5rem;
  }
  .swiper-pagination :deep(.swiper-pagination-bullet) {
    width: 1.5rem;
    height: 1.5rem;
    border: 15px solid transparent;
    &::after {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
}
</style>
