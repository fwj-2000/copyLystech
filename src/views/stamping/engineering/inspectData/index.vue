<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getSchema, getColumns } from './config';
  import { downloadInspectImportTemplate, getQcOperationList, importInspectData, setRemark } from '/@/api/engineering/detectionData';
  import { onMounted, reactive, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenForm } from '/@/adapter/form';
  import { isEmpty, isExist } from '/@/utils/is';
  import { cloneDeep } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';
  import ImportModal from './ImportModal.vue';
  import RemarkModal from './RemarkModal.vue';

  const { t } = useI18n();
  const globSetting = useGlobSetting();

  defineOptions({ name: 'engineering-basicInformation-inspectData' });

  const state = reactive({
    defaultColumns: [],
    loading: false,
  });

  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const [Form, formApi] = useVbenForm({
    collapsed: true,
    showCollapseButton: true,
    submitOnChange: false,
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    submitButtonOptions: {
      content: '查询',
    },
    handleReset: async () => {
      await formApi.setValues({
        time: [],
        productCode: '',
        remark: '',
      });
      fetchData();
    },
    handleSubmit: fetchData,
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: getSchema(),
    // fieldMappingTime: [['time', ['creatorTimeStart', 'creatorTimeEnd'], 'YYYY-MM-DD HH:mm:ss']],
    // i18nConfig: {
    //   moduleCode: 'PartNumberApplyColumn',
    //   transferRange: ['placeholder'],
    // },
  });

  const { getValues, setValues } = formApi;

  const [Grid, $grid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-inspectData',
      columns: getColumns(),
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const fields = ['productCode', 'productTime', 'operation'];
        if (!fields.includes(column.field)) return;
        const keyOf = r => {
          if (column.field === 'productCode') return r.productCode;
          if (column.field === 'productTime') return `${r.productCode}__${r.productTime}`;
          return `${r.productCode}__${r.productTime}__${r.operation}`;
        };
        const key = keyOf(row);
        const prevRow = visibleData[rowIndex - 1];
        if (prevRow && keyOf(prevRow) === key) {
          return { rowspan: 0, colspan: 0 };
        }
        let countRowspan = 1;
        while (rowIndex + countRowspan < visibleData.length && keyOf(visibleData[rowIndex + countRowspan]) === key) {
          countRowspan++;
        }
        if (countRowspan > 1) {
          return { rowspan: countRowspan, colspan: 1 };
        }
      },
      // api: getQcOperationList,
    },
  });

  function setLoading(loading) {
    state.loading = loading;
    setLoadingCallback(loading);
  }

  const { reloadData, setGridOptions, getFetchParams, recalculate, setLoading: setLoadingCallback } = $grid;

  async function fetchData() {
    setLoading(true);
    setGridOptions({
      columns: [],
      data: [],
    });
    const params = await getFetchParams();
    const formValues = cloneDeep(await formApi.getValues());
    const { time } = formValues;
    if (isExist(time) && time.length === 2) {
      formValues.operationTimeStart = dateUtil(time[0]).startOf('day').valueOf();
      formValues.operationTimeEnd = dateUtil(time[1]).endOf('day').valueOf();
    }
    state.defaultColumns = [];
    getQcOperationList({
      ...params,
      ...formValues,
    }).then(({ code, data }) => {
      if (code === 200) {
        let list = data?.list || [];
        if (isEmpty(list)) {
          setLoading(false);
          setGridOptions({
            columns: getColumns(),
          });
          return;
        }
        const headers = Object.keys(list[0]).filter(key => key !== 'operationid');

        const columns = headers.map(item => {
          let target = {
            title: item,
            field: item,
          };
          if (item !== 'productCode' && item !== 'operationid' && item !== 'productTime' && item !== 'operation' && item !== 'FAI#') {
            target.slots = {
              default: `default_${item}`,
            };
          }

          if (item === 'productCode') {
            target.title = '产品内部料号';
          } else if (item === 'operationid') {
            target.title = 'ID';
          } else if (item === 'productTime') {
            target.title = '调试时间';
          } else if (item === 'operation') {
            target.title = '调试内容';
          } else if (item === 'FAI#') {
            target.title = '检测类别';
          }
          return target;
        });
        state.defaultColumns = headers.filter(
          item => item !== 'productCode' && item !== 'operationid' && item !== 'productTime' && item !== 'operation' && item !== 'FAI#',
        );
        if (isEmpty(state.defaultColumns)) {
          state.defaultColumns = columns;
          list = [];
        }
        setLoading(false);
        nextTick(() => {
          setGridOptions({
            columns: columns,
            data: list,
            pagerConfig: {
              total: data.pagination.total || 0,
              pageSize: data.pagination.pageSize || 1,
              page: data.pagination.currentPage || 1,
            },
          });
          recalculate();
        });
        // ['productCode', 'operationid', 'productTime', 'operation', 'FAI#']
      }
    });
  }

  function handleDownloadTemp() {
    let _params: any = '';
    // if (props.multiplyList.length) {
    //   if (state.multiplyKey == '') {
    //     return message.info(t('component.batchImport.selectUserTip'));
    //   }
    //   _params = state.multiplyKey;
    // }
    // if (props.apiParams?.template) {
    //   _params = props.apiParams?.template;
    // }
    // if (props.version === '2') {
    //   window.open(`${globSetting.apiUrl}${props.templateUrl}`);
    //   return;
    // }
    downloadInspectImportTemplate(_params).then(res => {
      downloadByUrl({ url: res?.data?.url });
    });
  }

  const customRequest = async info => {
    console.log(info);
    let params = {
      file: info.file,
      fileName: info.file.name,
    };
    importInspectData(params).then(res => {
      console.log(res);
    });
  };

  function handleRemark(row) {
    openRejectModal(true, {
      // id: row.
      api: setRemark,
      ids: row.operationid,
      remark: row?.remark || null,
    });
  }

  onMounted(() => {
    fetchData();
  });
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Form class="relative overflow-x-hidden p-10px pb-10px vxe-form page" />
        <a-spin class="h-full w-full flex-center" :spinning="state.loading">
          <Grid class="h-full" v-if="state.defaultColumns.length > 0">
            <template v-for="item in (state.defaultColumns as string[])" #[`default_${item}`]="{ row, column }">
              <template v-if="row.operationid">
                <div :key="item" class="h-full w-full flex-center" v-if="row[column.field]?.ok == 1" style="background: rgb(149 222 100 / 70%)"
                  >{{ row[column.field]?.val }}
                </div>
                <div :key="item" class="h-full w-full flex-center" v-if="row[column.field]?.ok == 0" style="background: rgb(255 214 102 / 70%)"
                  >{{ row[column.field]?.val }}
                </div>
                <div v-if="!isExist(row[column.field]?.ok)">
                  <button type="link" @click="handleRemark(row)">{{ row.remark || '/' }}</button>
                </div>
              </template>
              <template v-else>
                <div :key="item">{{ row[column.field] }}</div>
              </template>
            </template>
          </Grid>
        </a-spin>
      </div>
    </div>
    <ImportModal @register="registerImportModal" @reload="fetchData" />
    <RemarkModal @register="registerRejectModal" @reload="fetchData" />
  </div>
</template>

<style lang="less" scoped>
  :deep(.ant-spin-nested-loading) {
    height: calc(100% - 54px);
    background: rgb(250 250 250 / 100%);
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  :deep(.vxe-table--render-default.size--small .vxe-body--column.is--padding .vxe-cell) {
    padding: 0;
    width: 100%;
  }

  :deep(.vxe-cell--wrapper) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
