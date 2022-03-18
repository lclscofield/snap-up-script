<script setup lang="ts">
import { ref } from 'vue'

const key = ref('')
async function createMainWallet (): Promise<void> {
    const ret = await window.ipcRenderer.invoke('createMainWallet')
    console.log('助记词', ret)
    key.value = ret
}
</script>

<template>
    <div class="wrap">
        <button
            type="button"
            @click="createMainWallet"
        >
            创建主钱包
        </button>
        <div>助记词: {{ key }}</div>
    </div>
</template>

<style lang="scss" scoped>
</style>
