<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.submitText')"
    :title="t('common.detailText')"
    destroyOnClose
    class="full-popup">
    <ScrollContainer>
      <div class="pop-item">
        <subtitle :title="t('common.baseinfo')"></subtitle>
        <BasicForm @register="registerForm"></BasicForm>

        <!-- <div class="files">
          <div class="files-item" v-for="(item, index) in fileList" :key="index">
            <div class="item-list">
              <div class="name">{{ item.name }}：</div>
              <div class="list-right">
                <a class="item-file-name ellipsis mr-10px" @click.stop="handlePreview(item)">{{ item.fileName }}</a>
                <div>
                  <a-button type="link" @click="handleDownloadFile(item)" v-if="item.fileName">
                    <template #icon>
                      <i class="icon-ym icon-ym-btn-download"></i>
                    </template>
                  </a-button>
                  <div v-else>--</div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="pop-item">
        <subtitle :title="t('dict.CommonCol.machinedPart')"></subtitle>
        <Grid style="height: 300px"> </Grid>
      </div>

      <!-- <div class="pop-item">
        <subtitle :title="t('dict.CommonCol.NGRouteDecision')"></subtitle>
        <NGGrid style="height: 300px"> </NGGrid>
      </div> -->
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { baseFrorm, partColumn } from './config';
  import { processdetail } from '/@/api/engineering/mould';
  import { ScrollContainer } from '/@/components/Container';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { PreviewModal } from '/@/components/Upload';
  import dayjs from 'dayjs';
  import { useGlobSetting } from '/@/hooks/setting';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);
  const globSetting = useGlobSetting();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-process-list-part',
      columns: partColumn,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    },
  });

  const [registerForm, { setFieldsValue }] = useForm({
    layout: 'vertical',
    labelWidth: 220,
    schemas: baseFrorm,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'MoldApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [registerPopup] = usePopupInner(init);
  // const fileList = ref<{ name: string; fileName: string; filePath: string; type?: string }[]>([]);

  async function init(data) {
    // processdetail()
    const res = await processdetail({ id: data.id });
    const {
      workOrderNo,
      projectName,
      productName,
      factoryAreaName,
      t0DeliveryDate,
      remark,
      creatorUserName,
      // drawing3dName,
      // drawing3dUrl,
      // drawing2dName,
      // drawing2dUrl,
      // drawingSpecialName,
      // drawingSpecialUrl,
      bomList,
    } = res.data;

    setFieldsValue({
      workOrderNo: workOrderNo,
      projectName: projectName,
      productName: productName,
      factoryAreaName: factoryAreaName,
      t0DeliveryDate: dayjs(t0DeliveryDate).format('YYYY-MM-DD'),
      // drawing3dName:drawing3dName,
      // drawing2dName:drawing2dName,
      // drawingSpecialName:drawingSpecialName,
      remark: remark,
      creatorUserName: creatorUserName,
    });
    // fileList.value = [
    //   { name: '3D组立图', fileName: drawing3dName, filePath: drawing3dUrl },
    //   { name: '2D图纸', fileName: drawing2dName, filePath: drawing2dUrl },
    //   { name: '特殊做法文件', fileName: drawingSpecialName, filePath: drawingSpecialUrl },
    // ];
    gridApi.grid.reloadData(bomList);
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }
  async function handleDownloadFile(item) {
    const { filePath, fileName } = item;
    window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${filePath}&fileName=${fileName}`);
  }
</script>

<style lang="less" scoped>
  .pop-item {
    border-bottom: 10px solid #f0f0f0;
    padding: 20px;
  }

  .files {
    display: flex;
    flex-wrap: wrap;

    .files-item {
      width: 33%;
      margin-top: 4px;

      .item-list {
        display: flex;
        align-items: center;

        .name {
          flex-shrink: 0;
        }

        .list-right {
          flex: 1;
          display: flex;
          align-items: center;

          .item-file-name {
            max-width: 90%;
            word-break: break-all;
          }
        }
      }
    }
  }

  .active-route {
    color: #ff7b00;
  }
</style>
