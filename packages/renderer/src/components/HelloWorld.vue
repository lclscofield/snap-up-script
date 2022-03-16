<script setup lang="ts">
import { ref } from 'vue'

const username = ref('Jiacheng111')
const password = ref('123456')

async function openBrowser (): Promise<void> {
    const ret = await window.ipcRenderer.invoke('openBrowser', JSON.stringify({
        username: username.value,
        password: password.value,
    }))
    console.log(ret)
}

defineProps<{ msg: string }>()

// const c = ref(0)
// const store = useStore()
// console.log(c.value, store.count)
</script>

<template>
    <div class="wrap">
        <input
            v-model="username"
            type="text"
        >
        <input
            v-model="password"
            type="password"
        >
        <button
            type="button"
            @click="openBrowser"
        >
            open
        </button>
    </div>
</template>

<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    align-items: center;

    input, button {
        margin-top: 20px;
    }
}
</style>
