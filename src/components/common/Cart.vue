<template>
  <v-dialog v-model="model">
    <v-card width="600" class="mx-auto">
      <v-card-text>
        <v-sheet v-for="cart in cartList" class="my-5" :elevation="3" width="100%">
          <div class="pa-5 d-flex">
            <v-sheet :width="200" :height="200" />
            <div class="px-3 flex-grow-1 d-flex flex-column">
              <div class="mb-auto flex-grow-1">{{ cart.name }}</div>
              <div class="mb-3">$:{{ cart.price * quantities[cart.productId] }}</div>
              <div>
                <v-number-input v-model="quantities[cart.productId]" :max="cart.quantity" :min="0" label="數量" control-variant="split"
                :hideInput="false" :inset="false" :hide-details="true" density="compact" />
              </div>
            </div>
          </div>
        </v-sheet>
        <div>總金額: ${{ total }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="model = false">取消</v-btn>
        <v-btn @click="handelCheck">結帳</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, watch, computed } from 'vue';
  import type { Cart } from '@/types/interface';
  import { useUserStore } from '@/stores/userStore';
  const userStore = useUserStore();
  interface Props {
    cartList: Cart[];
  }
  const props = withDefaults(defineProps<Props>(), { });
  const emits = defineEmits(['check']);
  const model = defineModel<boolean>();

  const quantities = reactive<Record<string, number>>({});
  const total = computed(() => {
    return props.cartList.reduce((acc, item) => {
      const quantity = quantities[item.productId] ?? 0;
      return acc + quantity * item.price;
    }, 0)
  })
  watch(props.cartList, () => {
    props.cartList.forEach(cart => {
        quantities[cart.productId] = cart.quantity;
    });
  })
  const handelCheck = () => {
    const newData = props.cartList.map(cart => {
      const quantity = quantities[cart.productId] ?? 0;
      return {
        productID: cart.productId,
        quantity,
        price: cart.price
      }
    }).filter(item => item.quantity !== 0);
    if(newData.length === 0) return;
    const data = {
      cartList: newData,
      total: total.value,
      userId: userStore.userInfo.id
    }
    emits('check', data);
  }
</script>