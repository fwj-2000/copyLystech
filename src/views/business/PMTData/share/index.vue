<template>
  <PMTDataPage />
</template>

<script lang="ts" setup>
  import PMTDataPage from '../index.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
  import { useTabs } from '/@/hooks/web/useTabs';

  defineOptions({ name: 'business-PMTData-share' });

  function goPMTDataPage() {
    // 判断当前用户是否存在`PMT信息报表(/business/PMTData)`的菜单，如果有，则进入`PMT信息报表`页面，否则留在当前分享页面
    const router = useRouter();
    const route = useRoute();
    const PMRPageRoute = router.resolve({
      path: '/business/PMTData',
      query: route.query,
    });
    if (PMRPageRoute.name !== PAGE_NOT_FOUND_ROUTE.name) {
      // 存在`PMT信息报表(/business/PMTData)`的菜单，关闭当前tab，切换为菜单页面
      useTabs()
        .closeCurrent()
        .finally(() => {
          router.replace(PMRPageRoute);
        });
    }
  }

  goPMTDataPage();
</script>
