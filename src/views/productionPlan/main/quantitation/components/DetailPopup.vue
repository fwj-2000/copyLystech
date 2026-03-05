<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :cancelButtonProps="{ class: 'mx-12px' }"
    :title="t('common.MC')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <a-button @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full p-10px">
      <Grid>
        <template #toolbar-actions>
          <div style="position: relative; top: 8px">
            <Subtitle :title="t('common.MC')"></Subtitle>
          </div>
        </template>

        <template #engineeringRemarks="{ row }">
          <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
            <div v-html="row.engineeringRemarks"></div>
          </a-tooltip>
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { getPackageColumns } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { storageDetail, saveDetail, getDetails } from '/@/api/productionPlan/mainplan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getUserInfoList } from '/@/api/permission/user';
  import { trim, replace } from 'lodash-es';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'productionPlan-main-quantitation-list-mainPlanDetail',
      height: 'auto',
      columns: getPackageColumns() as any,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        refresh: false,
        slots: {
          tools: 'buttons',
        },
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
      },
      position: 'modal',
    },
  });

  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        gridApi.reloadData(
          r.data.map(item => {
            item = {
              ...item,
              stockNum: item.stockNum ?? 0,
              onEdit: true,
              editable: true,
            };
            return item;
          }),
        );
      }
    } catch (error) {
      console.log(error);
      closePopup();
    }
    changeLoading(false);
  }

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // `下一节点处理人(模切计划)` 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'mcPlanUserId', name: 'mcPlanUserName' });

    return true;
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param fieldConfig 赋值字段配置
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item[fieldConfig.id] || '';
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        gridApi.grid.setRow(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  async function handleSubmit(type) {
    changeOkLoading(true);
    const params = gridApi.getDataSource().map(item => {
      return {
        id: item.id,
        stockNum: item.stockNum ?? 0,
        demandQty: item.demandQty,
        requirementRegression: item.requirementRegression,
        requirementProduction: item.requirementProduction,
        mcPlanUserId: item.mcPlanUserId,
        mcPlanUserName: item.mcPlanUserName,
        remark: item.remark,
      };
    });
    try {
      const r = type == 'storage' ? await storageDetail(params) : await saveDetail(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeOkLoading(false);
    } catch (error) {
      console.log(error);
      changeOkLoading(false);
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
<style scoped lang="less">
  .popup-container {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 20px;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
