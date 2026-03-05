<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCpktagset, postCpktagSetBatchDel, postCpktagsetBatchDisable, postCpktagsetBatchEnable } from '/@/api/qualityAssurance/cpk';
  import { getColumns, getSchema } from '/@/views/qualityAssurance/cpk/cpkIdentificationSetting/config';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import AddPopup from './components/AddPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deletePurchaseQuotationList } from '/@/api/finance/materialPrice';
  import { message } from 'ant-design-vue';

  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();

  defineOptions({ name: 'qualityAssurance-cpk-cpkIdentificationSetting' });

  const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();

  const [Grid, { reload, getSelectRowKeys }] = useVbenVxeGrid({
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
      schema: getSchema(),
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkIdentificationSetting',
      columns: getColumns(),
      showIndexColumn: true,
      api: getCpktagset,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
    },
  });

  function handleEdit(row) {
    openAddPopup(true, [row]);
  }

  function handleAdd() {
    openAddPopup(true, []);
  }

  function getAction(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        // auth: 'btn_remove',
        modelConfirm: {
          onOk: handleSingDel.bind(null, record),
        },
      },
    ];
  }

  function handleEnable() {
    const keys = getSelectRowKeys();
    if (isEmpty(keys)) {
      return createMessage.warning(t('common.selectText'));
    }
    postCpktagsetBatchEnable(keys).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        reload();
      }
    });
  }

  function handleDisabled() {
    const keys = getSelectRowKeys();
    if (isEmpty(keys)) {
      return createMessage.warning(t('common.selectText'));
    }
    postCpktagsetBatchDisable(keys).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        reload();
      }
    });
  }

  function handleBatchDel() {
    const keys = getSelectRowKeys();
    if (isEmpty(keys)) {
      return createMessage.warning(t('common.selectText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          postCpktagSetBatchDel(keys).then(({ code, msg }) => {
            if (code == 200) {
              createMessage.success(msg);
              reload();
            }
          });
        } catch (e) {
          reload();
          throw e;
        }
      },
    });
  }

  function handleSingDel(row) {
    postCpktagSetBatchDel([row.id]).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        reload();
      }
    });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="handleAdd"> {{ t('common.addText') }} </a-button>
              <a-button type="primary" ghost @click="handleEnable"> {{ t('common.enableText') }} </a-button>
              <a-button @click="handleDisabled"> {{ t('common.disableText') }} </a-button>
              <!--              <a-button type="primary" danger ghost @click="handleBatchDel"> {{ t('common.batchDelText') }} </a-button>-->
              <a-button danger @click="handleBatchDel">{{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getAction(row, rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
    <AddPopup @register="registerAddPopup" @reload="reload" />
  </div>
</template>
