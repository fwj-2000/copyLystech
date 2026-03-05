<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    class="full-popup popup-top">
    <template #centerToolbar>
      <a-button class="ml-12px" @click="() => handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>

    <div class="h-full requirement-pop p-10px">
      <template v-if="!state.isModify">
        <Subtitle
          :title="t('views.filings.assignReviewer')"
          class="mt-8px pl-12px pr-12px"
          style="padding-bottom: 8px"
          :extra="{ show: false, hideAdd: true }" />
        <BasicForm @register="registerForm" />
      </template>
      <Subtitle :title="title" class="mt-8px" :extra="{ show: false, hideAdd: true }" />
      <div :style="{ height: state.isModify ? 'calc(100% - 70px)' : 'calc(100% - 150px)' }">
        <Grid>
          <template #imgUpload="{ row, column }">
            <ImageUpload
              :key="row[column.field]"
              :value="formatImageStringToList(row[column.field])"
              :multiple="true"
              version="2"
              width="100px"
              height="100px"
              @update:value="handleImageUrlChange($event, row, column.field)"
              @click.stop />
          </template>

          <template #img="{ row, column }">
            <template v-if="row[column.field]">
              <a-image
                v-for="url in formatImageStringToList(row[column.field], true)"
                :key="url"
                :width="100"
                :height="100"
                :src="url"
                object-fit="cover"
                loading="lazy" />
            </template>
            <span v-else></span>
          </template>

          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, nextTick, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { pick } from 'lodash-es';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { getEditTableColumn, editRules, getColumns, formatImageStringToList } from './ApplyPopConfig';
  import { getUnMakeDetail, customsAffairsMake, temporaryStorag, updateMake } from '/@/api/logisticAffairs/customsAffairsMake';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useUserStore } from '/@/store/modules/user';

  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import ImageUpload from '/@/components/Upload/src/components/ImageUpload.vue';

  interface State {
    list: Array<any>;
    initFields: any;
    moldeJsonList: Array<{ systemField: string; moldeField: string; translateField: string; isUpdate: 0 | 1; jsonId: string }>;
    customerConfigId: string;
    makeReviewUserId: string;
    /** 是否为`修改` */
    isModify: boolean;
  }

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);
  const title = ref<string>(t('views.filings.filingsInfo'));
  const userStore = useUserStore();

  const state = reactive<State>({
    list: [],
    initFields: {
      insidePartNumber: '',
      customsAffairsApplyId: '',
      sellCorporation: '',
      filingsLanguage: '',
      prot: '',
      shipmentType: '',
      pdPersonId: '',
      immediateCustomerPartNumber: '',
      terminalCustomerPartNumber: '',
      immediateCustomerName: '',
    },
    moldeJsonList: [],
    customerConfigId: '',
    makeReviewUserId: '',
    isModify: false,
  });
  // 可编辑状态列表
  const { createMessage, createConfirm } = useMessage();

  const gridOptions: VxeGridProps = {
    id: 'logisticAffairs-export-filings-finalForm-edit',
    columns: getEditTableColumn() as any,
    height: 'auto',
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    data: [{ ...state.initFields }],
    proxyConfig: {
      enabled: false,
    },
    showOverflow: false,
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      beforePasteMethod: ({ targetAreas }) => {
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols } = targetAreas[0];

        for (const col of cols) {
          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            col.editRender.props?.disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }

        return true;
      },
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'header-cell-dblclick': ({ column }) => {
        const includesFields = getEnableCols();

        const tableData = gridApi.getDataSource();

        if (!includesFields.includes(column.field)) return;
        if (tableData.length <= 1) return;
        const copyValue = tableData[0][column.field] || '';
        tableData.forEach((el: any, index: number) => {
          if (index === 0) {
            return false;
          }
          el[column.field] = copyValue;
        });
      },
    },
  });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  const [registerForm, { resetSchema, validate, setFieldsValue, clearValidate, getFieldsValue }] = useForm({
    schemas: [
      {
        field: 'makeReviewUserId',
        label: t('views.filings.reviewer'),
        component: 'CustomUserSelect',
        required: true,
        componentProps: {
          showSearch: true,
          style: 'width: 200px;',
          placeholder: '',
        },
        rules: [
          {
            validator(_rule, value, callback) {
              // 复核人不能指定自己
              if (value === userStore.getUserInfo.userId) {
                callback(t('dict.CustomsAffairsReview.selectReviewerTip'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
    ],
    layout: 'horizontal',
    baseColProps: {
      span: 24,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
  });

  async function init(data: { ids?: Array<string>; customerConfigId: string; isModify: boolean }) {
    state.list.length = 0;
    state.customerConfigId = data.customerConfigId;
    state.isModify = data.isModify || false;
    return nextTick(() => {
      state.isModify || resetSchema({});
      if (data.ids && data.ids.length > 0) {
        state.list = data.ids;
        getTableData(data.ids, data.customerConfigId);
      }
    });
  }

  function getTableData(ids: Array<string>, customerConfigId: string) {
    changeLoading(true);
    getUnMakeDetail({ ids, customerConfigId })
      .then(res => {
        const { outputs, moldeJsonList } = res.data;
        gridApi.reloadColumn(getColumns(moldeJsonList));
        state.moldeJsonList = moldeJsonList;
        state.customerConfigId = outputs?.[0]?.customerConfigId || '';
        state.makeReviewUserId = res?.data?.makeReviewUserId || '';

        setFieldsValue({ makeReviewUserId: state.makeReviewUserId });

        setTimeout(() => {
          state.isModify || clearValidate();

          const tableData = (Array.isArray(outputs) ? outputs : []).map(item => {
            const infoData = (Array.isArray(item.infoJsonList) ? item.infoJsonList : []).reduce((obj: any, item) => {
              obj[item.jsonId] = item.value;
              return obj;
            }, {});

            return {
              ...item,
              ...infoData,
            };
          });

          gridApi.grid.reloadData(tableData);
        });
      })
      .catch((error_: any) => {
        closePopup();
        throw error_;
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        gridApi.grid.remove(row);
        return Promise.resolve();
      },
    });
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat(['customsAffairsApplyId', 'declUnitName', 'legalUnit']);
  }

  async function handleSave(isSubmit = true) {
    let formData: any = getFieldsValue();
    // 当不是 `修改` 且为 `提交` 时，需要验证表单
    if (!state.isModify && isSubmit) {
      formData = await validate();
      if (!formData) {
        return false;
      }
    }

    const tableData = gridApi.getDataSource();

    if (tableData.length === 0) {
      return false;
    }

    const crInputs = tableData.map((el: any, index) => {
      return {
        customsAffairsApplyId: el.customsAffairsApplyId || state.list[index],
        infoJsonList: state.moldeJsonList.map(item => {
          return {
            ...item,
            value: el[item.jsonId],
          };
        }),
      };
    });

    changeLoading(true);
    changeOkLoading(true);

    let api: any = null;
    if (!isSubmit) {
      // 如果不是点击`提交`按钮，统一使用`暂存`接口
      api = temporaryStorag;
    } else if (state.isModify) {
      // 如果点击的是`提交`按钮，并且当前是`修改`，调用`制作修改`接口
      api = updateMake;
    } else {
      // 如果点击的是`提交`按钮，并且当前不是`修改`，调用`制作`接口
      api = customsAffairsMake;
    }

    return api({
      customerConfigId: state.customerConfigId,
      makeReviewUserId: state.isModify ? state.makeReviewUserId : formData.makeReviewUserId || '', // 如果是修改，不改变复核人，所以从接口返回的详情取值
      crInputs,
    })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        // 如果不是`提交`，则不关闭当前编辑页面
        isSubmit && closePopup();
      })
      .finally(() => {
        changeLoading(false);
        changeOkLoading(false);
      });
  }

  function handleImageUrlChange(list, row, field) {
    const urls = Array.isArray(list) ? list.map(item => (typeof item === 'string' ? item : item.url)).join(',') : '';
    gridApi.grid.setRow(row, { [field]: urls });
  }
</script>

<style lang="less" scoped>
  .popup-top {
    top: 0;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.basic-content-wrap) {
    display: inline-flex;
  }

  // :deep(.ant-upload-wrapper.ant-upload-picture-card-wrapper) {
  //   .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-container,
  //   .ant-upload.ant-upload-select {
  //     width: 100px;
  //     height: 50px;
  //   }
  // }

  .basic-form {
    display: inline-block;
    width: 200px;
    margin-right: 8px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
