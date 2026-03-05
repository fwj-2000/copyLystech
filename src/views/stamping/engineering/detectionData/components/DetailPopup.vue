<script lang="ts" setup>
  import { BasicPopup, usePopup, usePopupInner } from '/@/components/Popup';
  import { reactive, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenForm } from '/@/adapter/form';
  import { getEditSchema, getEditColumns } from '../config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useUserStore } from '/@/store/modules/user';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { TableAction } from '/@/components/Table';
  import { saveProductDetail, updateProductDetail } from '/@/api/engineering/detectionData';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isExist } from '/@/utils/is';

  const { createConfirm, createMessage } = useMessage();

  const userStore = useUserStore();

  const emit = defineEmits(['register', 'submitSuccess']);

  const { t } = useI18n();
  const state = reactive({
    mode: 'add',
    id: '',
    disabled: false,
  });
  const title = computed(() => {
    return state.mode === 'add' ? t('common.add') : t('common.edit');
  });

  const [registerPopup, { closePopup: closeDetailPopup, changeLoading: changePopuploading }] = usePopupInner(init);

  async function init(data) {
    state.id = '';
    console.log('🚀 ~ init ~ data:', data);
    state.mode = data.mode;

    if (data.mode === ModeTypeEnum.ADD) {
      executeAdd(data);
    }
    if (data.mode === ModeTypeEnum.EDIT) {
      executeEdit(data);
    }
    if (data.mode === ModeTypeEnum.VIEW) {
      executeView(data);
    }
  }

  const rowData = {
    faiNo: '',
    spc: '',
    detail: '',
    dimension: '',
    tolPlus: '',
    tolMinus: '',
    instrumentName: '',
    resolution: '',
    usl: '',
    lsl: '',
  };

  const [Form, { setValues, getValues, setState }] = useVbenForm({
    showCollapseButton: false,
    submitOnChange: false,
    showDefaultActions: false,
    submitOnEnter: false,
    commonConfig: {
      componentProps: {},
      colon: true,
      formItemClass: 'items-start',
    },
    layout: 'vertical',
    wrapperClass: 'grid grid-cols-4 gap-4',
    schema: getEditSchema(),
    // i18nConfig: {
    //   moduleCode: 'PartNumberApplyColumn',
    //   transferRange: ['placeholder'],
    // },
  });

  const [Grid, { getDataSource, loadData, insertAt, reloadData, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-detectionData-edit',
      columns: getEditColumns(),
      toolbarConfig: {
        refresh: false,
      },
      customConfig: {
        allowVisible: false,
      },
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      data: [cloneDeep(rowData)],
      clipConfig: {
        isPaste: true,
        // excludeFields: ['originPartNumber'],
        // beforePasteMethod: handleBeforePaster,
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      keepSource: true,
      rowConfig: {
        keyField: 'uuid',
      },
      showIndexColumn: true,
    },
  });

  // function handleBeforePaster(data) {
  //   console.log(data, 'data');
  // }

  async function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
      loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, {
        ...copyData,
        uuid: buildUUID(),
      });
      loadData(data);
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      // remove(row);
      loadData(data);
    }
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
      },
    ];
  }

  function handleAddRows(rowCount) {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  function executeAdd(data) {
    // 新增
    // 初始化组织名称和创建人
    const userInfo = userStore.userInfo;

    const organizationName = userInfo.organizeName || '';
    const userName = userInfo.userName || '';
    const userAccount = userInfo.userAccount || '';
    if (!organizationName || !userName || !userAccount) {
      return;
    }
    setValues({
      organizationName: getLastThreeSegments(organizationName),
      userAccount: `${userName}/${userAccount}`,
    });
    console.log({
      organizationName: getLastThreeSegments(organizationName),
      userAccount: `${userName}/${userAccount}`,
    });
  }

  function executeEdit(data) {
    // 编辑
    console.log(data, 'datadatadata');
    state.id = data.id;
    setValues(data);
    reloadData(data.productQcItems);
  }

  function executeView(data) {
    setState({
      commonConfig: {
        disabled: true,
      },
    });
    // 查看
    setValues(data);
    reloadData(data.productQcItems);
    setDisabled(true);
  }

  async function handleSubmit(type) {
    const formValues = await getValues();
    const list = getDataSource();

    changePopuploading(true);
    const params = {
      ...formValues,
      productQcItems: list,
    };
    let func = saveProductDetail;

    if (state.id) {
      params.id = state.id;
      func = updateProductDetail;
    }

    func(params)
      .then(({ code, data, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          state.id = data || state.id;
          emit('submitSuccess', data);
          if (type === 'submit') {
            closeDetailPopup();
          }
        }
      })
      .finally(() => {
        changePopuploading(false);
      });
  }

  function getLastThreeSegments(path) {
    const segments = path.split('/').filter(segment => segment !== '');

    if (segments.length <= 3) {
      return segments.join('/');
    }

    return segments.slice(-3).join('/');
  }

  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    if (disabled) {
      const columns = getEditColumns();
      columns.pop();
      setGridOptions({
        columns,
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    }
  }
</script>

<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.temporarySave')"
    :showCancelBtn="false"
    destroyOnClose
    @ok="handleSubmit"
    :title="title"
    class="full-popup pb-10px">
    <template #centerToolbar>
      <a-space class="mr-12px">
        <a-button v-if="state.mode !== ModeTypeEnum.VIEW" type="primary" ghost @click="handleSubmit('save')">{{ t('common.temporarySave') }}</a-button>
        <a-button v-if="state.mode !== ModeTypeEnum.VIEW" type="primary" @click="handleSubmit('submit')">{{ t('common.submit') }}</a-button>
      </a-space>
    </template>
    <div class="bg-[#ebeef5]">
      <a-card>
        <Subtitle title="基础信息" />
        <Form />
      </a-card>
    </div>
    <div class="bg-[#ebeef5] h-10px w-full"></div>
    <Grid class="grid">
      <template v-if="!state.disabled" #toolbar-actions>
        <Subtitle placement="vxe" title="检测信息" id="material" :defaultValue="2" :extra="{ show: true }" @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>

<style scoped lang="less">
  .grid {
    height: calc(100% - 132px);
  }

  :deep(.required) {
    & > label::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ff4d4f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
</style>
