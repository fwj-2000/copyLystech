<template>
  <!-- 单品 -->
  <div>
    <div class="form-search-block mb-20px">
      <span>SN：</span>
      <!-- 流转标签 -->
      <div class="w-1/2">
        <LydcInput :suffixIcon="'icon-ym icon-ym-scanCode'" v-model:value="translateInput" :placeholder="t('common.scanText')" @Keydown="handlerInputKeydown" />
      </div>
    </div>
    <Grid>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { singleColumns } from './config';
  import { getlabeldetailbysn, sncodereceive } from '/@/api/purchase/outsourcemanage';
  import { debounce } from 'lodash-es';

  const { t } = useI18n();

  const translateInput = ref('');

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-outsourcingManagement-single-list',
      columns: singleColumns,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      height: 430,
      showIndexColumn: true,
      i18nConfig: {
        otherConfig: {
          resizeable: true,
        },
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: deleteFn.bind(null, record),
        // auth: 'btn_remove',
      },
    ];
  }

  const emit = defineEmits(['register', 'reload', 'changeLoading', 'closeModal']);
  const { createMessage } = useMessage();

  const handlerInputKeydown = (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    handlerInputChangeFn(val);
  };

  const handlerInputChangeFn = debounce(async val => {
    const table = gridApi.getDataSource();
    translateInput.value = '';
    if (table.some(item => item.snCode === val)) {
      createMessage.error(t('dict.CommonCol.snExists'));
      return;
    }
    // SN001
    emit('changeLoading', true);
    const { data } = await getlabeldetailbysn({ snCode: val }).finally(() => {
      emit('changeLoading', false);
    });
    gridApi.grid.insertAt(data, -1);
  }, 300);

  const deleteFn = async record => {
    gridApi.grid.remove(record);
  };

  function init() {
    translateInput.value = '';
  }

  //提交
  async function handleSubmit() {
    const table = gridApi.getDataSource();
    if (table.length === 0) {
      createMessage.warning(t('dict.CommonCol.scanSNTip'));
      return;
    }
    emit('changeLoading', true);
    sncodereceive(table)
      .then(res => {
        createMessage.success(res.msg);
        emit('changeLoading', false);
        emit('closeModal');
        emit('reload');
      })
      .catch(() => {
        emit('changeLoading', false);
      });
  }

  defineExpose({
    init,
    handleSubmit,
  });
</script>

<style lang="less" scoped>
  ::v-deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  .form-search-block {
    display: flex;
    align-items: center;
  }
</style>
