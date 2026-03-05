<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.asignBom')" showOkBtn @ok="handleSubmit" width="1200px">
    <div class="assign-tip">
      {{ state.material }}
      <!-- 的申请数量是 -->
      {{ t('tip.MPS.tip26') }}
      <span class="text-red-600">{{ state.materialNum }}</span>
      <!-- ,请选择BOM表进行分配 -->
      {{ t('tip.MPS.tip27') }}
    </div>
    <Grid class="mt-20px" style="height: 380px"> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { assignBOMColumn } from './allocateConfig';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { materialPartPushbom, materialPartBomlist } from '/@/api/mps/productionPlan/materialPlan';

  const { t } = useI18n();
  const state = reactive({
    id: '',
    material: '',
    materialNum: '',
    initBoned: '', // 初始化的保税类型
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'pruductionPlan-main-materialPlan-assignBOM',
      pagerConfig: {
        autoHidden: true,
      },
      columns: assignBOMColumn,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDemandPlanColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      proxyConfig: {
        autoLoad: false,
      },
      clipConfig: {
        isCopy: true,
        isCut: true,
        isPaste: true,
      },
      position: 'modal',
    },
  });

  const emit = defineEmits(['reload', 'register']);
  const { createMessage, createConfirm } = useMessage();
  async function reloadGrid() {
    gridApi.setLoading(true);
    const res = await materialPartBomlist({ id: state.id });
    const { data } = res;
    gridApi.reloadData(data || []);
    gridApi.setLoading(false);
    // 提取保税类型
    const bondItem = data.find(item => item.qty > 0);
    state.initBoned = bondItem ? bondItem.isBonded : '';
  }
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  async function init(data) {
    // 更新数据
    state.material = data.material;
    state.materialNum = data.materialNum;
    state.id = data.id;
    reloadGrid();
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    const list = await gridApi.getDataSource();
    const bomList: { version: string; qty: number; isBonded: boolean }[] = [];
    // 校验是否为同种保税、是否选择了禁用bom
    let isSameBoned: boolean | null | 'not' = null;
    let isDisabledBom = false;
    let currentBoned: boolean | null = null;
    // 计算qty总量
    const qty = list.reduce((pre, cur) => {
      if (cur.qty && cur.qty > 0) {
        if (isSameBoned === null) {
          isSameBoned = cur.isBonded;
          currentBoned = cur.isBonded;
        } else if (cur.isBonded !== isSameBoned) {
          isSameBoned = 'not';
        }
        if (cur.enable) {
          bomList.push({
            version: cur.version,
            qty: cur.qty,
            isBonded: cur.isBonded,
          });
        } else {
          isDisabledBom = true;
        }
      }
      return Number(pre || 0) + Number(cur.qty || 0);
    }, 0);
    if (isSameBoned === 'not') {
      createMessage.error(t('tip.MPS.tip22')); // 请保持分配的BOM保税类型为同一种
      return;
    }
    if (isDisabledBom) {
      createMessage.error(t('tip.MPS.tip23')); // 请不要分配数量到禁用的BOM
      return;
    }
    if (qty != state.materialNum) {
      createMessage.error(t('tip.MPS.tip24', state.materialNum)); // 分配数量需要等于申请数量
      return;
    }
    // 当前bom从保税变成非保税，需要主需求重新下推数据，是否继续？
    if (currentBoned == state.initBoned) {
      handleAfterSubmit(bomList);
    } else {
      createConfirm({
        iconType: 'warning',
        content: t('tip.MPS.tip25'), // bom切换后，需要主需求重新下推，申请数量有可能会变更，是否继续？
        onOk: () => {
          handleAfterSubmit(bomList);
        },
        onCancel: () => {
          changeOkLoading(false);
        },
      });
    }
  }
  // 提交
  async function handleAfterSubmit(bomList) {
    try {
      const res = await materialPartPushbom({
        id: state.id,
        bomList: bomList,
      });
      createMessage.success(res.msg);
      emit('reload');
      closeModal(); //关闭弹窗
    } finally {
      changeOkLoading(false);
    }
  }
</script>

<style scoped lang="scss">
  .assign-tip {
    padding: 10px 16px;
    border: 1px solid #ff7b00;
    border-radius: 4px;
    color: #1a1a1a;
    font-size: 14px;
    line-height: 22px;
    background-color: rgba(255, 123, 0, 0.1);
  }
</style>
