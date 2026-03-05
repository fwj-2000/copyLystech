<!-- 数据版本明细 -->
<template>
  <BasicPopup v-bind="$attrs" :showOkBtn="state.show" :title="t('common.FCupdate')" @ok="handleSave" class="full-popup" @register="registerPopup">
    <div class="h-full p-2">
      <Grid style="height: 70%" />
      <!-- 审批人 -->
      <BasicAudit class="pl-10px" ref="basicAuditRef" approver-type="FC" :schemas="MPschema"></BasicAudit>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import { columns } from '/@/views/customerService/information/fcData/components/config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { changeSave } from '/@/api/customerSerivce/fcData';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick, cloneDeep } from 'lodash-es';
  import { FormSchema } from '/@/components/Form';
  import BasicAudit from '/@/components/CustomComponents/src/fc/BasicAudit.vue';
  const { t } = useI18n();

  dayjs.extend(isoWeek);
  const state = reactive({
    show: true,
  });
  const emits = defineEmits(['reload']);
  const _cols = cloneDeep(columns);
  _cols.splice(0, 5);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'customerService-information-fcData-edit',
      columns: _cols.map(col => {
        const _item = {
          title: col.title,
          field: col.field,
        };
        if (col.editRender) {
          _item['editRender'] = col.editRender;
        }
        return _item;
      }),
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      clipConfig: {
        isPaste: true,
        isCopy: true,
        beforeCopyMethod: ({ cellValue }) => {
          console.log('beforeCopyMethod', cellValue);
          return cellValue;
        },
      },
    },
  });
  const { reloadData } = gridApi;
  const [registerPopup, { closePopup, changeOkLoading }] = usePopupInner(({ records }) => {
    reloadData(records);
  });
  const MPschema: FormSchema = [
    {
      required: true,
      field: 'yuanze',
      label: t('dict.fcDataAudit.MP'),
      component: 'Textarea',
      componentProps: {
        allowClear: false,
        rows: 1,
      },
      colProps: { span: 12 },
    },
  ];

  const basicAuditRef = ref<InstanceType<typeof BasicAudit>>();
  async function handleSave() {
    changeOkLoading(true);
    // 校验数据
    const res = (await basicAuditRef?.value?.validateAll()) ?? [];
    if (res?.includes(false)) {
      return changeOkLoading(false);
    }
    const {
      yuanze,
      mainProcess,
      approverGroupId,
      CustomerManager = [],
      CustomerSupervisor = [],
      PMC = [],
      Sale = [],
      SaleLeader = [],
    } = basicAuditRef?.value?.getValues() ?? {};
    // 过滤出可变更字段
    const filteCodes = [
      'dataId',
      'customerCode',
      'factory',
      'customerPerson',
      'project',
      'projectPhase',
      'innerMaterialNumber',
      'middleMaterialNumber',
      'factoryArea',
      'factoryAreaName',
      'useQuantity',
      'vmiOrJit',
      'tradeCurrency',
      'productCategory',
      'materialPrinciple',
    ];
    const data = columns.filter(col => col.editRender).map(col => col.field);
    const paramField = data.concat(filteCodes);
    const params = {
      fcChangeList: gridApi.getDataSource().map(row => {
        return {
          ...pick(row, paramField),
          bacthCode: row.batchNumber,
        };
      }),
      audit: {
        approveId: approverGroupId,
        mainProcesses: mainProcess,
        materialPreparationPrinciple: yuanze,
        customerManagerUserIds: CustomerManager,
        customerSupervisorUserIds: CustomerSupervisor,
        pmcUserIds: PMC,
        saleUserIds: Sale,
        saleLeaderUserIds: SaleLeader,
      },
    };
    changeSave(params)
      .then(() => {
        closePopup();
        emits('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
