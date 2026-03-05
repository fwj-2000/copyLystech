<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :draggable="true"
    :show-cancel-btn="false"
    showOkBtn
    :width="800"
    :ok-text="t('common.okText')"
    @ok="closeModal">
    <div class="w-full h-[400px] bg-white">
      <Grid> </Grid>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { executeCheck } from '/@/api/productionDeal/checkProject';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const { t } = useI18n();
  const baseStore = useBaseStore();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const [Grid, GridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'mr-[5px]',
      },
      submitButtonOptions: {
        content: t('dict.CommonCol.executeCheck'),
      },
      resetButtonOptions: {
        show: false,
      },
      handleSubmit: checkSubmit,
      wrapperClass: 'grid grid-cols-3  gap-4',
      schema: [
        {
          fieldName: 'parameterValue',
          label: t('dict.CommParmColumn.parameterValue'),
          labelWidth: 80,
          component: 'Input',
          componentProps: {
            placeholder: t('dict.CommParmColumn.parameterValue'), //'参数值',
            allowClear: true,
          },
        },
      ],
    },
    gridOptions: {
      id: 'dieCut-checkProject-components-checkModal',
      columns: [
        {
          title: t(['dict.CommonCol.checkProject', 'dict.CommonCol.dutyPersonName']), //'点检项名称',
          field: 'itemName',
        },
        {
          title: '点检状态',
          field: 'status',
          cellRender: {
            name: 'Tag',
            options: [
              {
                id: 'pending',
                fullName: '暂未点检',
                theme: 'gray',
              },
              {
                id: 'success',
                fullName: '点检成功',
                theme: 'green',
              },
              {
                id: 'fail',
                fullName: '点检失败',
                theme: 'red',
              },
            ],
          },
        },
      ] as any,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  const getTitle = computed(() => t('dict.CommonCol.check'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);

  function init(data) {
    let dataValue = parseItemData(data);
    state.dataForm = data;
    GridApi.reloadData(dataValue);
    GridApi.setFieldValue('parameterValue', data.parameterValue);
  }
  async function checkSubmit(val) {
    const { code, msg, data } = await executeCheck({
      id: state.dataForm.id,
      parameterValue: val.parameterValue,
    });

    if (code !== 200) {
      createMessage.error(msg);
      return;
    }
    data.forEach(item => {
      item.status = item.isPassed ? 'success' : 'fail';
    });
    GridApi.reloadData(data);
  }
  function parseItemData(row) {
    const ids = row.itemIds?.split(',') || [];
    const names = row.itemNames?.split(',') || [];
    return names.map((name, index) => ({
      id: ids[index],
      itemName: name,
      status: 'pending',
    }));
  }
</script>
<style lang="less" scoped>
  :deep(.vxe-form.page) {
    border-bottom: none;
  }
</style>
