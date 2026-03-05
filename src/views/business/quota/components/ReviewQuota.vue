<template>
  <a-card :bordered="false" style="padding-left: 16px">
    <Descriptions
      title=""
      layout="vertical"
      :colon="false"
      class="custom-descriptions"
      :contentStyle="{ color: '#1A1A1A', fontWeight: 400, fontSize: '14px' }"
      :labelStyle="{ fontSize: '14px', fontWeight: 400, color: '#999' }">
      <!--      <template v-for="item in props.descState">-->
      <!--        <Descriptions.Item v-if="item.value !== 'DesensitizedDrawingsName'" :label="item.label">-->
      <!--          {{ item.value }}-->
      <!--        </Descriptions.Item>-->
      <!--        <Descriptions.Item @click="handleDownloadPic(item)" v-else :label="item.label">-->
      <!--          {{ item.value }}-->
      <!--        </Descriptions.Item>-->
      <!--      </template>-->
      <Descriptions.Item v-for="item in props.descState" :label="item.label">
        <template v-if="item.downloadId">
          <div style="cursor: pointer"> {{ item.value }}</div>
          <a v-if="hasBtnP('btn_download_pic')" class="mr-2 ml-2" @click="handleDownloadPic(item)">下载</a>
          <a v-if="hasBtnP('btn_preview_pic')" @click="handlePreviewPic(item)">预览</a>
        </template>
        <template v-else> {{ item.value }}</template>
      </Descriptions.Item>
    </Descriptions>
  </a-card>
  <Preview ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { Descriptions } from 'ant-design-vue';
  import { defineProps, ref } from 'vue';
  import { downloadPic, previewPic } from '/@/api/business/quota';
  import { downloadByUrl } from '/@/utils/file/download';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const props = defineProps(['descState']);
  const filePreviewRef = ref<any>(null);

  const { hasBtnP } = usePermission();
  async function handleDownloadPic(item) {
    console.log(item.downloadId);
    const {
      data: { name, url },
    } = await downloadPic({
      id: item.downloadId,
    });
    downloadByUrl({ url, target: '_blank', name });
  }

  async function handlePreviewPic(item) {
    const params = {
      name: item.value,
      Id: item.downloadId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
    // console.log(item);
    // const res = await previewPic({
    //   id: item.downloadId,
    //   noCache: false,
    //   isCopy: 0,
    //   previewType: 'localPreview',
    // });
    // console.log(res);
  }
</script>
