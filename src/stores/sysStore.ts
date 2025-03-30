import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
export const useSysStore = defineStore('sysStore', () => {
  const dialog = ref(false);
  const dialogText = ref('');
  const openDialog = (text: string) => {
    dialogText.value = text;
    dialog.value = true;
  }
  const closeDialog = () => dialog.value = false;

  return {
    dialog,
    dialogText,
    openDialog,
    closeDialog
  }
})