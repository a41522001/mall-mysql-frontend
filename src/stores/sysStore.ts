import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
export const useSysStore = defineStore('sysStore', () => {
  const dialog = ref(false);
  const isLoading = ref(false);
  const dialogText = ref('');
  const openDialog = (text: string) => {
    dialogText.value = text;
    dialog.value = true;
  }
  const setLoading = (payload: boolean) => {
    isLoading.value = payload;
  }
  const closeDialog = () => dialog.value = false;
  return {
    dialog,
    dialogText,
    openDialog,
    closeDialog,
    isLoading,
    setLoading
  }
})