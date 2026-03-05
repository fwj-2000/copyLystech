<!--
 * @Author: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @Date: 2024-09-11 11:04:01
 * @LastEditors: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @LastEditTime: 2024-09-11 13:14:03
 * @FilePath: \lydc.server.web\src\views\engineering\drawing\drawingReview\components\AttachHistory.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal
    :z-index="999"
    v-bind="$attrs"
    :width="720"
    :minHeight="400"
    @register="registerModal"
    :title="t('common.attachmentHistory')"
    showOkBtn
    @ok="handleSubmit"
    destroy-on-close>
    <a-list size="small" bordered :data-source="historyData">
      <template #renderItem="{ item: value }">
        <a-list-item>
          <a-list-item-meta :description="value.originFileName">
            <template #avatar>
              {{ dayjs(value.CreatorTime).tz().format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-space>
              <a v-if="hasBtnP('btn_detail')" @click="handlePreview(value)" key="list-loadmore-edit">{{ t('component.upload.preview') }}</a>
              <a v-if="hasBtnP('btn_detail')" @click="handleHistoryDownload(value)" key="list-loadmore-more">{{ t('common.downloadText') }}</a>
              <a v-if="hasBtnP('btn_del_attach')" @click="handleDel(value)" key="list-loadmore-edit">{{ t('component.upload.del') }}</a>
            </a-space>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </BasicModal>
  <Preview ref="filePreviewRef" />
</template>

<script setup lang="ts">
  import { getFileInfoHistory, postDrawingsReviewDeleteAttach } from '/@/api/engineering/drawingReview';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { deleteDrawings, downloadDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const { createMessage, createConfirm } = useMessage();
  const emit = defineEmits(['reload']);

  const state = reactive({
    id: '',
  });

  const { hasBtnP } = usePermission();
  const historyData = ref([]);
  const filePreviewRef = ref();

  function handleSubmit() {
    console.log('handleSubmit');
  }

  async function init(initData) {
    changeLoading(true);
    state.id = initData.id;
    const { code, data } = await getFileInfoHistory({
      ApplyId: initData.id,
      FileType: 'Attachment',
    });
    if (code === 200) {
      historyData.value = data;
      if (data.length == 0) closeModal();
    }
    setTimeout(() => {
      changeLoading(false);
    }, 300);
  }

  function handlePreview(value) {
    console.log(value);
    const params = {
      name: value.originFileName,
      Id: value.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  async function handleHistoryDownload(val) {
    const {
      data: { name, url },
    } = await downloadDrawingshistory({
      Id: val.id,
    });
    downloadByUrl({ url: url, target: '_blank', fileName: name });
  }

  function handleDel(val) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        // changeLoading(true);
        postDrawingsReviewDeleteAttach({ id: val.id })
          .then(({ code }) => {
            if (code === 200) {
              message.success(t('common.delSuccess'));
              init({
                id: state.id,
              });
              emit('reload');
            }
          })
          .finally(e => {
            changeLoading(false);
          });
      },
    });
  }
</script>
