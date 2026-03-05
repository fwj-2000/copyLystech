<!-- 操作按钮组 -->
<template>
  <!-- 统计结果 -->
  <a-dropdown placement="bottomLeft" :trigger="['click']">
    <a-button type="primary" :loading="statisticloading">统计结果</a-button>
    <template #overlay>
      <a-menu mode="vertical" :items="statisticButtonList()" @click="handleClickBatchItem">
        <!-- <a-menu-item v-for="(item, idx) in statisticButtonList" :key="idx">
          <SingleUpload v-bind="item" :afterUpload="afterUploadHandle">
            <template v-slot="{ loading }">
              <div :loading="loading">
                {{ item.buttonText }}
              </div>
            </template>
          </SingleUpload>
        </a-menu-item> -->
      </a-menu>
    </template>
  </a-dropdown>
  <!-- 同步数据 -->
  <a-popconfirm title="确定同步" @confirm="syncData">
    <a-button type="primary" :loading="syncLoading">同步数据</a-button>
  </a-popconfirm>
  <!-- 更新Sap底稿状态 -->
  <a-dropdown v-if="showUpdateSap">
    <a-button type="primary" :loading="updateSapLoading">更新Sap底稿状态</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item v-for="(item, idx) in sapOptions" :key="idx" @click="updateSapStatus(item.value)">
          {{ item.label }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { dimensionSyncbgbase, updateSapFactory } from '/@/api/dataAnalysis/financial';
  import { getDimensionDownload } from '/@/api/dataAnalysis/financial';

  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import { statisticButtonList, sapOptions } from './config';
  import { downloadByUrl } from '/@/utils/file/download';

  interface IProps {
    formParams: () => Record<string, any>; // 修改为函数类型 避免卡顿
  }
  const props = withDefaults(defineProps<IProps>(), {
    formParams: () => ({}),
  });
  const showUpdateSap = computed(() => {
    const { orgCode = '' } = props.formParams();
    return orgCode.length >= 9;
  });
  const statisticloading = ref<boolean>(false);
  const syncLoading = ref<boolean>(false);
  const updateSapLoading = ref<boolean>(false);

  const { createMessage } = useMessage();
  // 同步数据
  const syncData = () => {
    syncLoading.value = true;
    dimensionSyncbgbase()
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
        } else {
          createMessage.error(res.msg);
        }
      })
      .finally(() => {
        syncLoading.value = false;
      });
  };

  // 更新sap底稿状态
  const updateSapStatus = status => {
    const { startDim, endDim, dimension, orgCode } = props.formParams();
    const params = {
      status,
      startDim,
      endDim,
      dimension,
      orgCode,
    };
    updateSapLoading.value = true;
    const searchParams = new URLSearchParams(params as any);
    const queryString = searchParams.toString();
    updateSapFactory(queryString)
      .then(() => {
        createMessage.success('更新成功');
      })
      .finally(() => {
        updateSapLoading.value = false;
      });
  };

  const afterUploadHandle = resData => {
    if (resData.isOk) {
      const url = resData.url;
      const fileName = resData.fileName;
      downloadByUrl({ url, fileName });
      createMessage.success('操作成功');
    } else {
      createMessage.error('上传失败');
    }
  };

  // 批量导入
  const handleClickBatchItem = async ({ item }) => {
    const { clickMethod } = item.originItemValue;
    if (clickMethod) {
      await clickMethod(props.formParams()).catch(() => {});
    }
  };
</script>
