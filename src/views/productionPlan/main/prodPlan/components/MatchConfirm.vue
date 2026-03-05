<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :showOkBtn="true"
    :title="t('匹配确认单')"
    destroyOnClose
    @ok="handleSave"
    class="full-popup">
    <ScrollContainer>
      <MatchTable ref="matchRef" type="checkbox" :originTablesConfig="originTablesConfig" />
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { OriginTable, TargetTable, MatchTable } from '/@/components/CustomComponents';
  const emits = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  interface State {
    type: 'add' | 'edit' | 'view';
  }
  const columns = [
    {
      title: '表名',
      field: 'tableName',
    },
    {
      title: '表描述',
      field: 'tableDesc',
    },
  ];
  const originTablesConfig = reactive([
    {
      id: 'importTable',
      title: '导入数据表',
      columns: columns,
    },
    {
      id: 'dbTable',
      title: '原有数据表',
      columns: columns,
    },
  ]);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const matchRef = ref();
  async function init(data) {
    matchRef.value.init({
      originTable: {
        importTable: [
          {
            tableName: '表1',
            tableDesc: '表1描述',
            seq: 1,
          },
          {
            tableName: '表1',
            tableDesc: '表1描述',
            seq: 2,
          },
          {
            tableName: '表1',
            tableDesc: '表1描述',
            seq: 3,
          },
        ],
        dbTable: [
          {
            tableName: '表2',
            tableDesc: '表2描述',
          },
        ],
      },
      targetTable: [],
    });
  }
</script>
<style lang="less" scoped>
  :deep(.scrollbar__view) {
    padding: 10px;
    height: 100%;
  }
</style>
