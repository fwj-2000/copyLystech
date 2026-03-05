<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'mr-12px' }"
    :cancelButtonProps="{ class: 'my-12px' }"
    :title="t('common.deliveryDate')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <a-button class="ml-12px" @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full p-10px">
      <Grid>
        <template #toolbar-actions>
          <Subtitle placement="vxe" :title="t('common.deliveryDate')"></Subtitle>
        </template>
        <template #engineeringRemarks="{ row }">
          <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
            <div v-html="row.engineeringRemarks"></div>
          </a-tooltip>
        </template>
        <template #expand="{ row }">
          <div style="padding-right: 20px; padding-top: 10px">
            <SubTable :list="row.children" />
          </div>
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { detailcols } from './detailConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { storageMcDetail, updateMcAPI, getMcDetails, getBomDetail } from '/@/api/productionPlan/mainplan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { defineAsyncComponent } from 'vue';
  import dayjs from 'dayjs';
  import { trim, replace } from 'lodash-es';
  import { useRouter } from 'vue-router';
  const SubTable = defineAsyncComponent(() => import('./BomTable.vue'));

  const router = useRouter();
  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [Grid, $grid] = useVbenVxeGrid({
    gridOptions: {
      id: 'materialRequirement-deliveryDate-edit',
      columnConfig: {
        resizable: true,
      },
      // showOverflow: false,
      columns: detailcols,
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: {
        // 下一节点处理人 必填
        diecuttingPlanUserId: [{ required: true, message: t('common.required') }],
        // 预估材料交期 必填
        estimatedMaterialsTime: [{ required: true, message: t('common.required') }],
      },
      toolbarConfig: {
        refresh: false,
        expandAll: true,
      },
      customConfig: {
        allowVisible: false,
      },
      pagerConfig: {
        enabled: false,
      },
      virtualYConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      // clipConfig: {
      //   isPaste: true,
      //   beforePasteMethod: handleBeforePaster,
      // },
      i18nConfig: {
        moduleCode: 'QuantitativeDeliveryConfirmColumn',
      },
      position: 'modal',
      expandConfig: {
        lazy: true,
        loadMethod: async ({ row }) => {
          const r = await getBomDetail({ id: row.id });
          row.children = r.data;
        },
      },
    },
  });
  const { reloadData, getDataSource, setRowExpand } = $grid;
  async function init(data) {
    changeLoading(true);
    const r = await getMcDetails(data.ids);
    if (r.code == 200) {
      reloadData(
        r.data.map(item => {
          item = {
            ...item,
            estimatedMaterialsTime: item.estimatedMaterialsTime ? dayjs(item.estimatedMaterialsTime).tz().format('YYYY-MM-DD') : '',
            mcRemark: item.mcRemark ?? item.pcRemark,
          };
          return item;
        }),
      );
    }

    // setTimeout(() => {
    //   console.log('setRowGroupExpandsetRowGroupExpandsetRowGroupExpandsetRowGroupExpand');
    //   setRowExpand(getDataSource(), true);
    // }, 1000);
    changeLoading(false);
  }

  // 跳转到量试订单评审详情
  function openPdDetailFn(data) {
    const { engineeringInformationId } = data;
    router.push(`/engineering/data/produce?id=${engineeringInformationId}&type=view`);
  }

  async function handleSubmit(type) {
    if (type !== 'storage' && (await $grid.grid.validate(true))) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return false;
    }

    changeOkLoading(true);
    const params = getDataSource().map(item => {
      return {
        id: item.id,
        estimatedMaterialsTime: item.estimatedMaterialsTime,
        mcRemark: item.mcRemark,
        diecuttingPlanUserId: item.diecuttingPlanUserId,
        diecuttingPlanUserName: item.diecuttingPlanUserName,
      };
    });
    // 如果数据都被删除了，直接关闭弹窗
    if (params.length) {
      try {
        const r = type == 'storage' ? await storageMcDetail(params) : await updateMcAPI(params);
        if (r.code == 200) {
          createMessage.success(t('sys.api.operationSuccess'));
          if (type != 'storage') {
            closePopup();
            emits('reload');
          }
        }
        changeOkLoading(false);
      } catch (error) {
        changeOkLoading(false);
      }
    } else {
      closePopup();
    }
  }
  // 复制富文本
  function richTextToPlainText(html) {
    if (!html) return '';

    // 创建一个临时的div元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 获取纯文本内容
    let text = tempDiv.textContent || tempDiv.innerText || '';

    // 使用lodash处理文本
    text = trim(text);
    text = replace(text, /\s+/g, ' '); // 将多个空白字符替换为单个空格
    text = replace(text, /\n\s*\n/g, '\n'); // 清理多余的空行

    return text;
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
