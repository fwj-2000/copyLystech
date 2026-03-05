<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    title="CPK审核"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    :confirmLoading="loading"
    class="h-full"
    @ok="handleSubmit">
    <template #insertToolbar>
      <a-button :loading="loading" @click="handleSubmit" type="primary">{{ t('common.submit') }} </a-button>
    </template>
    <Grid style="height: calc(100% - 50px)">
      <template #toolbar-actions>
        <Subtitle :title="t('dict.CPK.CPKReportUpload')" />
      </template>
      <template #attachment="{ row }">
        <template v-if="row.fileList && row.fileList.length > 0">
          <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
        </template>
        <template v-else></template>
      </template>
      <template #action="{ row }">
        <a-upload v-feature :multiple="false" :before-upload="beforeInstallUpload.bind(null, row)" :showUploadList="false">
          <i class="icon-ym icon-ym-upload" style="color: rgb(26 144 255)" />
        </a-upload>
      </template>
    </Grid>
    <AttachList @register="registerAttach" @reload="emit('reload')" @close="emit('reload')" @changeFileList="handleAttachChange" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, toRefs, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getRules } from '/@/views/engineering/PCCBeta/components/PccMaterial/config';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { cloneDeep, defaultsDeep, isError, isArray } from 'lodash-es';
  import { getMaterialQueryByMaterialCode, uploadInstallFile } from '/@/api/engineering/pcc';
  import { getReviewColumn } from '../config';
  import { TableAction } from '/@/components/Table';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import AttachList from '../../cpkUploadReport/components/AttachList.vue';
  import { postCpkCommitWithOpinion } from '/@/api/qualityAssurance/cpk';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const emit = defineEmits(['register', 'reload']);
  const state = reactive({
    loading: false,
  });

  const { loading } = toRefs(state);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerAttach, { openModal: openAttachModal }] = useModal();

  const [Grid, { loadData, reloadData, getDataSource, grid }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getReviewColumn(),
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
      },
      currentRowConfig: {
        isFollowSelected: true,
      },
      scrollY: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      rowConfig: {
        keyField: 'uuid',
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: handleBeforePaster,
      },
      // i18nConfig: {
      // 	moduleCode: 'PCCColumn',
      // },
    },
  });

  function handleReload(list) {
    console.log(list);
  }

  async function init(data) {
    const list = data.map(item => ({
      ...item,
      uuid: item.id,
      riskShipName: item.riskShip ? '是' : '否',
      riskShip: item.riskShip ? 1 : 0,
      ygaWaiverName: item.ygaWaiver ? '是' : '否',
      ygaWaiver: item.ygaWaiver ? 1 : 0,
      ygaWaiverRName: item.ygaWaiverR === 1 ? 'OK' : 'NG',
      approve: item.approve ? 1 : 0,
      approveName: item.approveName ? '是' : '否',
      approveRName: item.approveR === 1 ? 'OK' : 'NG',
    }));
    await nextTick();
    reloadData(list);
  }
  const normalizeToArray = value => {
    if (Array.isArray(value)) {
      return value;
    }
    if (value) {
      return [value];
    }
    return [];
  };
  function handleSubmit() {
    const list = getDataSource();
    const params = {
      saveAndCommit: true,
      // list: cloneDeep(list).map(item => {
      // 	const target = {
      // 		...item,
      // 		reviewList: [
      // 			...item.reviewList,
      // 			{
      // 				node: 'WH',
      // 				handlerList: isArray(item.wh) ? item.wh : item.wh ? [item.wh] : [],
      // 			}
      // 		]
      // 	}
      // 	delete target.wh
      // 	return target
      // }),
      list: cloneDeep(list).map(item => {
        const target = {
          ...item,
          handlerList: normalizeToArray(item.wh),
        };
        return target;
      }),
    };
    changeLoading(true);
    state.loading = true;
    postCpkCommitWithOpinion(params)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          emit('reload');
          closePopup();
        }
      })
      .finally(() => {
        changeLoading(false);
        state.loading = false;
      });
  }

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(props.api, getProcessList());
      const { cols, rows } = targetAreas[0];

      const materialFnList = {};
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          if (field === 'originPartNumber') {
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      // 重新执行粘贴的料号逻辑
      if (!isEmpty(materialFnList)) {
        getMaterialQueryByMaterialCode(Object.keys(materialFnList)).then(({ data }) => {
          data.forEach(item => {
            // 执行校验函数
            const result = materialFnList[item['materialCode']]?.(item);
            console.log(result);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function beforeInstallUpload(row, file) {
    const params = {
      file: file,
      filePath: 'CPK',
    };
    uploadInstallFile(params)
      .then(({ code, msg, data }) => {
        if (code == 200) {
          defaultsDeep(row, { fileList: [] });
          row.fileList.push(data);
          createMessage.success(msg);
        }
      })
      .catch(() => {
        changeLoading(false);
        state.loading = false;
      });
    return false;
  }

  function handleAttachmentModal(row) {
    if (row.currentNode === 'EPMQPM1') {
      // 审核节点为`EPMQPM1`，用户需要能够修改附件(删除、新增)，但不需要选中`下一节点处理人`，因此创建一个新的`mode`，作为标识区分
      row.mode = 'EPMQPM1Review';
    } else {
      row.mode = 'view';
    }
    openAttachModal(true, [row]);
  }

  function handleAttachChange(list: { id: string; fileList: Array<any> }) {
    const rows = getDataSource();
    const row = rows.find(el => el.id === list.id);
    row && Object.assign(row, { fileList: list.fileList });
  }
</script>

<style lang="scss" scoped>
  :deep(.scrollbar__view) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  :deep(.scroll-container) {
    height: 100%;
  }
</style>
