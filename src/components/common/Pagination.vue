<template>
  <template v-if="totalItems > 0">
    <v-pagination v-model="currentPage" :length="length" :size="size" 
      rounded="circle" />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
const { mobile, smAndDown } = useDisplay();
interface Props {
  totalItems: number;
}
const props = defineProps<Props>();
const currentPage = defineModel<number>();
const size = computed(() => smAndDown.value ? 'small' : 'default');
const itemPerPage = 10;
const length = computed(() => Math.ceil(props.totalItems / itemPerPage));

</script>

<style scoped lang="scss">
</style>