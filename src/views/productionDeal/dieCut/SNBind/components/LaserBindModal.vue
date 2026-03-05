<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.laserSerialNumberBind')"
    :showOkBtn="true"
    @ok="handleSubmit"
    width="700px"
    destroy-on-close>
    <Grid>
      <template #toolbar-actions>
        <a-space>
          <a-button type="primary" ghost @click="handleClear">{{ t('common.cleanText') }}</a-button>
          <ImpExcel @success="importSuccess">
            <a-button type="primary" ghost>{{ t('dict.CommonCol.excelParse') }}</a-button>
          </ImpExcel>
        </a-space>
      </template>
      <template #serialNumber="{ row }">
        <a-input v-model:value="row.serialNumber" class="serialNumber" @pressEnter="handleEnter(row)" />
      </template>
      <template #lsSeq="{ row }">
        <a-input v-model:value="row.lsSeq" class="lsSeq" @change="handleChange()" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getActions(row)" />
      </template>
    </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction } from '/@/components/Table';
  import { debounce, countBy, pickBy, keys } from 'lodash-es';
  import { getmaxlsseq, batchsetlsseq } from '/@/api/productionDeal/SNBind';
  import { ImpExcel } from '/@/components/Excel';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const laserColumn = [
    {
      title: t('dict.CommonCol.seq'),
      field: 'sort',
      width: 50,
    },
    {
      title: 'SN',
      field: 'serialNumber',
      slots: { default: 'serialNumber' },
    },
    // 镭射序号
    {
      title: t('dict.CommonCol.laserNumber'),
      field: 'lsSeq',
      width: 160,
      slots: { default: 'lsSeq' },
    },
    // 错误
    {
      title: t('common.errorText'),
      field: 'msg',
      width: 160,
      className: 'cell-msg',
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 60,
      fixed: 'right',
    },
  ];

  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-SNBind-laserBindList',
      columns: laserColumn,
      height: 450,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        custom: false,
        refresh: false,
      },
    },
  });

  function getActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  // 导入
  const importSuccess = async res => {
    if (!res || !res.length) return;
    const results = res[0].results.map(item => {
      return {
        lsSeq: item.镭射序号,
        serialNumber: item.SN,
      };
    });
    const reverseResults = [...results].reverse();
    const tableData = [...reverseResults, ...gridApi.getDataSource()];
    const tableList = tableData.map((item, index) => {
      return {
        ...item,
        sort: tableData.length - index,
      };
    });
    await gridApi.reloadData(tableList);
    getDupValues('lsSeq');
    getDupValues('serialNumber');
    setLocalstorageTableData();
  };

  const handleDelete = row => {
    gridApi.grid.remove(row);
    const tableData = gridApi.getDataSource();
    const tableList = tableData.map((item, index) => {
      return {
        ...item,
        sort: tableData.length - index,
      };
    });
    gridApi.reloadData(tableList);
    setLocalstorageTableData();
  };

  const maxReq = ref(0);

  const inputElementFocus = index => {
    const inputElement = document.getElementsByClassName('serialNumber')[index] as HTMLInputElement;
    inputElement?.focus();
  };

  const handleLoadCacheData = async laserBindCache => {
    const initData = JSON.parse(laserBindCache);
    const tableData = initData.tableData;
    const reqData = initData.maxReq;
    maxReq.value = reqData;
    if (tableData[0].serialNumber) {
      // 第一行的snCode有值，则添加一行数据
      const data = { serialNumber: '', lsSeq: reqData + tableData.length + 1 };
      const tableList = [data, ...tableData].map((item, index) => {
        return {
          ...item,
          sort: tableData.length + 1 - index,
        };
      });
      await gridApi.reloadData(tableList);
      getDupValues('lsSeq');
      nextTick(() => {
        inputElementFocus(0);
      });
    } else {
      // 第一行的snCode没有值，则光标移动到第一行
      await gridApi.reloadData(tableData);
      getDupValues('lsSeq');
      nextTick(() => {
        inputElementFocus(0);
      });
    }
  };

  const handleLoadInitData = async () => {
    changeLoading(true);
    const { data } = await getmaxlsseq().finally(() => {
      changeLoading(false);
    });
    maxReq.value = data || 0;
    const row = { serialNumber: '', lsSeq: maxReq.value + 1, sort: 1 };
    await gridApi.reloadData([row]);
    nextTick(() => {
      inputElementFocus(0);
    });
  };

  async function init() {
    const laserBindCache = localStorage.getItem('laserBindCache');
    if (laserBindCache) {
      // 存在缓存数据，加载缓存数据
      handleLoadCacheData(laserBindCache);
    } else {
      // 不存在缓存数据，默认加载一行数据。并获取最大镭射序号
      handleLoadInitData();
    }
  }

  // 设置缓存数据
  const setLocalstorageTableData = () => {
    const tableData = gridApi.getDataSource().map(item => {
      return {
        sort: item.sort,
        lsSeq: item.lsSeq,
        serialNumber: item.serialNumber,
        msg: item.msg,
      };
    });
    if (tableData.length) {
      localStorage.setItem('laserBindCache', JSON.stringify({ tableData, maxReq: maxReq.value }));
    } else {
      removeStorage();
    }
  };

  const handleEnter = async row => {
    const tableData = gridApi.getDataSource();
    // 校验是否存在相同的SN，相同则清除当前SN
    const dupValues = getDupValues('serialNumber');
    if (dupValues.length) {
      row.serialNumber = '';
    }

    if (tableData.some(item => !item.serialNumber)) {
      // 存在未输入SN的行，则跳转到未输入SN的行。这边未输入序号的时候不用自动填充，用户手动删除就需要手动填充
      for (let i = 0; i < tableData.length; i++) {
        if (!tableData[i].serialNumber) {
          inputElementFocus(i);
          break;
        }
      }
    } else {
      // 不存在未输入SN的行，则新增一行
      const lsSeq = maxReq.value + tableData.length + 1;
      const data = { serialNumber: '', lsSeq };
      const tableList = [data, ...tableData].map((item, index) => {
        return {
          ...item,
          sort: tableData.length + 1 - index,
        };
      });
      await gridApi.reloadData(tableList);
      getDupValues('lsSeq');
      nextTick(() => {
        inputElementFocus(0);
      });
    }
    setLocalstorageTableData();
  };

  const getDupValues = (type, checkList?) => {
    const list = checkList || gridApi.getDataSource();
    const values = list.map(item => item[type].toString());
    //统计出现次数
    const counts = countBy(values);
    // 次数 > 1 的键（重复值）
    const repeats = pickBy(counts, v => v > 1);
    const dupValues = keys(repeats);
    if (dupValues.length) {
      // createMessage.warning(`存在相同的${type === 'lsSeq' ? '镭射序号' : 'SN'}【${dupValues.join('、')}】`);
      createMessage.warning(t('dict.CommonCol.identicalTip', [type === 'lsSeq' ? t('dict.CommonCol.laserNumber') : 'SN', dupValues.join('、')]));
    }
    return dupValues;
  };

  const handleChange = debounce(async () => {
    getDupValues('lsSeq');
    setLocalstorageTableData();
  }, 500);

  const removeStorage = () => {
    localStorage.removeItem('laserBindCache');
  };

  function handleClear() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.clearSNDataTip'),
      onOk: async () => {
        removeStorage();
        closeModal();
      },
    });
  }

  //提交
  async function handleSubmit() {
    const tableList = gridApi.getDataSource().filter(item => item.serialNumber && item.lsSeq);
    const snCodeDupValues = getDupValues('serialNumber', tableList);
    const laserCodeDupValues = getDupValues('lsSeq', tableList);
    if (snCodeDupValues.length || laserCodeDupValues.length) return;
    changeOkLoading(true);
    const { msg, data } = await batchsetlsseq(tableList).finally(() => changeOkLoading(false));
    if (data === true) {
      createMessage.success(msg);
      removeStorage();
      emit('reload');
      handleLoadInitData();
    } else {
      createMessage.warning(t('dict.CommonCol.abnormalDataPresent'));
      const tableList = data.map((item, index) => {
        return {
          ...item,
          sort: data.length - index,
        };
      });
      gridApi.reloadData(tableList);
      setLocalstorageTableData();
    }
  }
</script>

<style lang="less" scoped>
  ::v-deep(.cell-msg) {
    color: red;
  }
</style>
