import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
export const useSysStore = defineStore('sysStore', () => {
  const router = useRouter();
  const dialog = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const dialogText = ref<string>('');
  const confirmDialog = ref<boolean>(false);
  const confirmText = ref<string>('');
  const confirmFunction = ref();
  const confirmAssign = (text: string, fn: Function) => {
    confirmText.value = text;
    confirmFunction.value = fn;
    confirmDialog.value = true;
  }
  const closeConfirmDialog = () => {
    confirmDialog.value = false;
    confirmText.value = '';
    confirmFunction.value = null;
  }
  const openDialog = (text: string) => {
    dialogText.value = text;
    dialog.value = true;
  }
  const setLoading = (payload: boolean) => {
    isLoading.value = payload;
  }
  const closeDialog = () => dialog.value = false;
  const jumpRoute = () => {
    console.log(router);
    router.push('/login');
  }

  return {
    dialog,
    dialogText,
    openDialog,
    closeDialog,
    isLoading,
    setLoading,
    jumpRoute,
    confirmDialog,
    confirmFunction,
    confirmAssign,
    confirmText,
    closeConfirmDialog
  }
})