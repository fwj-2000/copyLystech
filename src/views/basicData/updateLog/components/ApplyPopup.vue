<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="okBtnText"
    :showCancelBtn="true"
    :title="popupTitle"
    destroyOnClose
    @ok="handleSubmit"
    @close="handleClose"
    class="full-popup">
    <div class="SystemGenerate_Container">
      <div class="UploadTime-Container">
        <span class="UploadTimetext">{{ t('common.logTimeUpdate') }}：</span>
        <template v-if="currentType === 'add'">
          <a-input v-model:value="addTimeValue" :placeholder="t('common.fromSys')" disabled />
        </template>
        <template v-else>
          <a-date-picker v-model:value="date" show-time type="date" disabled />
        </template>
      </div>
      <div class="UploadVersion-Container">
        <span class="UploadTimetext">{{ t('common.logUpdateVersion') }}：</span>
        <template v-if="currentType === 'add'">
          <a-input v-model:value="addVersionValue" :placeholder="t('common.fromSys')" disabled />
        </template>
        <template v-else>
          <a-input v-model:value="versionText" disabled />
        </template>
      </div>
    </div>
    <div class="divider_header"></div>
    <div class="content-container">
      <div class="left-section">
        <div class="svg-container">
          <img src="../../../../assets/icons/upgradeLog/Crystal.svg" alt="Crystal Icon" />
          <span class="NewFeat">{{ t('feature.new') }}</span>
        </div>
        <LydcEditor ref="newEditor" id="new-feature-editor" :editorConfig="editorBaseConfig" v-model:value="newFeatureContent" />
      </div>
      <div class="divider_content"></div>
      <div class="right-section">
        <div class="svg-container">
          <img src="../../../../assets/icons/upgradeLog/Settings.svg" alt="Settings Icon" />
          <span class="NewFeat">{{ t('common.optimizationandFixes') }}</span>
        </div>
        <LydcEditor ref="editor" id="bug-fix-editor" :editorConfig="editorBaseConfig" v-model:value="bugFixContent" />
      </div>
    </div>
  </BasicPopup>
</template>

