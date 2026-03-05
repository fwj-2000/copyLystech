<template>
  <BasicModal :width="1000" v-bind="$attrs" @register="registerModal" canFullscreen draggable @ok="handleSubmit" destroy-on-close>
    <template #title>
      <subtitle class="sample-collection-subtitle" :title="t('common.materialSampleCollection')" />
    </template>

    <div style="height: 500px">
      <Grid />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { getNewMaterial } from '/@/api/quanlity/newMetarialCheck';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { sampleCollection } from '/@/api/quanlity/newMetarial';
  import { useI18n } from '/@/hooks/web/useI18n';
  const emit = defineEmits(['register', 'success']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const columns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      title: '材料流水编码',
      field: 'materialNumber',
      width: 160,
    },
    {
      title: '送样次数',
      field: 'number',
      width: 100,
    },
    {
      title: '领取人',
      field: 'claimUserId',
      minWidth: 180,
      editRender: {
        name: 'CustomUserSelect',
        props: {
          placeholder: '请输入领取人',
        },
      },
    },
    {
      title: '领取卷数(R)',
      field: 'qty',
      width: 100,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '请输入实际领取数量',
        },
      },
    },
    {
      title: '领取日期',
      field: 'claimDate',
      minWidth: 180,
      editRender: {
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD',
        },
      },
    },
    {
      title: '备注',
      field: 'claimRemarks',
      minWidth: 220,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '请输入备注',
        },
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      api: getNewMaterial,
      columns,
      data: [],
      rowConfig: {
        keyField: 'id', // 使用样品的 id
      },
      height: 'auto',
      showIndexColumn: false,
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      position: 'modal',
      id: 'qualityAssurance-sampleCollection-modal',
    },
  });

  // 打开弹窗时，父组件传入 { rows: 已选择的已处理单据数组 }
  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);

  function init(data) {
    console.log(data, 'datadatadatadatadata');
    const rows = data?.rows || [];
    const list: any[] = [];

    rows.forEach((row: any) => {
      const outputs = row.samplesRecordOutputs || [];
      outputs.forEach((item: any) => {
        if (item.isClaimEnum == '0') {
          list.push({
            id: item.id, // samplesRecordOutputs 的 id
            materialNumber: row.materialNumber,
            number: item.number,
            // 原始卷数（从接口来的 qty，用来做“最大可领”校验）
            originalQty: item.qty,
            // 实际可编辑的领取卷数，初始值 = 默认显示的 qty
            qty: item.qty,
            claimUserId: item.creatorUserId, // 默认领取人 = PD
            claimUserName: item.creatorUserName,
            claimDate: '',
            claimRemarks: '',
          });
        }
      });
    });

    const grid = gridApi.grid as any;
    if (grid?.reloadData) {
      grid.reloadData(list);
    } else if (grid?.loadData) {
      grid.loadData(list);
    }
  }

  async function handleSubmit() {
    const list = gridApi.getDataSource();

    if (!list.length) {
      closeModal();
      return;
    }

    //必填校验：领取人 + 领取日期 + 领取卷数
    const invalidRequired = list.some((r: any) => !r.claimUserId || !r.claimDate || r.qty === null || r.qty === undefined || r.qty === '');
    if (invalidRequired) {
      createMessage.warning('请填写完整的领取人、领取日期和领取卷数');
      return;
    }

    //领取卷数不能大于默认值(originalQty)
    const invalidQty = list.some((r: any) => {
      const qty = Number(r.qty);
      const originalQty = Number(r.originalQty);
      // 非数字直接当错处理
      if (Number.isNaN(qty) || Number.isNaN(originalQty)) return true;
      return qty > originalQty;
    });

    if (invalidQty) {
      createMessage.warning('领取卷数不能大于默认的送样卷数');
      return;
    }

    const payload = list.map((r: any) => {
      const timestamp = r.claimDate ? new Date(r.claimDate).getTime() : null;
      return {
        id: String(r.id),
        claimUserId: String(r.claimUserId),
        claimDate: timestamp,
        claimQty: Number(r.qty),
        claimRemarks: r.claimRemarks || '',
      };
    });
    console.log(payload, 'payload with timestamp and claimQty');

    changeLoading(true);
    changeOkLoading(true);
    try {
      const res = await sampleCollection(payload);
      if (res?.code === 200) {
        createMessage.success(res.msg || '操作成功');
        emit('success');
        closeModal();
      } else {
        createMessage.error(res?.msg || '操作失败');
      }
    } catch (e) {
      console.error(e);
      createMessage.error('请求失败');
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }
</script>

<style scoped lang="less">
  .sample-collection-subtitle {
    font-family: 'HarmonyOS Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    font-weight: 700; // 字重 700
    font-size: 16px; // 字号 16px
    line-height: 24px; // 行高 24px
    letter-spacing: 0; // 字间距 0
    text-align: left; // 左对齐
  }

  .tip {
    margin-top: 8px;
    color: #ff4d4f;
    font-size: 12px;
    text-align: left;
  }
</style>
