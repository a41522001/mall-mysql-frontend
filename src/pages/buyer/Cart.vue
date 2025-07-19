<template>
  <div class="bg-white pa-3" id="cart">
    <v-row>
      <v-checkbox v-model="isAllCheck" label="全選" density="compact" />
    </v-row>
    <v-row v-for="cart in cartList" class="align-sm-center position-relative">
      <v-checkbox
        v-model="isAddOrder[cart.productId]"
        class="position-absolute top-0 left-0"
        density="compact"
        hide-details
      />
      <v-btn
        @click="openDeleteCartDialog(cart.productId, false)"
        density="comfortable"
        variant="text"
        icon="$close"
        class="position-absolute top-0 right-0 mx-3"
      />
      <v-col cols="7" sm="5">
        <v-sheet class="image_container w-100 ps-5">
          <img class="w-100 h-100" :src="cart.image" alt="" />
        </v-sheet>
      </v-col>
      <v-col cols="5" sm="2">
        <div class="d-flex flex-column flex-sm-row h-100">
          <div class="flex-1-1 mb-sm-0 mb-auto">
            <div class="mb-3">{{ cart.name }}</div>
            <div class="">單價: ${{ cart.price }}</div>
          </div>
        </div>
      </v-col>
      <v-col cols="9" sm="5">
        <div class="flex-sm-1-1 d-flex align-sm-center flex-column flex-sm-row">
          <v-number-input
            v-model="quantities[cart.productId]"
            :min="0"
            label="數量"
            control-variant="split"
            :hideInput="false"
            :inset="false"
            hide-details
            density="compact"
            max-width="100%"
            @update:model-value="
              handleCheckStock(cart.productId, quantities[cart.productId])
            "
          />
          <div class="text-sm-end font-weight-bold text-h6 ms-sm-3">
            $:{{ cart.price * quantities[cart.productId] }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
    <div class="d-flex flex-column align-end">
      <div class="mb-5 font-weight-regular text-h4">總金額: ${{ total }}</div>
      <v-btn class="text-white" color="#0D47A1" @click="handleCheckDialog"
        >前往結帳</v-btn
      >
    </div>
    <!-- 刪除商品dialog -->
    <v-dialog v-model="dialog.deleteCart">
      <v-card width="300px" class="mx-auto">
        <v-card-text class="text-h6">是否刪除此商品</v-card-text>
        <v-card-actions>
          <v-btn class="confirm-btn" @click="deleteCart">確定</v-btn>
          <v-btn class="cancel-btn" @click="revertQuantity">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 確定結帳dialog -->
    <v-dialog v-model="dialog.checkout">
      <v-card width="300px" class="mx-auto">
        <v-card-text class="text-h6">是否前往結帳</v-card-text>
        <v-card-actions>
          <v-btn class="confirm-btn" @click="handelCheckConfirm">確定</v-btn>
          <v-btn class="cancel-btn" @click="dialog.checkout = false"
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, inject, shallowRef } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useSysStore } from "@/stores/sysStore";
import { useRouter, type Router } from "vue-router";
import type { UserInfo } from "@/types/interface";
import {
  apiDeleteCart,
  apiUpdateCartQuantity,
  apiAddOrder,
} from "@/utils/apiClient";
defineOptions({
  inheritAttrs: false,
});
const userInfo = inject<UserInfo>("userInfo")!;
const { id: userId } = userInfo;
const cartStore = useCartStore();
const sysStore = useSysStore();
const router: Router = useRouter();
const cartList = computed(() => cartStore.cartList);
const quantities = reactive<Record<string, number>>({});
// 選擇框
const isAddOrder = reactive<Record<string, boolean>>({});

const isAllCheck = computed({
  get(): boolean {
    return Object.values(isAddOrder).every((value) => value);
  },
  set(val: boolean) {
    for (const key in isAddOrder) {
      isAddOrder[key] = val;
    }
  },
});
// 紀錄目前的productID
const productId = ref<string>("");
const dialog = reactive({
  deleteCart: false,
  checkout: false,
});
const total = computed((): number => {
  return cartList.value.reduce((acc, item) => {
    if (quantities[item.productId] > 0 && isAddOrder[item.productId]) {
      return acc + quantities[item.productId] * item.price;
    } else {
      return acc + 0;
    }
  }, 0);
});
// 判斷是否需回復購物車數量的flag
const inputFlag = shallowRef<boolean>(false);

// 確認庫存(如果足夠則更新購物車數量)
const handleCheckStock = async (
  productId: string,
  quantity: number
): Promise<void> => {
  if (quantity === 0) {
    openDeleteCartDialog(productId, true);
    return;
  }
  const data = {
    productId,
    quantity,
  };
  try {
    await apiUpdateCartQuantity(data);
  } catch (error: any) {
    sysStore.openDialog(error.message);
    const stock = error.message.split(" ")[1];
    nextTick(() => {
      quantities[productId] = +stock;
    });
  }
};
// 開啟刪除購物車dialog
const openDeleteCartDialog = (productID: string, flag: boolean): void => {
  inputFlag.value = flag;
  productId.value = productID;
  dialog.deleteCart = true;
};
// 恢復數量
const revertQuantity = (): void => {
  if (inputFlag.value) {
    quantities[productId.value] = 1;
  }
  dialog.deleteCart = false;
};
// 刪除購物車
const deleteCart = async (): Promise<void> => {
  const res = await apiDeleteCart(productId.value);
  dialog.deleteCart = false;
  sysStore.openDialog(res.message);
  cartStore.getCartList();
};
const handleCheckDialog = () => {
  dialog.checkout = true;
};
// 結帳
const handelCheckConfirm = async (): Promise<void> => {
  const newData = cartList.value
    .map((cart) => {
      let quantity = 0;
      if (quantities[cart.productId] > 0 && isAddOrder[cart.productId]) {
        quantity = quantities[cart.productId];
      }
      return {
        productID: cart.productId,
        quantity,
        price: cart.price,
      };
    })
    .filter((item) => item.quantity !== 0);
  if (newData.length === 0) {
    dialog.checkout = false;
    sysStore.openDialog("未選取商品");
    return;
  }
  const data = {
    cartList: newData,
    total: total.value,
    userId: userId,
  };
  try {
    const res = await apiAddOrder(data);
    if (res.data) {
      await cartStore.getCartList();
      init();
      router.push({
        path: `checkout/${res.data}`,
      });
    }
  } catch (error: any) {
    console.log(error);
    const errMessage = error.split("Error:")[1];
    sysStore.openDialog(errMessage);
  } finally {
    dialog.checkout = false;
  }
};

const init = (): void => {
  for (const key in quantities) {
    delete quantities[key];
  }
  for (const key in isAddOrder) {
    delete isAddOrder[key];
  }

  if (cartList.value.length === 0) {
    sysStore.openDialog("購物車內無商品");
    router.push("/buyer");
  }
  nextTick(() => {
    cartStore.cartList.forEach((cart) => {
      quantities[cart.productId] = cart.quantity;
      isAddOrder[cart.productId] = false;
    });
  });
};
onMounted(() => {
  init();
});
</script>
<style scoped lang="scss">
#cart {
  max-width: 768px;
  width: 100%;
  margin: auto;
}
</style>
