<script setup lang="ts">
  import DetailContainer from '../components/DetailContainer.vue';
  import { nextTick, ref, watch } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { getPccPreview } from '/@/api/engineering/pcc';
  import { isExist } from '/@/utils/is';

  const userStore = useUserStore();

  const detailContainerRef = ref(null);
  const isLocaleReady = ref(false);

  const data = {};

  useRouteParams(
    { insidePartNumber: { type: 'string' }, version: { type: 'number' }, docType: { type: 'string' }, token: { type: 'string' } },
    async params => {
      const token = userStore.getToken;
      if (!token) {
        // 未登录
        userStore.setToken(params.token);
      }
      try {
        await userStore.getUserInfoAction();
      } catch (error) {
        console.error('[PCCDetailPreview] Failed to preload locale data', error);
      } finally {
        isLocaleReady.value = true;
      }
      userStore.setLastUpdateTime();
      Object.assign(data, params);
    },
  );

  watch(
    isLocaleReady,
    async ready => {
      if (!ready) return;
      await nextTick();
      initDetails();
    },
    { immediate: false },
  );

  function initDetails() {
    const { insidePartNumber, version, docType } = data;
    if (isExist(insidePartNumber) && isExist(version) && isExist(docType)) {
      getPccPreview({
        insidePartNumber,
        version,
        docType,
      }).then(({ code, data }) => {
        if (code !== 200) return;
        detailContainerRef.value.init({
          cacheList: [
            {
              ...data,
              docType,
              version,
              insidePartNumber,
              currentNode: 'End',
            },
          ],
          index: 0,
          mode: 'view',
        });
      });
    }
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <DetailContainer v-if="isLocaleReady" ref="detailContainerRef" @changeLoading="() => {}" @changeCurrent="() => {}"> </DetailContainer>
      </div>
    </div>
  </div>
</template>
