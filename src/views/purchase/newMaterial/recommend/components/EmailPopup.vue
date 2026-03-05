<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.sendText')"
    :title="t('common.sendEmail')"
    destroyOnClose
    @ok="handleSave"
    class="full-popup">
    <div class="h-full p-10px">
      <Subtitle :title="t('common.newMateriaInfo')" />
      <div class="flex mb-8px p-10px">
        <span class="flex">{{ t('common.theme') }}:</span> <LydcInput v-model:value="state.theme" :placeholder="t('common.emailThemeTip')"></LydcInput>
      </div>
      <BasicTable @register="registerTable" :data-source="state.dataSource"></BasicTable>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { emailColumns } from '../config';
  import { sendEmail } from '/@/api/purchase/newMateria';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: 'add' | 'edit' | 'view';
    theme: string;
    dataSource: any;
  }

  const state = reactive<State>({
    type: 'add',
    theme: '',
    dataSource: [],
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerTable, { getSelectRowKeys }] = useTable({
    columns: emailColumns,
    rowKey: 'id',
    // rowSelection: { type: 'checkbox' },
    useSearchForm: false,
    showTableSetting: false,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  });

  async function init(data) {
    state.dataSource = data.list;
    state.theme = '';
  }

  const { t } = useI18n();
  async function handleSave() {
    if (state.theme == '') {
      return message.info(t('common.emailThemeTip'));
    }
    changeLoading(true);
    try {
      const r = await sendEmail({
        ids: state.dataSource.map(item => {
          return item.id;
        }),
        themeText: state.theme,
      });
      if (r.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      throw error;
    }
    // const idList = getSelectRowKeys() || [];
    // if (idList.length) {
    // } else {
    //   message.info(t('common.selectText'));
    // }
  }
</script>
