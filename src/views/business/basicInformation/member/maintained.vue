<template>
  <div>
    <a-tabs v-model:value="state.configType" type="card" :destroyInactiveTabPane="true" class="bg-white h-full" @change="changeConfigType">
      <a-tab-pane :key="3" tab="料件号" class="h-full">
        <BasicTable :columns="state.metarialColumn" @register="registerTable_metaria" style="width: 100%">
          <template #tableTitle>
            <a-button v-auth="'btn_edit'" @click="update('materia')">修改</a-button>
            <ModelConfirmButton
              v-auth="'btn_update_main'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: '确定要拉取最新成员，并覆盖?',
                  onOk: updateMember.bind(null, 3),
                },
              }">
              <span>更新已维护成员</span>
            </ModelConfirmButton>
          </template>
        </BasicTable>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="直接客户" style="height: 100%">
        <BasicTable :columns="state.customerCoulumn" @register="registerTable_customer" style="width: 100%">
          <template #tableTitle>
            <a-button v-auth="'btn_edit'" @click="update('customer')">修改</a-button>
            <ModelConfirmButton
              v-auth="'btn_update_main'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: '确定要拉取最新成员，并覆盖?',
                  onOk: updateMember.bind(null, 2),
                },
              }">
              <span>更新已维护成员</span>
            </ModelConfirmButton>
          </template>
        </BasicTable>
      </a-tab-pane>
      <a-tab-pane :key="1" tab="内部项目代码" style="height: 100%">
        <BasicTable :columns="state.innercodeCoulumn" @register="registerTable_inner" style="width: 100%">
          <template #tableTitle>
            <a-button v-auth="'btn_edit'" @click="update('innerCode')">修改</a-button>
            <ModelConfirmButton
              v-auth="'btn_update_main'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: '确定要拉取最新成员，并覆盖?',
                  onOk: updateMember.bind(null, 1),
                },
              }">
              <span>更新已维护成员</span>
            </ModelConfirmButton>
          </template>
        </BasicTable>
      </a-tab-pane>
    </a-tabs>
    <batchPop @register="registerUpdatePopup" @reload="reload"></batchPop>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onMounted, reactive, watch } from 'vue';
  import { metarialColumns, commonColumns, customerCoulumn, innercodeCoulumn } from './config';
  import { formatTableDefaultText } from '/@/utils';
  import { BasicTable, useTable } from '/@/components/Table';
  import { usePopup } from '/@/components/Popup';
  import { getlist, getFactorylist, getSlectOps, getSonconfigtypelist, updtaeprojectmembers } from '/@/api/business/member';
  import batchPop from './components/updatePopup.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { BasicForm, useForm } from '/@/components/Form';
  import { useMemberStore } from '/@/store/modules/projectMember';
  const memberStore = useMemberStore();

  defineOptions({ name: 'business-basicInformation-member' });
  const { t } = useI18n();
  const state = reactive<any>({
    metarialColumn: [], // 材料的配置
    customerCoulumn: [], // 直接客户的配置
    innercodeCoulumn: [],
    configType: 3,
    metarial: {
      factory: '',
      productionType: '',
      materialPartsNumber: '',
    },
    configTypeList: {
      metaria: [],
      customer: [],
      innerCode: [],
    },
  });

  // 当配置变动时，变更表头
  function setTitleCol(sourceList, type) {
    const _configList: any = [];
    const _list = sourceList
      ? sourceList.map(item => {
          _configList.push({
            id: item.configType,
            fullName: item.configColumnName,
          });
          return {
            title: item.configColumnName,
            dataIndex: item.configType,
          };
        })
      : [];
    state.configTypeList[type] = _configList;
    return _list;
  }
  function getDyamicTitle() {
    getSonconfigtypelist(memberStore.mainProcess).then(res => {
      const { materialPartsNumberConfigList, immediateCustomerCodeConfigList, insideProjectCodeConfigList } = res.data;
      // 料件号
      const _list = setTitleCol(materialPartsNumberConfigList, 'metaria');
      state.metarialColumn = metarialColumns.concat(_list).concat(commonColumns);
      updateConfigList(); // 初始配置

      // 直接客户
      const _customerlist = setTitleCol(immediateCustomerCodeConfigList, 'customer');
      state.customerCoulumn = customerCoulumn.concat(_customerlist).concat(commonColumns);

      // 内部代码
      const _innerList = setTitleCol(insideProjectCodeConfigList, 'innerCode');
      state.innercodeCoulumn = innercodeCoulumn.concat(_innerList).concat(commonColumns);
    });
  }
  onMounted(async () => {
    getDyamicTitle();
  });

  const commonFormConfig: any = [
    {
      field: 'memberConfigJson',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择配置角色',
        options: state.configTypeList.metaria,
        fieldNa: {
          value: 'dataIndex',
          label: 'title',
        },
      },
    },
    {
      field: 'member',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入成员名称',
      },
    },
  ];
  const metariaSchema: any = [
    {
      field: 'materialPartsNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '料件号',
        submitOnPressEnter: true,
      },
    },
    {
      field: 'factory',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂',
        labelField: 'Name',
        valueField: 'Id',
        showSearch: true,
        api: async v => {
          // 动态获取数据
          const r = await getFactorylist({
            mainProcess: memberStore.mainProcess,
            code: v,
          });
          if (r.code == 200) {
            return r.data.map(el => {
              el.Name = el.Name + '/' + el.Code;
              return el;
            });
          }
        },
      },
    },
    {
      field: 'productionType',
      component: 'Select',
      label: '',
      componentProps: {
        options: [
          {
            id: 1,
            fullName: '自制',
          },
          {
            id: 2,
            fullName: '外购',
          },
        ],
        placeholder: '请选择生产类型',
      },
    },
    ...commonFormConfig,
  ];
  const customerShema = [
    {
      field: 'insideProjectCode',
      component: 'Input',
      componentProps: {
        placeholder: '内部项目代码',
        labelField: 'code',
        valueField: 'code',
        showSearch: true,
        api: getSlectOps,
      },
    },
    {
      field: 'immediateCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: '直接客户代码',
        labelField: 'code',
        valueField: 'code',
        showSearch: true,
        api: getSlectOps,
      },
    },
    ...commonFormConfig,
  ];
  const innerShema = [
    {
      field: 'insideProjectCode',
      component: 'Input',
      componentProps: {
        placeholder: '内部项目代码',
        labelField: 'code',
        valueField: 'code',
        showSearch: true,
        api: getSlectOps,
      },
    },
    ...commonFormConfig,
  ];

  const tabelConfig: any = {
    api: getlist,
    beforeFetch: params => {
      params = {
        ...params,
        configType: state.configType,
        mainProcess: memberStore.mainProcess,
      };
      if (params.memberConfigJson && params.member) {
        params.memberConfigJson = params.memberConfigJson + '-' + params.member;
      }
      if (!params.memberConfigJson && params.member) {
        params.memberConfigJson = params.member;
      }
      return params;
    },
    afterFetch: data => {
      const list = data.map(item => {
        item.memberConfigList.forEach(memberItem => {
          item[memberItem.configType] = memberItem.memberName;
        });
        return item;
      });
      return list;
    },
    rowKey: 'id',
    striped: true,
    useSearchForm: true, // 使用搜索表单
    bordered: true, // 显示表格边框
    showIndexColumn: true, // 显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    formConfig: {
      baseColProps: { span: 3 },
      schemas: commonFormConfig,
    },
    rowSelection: {
      type: 'checkbox',
    }, // 可选修改
    canColDrag: true,
    clearSelectOnPageChange: true,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  };
  const metariaConfig = {
    ...tabelConfig,
    formConfig: {
      baseColProps: { span: 4 },
      schemas: metariaSchema,
    },
  };
  const customerConfig = {
    ...tabelConfig,
    formConfig: {
      baseColProps: { span: 4 },
      schemas: customerShema,
    },
  };
  const innerConfig = {
    ...tabelConfig,
    formConfig: {
      baseColProps: { span: 4 },
      schemas: innerShema,
    },
  };

  const [registerTable_metaria, { getSelectRowKeys: getSelectRowKeys_metaria, reload: reload_metaria, getForm: getForm_metaria }] = useTable(metariaConfig);
  const [registerTable_customer, { getSelectRowKeys: getSelectRowKeys_customer, reload: reload_customer, getForm: getForm_customer }] =
    useTable(customerConfig);
  const [registerTable_inner, { getSelectRowKeys: getSelectRowKeys_inner, reload: reload_inner, getForm: getForm_inner }] = useTable(innerConfig);

  const [registerUpdatePopup, { openPopup: openUpdatePopup }] = usePopup();
  // 选中数据，进行修改
  const update = type => {
    // 获取列表数据
    let idList: any = [];
    switch (state.configType) {
      case 3:
        idList = getSelectRowKeys_metaria();
        break;
      case 2:
        idList = getSelectRowKeys_customer();
        break;
      case 1:
        idList = getSelectRowKeys_inner();
        break;
    }
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }
    openUpdatePopup(true, {
      ids: idList,
      updateType: type,
      mainProcess: memberStore.mainProcess,
    });
  };

  function changeConfigType(e) {
    nextTick(() => {
      state.configType = e;
      memberStore.updateconfigType(e, '1');
      updateConfigList();
      reload();
    });
  }
  function updateConfigList() {
    switch (state.configType) {
      case 3:
        const _m = state.configTypeList.metaria;
        console.log(_m);
        getForm_metaria().updateSchema({
          field: 'memberConfigJson',
          componentProps: {
            options: _m,
          },
        });
        break;
      case 2:
        const _c = state.configTypeList.customer;
        getForm_customer().updateSchema({
          field: 'memberConfigJson',
          componentProps: {
            options: _c,
          },
        });
        break;
      case 1:
        getForm_inner().updateSchema({
          field: 'memberConfigJson',
          componentProps: {
            options: state.configTypeList.innerCode,
          },
        });
        break;
    }
  }
  function reload() {
    switch (state.configType) {
      case 3:
        reload_metaria();
        break;
      case 2:
        reload_customer();
        break;
      case 1:
        reload_inner();
        break;
    }
  }

  // 父级的tab变更时，也需要动态更新内部数据
  const props = defineProps({
    reload: {
      type: Number,
      default: 0,
    },
  });
  watch(
    () => [props.reload],
    () => {
      changeConfigType(state.configType);
    },
  );

  // 更新成员
  async function updateMember(type) {
    const r = await updtaeprojectmembers(type);
    if (r.code == 200) {
      message.success(t('sys.api.operationSuccess'));
      // 更新列表
      reload();
    }
  }
  // 表单
  // const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
  //   schemas: [...metariaSchema],
  //   baseColProps: { span: 4 },
  // });
  // async function handleSubmit() {
  //   state.metarial = {
  //     ...state.metarial,
  //     ...getFieldsValue(),
  //   };
  //   reload();
  // }
  // async function handleReset() {
  //   resetFields();
  //   for (let k in state.metarial) {
  //     state.metarial[k] = '';
  //   }
  //   reload();
  // }
</script>
