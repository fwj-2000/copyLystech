<template>
  <BasicPopup @register="registerPopup" v-bind="$attrs" destroyOnClose>
    <template #title>
      <div class="header-title">{{ state.type == 1 ? t('common.addText') : t('common.detailText') }}</div>
    </template>
    <template #insertToolbar>
      <a-button v-if="state.type == 1 && state.dataForm.code" class="btn" type="primary" @click="dStatus">{{ t('common.deleteTemporarySave') }}</a-button>
      <a-button v-if="state.type == 1 && !state.dataForm.code" class="btn" @click="save(2)">{{ t('common.temporarySave') }}</a-button>
      <a-button v-if="state.type == 1" class="btn" type="primary" @click="save(1)">{{ t('common.saveText') }}</a-button>
    </template>
    <div class="form">
      <Subtitle title="基础信息"></Subtitle>
      <BasicForm @register="registerForm" title="基础信息"> </BasicForm>
    </div>
    <div>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'result'">
            <a-select v-model:value="record.result" :disabled="state.type == 2" placeholder="请选择">
              <a-select-option v-for="item in state.resultList" :key="item.id" :value="item.id">{{ item.fullName }}</a-select-option>
            </a-select>
          </template>
          <template v-if="column.dataIndex === 'ngDetails' && record.result == 2">
            <a-input v-model:value="record.ngDetails" :disabled="state.type == 2"> </a-input>
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { Subtitle } from '/@/components/Subtitle';
  import { getEquipmentByCode, getEquipmentList } from '/@/api/equipment/information';
  import { getItemList } from '/@/api/equipment/checkItems';
  import { addCheck, getCheckById, getCheckByStatus, deleteStatus, updateStatus } from '/@/api/equipment/spotCheck';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
    resultList: any[];
    type: number;
    id: string;
  }

  const state = reactive<State>({
    dataForm: {},
    resultList: [],
    type: 100,
    id: '',
  });
  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'equipmentCode',
      label: '设备编码',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请输入设备编码',
        labelField: 'Name',
        valueField: 'Code',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'Code',
        },
        api: async v => {
          // 动态获取数据
          const r = await getEquipmentList(v);
          if (r.code == 200) {
            return r.data.map(el => {
              el.Name = el.Code + '/' + el.Name;
              return el;
            });
          }
        },
        onkeydown: key => onkeydown(key),
      },
    },
    {
      field: 'Name',
      label: '设备名称',
      component: 'Input',
      componentProps: {
        readonly: true,
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'CategoryName',
      label: '设备分类',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'Specification',
      label: '规格型号',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'SerialNumber',
      label: '机身序列号',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'SupplierName',
      label: '设备制造商',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'Position',
      label: '设备位置',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'FactoryAreaName',
      label: '厂区',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'ArrivalTime',
      label: '到厂时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      field: 'classes',
      label: '班次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
      },
    },
    {
      field: 'creatorUserName',
      label: '点检人',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      ifShow: () => {
        return state.type == 2;
      },
    },
    {
      field: 'creatorTime',
      label: '点检时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        disabled: true,
      },
      ifShow: () => {
        return state.type == 2;
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        rows: 1,
      },
    },
  ];

  const column: BasicColumn[] = [
    { title: '点检项编码', dataIndex: 'code' },
    { title: '点检项名称', dataIndex: 'name' },
    { title: '点检项标准', dataIndex: 'standard' },
    { title: '点检方法', dataIndex: 'method' },
    { title: '点检结果', dataIndex: 'result' },
    {
      title: 'NG原因',
      dataIndex: 'ngDetails',
    },
  ];

  const emit = defineEmits(['register', 'reload']);

  const { createMessage } = useMessage();

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerForm, { setFieldsValue, getFieldsValue, resetFields, updateSchema }] = useForm({
    schemas: schemas,
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
  });
  const [registerTable, { setTableData, getDataSource }] = useTable({
    columns: column,
    pagination: false,
  });

  async function init(data) {
    resetFields();
    state.dataForm = {};
    state.type = data.type;
    if (data.type == 1) {
      //查询是否存在暂存数据
      const isStatus = (await getCheckByStatus()).data;
      if (isStatus) {
        state.id = isStatus.id;
        state.dataForm.code = isStatus.code;
        setFieldsValue(isStatus);
        setTableData(isStatus.entities);
      }
    }
    state.resultList = data.resultList;
    if (data.classesNameList) updateSchema({ field: 'classes', componentProps: { options: data.classesNameList } });
    if (data.id) {
      state.dataForm.id = data.id;
      const list = (await getCheckById(data.id)).data;
      setFieldsValue(list);
      setTableData(list.entities);
      updateSchema([
        { field: 'classes', componentProps: { disabled: true } },
        { field: 'equipmentCode', componentProps: { disabled: true } },
        { field: 'remark', componentProps: { disabled: true } },
      ]);
    }
  }

  //设备编码输入框回车事件
  function onkeydown(key) {
    if (key.key == 'Enter') {
      const code = getFieldsValue()['equipmentCode'];
      //查询设备信息
      getEquipmentByCode(code).then(res => {
        if (res.data && res.data.Id) {
          //给form表单赋值
          setFieldsValue(res.data);
          const cate = res.data['Category'];
          //查询点检项根据设备类型
          getItemList({ category: cate }).then(res => {
            if (res.data && res.data[0].id) {
              setTableData(res.data);
            } else {
              createMessage.warning('请先维护点检项');
            }
          });
        }
      });
    }
  }

  function save(status) {
    const data = getFieldsValue();
    const entities = getDataSource();
    const isOK = entities.find(c => c.result == null);
    if (isOK) {
      createMessage.warning('有未点检的项目');
      return;
    }
    if (state.dataForm.code) {
      let check = {
        id: state.id,
        code: state.dataForm.code,
        ...data,
        entities,
      };
      //修改暂存数据
      updateStatus(check).then(res => {
        createMessage.success(res.msg);
        closePopup();
        emit('reload');
      });
    } else {
      let check = {
        status: status,
        ...data,
        entities,
      };
      addCheck(check)
        .then(res => {
          createMessage.success(res.msg);
          closePopup();
          emit('reload');
        })
        .catch(() => {
          changeLoading(false);
        });
    }
    state.id = '';
    state.dataForm = {};
  }

  //删除暂存
  function dStatus() {
    deleteStatus().then(res => {
      createMessage.success(res.msg);
      resetFields();
    });
  }
</script>

<style scoped>
  .form {
    margin: 0 36px 0 24px;
  }

  .btn {
    margin: 0 5px;
  }
</style>
