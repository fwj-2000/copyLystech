<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.createBOM')" showOkBtn @ok="handleSubmit" :width="1200" :minHeight="500">
    <div class="create-BOM">
      <div class="bom-catory mr-12px">
        <div :class="['catory-item', moldNo === item.moldNo ? 'activited-mold' : '']" v-for="(item, index) in bomlist" :key="index"> {{ item.moldNo }}</div>
        <div v-if="finish" class="catory-finish text-center">{{ t('dict.CommonCol.noMoreData') }}</div>
      </div>
      <div class="grid-box">
        <Grid></Grid>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMoldbomPage, getbomlist, makebom } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn } from '/@/views/engineering/mouldRoom/moldBOM/config';
  import { throttle } from 'lodash-es';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
  });

  const finish = ref(false);
  const pageParams = reactive({
    currentPage: 1,
    pageSize: 20,
  });
  const bomlist = ref<{ moldNo: string }[]>([]);
  const isLoading = ref(false);
  const moldNo = ref('');
  const id = ref('');
  const moldDetailId = ref('');
  const drawAfterVersion = ref('');

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, { reload, getSelectRows }] = useVbenVxeGrid({
    gridOptions: {
      id: props.type === 'newMold' ? 'engineering-mouldRoom-designEngineering-list-BOMList' : 'engineering-mouldRoom-designEngineeringRepair-list-BOMList',
      columns: getColumn().filter(item => item.field !== 'action'),
      api: getMoldbomPage,
      showIndexColumn: true,
      beforeFetch: params => {
        return drawAfterVersion.value
          ? {
              ...params,
              enabledStatus: 1,
              moldNo: moldNo.value,
              moldDetailId: moldDetailId.value,
              bomVersion: drawAfterVersion.value,
            }
          : {
              ...params,
              enabledStatus: 1,
              moldNo: moldNo.value,
              moldDetailId: moldDetailId.value,
            };
      },
      toolbarConfig: {
        enabled: false,
      },
      scrollY: {
        enabled: false,
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = [
          'checkbox',
          'bomDocumentNumber',
          'projectCode',
          'productName',
          'bomVersion',
          'erpSystem',
          'productMaterials',
          'expenseAttribution',
          'action',
        ];
        const diffField = 'bomId';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
      i18nConfig: {
        moduleCode: 'MoldBomColumn',
      },
    },
  });

  const getbomlistFn = async () => {
    // 退出分页判断
    if (finish.value) {
      return;
    }
    isLoading.value = true;
    const { data } = await getbomlist({ ...pageParams, moldNo: moldNo.value });
    isLoading.value = false;
    bomlist.value.push(...data.list);

    if (data.list.length < pageParams.pageSize) {
      finish.value = true;
    } else {
      pageParams.currentPage++;
    }
  };

  const getData = async () => {
    getbomlistFn();
    reload();
  };

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const resetData = () => {
    pageParams.currentPage = 1;
    finish.value = false;
    bomlist.value = [];
  };

  async function init(data) {
    resetData();
    id.value = data.id;
    moldNo.value = data.moldNo;
    moldDetailId.value = data.moldDetailId;
    drawAfterVersion.value = data.drawAfterVersion;
    getData();
  }

  //提交
  async function handleSubmit() {
    let rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    if (rows.length > 1) {
      const bomIds = new Set(rows.map(item => item.bomId));
      if (bomIds.size !== 1) {
        createMessage.warning(t('dict.NewMoldColumn.selectOneItemTip'));
        return;
      }
    }
    changeOkLoading(true);
    const params = {
      id: id.value,
      bomId: rows[0].bomId,
    };
    const res = await makebom(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }

  const handleScroll = () => {
    const element = document.getElementsByClassName('bom-catory')[0];
    if (element) {
      const { scrollTop, clientHeight, scrollHeight } = element;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // 距离底部100px时触发加载
        if (!isLoading.value || !finish.value) {
          getbomlistFn();
        }
      }
    }
  };
  const throttledHandleScroll = throttle(handleScroll, 300);

  onMounted(() => {
    nextTick(() => {
      document.getElementsByClassName('bom-catory')[0]?.addEventListener('scroll', throttledHandleScroll);
    });
  });
</script>
<style lang="scss" scoped>
  .create-BOM {
    display: flex;
    height: 500px;
    .bom-catory {
      width: 226px;
      background-color: #fafafa;
      overflow: scroll;
      .catory-item {
        padding: 8px 12px;
        color: #1a1a1a;
        font-size: 14px;
        cursor: pointer;
      }
      .activited-mold {
        color: #ff7b00;
      }
      .catory-finish {
        padding: 8px 12px;
        color: #606266;
        font-size: 12px;
      }
    }
    .grid-box {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
