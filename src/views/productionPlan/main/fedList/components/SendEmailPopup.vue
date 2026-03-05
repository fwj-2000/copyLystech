<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('dict.FeedList.sendEmail')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup p-10px">
    <div class="title-box">
      <div class="title-stick">
        <div class="gun"></div>
        <div class="title">{{ t('dict.FeedList.feedInfomation') }}</div>
      </div>
    </div>
    <div class="pl-12px pr-12px mt-13px">
      <!-- <a-form>
        <a-form-item :label="t('dict.CommonCol.themeText')">
          <a-input :placeholder="t('ui.placeholder.input')"></a-input>
        </a-form-item>
      </a-form> -->
      <BasicForm @register="registerForm"></BasicForm>
    </div>
    <Grid style="height: calc(100% - 97px)"> </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { sendEmailColumn } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getEmailDetail, sendmail } from '/@/api/mps/productionPlan/MPS';
  import { BasicForm, useForm } from '/@/components/Form';
  const { t } = useI18n();

  const emits = defineEmits(['reload']);

  const btnLoading = ref(false);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, resetFields, validate, getFieldsValue }] = useForm({
    labelWidth: 0,
    schemas: [
      {
        field: 'themeText',
        label: '主题',
        component: 'Input',
        componentProps: { placeholder: t('dict.FeedListColumn.themeText') },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
    ],
  });

  const [Grid, { reloadData, validate: gridValidate, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-sendEmailList',
      columns: sendEmailColumn,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: '	FeedListColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
    },
  });

  async function init({ inMaterialNos }) {
    changeLoading(true);
    const { data, code } = await getEmailDetail(inMaterialNos).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      reloadData(data);
    }
  }

  // 点击提交
  async function handleSaveFn() {
    const tableData = await getDataSource();
    const { themeText } = await getFieldsValue();
    const values = await validate();
    if (!values) return;
    changeLoading(true);
    const { code, msg } = await sendmail({ themeText, SupplierEmailInfos: tableData }).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
    } else {
      createMessage.error(msg);
    }
  }
</script>
<style lang="scss" scoped>
  .title-box {
    padding: 10px 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-stick {
      display: flex;
      align-items: center;

      .gun {
        border-radius: 2px;
        background: #ff7b00;
        width: 2px;
        height: 14px;
        margin-right: 10px;
      }

      .title {
        color: #1a1a1a;
        font-family: 'Microsoft YaHei UI';
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
      }
    }
  }
</style>
