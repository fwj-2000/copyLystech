<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    class="full-popup">
    <div class="flex-column">
      <AddTable :dataSource="state.tableData" ref="AddTableRef"></AddTable>
    </div>
    <Preview ref="filePreviewRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, unref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addMoldapply, getMoldapplyDetail } from '/@/api/engineering/mould';
  import { ADD_COLUMNS } from '../apply/components/config';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import AddTable from '../apply/components/addTable.vue';

  const filePreviewRef = ref<ModalComponent | null>(null);
  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    tableData: any[];
    fileList: any[];
    costcenterlist: [];
    factoryList: [];
    productTypelist: [];
  }

  const state = reactive<State>({
    mouldNo: '',
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
    tableData: [],
    fileList: [],
    costcenterlist: [],
    factoryList: [],
    productTypelist: [],
  });
  const AddTableRef = ref();
  const { title } = toRefs(state);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup }] = usePopupInner(init);

  async function handleSubmit(type = 1) {
    try {
      const { data, code } = await addMoldapply({ list: state.tableData, type, id: state.id });
      if (code === 200) {
        state.tableData = [];
        closePopup();
        createMessage.success(t('common.saveSuccessText'));
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    }
  }

  function init({ id, title }) {
    state.title = title;
    state.id = id;
    getMoldapplyDetailFn(id);
  }

  async function getMoldapplyDetailFn(id) {
    const { data, code } = await getMoldapplyDetail(id);
    if (code === 200) {
      state.tableData = data.map(o => {
        o.urgentLevel = o.urgentLevel ? String(o.urgentLevel) : '';
        return o;
      });
      unref(AddTableRef).setTableData(data);
      getRowSpanRuleFn();
    }
  }

  function getRowSpanRuleFn() {
    ADD_COLUMNS[0].customCell = (_, index) => {
      if (index === 0) return { rowSpan: state.tableData.length };
      else return { rowSpan: 0 };
    };
  }
</script>

<style lang="less" scoped>
  .flex-column {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .warp {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-left {
      flex: 1;
      display: flex;
      align-items: baseline;
      padding: 0 12px;
      min-width: 400px;
      flex-wrap: nowrap;
    }

    &-right {
      //   position: absolute;
      //   right: 0;
    }
  }

  .table-box {
    height: 100%;
    background-color: rgb(88 105 132);
  }
</style>
