<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumns } from '/@/views/dashboard/vc/MILManage/config';
  import { onMounted, watch } from 'vue';

  import Chart from './WrapperChart.vue';
  import { getMilbulletinboard, postMilbulletinboard } from '/@/api/dashbord/operate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ImageUpload } from '/@/components/Upload';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { commonOptions } from './config';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  defineOptions({ name: 'dashboard-vc-MILManage' });

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerForm, { searchLoading, api }] = useSearchForm({ formOptions: commonOptions });
  const handleSubmit = async () => {
    await reload();
  };
  const [Grid, { reload, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'dashboard-vc-MILManage',
      // @ts-ignore
      columns: getColumns(),
      api: getMilbulletinboard,
      showIndexColumn: true,
      // @ts-ignore
      proxyConfig: {
        response: {
          result: 'data',
        },
      },
      tooltipConfig: {
        showAll: true,
        enterable: true,
        contentMethod: ({ column, row }) => {
          const { field, title } = column;
          // console.log(field, 'ffield', title);
          const filedArr = ['analysis', 'interimAction', 'correctiveAction', 'preventive'];
          if (filedArr.includes(field)) {
            return null; //默认内容
          }
          return ''; //不加提示
        },
      },
      cellConfig: {
        height: 105,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      columnConfig: {
        resizable: true,
      },
      pagerConfig: {
        autoHidden: true,
      },
      height: '',
      beforeFetch: params => {
        console.log(api.getFormParams(), 'beforeFetch');
        // console.log(params, 'beforeFetch');
        const { startTime, endTime, dimension, ...res } = api.getFormParams();
        return {
          dimension,
          startTime: dimension ? startTime : '',
          endTime: dimension ? endTime : '',
          ...res,
          ...params,
        };
      },
    },
  });

  function handleFileChange(e, index, record) {
    record.imageList = e;
  }

  onMounted(() => {
    watch(
      [() => searchLoading.value],
      () => {
        // console.log('watch', searchLoading.value);
        if (searchLoading.value) return;
        handleSubmit();
      },
      {
        deep: true,
        immediate: false,
      },
    );
  });
  function handleSave() {
    const rows = getDataSource().map(item => ({
      ...item,
      ...api.getFormParams(),
    }));
    postMilbulletinboard(rows).then(({ code, msg }) => {
      if (code == 200) {
        reload();
        createMessage.success(msg);
      }
    });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box h-full">
        <SearchForm @register="registerForm">
          <template #right>
            <a-button v-auth="'btn_edit'" @click="handleSave" type="primary" ghost>{{ t('common.saveText') }}</a-button>
            <a-button type="primary" @click="handleSubmit">{{ t('common.queryText') }}</a-button>
          </template>
        </SearchForm>
        <Grid style="height: calc(100% - 60px)">
          <template #yield="{ row }">
            <Chart height="82px" style="height: 100%; width: 100%" :options="row.yieldTrend" />
          </template>
          <template #imageList="{ row, rowIndex }">
            <ImageUpload
              version="2"
              width="80px"
              height="80px"
              v-model:value="row.imageList"
              style="min-height: 80px; margin-bottom: 0"
              :maxNumber="3"
              @change="handleFileChange($event, rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  :deep(.vxe-cell--wrapper) {
    display: -webkit-box; /* 弹性盒子模型 */
    -webkit-box-orient: vertical; /* 垂直排列 */
    -webkit-line-clamp: 5; /* 限制显示5行 */
    overflow: hidden; /* 隐藏超出内容 */
  }
</style>
