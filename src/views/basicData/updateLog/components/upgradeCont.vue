<template>
  <div class="UpdateCotent-container">
    <div class="log-title" v-if="props.showTitle">
      <div class="orange-line"></div>
      <span class="log-title-text">{{ t('common.logUpdateContent') }}</span>
    </div>
    <div class="mainContentBox">
      <a-spin :spinning="loading">
        <a-select v-if="props.showSelect && logData" v-model:value="currentStatus" style="width: 200px" :options="statusOptions" :disabled="true"></a-select>

        <!-- 版本号 -->
        <span class="content-title version-title" v-if="logData">
          {{ t('common.DieCuttingSystemVersion') }}{{ logData.MajorVersion || 0 }}.{{ logData.MinorVersion || 0 }}.{{ logData.PatchVersion || 0 }}
        </span>

        <!-- 新功能区域 -->
        <div class="svg-container" v-if="logData">
          <img src="../../../../assets/icons/upgradeLog/Crystal.svg" alt="Crystal Icon" />
          <span class="NewFeat">{{ t('feature.new') }}</span>
        </div>
        <template v-if="logData">
          <ul v-if="isValidContent(logData.FeatureContent)" class="custom-bullets" v-html="formatContent(logData.FeatureContent)"></ul>
          <div v-else class="no-content">{{ t('common.newFeatureNoContent') }}</div>
        </template>

        <!-- 优化修复区域 -->
        <div class="svg-container" v-if="logData">
          <img src="../../../../assets/icons/upgradeLog/Settings.svg" alt="Settings Icon" />
          <span class="NewFeat">{{ t('common.optimizationandFixes') }}</span>
        </div>
        <template v-if="logData">
          <ul v-if="isValidContent(logData.BugFixContent)" class="custom-bullets" v-html="formatContent(logData.BugFixContent)"></ul>
          <div v-else class="no-content">{{ t('common.optimizationFixesnoContent') }}</div>
        </template>

        <div v-if="!logData && !loading" class="no-data">{{ t('common.UpdateLognoData') }}</div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineProps, ref, watch } from 'vue';
  import { getUpdateLogById } from '/@/api/business/updateLogs';
  import { message } from 'ant-design-vue';
  const { t } = useI18n();
  const props = defineProps({
    showTitle: { type: Boolean, default: true },
    showSelect: { type: Boolean, default: true },
    logId: { type: String, default: '' },
  });

  const statusOptions = [
    { value: 1, label: t('dict.ProcessRoute.RouteStatus.1') },
    { value: 0, label: t('common.StatusTobeReleased') },
  ];
  const currentStatus = ref(1);
  const logData = ref<any>(null);
  const loading = ref(false);

  watch(
    () => props.logId,
    newId => {
      if (newId) {
        fetchLogDetail(newId);
      } else {
        logData.value = null;
      }
    },
    { immediate: true },
  );

  // 获取日志详情
  const fetchLogDetail = async (id: string) => {
    try {
      loading.value = true;
      const res = await getUpdateLogById({ id });

      if (res.code === 200 && res.data) {
        logData.value = res.data;
        currentStatus.value = res.data.Status === 0 ? 0 : 1;
      } else {
        logData.value = null;
      }
    } catch (error) {
      // console.error('获取日志详情失败:', error);
      // message.error('网络错误，无法加载日志');
      logData.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 将后端数据转换为<ul>列表
   * 处理两种格式：纯文本和带<p>标签的HTML
   */
  const formatContent = (content: string) => {
    if (!content) return '';

    if (content.includes('<p>')) {
      return content
        .replaceAll(/<p[^>]*>/gi, '<li>')
        .replaceAll(/<\/p>/gi, '</li>')
        .replaceAll(/<br[^>]*>/gi, '')
        .replaceAll(/&nbsp;/gi, ' ')
        .replaceAll(/^\s+|\s+$/g, '');
    }
    return `<li>${content}</li>`;
  };

  const isValidContent = (content: string) => {
    if (!content) return false;
    // 移除所有HTML标签后检查是否有实际内容
    const text = content.replaceAll(/<[^>]*>/gi, '').trim();
    return text.length > 0;
  };

  const setLog = (data: any) => {
    logData.value = data;
    if (data) currentStatus.value = data.Status === 0 ? 0 : 1;
  };
  defineExpose({ setLog });
</script>

<style lang="less" scoped>
  .no-content,
  .no-data {
    color: #999;
    padding: 10px 0;
  }

  .UpdateCotent-container {
    display: flex;
    width: calc(100% - 20px);
    flex-direction: column;
    gap: 16px;
    padding: 20px 0 30px 30px;
  }

  .version-title {
    display: block;
    margin-top: 16px;
    margin-bottom: 20px;
  }

  .custom-bullets li {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px;
  }

  .custom-bullets {
    list-style-type: disc;
    padding-left: 20px;
    margin: 0; /* 清除默认边距，避免布局偏移 */
  }

  .custom-bullets li::marker {
    color: #000;
    font-size: 0.8em;
  }

  .NewFeat {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }

  .svg-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .content-title {
    color: #1a1a1a;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .mainContentBox {
    display: flex;
    max-height: 674px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 8px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 15px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }
  }
</style>
