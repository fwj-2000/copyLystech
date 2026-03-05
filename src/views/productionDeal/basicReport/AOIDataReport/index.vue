<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 批量导出 -->
              <a-button class="mr-12px" @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>

          <template #result="{ row }">
            <LydcTag v-if="row.result.toLowerCase() === 'ok'" theme="green" text="OK"></LydcTag>
            <LydcTag v-else theme="red" text="NG"></LydcTag>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { schema, column } from './config';
  import { downloadByUrl } from '/@/utils/file/download';
  import { processGroupColumn } from './utils';
  import { dateUtil } from '/@/utils/dateUtil';
  import { cloneDeep } from 'lodash-es';
  import { getAOISizeDataReportList, AOISizeDataReportExport } from '/@/api/productionDeal/AOIDataReport';
  import { message } from 'ant-design-vue';
  import { router } from '/@/router/index';

  const { t } = useI18n();

  defineOptions({ name: 'productionDeal-basicReport-AOIDataReport' });

  async function handleGetAOISizeDataReportList(params) {
    if (!params.product || (!params.serialNumbers && !params.creatorTimeStart)) return {};
    const res = await getAOISizeDataReportList({ ...params, dataType: 0 });
    return res;
  }

  const [Grid, { getFromValue, reloadData, reloadColumn, setLoading }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: schema,
    },
    gridOptions: {
      // id: 'productionDeal-basicReport-AOIDataReport-list',
      columns: column,
      showIndexColumn: true,
      api: handleGetAOISizeDataReportList,
      beforeFetch: params => handleParams(params),
      afterFetch: data => {
        // const colorList = ['header-orange', 'header-blue', 'header-skeyblue', 'header-green', 'header-red'];
        // const columnList = data?.columns.map(item => {
        //   if (item.field === 'result') {
        //     return {
        //       ...item,
        //       width: '130px',
        //       slots: { default: 'result' },
        //     };
        //   } else if (item.group) {
        //     const colorIndex = (Number(item.group) - 1) % colorList.length;
        //     if (item.children && item.children.length > 0) {
        //       const childrenItem = item.children.map(children1 => {
        //         return {
        //           ...children1,
        //           children: children1.children.map(children2 => {
        //             return {
        //               ...children2,
        //               children: children2.children.map(children3 => {
        //                 return {
        //                   ...children3,
        //                   width: 100,
        //                   className: ({ row }) => {
        //                     // 标准值
        //                     const standardValue = Number(children1.title);
        //                     // 上公差
        //                     const upperTolerance = Number(children2.title);
        //                     // 下公差
        //                     const lowerTolerance = Number(children3.title);
        //                     return Number(row[children3.field]) > Number(Decimal(standardValue).plus(Decimal(upperTolerance))) ||
        //                       Number(row[children3.field]) < Number(Decimal(standardValue).plus(Decimal(lowerTolerance)))
        //                       ? 'cell-red'
        //                       : '';
        //                   },
        //                 };
        //               }),
        //             };
        //           }),
        //         };
        //       });
        //       return {
        //         ...item,
        //         width: '130px',
        //         headerClassName: colorList[colorIndex],
        //         children: childrenItem,
        //       };
        //     } else {
        //       return {
        //         ...item,
        //         width: '130px',
        //         headerClassName: colorList[colorIndex],
        //       };
        //     }
        //   } else {
        //     return {
        //       ...item,
        //       width: '130px',
        //     };
        //   }
        // });
        const processColumn = column => {
          switch (true) {
            case column.field === 'result':
              return {
                ...column,
                width: '130px',
                slots: { default: 'result' },
              };
            case !!column.group:
              return processGroupColumn(column);
            default:
              return {
                ...column,
                width: '130px',
              };
          }
        };
        const columnList = data?.columns?.map(processColumn) || [];
        reloadColumn(columnList);
        reloadData(data?.list);
      },
    },
  });

  // 处理参数
  function handleParams(params) {
    const meta = router.currentRoute.value.meta;
    if (params.pickerVal && params.pickerVal.length > 0) {
      params.creatorTimeStart = dateUtil(params.pickerVal[0]).valueOf();
      params.creatorTimeEnd = dateUtil(params.pickerVal[1]).valueOf();
      delete params.pickerVal;
    }
    if (meta.modelId) {
      params.menuId = meta.modelId;
    }
    return params;
  }

  // 批量导出
  const handleExport = async () => {
    const params = cloneDeep(await getFromValue());
    const requestParams = handleParams(params);
    if (!requestParams.product || (!requestParams.serialNumbers && !requestParams.creatorTimeStart)) return message.warning(t('dict.CommonCol.checkDataFirst'));
    setLoading(true);
    AOISizeDataReportExport(requestParams)
      .then(res => {
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
      })
      .finally(() => setLoading(false));
  };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  ::v-deep(textarea) {
    resize: none; /* 禁止拖动改变大小 */
  }

  ::v-deep(.header-orange) {
    color: #ff7b00;
  }

  ::v-deep(.header-blue) {
    color: blue;
  }

  ::v-deep(.header-green) {
    color: green;
  }

  ::v-deep(.header-red) {
    color: red;
  }

  ::v-deep(.header-skeyblue) {
    color: skeyblue;
  }

  ::v-deep(.cell-red) {
    color: red;
  }
</style>
