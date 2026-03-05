<template>
  <div>
    <VxeGrid ref="gridRef" v-bind="gridOptions" :data="[...toRaw(props.data)]" @checkboxChange="handleCheckboxChange" @custom="handleCustom">
      <template #nodeRecord="{ row }">
        <a class="table-a" @click="openNodeRecordModalFn(row)" style="cursor: pointer">{{ t('common.viewDetails') }}</a>
      </template>
      <template #pushRecords="{ row }">
        <!-- 推送记录 -->
        <span class="table-a" @click="handlePushRecords(row)">{{ t('common.viewDetails') }}</span>
      </template>
      <template #drawingshistory="{ row }">
        <a class="table-a" @click="handleDrawView(row)">{{ t('common.viewDetails') }}</a>
      </template>
    </VxeGrid>

    <PushRecords @register="registerPushRecords" />
    <NodeModal @register="registerNodeRecord" />
    <FileListModal @register="registerFile" />
  </div>
</template>

<script lang="ts" setup>
  import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { getNodelist } from '/@/api/engineering/mould';
  import { watch, ref, toRaw } from 'vue';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { getDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { handleRecallCopyMethod } from '/@/adapter/utils';
  import { getVxeTableId, getTableCustomData, saveTableCustomData } from './config';
  import { useRoute } from 'vue-router';

  import { NodeModal } from '/@/components/CustomComponents';
  import PushRecords from '/@/views/engineering/mouldBusiness/review/components/PushRecords.vue';
  import { FileListModal } from '/@/components/Upload';
  import { VxeGrid } from 'vxe-table';

  const props = defineProps({
    /** 表格数据 */
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    /** 选中行数据信息 */
    checkedList: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    /** 是否禁用复选框 */
    disabledCheck: {
      type: Boolean,
      default: false,
    },
    /** 表格列配置 */
    columns: {
      type: Array as PropType<VxeGridPropTypes.Columns>,
      default: () => [],
    },
  });

  const emits = defineEmits(['update:checkList', 'reload']);

  const { t } = useI18n();
  const route = useRoute();

  const gridRef = ref<InstanceType<typeof VxeGrid>>();

  const gridOptions: VxeGridProps = {
    // 使用路由作为展开表id，将`/`替换为`-`，如: `/engineering/mouldBusiness/review` -> `engineering-mouldBusiness-review-expanded-table`
    id: getVxeTableId(route.path),
    maxHeight: 400,
    minHeight: 80,
    columns: props.columns,
    showOverflow: true,
    pagerConfig: {
      enabled: false,
    },
    checkboxConfig: {
      showHeader: false,
      checkRowKeys: props.checkedList,
      highlight: true,
      checkMethod: () => !props.disabledCheck,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: false, // 是否启用多区域选取功能
      selectCellByHeader: true, // 启用后有效，点击列头是否选取当前列的所有单元格
      excludeFields: ['action', 'checkbox', 'sort', 'radio', 'expand'], // 排除指定列禁止被选取
    },
    rowConfig: {
      keyField: 'id',
    },
    cellConfig: {
      height: 40,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: false, // 是否启用粘贴功能
      copyMethod: handleRecallCopyMethod,
    },
    virtualYConfig: {
      enabled: true, // 是否开启虚拟滚动
      gt: 10,
    },
    proxyConfig: {
      enabled: false,
    },
    keyboardConfig: {
      arrowCursorLock: true, // 方向键光标锁，开启后处于非聚焦式编辑状态，将支持在编辑状态中通过方向键切换单元格。（切换为聚焦编辑状态，可以按 F2 键或者鼠标左键点击输入框，就可以用方向键左右移动输入框的光标）
      isClip: true, // 是否开启复制粘贴
      isArrow: true, // 是否开启方向键功能
      isShift: true, // 是否开启同时按住方向键以活动区域为起始，向指定方向扩展单元格区域
      isTab: true, // 是否开启 Tab 键功能
      isEnter: false, // 是否开启回车键功能
      isEdit: false, // 是否开启任意键进入编辑（功能键除外）
      isBack: false, // 是否开启回退键功能
      isDel: false, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
      isFNR: true, // 是否开启查找与替换
    },
    customConfig: {
      enabled: true,
      storage: true,
      modalOptions: {
        resize: false,
      },
      // 个性化 缓存配置
      restoreStore: ({ id }) => getTableCustomData(id),
      updateStore: ({ id, storeData }) => saveTableCustomData(id, storeData),
    },
  };

  function handleCheckboxChange() {
    const rows: Array<any> = [];
    if (gridRef.value?.getCheckboxRecords) {
      const records = gridRef.value?.getCheckboxRecords?.() ?? [];
      rows.push(...records);
    }

    emits(
      'update:checkList',
      rows.map(item => item.id),
      rows,
    );
  }

  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();
  /** 打开节点记录弹窗 */
  function openNodeRecordModalFn(record: any = '') {
    openNodeRecordModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  /** 变更选中行数据 */
  watch(
    () => props.checkedList,
    newVal => {
      if (typeof gridRef.value?.clearCheckboxRow !== 'function') return;
      gridRef.value.clearCheckboxRow().then(() => {
        gridRef.value && gridRef.value.setCheckboxRowKey(newVal, true);
      });
    },
  );

  const [registerPushRecords, { openModal: openPushRecords }] = useModal();
  /** 推送记录 */
  function handlePushRecords(row: { id: string }) {
    openPushRecords(true, {
      woId: row.id,
    });
  }

  const [registerFile, { openModal: openFileList }] = useModal();
  function handleDrawView(record) {
    openFileList(true, {
      id: record.id,
      downloadApi: fileDownload,
      listApi: getDrawingshistoryFn.bind(null, { InsidePartNumber: record.insidePartNumber, id: record.insidePartNumberId }),
    });
  }

  function getDrawingshistoryFn({ InsidePartNumber, id }) {
    return getDrawingshistory(
      {
        InsidePartNumber,
        DrawingsType: 'DesensitizedDrawings',
        id: id,
      },
      id,
    );
  }

  function handleCustom({ type }) {
    if (type === 'confirm' || type === 'reset') {
      emits('reload');
    }
  }

  defineExpose({
    openCustomConfigModal: () => {
      gridRef.value?.openCustom?.();
    },
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-table-custom-popup--table-wrapper th) {
    background-color: #fff;
  }
</style>
