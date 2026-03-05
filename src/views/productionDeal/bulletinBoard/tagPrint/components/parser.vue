<template>
    <div v-if="state.list">
        <component :is="layouts" :data="props.data" :list="state.list" :lines="props.lines" :fmac="fmac" />
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, markRaw, watch, reactive, nextTick } from 'vue'
const props = defineProps(['item', 'data', 'list', 'lines', 'fmac'])
const state = reactive({
    list: []
})
let layouts = ref<any>(null);

watch(() => props.list, () => {
    nextTick(() => {
        state.list = props.list
        layouts.value = markRaw(defineAsyncComponent(() => getComponents(props.item.lydcKey)));
    })
}, {
    immediate: true
})

function getComponents(e: string) {
    return import(`../components/${e}/index.vue`)
}
</script>