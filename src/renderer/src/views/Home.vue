<template>
  <h1>主页</h1>
  <button @click="close">关闭</button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const id = ref(0)

//测试系统托盘
const close = () => {
  window.api.windowClose(id.value)
}

// 生命周期
onMounted(() => {
  window.api.getWinInfo().then((msg) => {
    console.log(msg)
    id.value = msg.id
  })
})
</script>

<style lang="scss" scoped></style>
