<template>
  <div class="lydc-subtitle-container" :class="`lydc-subtitle-container-${props.placement}`">
    <div class="title">
      <div class="tag" :style="{ backgroundColor: `${props.color}` }"></div>
      <div>{{ props.title }}</div>
      <div class="ml-3">
        <slot name="afterTitle"></slot>
      </div>
    </div>
    <div class="extra" v-if="props.extra.show">
      <slot name="extra"></slot>
      <div style="margin-left: 10px; cursor: pointer" @click="props.extra.click">
        <i v-if="props.extra.icon" :style="{ color: `${props.extra.color}` }" :class="props.extra.icon"></i>
        <AddCustomRows v-if="!props.extra.hideAdd" :default-value="props.defaultValue" @submit="addColumn" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  const emits = defineEmits(['addColumn']);

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#FF7B00',
    },
    extra: {
      type: Object,
      default: () => {
        return {
          show: false,
          hideAdd: false,
          text: '',
          icon: '',
          color: '',
          onClick: () => {},
        };
      },
    },
    placement: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: Number,
      default: 1,
    },
  });

  const { t } = useI18n();

  const addColumn = data => {
    console.log('addColumn', data);
    emits('addColumn', data);
  };
</script>

<style lang="less">
  .lydc-subtitle-container {
    padding-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .extra {
      margin-left: 16px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
      display: flex;
      align-items: center;

      .tag {
        width: 3px;
        height: 14px;
        background-color: #ff7b00;
        border-radius: 2px;
        margin-right: 8px;
      }
    }
  }

  .lydc-subtitle-container-vxe {
    padding-bottom: 0;
    width: 100%;
  }
</style>
