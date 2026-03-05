<template>
  <BasicModal
    canFullscreen
    draggable
    :title="t('dict.CommonCol.img')"
    showOkBtn
    destroy-on-close
    :width="800"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit">
    <div>
      <div>
        <!-- 产品实物图片正面 -->
        <Subtitle :title="t('dict.FilingsApplyColumn.ProductPicture')">
          <template #afterTitle>
            <div class="required">*</div>
          </template>
        </Subtitle>
        <ImageUpload
          v-feature
          :value="state.productPicture"
          :maxNumber="15"
          name="fileList"
          updateType="all"
          :multiple="false"
          :disabled="disabled"
          version="2"
          width="90px"
          height="90px"
          :maxSize="10"
          @change="(list: Array<FileInfo>) => handleImgUpdate(list, 'productPicture')" />
        <!-- 产品实物图片反面 -->
        <Subtitle :title="t('dict.FilingsApply.productPictureBack')" />
        <ImageUpload
          v-feature
          :value="state.productPictureBack"
          :maxNumber="15"
          name="fileList"
          updateType="all"
          :multiple="false"
          :disabled="disabled"
          version="2"
          width="90px"
          height="90px"
          :maxSize="10"
          @change="(list: Array<FileInfo>) => handleImgUpdate(list, 'productPictureBack')" />
        <!-- 纯产品称重图片 -->
        <Subtitle :title="t('dict.FilingsApplyColumn.ProductWeightPicture')">
          <template #afterTitle>
            <div class="required">*</div>
          </template>
        </Subtitle>
        <ImageUpload
          v-feature
          :value="state.productWeightPicture"
          :maxNumber="15"
          name="fileList"
          updateType="all"
          :multiple="false"
          :disabled="disabled"
          version="2"
          listType="picture-card"
          width="90px"
          height="90px"
          :maxSize="10"
          @change="(list: Array<FileInfo>) => handleImgUpdate(list, 'productWeightPicture')" />
        <!-- 带衬背称重图片 -->
        <Subtitle :title="t('dict.FilingsApplyColumn.BackProductWeightPicture')">
          <template #afterTitle>
            <div class="required">*</div>
          </template>
        </Subtitle>
        <ImageUpload
          v-feature
          :value="state.backProductWeightPicture"
          :maxNumber="15"
          name="fileList"
          updateType="all"
          :multiple="false"
          :disabled="disabled"
          version="2"
          width="90px"
          height="90px"
          :maxSize="10"
          @change="(list: Array<FileInfo>) => handleImgUpdate(list, 'backProductWeightPicture')" />
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import ImageUpload from '/@/components/Upload/src/components/ImageUpload.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';

  const { createMessage } = useMessage();

  const emit = defineEmits(['register', 'reload', 'ok']);
  const { t } = useI18n();

  /** 禁用状态 */
  const disabled = ref<boolean>(true);
  /** 用于设置值的回调 */
  let callBack: (data: State) => void = (_data: State) => {};

  type FileInfo = {
    url: string;
    name?: string;
  };

  interface State {
    /** 纯产品称重图片 */
    productWeightPicture: Array<FileInfo>;
    /** 带衬背称重图片 */
    backProductWeightPicture: Array<FileInfo>;
    /** 产品实物图片正面 */
    productPicture: Array<FileInfo>;
    /** 产品实物图片反面 */
    productPictureBack: Array<FileInfo>;
  }

  const state = reactive<State>({
    productWeightPicture: [],
    backProductWeightPicture: [],
    productPicture: [],
    productPictureBack: [],
  });

  const [registerModal, { closeModal }] = useModalInner(init);

  /** 初始化 */
  function init(data: State & { disabled?: boolean; callBack?: (data: State) => void }) {
    state.productWeightPicture = initImageList(data.productWeightPicture || []);
    state.backProductWeightPicture = initImageList(data.backProductWeightPicture || []);
    state.productPicture = initImageList(data.productPicture || []);
    state.productPictureBack = initImageList(data.productPictureBack || []);

    disabled.value = typeof data.disabled === 'boolean' ? data.disabled : true;
    callBack = typeof data.callBack === 'function' ? data.callBack : (_data: State) => {};
  }

  /** 格式化图片列表为完整URL */
  function initImageList(list: Array<FileInfo>) {
    if (Array.isArray(list)) {
      return list;
    }
    return typeof list === 'string' ? [{ url: list as string }] : [];
    // return Array.isArray(list) ? list : typeof list === 'string' ? [{ url: list as string }] : [];
  }

  /**
   * 图片变化处理
   * @param list 上传后的图片列表
   * @param type 图片类型
   */
  function handleImgUpdate(list: Array<FileInfo>, type: keyof State) {
    state[type] = Array.isArray(list) ? list : [];
  }

  /** 提交 */
  async function handleSubmit() {
    const data = cloneDeep(state);
    emit('ok', data);
    typeof callBack === 'function' && callBack(data);
    createMessage.success(t('sys.api.operationSuccess'));
    closeModal();
  }
</script>

<style lang="less" scoped>
  .required {
    color: red;
    margin-left: -10px;
  }

  :deep(.ant-upload-list) {
    display: block;
  }
</style>
