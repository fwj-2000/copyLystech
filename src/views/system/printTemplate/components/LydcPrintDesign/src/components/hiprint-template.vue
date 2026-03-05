<template>
  <div class="w-full">
    <a-input :placeholder="t('dict.CommonCol.PESC')" style="margin-bottom: 16px" v-model:value="searchText" @change="handleSearch">
      <template #prefix>
        <i class="icon-ym icon-ym-search" style="color: #ccc"></i>
      </template>
    </a-input>

    <div class="flex-row template-list" ref="listContainer">
      <div class="template-box flex-col" v-for="item in filteredItems" :key="item.id" @click="emit('clickTemplate', item)">
        <img class="template-img" :src="item.image" alt="" />
        <span class="template-text">{{ item.name }}</span>
      </div>
      <div v-if="loading" class="loading-more">加载中...</div>
      <div v-if="noMoreData" class="no-more-data">没有更多数据了</div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { getPrintTemplate } from '/@/api/system/printTemplate';
  import portalNodata from '/@/assets/images/portal-nodata.png';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  // 原始数据
  const items = ref([]);
  const searchText = ref('');
  const loading = ref(false);
  const noMoreData = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(999); // 初始加载10条
  const listContainer = ref(null);
  const emit = defineEmits(['clickTemplate']);
  // 转换接口数据为前端需要的格式
  const transformData = apiData => {
    return apiData.map(item => ({
      id: item.id,
      name: item.name,
      image: portalNodata,
      ...item,
    }));
  };

  // 获取打印模板数据
  const fetchPrintTemplates = async () => {
    getPrintTemplate({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      sidx: '',
      sort: '',
      menuId: '712565415926038469',
      _t: Date.now(),
    }).then(res => {
      items.value = transformData(res.data.list);
    });
  };

  // 初始化加载第一页数据
  onMounted(() => {
    fetchPrintTemplates();
  });

  // 过滤后的项目
  const filteredItems = computed(() => {
    if (!searchText.value) {
      return items.value;
    }
    return items.value.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
  });

  const handleSearch = () => {
    // 可以在这里添加额外的搜索处理逻辑
  };
</script>

<style scoped>
  .template-list {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    height: calc(100% - 50px);
    overflow-y: auto;
  }

  .template-list::-webkit-scrollbar {
    display: none;
  }

  .template-box {
    width: 112px;
  }

  .template-img {
    background: #f1f1f1;
    padding: 15px 5px;
    width: 112px;
    height: 112px;
    border-radius: 5.74px;
    border: 1px solid #dbdbdb;
  }

  .template-text {
    color: #666;
    font-size: 14px;
    margin-top: 20px;
    text-align: center;
  }

  .flex-row {
    display: flex;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .loading-more,
  .no-more-data {
    width: 100%;
    text-align: center;
    padding: 10px;
    color: #999;
  }
</style>
