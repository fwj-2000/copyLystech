<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.type == 'edit'"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    @open-change="handleVisibleChange"
    :destroy-on-close="true"
    class="full-popup top-0 ly-prod-detail">
    <template #insertToolbar>
      <div v-if="state.type == 'call'">
        <a-button @click="handleCall" type="primary" class="ml-8px">回复中</a-button>
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
    </template>
    <ScrollContainer style="background: #ebeef5" class="pt-3">
      <div>
        <Card>
          <template #title>
            <div class="ly-prod-detail-base">
              <div>基础信息</div>
            </div>
          </template>
          <Descriptions v-bind="descOptions">
            <template v-for="(item, i) in simpleDesc" :key="i">
              <Descriptions.Item v-if="state.base[item.dataIndex]" :label="item.title">
                {{ toVal(item, state.base) }}
              </Descriptions.Item>
            </template>
          </Descriptions>
        </Card>
        <Card>
          <template #title>
            <div class="ly-prod-detail-base">
              <div>客户反馈</div>
            </div>
          </template>
          <div>
            <LydcTinymceEditor
              v-model:value="state.editor"
              :height="300"
              placeholder="客户回复"
              :toolbar="toolbar"
              :plugins="plugins"
              :showImageUpload="false"
              :options="{
                paste_data_images: false,
              }" />
          </div>
        </Card>
        <Card>
          <template #title>备案表</template>
          <BasicTable @register="registerTable" :data-source="state.base.DataList"></BasicTable>
        </Card>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { debounce } from '/@/utils/debounce';
  // import { SimpleTable } from '/@/components/SimpleTable';
  import { customReplay, getReplayDetail, saveReplaying } from '/@/api/business/filings';
  import { simpleDesc, affairColumn, descOptions } from './config';
  import Card from './Card.vue';
  import { formatTableDefaultText } from '/@/utils';
  import { ScrollContainer } from '/@/components/Container';
  import { message, Descriptions } from 'ant-design-vue';
  import { toVal } from '/@/utils/baseinfo';

  const emits = defineEmits(['register', 'refresh']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const toolbar = ['bold italic underline code codesample bullist numlist media'];
  const plugins = [''];

  const state = reactive({
    type: 'add',
    base: {
      DataList: [],
    },
    editor: '',
    Id: '',
    title: '',
  });
  const { title } = toRefs(state);

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);
  async function init(data) {
    state.Id = data.id;
    state.type = data.type;
    state.title = data.title + '备案表';
    getFillDetail(state.Id);
  }

  // 表格配置
  const [registerTable] = useTable({
    columns: affairColumn,
    useSearchForm: false,
    ellipsis: true,
    canResize: false,
    pagination: false,
    showTableSetting: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  async function getFillDetail(id) {
    changeLoading(true);
    const r = await getReplayDetail(id);
    if (r.code == 200) {
      state.base = r.data;
    }
    changeLoading(false);
  }

  async function handleCall() {
    const r = await saveReplaying(state.Id);
    if (r.code == 200) {
      message.success(t('sys.api.operationSuccess'));
      closePopup();
    }
  }

  function handleSave() {
    changeOkLoading(true);
    customReplay({
      Id: state.Id,
      ReplyContent: state.editor,
    })
      .then(res => {
        changeOkLoading(true);
        closePopup();
        createMessage.success(res?.msg || '保存成功');
      })
      .catch(err => {
        changeOkLoading(false);
      });
  }
  function handleVisibleChange(v) {
    if (!v) {
      emits('refresh');
    }
  }
</script>

<style lang="less">
  .ly-prod-detail {
    &-base {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn-wrap {
        display: flex;
        gap: 16px;
      }
    }

    &-concat {
      display: flex;
      gap: 20px;

      &-item {
        flex: 1;
      }
    }

    &-footer {
      // min-width: 100%;
      // height: 66px;
      // padding: 18px 16px 18px 18px;
      // box-sizing: border-box;
      // background: white;
      border-radius: 10px 10px 0 0;
      // position: sticky;
      // bottom: 0;
      // z-index: 1000;
    }

    .h2 {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }

    .tag {
      width: 50px;
      border-radius: 2px;
      background: rgb(255 123 0 / 10%);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 2px 8px;
      color: #ff7b00;
      font-size: 12px;
    }

    .footer-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      gap: 20px;
    }
    // 覆写组件样式
    :deep(.lydc-basic-table-action button i) {
      font-size: 18px;
    }

    :deep(.ant-card-body) {
      width: 100%;
    }

    :deep(.ant-table-title) {
      display: none;
    }

    :deep(.ant-table-thead > tr > th) {
      border-top: 1px solid rgb(0 0 0 / 6%);
    }

    :deep(.ant-table-thead > tr:first-child > th) {
      border-top: none;
    }

    :deep(.ant-table-thead > tr > th:not(:last-child, .ant-table-selection-column)::before) {
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 1.6em;
      background-color: rgb(0 0 0 / 6%);
      transform: translateY(-50%);
      transition: background-color 0.3s;
      content: '';
    }
  }
</style>
