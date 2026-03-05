<template>
  <BasicModal
    canFullscreen
    draggable
    :title="t('common.desensitizedInformation')"
    showOkBtn
    destroy-on-close
    :width="800"
    :height="600"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit">
    <div>
      <div>
        <Subtitle :title="t('common.imgInfo')"></Subtitle>
        <ImageUpload
          :api="uploadImage"
          :value="state.imgList"
          :maxNumber="15"
          name="fileList"
          updateType="all"
          multiple
          @delete="handleDeleteImg"
          @change="handleImgUpdate"></ImageUpload>
      </div>
      <div>
        <Subtitle :title="t('common.desensitizedInformation')" :extra="{ show: true, hideAdd: true }">
          <template #extra>
            <AddCustomRows @submit="addColumnText" />
          </template>
        </Subtitle>
        <Grid>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { Subtitle } from '/@/components/Subtitle';
  import { buildUUID } from '/@/utils/uuid';
  import { uploadImage, deleteImage, updateTerminalDesensitization } from '/@/api/business/terminalCustomer';
  import ImageUpload from '/@/components/Upload/src/components/ImageUpload.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import { getAppEnvConfig } from '/@/utils/env';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { VITE_GLOB_API_URL } = getAppEnvConfig();

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const IMG_URL_PREFIX = VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/';

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      height: '300px',
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      columns: [
        {
          title: t('common.desensitizedInformation'),
          field: 'desensitizationText',
          minWidth: 240,
          editRender: {
            name: 'Input',
            autoFocus: true,
          },
        },
        {
          title: t('common.action'),
          field: 'action',
          width: 80,
          slots: {
            default: 'action',
          },
        },
      ],
      clipConfig: {
        isPaste: true,
      },
      position: 'modal',
      pagerConfig: {
        enabled: false,
      },
    },
  });
  const { getDataSource } = gridApi;

  interface State {
    deleteTempImg: string[]; // 删除的图片路径临时存储地
    imgList: string[]; // 图片列表
    imgTempList: string[]; // 图片列表
    id: string; // 终端客户主键id
  }
  const state = reactive<State>({
    deleteTempImg: [],
    id: '',
    imgList: [],
    imgTempList: [],
  });

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(init);

  function init(data) {
    changeOkLoading(false);
    state.id = data.id;
    state.deleteTempImg = [];
    state.imgList = [];
    state.imgTempList = [];
    if (data.convertConfig) {
      const convertConfig = JSON.parse(data.convertConfig);
      state.imgList = (convertConfig.removeLogos || []).map(el => {
        return IMG_URL_PREFIX + el;
      });
      state.imgTempList = cloneDeep(state.imgList);
      initText(
        (convertConfig.removeTexts || []).map(x => {
          return {
            desensitizationText: x,
          };
        }),
      );
    }
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopyText.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteText.bind(null, row),
      },
    ];
  }

  function handleCopyText(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }
  function handleDeleteText(row) {
    gridApi.grid.remove(row);
  }

  // 增加脱敏信息列数
  function addColumnText(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        desensitizationText: '',
      });
    }
    gridApi.grid.reloadData(list);
  }

  // 初始化表格脱敏信息
  function initText(list) {
    gridApi.grid.reloadData(
      list.map(el => {
        return {
          _X_ROW_KEY: buildUUID(),
          ...el,
        };
      }),
    );
  }

  //  删除脱敏图片
  function handleDeleteImg(data) {
    // 留下需要删除的图片路径，在点击确认时，再统一删除
    let url = data.url || data.filePath;
    if (data.response) {
      url = data.response.data[0].filePath;
    }
    const filePath = url.replace(IMG_URL_PREFIX, '');
    state.deleteTempImg.push(filePath);
  }
  // 图片更新
  function handleImgUpdate(data) {
    state.imgTempList = [];
    data.map(el => {
      if (typeof el === 'string') {
        state.imgTempList.push(el);
      } else {
        state.imgTempList.push(el.url);
      }
    });
  }

  async function handleSubmit() {
    if (state.imgTempList.length === 0 && getDataSource().length === 0) {
      createMessage.warn(t('dict.TerminalCustomer.privacyInfoMaintenanceCheckTip'));
      return false;
    }

    changeOkLoading(true);
    // 如果当前需要删除图片，则进行删除处理
    try {
      if (state.deleteTempImg.length) {
        await deleteImage({
          filePaths: state.deleteTempImg,
        });
      }
      // 拼接图片和文字信息
      const params = {
        convertConfig: {
          removeLogos: state.imgTempList.map(el => {
            return el.replace(IMG_URL_PREFIX, '');
          }),
          removeTexts: getDataSource().map(el => {
            return el.desensitizationText;
          }),
        },
      };
      await updateTerminalDesensitization(state.id, params);
      closeModal();
      emit('reload');
      createMessage.success(t('sys.api.operationSuccess'));
    } finally {
      changeOkLoading(false);
    }
  }
</script>
