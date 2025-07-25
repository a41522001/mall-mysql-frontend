<template>
  <div class="d-flex flex-column">
    <template v-if="productList.length > 0">
      <v-row>
        <template
          v-for="{
            id,
            quantity,
            price,
            name,
            sellUserId,
            image,
            isActive,
            count,
          } in productList"
          :key="id"
        >
          <v-col sm="6" md="4" lg="3">
            <div class="bg-white rounded-lg">
              <v-img :src="image" width="100%" rounded="t-lg" />
              <div class="pa-5">
                <h3 class="mb-3">{{ name }}</h3>
                <div>NT$ {{ formatNumberWithCommas(price) }}</div>
                <div class="d-flex mb-5">
                  <span>庫存:</span>
                  <span>{{ quantity }}</span>
                  <span class="ms-auto">銷量:</span>
                  <span>{{ count }}</span>
                </div>
                <div class="d-flex ga-3">
                  <v-btn
                    class="flex-grow-1"
                    color="#1976D2"
                    @click="handleModifyProduct(id)"
                    >編輯</v-btn
                  >
                  <v-btn
                    class="flex-grow-1"
                    color="#E0E0E0"
                    @click="handleIsActive(id, isActive!)"
                    >{{ renderIsActiveText(isActive!) }}</v-btn
                  >
                </div>
              </div>
            </div>
          </v-col>
        </template>
      </v-row>
    </template>
    <template v-else>
      <div class="align-self-center pt-10 text-h4">
        還沒有商品嗎? 趕快去新增吧!
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { SellProduct } from "@/types/interface";
import { formatNumberWithCommas } from "@/utils/index";
import { useSysStore } from "@/stores/sysStore";
const sysStore = useSysStore();
interface Props {
  productList: SellProduct[];
}
const props = defineProps<Props>();
const emits = defineEmits(["changeIsActive", "modifyProduct"]);
const currentProductId = shallowRef<string>("");
const currentActive = shallowRef<0 | 1>(0);
const renderIsActiveText = (isActive: 0 | 1) => (isActive ? "下架" : "上架");
const changeIsActive = () => {
  emits("changeIsActive", currentProductId.value, currentActive.value);
  sysStore.confirmDialog = false;
};
const handleIsActive = (productId: string, isActive: 0 | 1) => {
  const isActiveText = isActive ? "下架" : "上架";
  currentProductId.value = productId;
  currentActive.value = isActive;
  sysStore.confirmAssign(`確定要${isActiveText}嗎?`, changeIsActive);
};
const handleModifyProduct = (productId: string) => {
  emits("modifyProduct", productId);
};
</script>
