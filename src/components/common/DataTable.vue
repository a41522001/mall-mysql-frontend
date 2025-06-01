<template>
  <v-data-table-virtual :headers="tableView" :items="items" :item-key="itemKey" height="600"
    return-object :hide-default-footer="noFooter">
    <template v-slot:item="{ item, columns, isSelected, toggleSelect, index: rowIndex }">
      <tr @click="handleClick(item, rowIndex)" :class="{current: rowIndex === currentRowIndex}">
        <template v-if="prepend">
          <td class="d-flex align-center ga-2">
            <template v-for="prep in prepend.value">
              <v-btn @click="prep?.method?.(item, rowIndex)" :class="prep?.className"
                :variant="prep?.variant" :color="prep?.color" density="comfortable" 
                >
                {{ prep.text }}
              </v-btn>
            </template>
          </td>
        </template>
        <template v-for="header in headers" :key="header.key">
          <td>
            <template v-if="slots[`${header.key}`]">
              <slot :name="`${header.key}`"
                    :item="item"
                    :value="item[header.key]"
                    :header="header"
                    :rowIndex="rowIndex"
              ></slot>
            </template>
            <template v-else>
              {{ item[header.key] }}
            </template>
          </td>
        </template>
        <template v-if="append">
          <td class="d-flex align-center ga-2">
            <template v-for="app in append.value">
              <v-btn @click="app?.method?.(item, rowIndex)" :class="app?.className"
                :variant="app?.variant" :color="app?.color" density="comfortable" 
                >
                {{ app.text }}
              </v-btn>
            </template>
          </td>
        </template>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { computed, useSlots, watch } from 'vue';
import type { Props } from '@/types/dataTable';
import type { TableItem } from '@/types/dataTable';
const slots = useSlots();
const props = withDefaults(defineProps<Props>(), {
  noFooter: true
})
const emits = defineEmits(['clickRow']);
const tableView = computed(() => {
  const result = [...props.headers];
  if(props.prepend) {
    const { value, ...prep } = props.prepend;
    result.unshift(prep);
  }
  if(props.append) {
    const { value, ...app } = props.append;
    result.push(app)
  }
  return result;
})
const currentRow: TableItem = shallowReactive({});
const currentRowIndex = shallowRef<number>(-1);
const handleClick = (item: TableItem, index: number) => {
  for (const key in currentRow) {
    delete currentRow[key];
  }
  Object.assign(currentRow, item);
  currentRowIndex.value = index;
  emits('clickRow', item, index);
}
watch(props.items, () => {
  for (const key in currentRow) {
    delete currentRow[key];
  }
  currentRowIndex.value = -1;
})
</script>

<style scoped lang="scss">
@import '@/styles/dataTable';
</style>