<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid> </Grid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getWorkOrderBom } from '/@/api/productionDeal/workOrder';
  import { columns } from './components/config';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  const route = useRoute();
  defineOptions({ name: 'productionDeal-dieCut-bom' });
  const searchFormSchema = [
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入工单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'materialCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入物料编号',
        allowClear: true,
      },
    },
  ];
  const [Grid, { setLoading, setFieldValue }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
    },
    gridOptions: {
      id: 'productionDeal-dieCut-bom',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getWorkOrderBom,
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });
  onMounted(() => {
    if (route.query.workOrderNo) {
      console.log(route.query.workOrderNo);
      setFieldValue('workOrderNo', route.query.workOrderNo);
    }
  });
</script>
