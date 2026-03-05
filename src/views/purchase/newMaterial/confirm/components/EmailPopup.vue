<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :showOkBtn="true"
    :okButtonText="t('common.sendText')"
    :title="t('common.sendEmail')"
    destroyOnClose
    @ok="handleSave"
    class="full-popup">
    <div class="h-full p-10px">
      <Subtitle :title="t('common.newMateriaInfo')" />
      <div class="flex mb-8px p-10px">
        <span class="flex">{{ t('common.theme') }}:</span> <LydcInput v-model:value="state.theme" :placeholder="t('common.emailThemeTip')"></LydcInput>
      </div>
      <Grid style="height: calc(100% - 90px)"></Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { emailColumns } from '../config';
  import { sendEmail } from '/@/api/purchase/newMateriaConfirm';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
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

  const [Grid, { reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-newMaterial-confirm-email',
      columns: emailColumns,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  async function init(data) {
    state.dataSource = data.list;
    reloadData(data.list || []);
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
      console.error(error);
      changeLoading(false);
    }
  }
</script>
