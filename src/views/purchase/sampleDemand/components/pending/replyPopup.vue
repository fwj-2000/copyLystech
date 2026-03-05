<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="t('common.replyInfo')"
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button @click="handleSave(false)" type="primary" class="ml-12px" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <Grid />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { VxeTableGridOptions } from '/@/adapter/vxe-table';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick } from 'lodash-es';
  import dayjs from 'dayjs';
  import { getApplyDatas, replyPurchase } from '/@/api/engineering/sample';
  import { getReplyTableColumn, replyEditRules, computeReplyArea } from './configVxe';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();

  const { createMessage } = useMessage();

  const gridOptions: DeepPartial<VxeTableGridOptions<any>> = {
    columns: getReplyTableColumn() as any,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules: replyEditRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      beforePasteMethod: data => {
        const { targetAreas } = data;
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols } = targetAreas[0];

        for (const col of cols) {
          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            col.editRender.props?.disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }

        return true;
      },
      afterPasteMethod: handleAfterPasteMethod,
    },
    pagerConfig: {
      enabled: false,
    },
    // border: true
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    changeLoading(true);
    getApplyDatas(data.ids, true)
      .then(res => {
        const resData = (res.data || [])
          .map((item: any) => {
            return {
              ...item,
              // arrivalDate: dayjs(item.arrivalDate).format('YYYY-MM-DD'),
            };
          })
          .sort(
            // 根据传入的id顺序进行排序
            (a: { id: string }, b: { id: string }) => data.ids.indexOf(a.id) - data.ids.indexOf(b.id),
          );
        gridApi.grid.reloadData(resData);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSave(isSubmit = false) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    const list = gridApi.grid.getFullData().map(item => {
      const obj = pick(item, ['id', 'replySizeLong', 'replySizeWide', 'replyQty', 'arrivalDate', 'expressInformation', 'replyRemark']);
      if (obj.arrivalDate && typeof obj.arrivalDate !== 'string') {
        obj.arrivalDate = typeof obj.arrivalDate.format === 'function' ? obj.arrivalDate.format('YYYY-MM-DD') : dayjs(obj.arrivalDate).format('YYYY-MM-DD');
      }
      return obj;
    });
    changeLoading(true);
    return replyPurchase(list, isSubmit)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        isSubmit && closePopup();
      })
      .catch(() => {})
      .finally(() => {
        emits('reload');
        changeLoading(false);
      });
  }

  /** 只允许输入数字的字段 */
  const numberFields = ['replySizeWide', 'replySizeLong', 'replyQty'];
  const dateFields = ['arrivalDate'];
  /**
   * 复制黏贴处理
   * @param params
   */
  function handleAfterPasteMethod({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }

    targetAreas.forEach((item: any) => {
      item.rows.forEach((row: any) => {
        item.cols.forEach((col: any) => {
          const rowValue = row[col.field];

          if (numberFields.includes(col.field) && Number.isNaN(+rowValue)) {
            row[col.field] = '';
            createMessage.warning(t('sys.validate.number'));
          } else if (dateFields.includes(col.field)) {
            const value = dayjs(/^\d+$/.test(rowValue) ? +rowValue : rowValue);
            const flag = value.isValid();
            row[col.field] = flag ? value.format('YYYY-MM-DD') : null;
            flag || createMessage.warning(t('sys.validate.date'));
          }
        });
        row.replyArea = computeReplyArea(row);
      });
    });

    return true;
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }

  :deep(.border-right) {
    border-right: 1px solid rgb(228 228 231);
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
