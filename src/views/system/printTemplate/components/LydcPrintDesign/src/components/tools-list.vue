<template>
  <div class="w-full">
    <a-input class="w-full" :placeholder="t('dict.CommonCol.PESC')" style="margin-bottom: 16px" v-model:value="searchText" @change="handleSearch">
      <template #prefix>
        <i class="icon-ym icon-ym-search" style="color: #ccc"></i>
      </template>
    </a-input>

    <!-- 搜索结果显示 -->
    <div v-show="showSearchResults" style="display: flex; justify-content: space-between">
      <template v-for="item in allItems" :key="item.label">
        <div v-show="itemMatchesSearch(item)" class="drag-item" v-for="item in [item]" :key="item.tid">
          <a class="ep-draggable-item" :tid="item.tid">
            <img :src="item.icon" alt="" />
            <p class="icon-label">{{ item.label }}</p>
          </a>
        </div>
      </template>
      <div style="width: 72px; height: 0"></div>
    </div>

    <!-- 默认内容（始终渲染但根据条件显示） -->
    <div class="tools-list-parent" v-show="showDefaultContent">
      <!-- 基础元素部分 -->
      <div class="title" @click="toggleBasic">
        基础元素
        <i class="ym-custom ym-custom-menu-down" v-show="showBasic"></i>
        <i class="ym-custom ym-custom-menu-right" v-show="!showBasic"></i>
      </div>
      <div v-show="showBasic" class="drag-item-box">
        <div class="drag-item" v-for="item in dragDefaultItems" :key="item.tid">
          <a class="ep-draggable-item" :tid="item.tid">
            <img :src="item.icon" alt="" />
            <p class="icon-label">{{ item.label }}</p>
          </a>
        </div>
      </div>

      <!-- 平台元素部分 -->
      <div class="title" @click="toggleCustom">
        平台元素
        <i class="ym-custom ym-custom-menu-down" v-show="showCustom"></i>
        <i class="ym-custom ym-custom-menu-right" v-show="!showCustom"></i>
      </div>
      <div v-show="showCustom" class="drag-item-box">
        <div class="drag-item" v-for="item in dragCustomItems" :key="item.tid">
          <a class="ep-draggable-item" :tid="item.tid">
            <img :src="item.icon" alt="" />
            <p class="icon-label">{{ item.label }}</p>
          </a>
        </div>
        <div style="width: 72px; height: 0"></div>
      </div>
    </div>

    <!-- 搜索无结果提示 -->
    <div v-show="searchText && !hasSearchResults" class="no-result"> 没有找到匹配的项目 </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { dragDefaultItems, dragCustomItems } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  // 控制折叠状态
  const showBasic = ref(true);
  const showCustom = ref(true);
  const searchText = ref('');
  // 合并所有项目用于搜索
  const allItems = [...dragDefaultItems, ...dragCustomItems];

  // 计算是否有搜索结果
  const hasSearchResults = computed(() => {
    if (!searchText.value) return false;
    return allItems.some(item => itemMatchesSearch(item));
  });

  // 是否显示搜索结果
  const showSearchResults = computed(() => {
    return searchText.value && hasSearchResults.value;
  });

  // 是否显示默认内容
  const showDefaultContent = computed(() => {
    return !searchText.value || !hasSearchResults.value;
  });

  // 检查项目是否匹配搜索
  const itemMatchesSearch = item => {
    if (!searchText.value) return false;
    return item.label.toLowerCase().includes(searchText.value.toLowerCase());
  };

  // 切换折叠状态
  const toggleBasic = () => {
    showBasic.value = !showBasic.value;
  };

  const toggleCustom = () => {
    showCustom.value = !showCustom.value;
  };

  // 搜索处理
  const handleSearch = () => {};
</script>

<style lang="scss" scoped>
  .tools-list-parent {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
  .tools-list-parent::-webkit-scrollbar {
    display: none;
  }
  .title {
    font-size: 14px;
    font-weight: 400;
    margin: 0px 0 13px 0px;
    cursor: pointer;

    .ym-custom {
      color: #666;
      transition: transform 0.2s ease;
    }
  }

  .no-result {
    padding: 16px;
    text-align: center;
    color: #999;
  }

  .drag-item-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .drag-item {
    width: calc((100% - 24px) / 3);
    max-width: 72px;
    max-height: 72px;
    box-sizing: border-box;
    margin-bottom: 20px;
  }

  .ep-draggable-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 9px 5px;
    border-radius: 6px;
    background-color: #f1f1f1;
    cursor: move;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .ep-draggable-item:hover {
    background-color: #f0f0f0;
  }

  .icon-text {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .icon-label {
    font-size: 12px;
    margin-top: 8px;
    text-align: center;
  }
</style>