<script setup lang="ts">
  import moment from 'moment';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ref, defineEmits, onMounted, nextTick, useTemplateRef } from 'vue';
  import { postUpdateLog, putUpdateLog, getUpdateLogList } from '/@/api/business/updateLogs';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['refresh-list', 'update-current-log', 'select-log', 'close', 'register']);
  const { t } = useI18n();

  // 编辑器内容双向绑定变量
  const newFeatureContent = ref('');
  const bugFixContent = ref('');
  const logDataCache = ref<any>(null);

  // 弹窗状态变量
  const popupTitle = ref('');
  const okBtnText = ref('');
  const currentType = ref<'add' | 'edit'>('add');
  const currentLogId = ref('');
  const versionText = ref('');
  const date = ref<moment.Moment | null>(null);
  const addTimeValue = ref('');
  const addVersionValue = ref('');

  // 编辑器配置和引用
  const newEditorRef = useTemplateRef('newEditor');
  const editorRef = useTemplateRef('editor');
  const editorBaseConfig = ref({
    placeholder: t('dict.DrawingsReviewColumn.enterContent'),
    customPaste: (editor: any, event: ClipboardEvent): boolean => {
      try {
        const html = event.clipboardData.getData('text/html') || '';
        const text = event.clipboardData.getData('text/plain') || '';
        const pasteContent = html || text;

        if (pasteContent) {
          editor.insertText(pasteContent);
          event.preventDefault();
          return false;
        }
      } catch (error) {
        console.error('粘贴处理失败:', error);
      }
      return true;
    },
  });

  // 格式化文本为编辑器兼容格式
  const formatTextToEditorContent = (text: string) => {
    return text || '';
  };

  // 新增：用初始数据加载日志（避免后端同步延迟）
  const loadTargetLogByInitialData = (initialData: any) => {
    try {
      changeLoading(true);
      logDataCache.value = initialData;
      // 强制确保状态为待发布（0）、版本为0.0.0
      const safeStatus = initialData.Status ?? 0;
      const safeMajor = initialData.MajorVersion ?? 0;
      const safeMinor = initialData.MinorVersion ?? 0;
      const safePatch = initialData.PatchVersion ?? 0;

      versionText.value = `${safeMajor}.${safeMinor}.${safePatch}`;
      date.value = initialData.CreatorTime ? moment(initialData.CreatorTime) : moment();
      newFeatureContent.value = formatTextToEditorContent(initialData.FeatureContent);
      bugFixContent.value = formatTextToEditorContent(initialData.BugFixContent);
      console.log('用初始数据加载日志（正确值）：', { Status: safeStatus, Version: versionText.value });
    } catch (error) {
      console.error('初始数据加载失败:', error);
      clearEditors();
    } finally {
      changeLoading(false);
    }
  };

  // 加载目标日志数据（接口加载，作为fallback）
  const loadTargetLogData = async (targetId: string) => {
    try {
      changeLoading(true);
      console.log('加载日志ID:', targetId);
      const res = await getUpdateLogList({ Id: targetId });

      if (res.code === 200) {
        console.log('接口返回数据:', res.data);
        let targetLog = res.data.find((log: any) => log.Id === targetId);

        if (!targetLog && logDataCache.value?.CreatorTime) {
          targetLog = res.data.find((log: any) => log.CreatorTime === logDataCache.value.CreatorTime);
        }

        if (targetLog) {
          // 强制修正接口返回的错误值
          targetLog.Status = targetLog.Status ?? 0;
          targetLog.MajorVersion = targetLog.MajorVersion ?? 0;
          targetLog.MinorVersion = targetLog.MinorVersion ?? 0;
          targetLog.PatchVersion = targetLog.PatchVersion ?? 0;

          logDataCache.value = targetLog;
          versionText.value = `${targetLog.MajorVersion}.${targetLog.MinorVersion}.${targetLog.PatchVersion}`;
          date.value = targetLog.CreatorTime ? moment(targetLog.CreatorTime) : moment();

          newFeatureContent.value = formatTextToEditorContent(targetLog.FeatureContent);
          await nextTick();
          bugFixContent.value = formatTextToEditorContent(targetLog.BugFixContent);
          console.log('成功加载日志内容:', {
            newFeature: newFeatureContent.value,
            bugFix: bugFixContent.value,
          });
        } else {
          await clearEditors();
        }
      } else {
        message.warning(`接口请求失败：${res.msg || '未知错误'}`);
      }
    } catch (error) {
      console.error('加载日志失败:', error);
      message.error('网络异常，请检查接口地址');
    } finally {
      changeLoading(false);
    }
  };

  // 手动清空编辑器内容
  const clearEditors = async () => {
    newFeatureContent.value = '';
    bugFixContent.value = '';

    await nextTick();
    if (newEditorRef.value && typeof newEditorRef.value.setHtml === 'function') {
      newEditorRef.value.setHtml('');
    }
    if (editorRef.value && typeof editorRef.value.setHtml === 'function') {
      editorRef.value.setHtml('');
    }
  };

  // 弹窗初始化（优先用初始数据）
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner((data: any) => {
    currentType.value = data?.type || 'add';
    currentLogId.value = data?.logId || '';
    const initialLogData = data?.logData || null; // 接收index传递的初始数据
    console.log('弹窗初始化 - 类型:', currentType.value, '日志ID:', currentLogId.value, '初始数据:', initialLogData);

    if (currentType.value === 'add') {
      popupTitle.value = t('common.add');
      okBtnText.value = t('dict.PrOrderFlowNode.apply');
      addTimeValue.value = '';
      addVersionValue.value = '';
      logDataCache.value = null;
      clearEditors();
    } else {
      popupTitle.value = t('dict.CommonCol.modify');
      okBtnText.value = t('common.saveText');
      if (currentLogId.value) {
        // 优先用初始数据，无初始数据再调用接口
        if (initialLogData && initialLogData.Id === currentLogId.value) {
          loadTargetLogByInitialData(initialLogData);
        } else {
          loadTargetLogData(currentLogId.value);
        }
      } else {
        message.warning('请先在左侧时间树选择需要修改的日志');
        setTimeout(() => closePopup(), 1500);
      }
    }
  });

  // 处理弹窗关闭
  const handleClose = async () => {
    await clearEditors();
    emit('close');
  };

  // 修复：提交时强制传递正确的状态和版本
  const handleSubmit = async () => {
    const featureContentVal = newFeatureContent.value;
    const bugFixContentVal = bugFixContent.value;

    if (!featureContentVal && !bugFixContentVal) {
      message.warning('请至少输入一项内容');
      return;
    }

    // 强制获取正确的初始值（禁止状态和版本变更）
    const correctStatus = logDataCache.value?.Status ?? 0;
    const correctMajor = logDataCache.value?.MajorVersion ?? 0;
    const correctMinor = logDataCache.value?.MinorVersion ?? 0;
    const correctPatch = logDataCache.value?.PatchVersion ?? 0;

    try {
      changeLoading(true);
      if (currentType.value === 'add') {
        const res = await postUpdateLog({
          FeatureContent: featureContentVal,
          BugFixContent: bugFixContentVal,
        });
        if (res.code === 200) {
          message.success('发布成功');
          emit('refresh-list');
          await clearEditors();
          closePopup();
        } else {
          message.error(`发布失败：${res.msg || '未知错误'}`);
        }
      } else {
        // 修改日志：强制传递正确的状态和版本
        const res = await putUpdateLog({
          Id: currentLogId.value,
          FeatureContent: featureContentVal,
          BugFixContent: bugFixContentVal,
          CreatorTime: logDataCache.value?.CreatorTime,
          Status: correctStatus, // 固定待发布
          MajorVersion: correctMajor, // 固定0
          MinorVersion: correctMinor, // 固定0
          PatchVersion: correctPatch, // 固定0
          TenantId: logDataCache.value?.TenantId,
        });
        if (res.code === 200) {
          message.success('保存成功');
          // 完整传递状态和版本，确保index更新正确
          emit('update-current-log', {
            Id: currentLogId.value,
            FeatureContent: featureContentVal,
            BugFixContent: bugFixContentVal,
            Status: correctStatus,
            MajorVersion: correctMajor,
            MinorVersion: correctMinor,
            PatchVersion: correctPatch,
          });
          await clearEditors();
          closePopup();
        } else {
          message.error(`保存失败`);
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error(currentType.value === 'add' ? '提交失败' : '保存失败');
    } finally {
      changeLoading(false);
    }
  };

  onMounted(() => {
    // 组件挂载时初始化
  });
</script>

<style lang="less" scoped>
  #editor-wrapper {
    display: flex;
    height: 572px;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
  }

  #toolbar-container {
    border-bottom: 1px solid #ccc;
  }

  #editor-container {
    height: 500px;
  }

  .wang-editor-container .wang-editor-editor {
    height: 450px;
  }

  :deep(.w-e-toolbar) {
    background-color: #f7f7f7;
  }

  .NewFeat {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }

  .divider_content {
    position: absolute;
    right: 50%;
    top: 70px;
    bottom: 0;
    width: 1px;
    height: calc(100% - 70px);
    background: #dbdbdb;
  }

  .divider_header {
    width: 100%;
    height: 1px;
    background: #dbdbdb;
  }

  .SystemGenerate_Container {
    height: 70px;
    width: 100%;
    display: flex;
    padding: 20px;
    gap: 20px;
  }

  .UploadTime-Container,
  .UploadVersion-Container {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 30px;
  }

  .a-date-picker,
  .a-input {
    display: flex;
    padding: 4px 8px;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    background: #f2f2f2;
    margin-left: 8px;
  }

  .UploadTimetext {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    white-space: nowrap;
  }

  .left-section,
  .right-section {
    width: 50%;
    height: 673px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .svg-container {
    display: flex;
    gap: 8px;
    width: calc(100% - 40px);
    height: 32px;
    align-items: center;
  }

  .content-container {
    display: flex;
  }

  :deep(.w-e-text-container) {
    min-height: 450px !important;
    border: 1px solid #e8e8e8 !important;
    background-color: white !important;
  }

  :deep(.w-e-text) {
    min-height: 450px !important;
  }

  :deep(.w-e-text-container:focus-within) {
    border-color: #1890ff !important;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%) !important;
  }
</style>
