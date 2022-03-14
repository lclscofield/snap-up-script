<script setup lang="ts">
// import { ref } from 'vue'
// import { useStore } from '../store/index'

async function upload (): Promise<void> {
    const ret = await window.ipcRenderer.invoke('upload')
    console.log(ret)
}
async function openBrowser (): Promise<void> {
    const ret = await window.ipcRenderer.invoke('openBrowser')
    console.log(ret)
}
async function closeBrowser (): Promise<void> {
    const ret = await window.ipcRenderer.invoke('closeBrowser')
    console.log(ret)
}

defineProps<{ msg: string }>()

// const c = ref(0)
// const store = useStore()
// console.log(c.value, store.count)
</script>

<template>
    <button
        type="button"
        @click="upload"
    >
        upload
    </button>
    <button
        type="button"
        @click="openBrowser"
    >
        open
    </button>
    <button
        type="button"
        @click="closeBrowser"
    >
        close
    </button>
</template>

<style lang="scss" scoped>
</style>
