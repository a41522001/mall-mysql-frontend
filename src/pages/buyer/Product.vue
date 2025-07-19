<template>
  <div class="mb-5">
    <Carousels :products="products" />
  </div>
  <v-row>
    <v-col
      v-for="{ id, name, price, quantity, image, sellUserId } in productList"
      :key="id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card>
        <v-img :src="image" cover />
        <v-card-text>
          <div class="text-h4 mb-4">{{ name }}</div>
          <div>${{ price }}</div>
          <div>庫存: {{ quantity }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="
              handleAddCart({ id, name, price, quantity, image, sellUserId })
            "
            :color="renderBtnColor(quantity)"
            variant="elevated"
            :disabled="quantity === 0"
          >
            {{ renderBtnText(quantity) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <!-- 新增商品dialog -->
  <v-dialog
    v-model="dialog.addProduct"
    max-width="400"
    width="100%"
    class="mx-5"
  >
    <v-card>
      <v-card-title class="d-flex">
        <div class="me-auto">加入購物車</div>
        <v-btn
          @click="closeDialog"
          density="comfortable"
          variant="text"
          icon="$close"
        />
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <img class="w-100" :src="currentProduct.image" alt="" />
          </v-col>
          <v-col cols="8">
            <div>商品名稱</div>
            <div>單價: ${{ currentProduct.price }}</div>
          </v-col>
          <v-col cols="12">
            <div class="mb-2">
              <v-number-input
                v-model="quantity"
                :max="currentProduct.quantity"
                :min="1"
                label="數量"
                control-variant="split"
                :hideInput="false"
                :inset="false"
                :hide-details="true"
                density="compact"
              />
            </div>
            <div>總計 : ${{ currentProductTotalPrice }}</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#aaaaaa" variant="elevated" @click="closeDialog"
          >取消</v-btn
        >
        <v-btn color="#1976D2" variant="elevated" @click="handleConfirmAddCart"
          >確認加入購物車</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {
  reactive,
  shallowReactive,
  inject,
  ref,
  onMounted,
  computed,
  nextTick,
} from "vue";
import { useSysStore } from "@/stores/sysStore";
import { useCartStore } from "@/stores/cartStore";
import type { Product, UserInfo } from "@/types/interface";
import { useRouter } from "vue-router";
import Carousels from "@/components/common/Carousels.vue";
import { apiGetProduct, apiAddCart } from "@/utils/apiClient";
interface Props {
  searchString: string;
}
const router = useRouter();
const sysStore = useSysStore();
const cartStore = useCartStore();
const userInfo = inject<UserInfo>("userInfo")!;
const { id: userId } = userInfo;
const props = defineProps<Props>();
const products: Product[] = shallowReactive([]);
const currentProduct: Product = shallowReactive({
  id: "",
  name: "",
  price: 0,
  quantity: 0,
  image: "",
  sellUserId: "",
});
const productList = computed((): Product[] => {
  if (!props.searchString) return products;
  return products.filter((item) => {
    const productName = item.name.toUpperCase();
    return productName.includes(props.searchString.toUpperCase());
  });
});
const currentProductTotalPrice = computed(
  (): number => currentProduct.price * quantity.value
);
const quantity = ref<number>(1);
const dialog = reactive({
  cart: false,
  product: false,
  addProduct: false,
});

const renderBtnText = (quantity: number): string =>
  quantity ? "加入購物車" : "目前尚無庫存";
const renderBtnColor = (quantity: number): string =>
  quantity ? "#3B82F6" : "#ff0000";

const clearData = (): void => {
  currentProduct.id = "";
  currentProduct.name = "";
  currentProduct.price = 0;
  currentProduct.quantity = 0;
  currentProduct.image = "";
  quantity.value = 1;
};

const closeDialog = (): void => {
  dialog.addProduct = false;
  clearData();
};

const handleAddCart = (product: Product): void => {
  dialog.addProduct = true;
  Object.assign(currentProduct, product);
};

// 新增購物車API
const handleConfirmAddCart = async (): Promise<void> => {
  const { id } = currentProduct;
  const product = {
    productId: id,
    quantity: quantity.value,
  };
  try {
    await apiAddCart(product);
    dialog.product = false;
    handleGetProduct();
    closeDialog();
    cartStore.getCartList();
    sysStore.openDialog("成功添加購物車");
  } catch (error: any) {
    sysStore.openDialog(error.message as string);
  }
};

// 取得商品列表API
const handleGetProduct = async (): Promise<void> => {
  const res = await apiGetProduct();
  products.splice(0, products.length, ...res.data);
};

onMounted(async () => {
  if (sessionStorage.getItem("token")) {
    handleGetProduct();
  }
});
</script>
