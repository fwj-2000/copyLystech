<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm
          @register="registerSearchForm"
          :schemas="searchSchemas"
          @advanced-change="redoHeight"
          @submit="handleSearchSubmit"
          @reset="handleSearchReset"
          class="search-form">
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" v-bind="getTableBindValue" ref="tableRef" @columns-change="handleColumnChange">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addHandle()">上传文件</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="!(record.top || column.id?.includes('-'))">
              <!-- <template v-if="column.lydcKey === 'sign'">
                <lydc-sign v-model:value="record[column.dataIndex]" detailed />
              </template>
              <template v-if="column.lydcKey === 'signature'">
                <lydc-signature v-model:value="record[column.dataIndex]" detailed />
              </template>
              <template v-if="column.lydcKey === 'rate'">
                <lydc-rate v-model:value="record[column.dataIndex]" :count="column.count" :allowHalf="column.allowHalf" disabled />
              </template>
              <template v-if="column.lydcKey === 'slider'">
                <lydc-slider v-model:value="record[column.dataIndex]" :min="column.min" :max="column.max" :step="column.step" disabled />
              </template>
              <template v-if="column.lydcKey === 'uploadImg'">
                <lydc-upload-img v-model:value="record[column.dataIndex]" disabled detailed simple v-if="record[column.dataIndex]?.length" />
              </template>
              <template v-if="column.lydcKey === 'uploadFile'">
                <lydc-upload-file v-model:value="record[column.dataIndex]" disabled detailed simple v-if="record[column.dataIndex]?.length" />
              </template> -->
              <template v-if="record[column.dataIndex]">
                <template v-if="column.key === 'desensitizedUrl' || column.key === 'convertedUrl' || column.key === 'sourceUrl'">
                  <div class="flex pl-4px pr-4px">
                    <span class="truncate">
                      <!-- <a-tooltip :title="record[column.dataIndex]" placement="bottom"> -->
                      {{ record[column.dataIndex].match(/[^/]+$/)[0] }}
                      <!-- </a-tooltip> -->
                    </span>
                    <span class="upload-file-list__item-actions">
                      <EyeOutlined title="查看" class="pl-4px" @click="handlePreview(record[column.dataIndex])" />
                      <DownloadOutlined title="下载" class="pl-8px" @click="handleDownload(record[column.dataIndex])" />
                    </span>
                  </div>
                </template>
                <!-- <lydc-input
                  v-else
                  v-model:value="record[column.dataIndex]"
                  :useMask="column.useMask"
                  :maskConfig="column.maskConfig"
                  :showOverflow="true"
                  detailed /> -->
              </template>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <Form ref="formRef" @reload="reload" />
    <FilePreview ref="filePreviewRef" />
  </div>
</template>

<script lang="ts" setup>
  import { getList } from './helper/api';
  import { getDictionaryDataSelector } from '/@/api/systemData/dictionary';
  import { getDataInterfaceRes } from '/@/api/systemData/dataInterface';
  import { ref, reactive, onMounted, toRefs, computed, unref, nextTick, provide } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, TableActionType, SorterResult } from '/@/components/Table';
  import Form from './Form.vue';
  import { useRoute } from 'vue-router';
  import { getSearchFormSchemas } from '/@/components/FormGenerator/src/helper/transform';
  import { cloneDeep } from 'lodash-es';
  import columnList from './helper/columnList';
  import searchList from './helper/searchList';
  import { dyOptionsList } from '/@/components/FormGenerator/src/helper/config';
  import { noGroupList } from '/@/components/FormGenerator/src/helper/config';
  import { EyeOutlined, DownloadOutlined } from '@ant-design/icons-vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { FilePreview, createImgPreview } from '/@/components/Preview/index';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getParamList } from '/@/utils/lydc';

  interface State {
    config: any;
    columnList: any[];
    printListOptions: any[];
    columnBtnsList: any[];
    customBtnsList: any[];
    treeActiveId: string;
    treeActiveNodePath: any;
    columns: any[];
    complexColumns: any[];
    childColumnList: any[];
    exportList: any[];
    cacheList: any[];
    currFlow: any;
    isCustomCopy: boolean;
    candidateType: number;
    currRow: any;
    workFlowFormData: any;
    expandObj: any;
    columnSettingList: any[];
    searchSchemas: any[];
    treeRelationObj: any;
    treeQueryJson: any;
    leftTreeActiveInfo: any;
  }

  const route = useRoute();

  const formRef = ref<any>(null);
  const tableRef = ref<Nullable<TableActionType>>(null);

  const filePreviewRef = ref<any>(null);
  const imgTypeList = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);

  const defaultSearchInfo = {
    menuId: route.meta.modelId as string,
    moduleId: '605245303720771525',
    superQueryJson: '',
  };
  const searchInfo: any = reactive({
    ...cloneDeep(defaultSearchInfo),
  });
  const state = reactive<State>({
    config: {},
    columnList: [],
    printListOptions: [],
    columnBtnsList: [],
    customBtnsList: [],
    treeActiveId: '',
    treeActiveNodePath: [],
    columns: [],
    complexColumns: [], // 复杂表头
    childColumnList: [],
    exportList: [],
    cacheList: [],
    currFlow: {},
    isCustomCopy: false,
    candidateType: 1,
    currRow: {},
    workFlowFormData: {},
    expandObj: {},
    columnSettingList: [],
    searchSchemas: [],
    treeRelationObj: null,
    treeQueryJson: {},
    leftTreeActiveInfo: {},
  });
  const { searchSchemas } = toRefs(state);
  const [registerSearchForm, { updateSchema, submit: searchFormSubmit }] = useForm({
    baseColProps: { span: 6 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    compact: true,
  });
  const [registerTable, { reload, setLoading, redoHeight, clearSelectedRowKeys }] = useTable({
    api: getList,
    immediate: false,
    clickToRowSelect: false,
    afterFetch: data => {
      const list = data.map(o => ({
        ...o,
        ...state.expandObj,
      }));
      state.cacheList = cloneDeep(list);
      return list;
    },
  });

  provide('getLeftTreeActiveInfo', () => state.leftTreeActiveInfo);

  const getHasBatchBtn = computed(() => {
    let btnsList = [];
    return !!btnsList.length;
  });
  const getTableBindValue = computed(() => {
    let columns = state.complexColumns;
    const defaultSortConfig = [] as any;
    const sortField = defaultSortConfig.map(o => (o.sort === 'desc' ? '-' : '') + o.field);
    const data: any = {
      pagination: { pageSize: 20 }, //有分页
      searchInfo: unref(searchInfo),
      ellipsis: true,
      defSort: { sidx: sortField.join(',') },
      sortFn: (sortInfo: SorterResult | SorterResult[]) => {
        if (Array.isArray(sortInfo)) {
          const sortList = sortInfo.map(o => (o.order === 'descend' ? '-' : '') + o.field);
          return { sidx: sortList.join(',') };
        } else {
          const { field, order } = sortInfo;
          if (field && order) {
            // 排序字段
            return { sidx: (order === 'descend' ? '-' : '') + field };
          } else {
            return {};
          }
        }
      },
      columns,
      // bordered: true,
      // actionColumn: {
      //   width: 150,
      //   title: '操作',
      //   dataIndex: 'action',
      // },
    };
    if (unref(getHasBatchBtn)) {
      const rowSelection: any = { type: 'checkbox' };
      data.rowSelection = rowSelection;
    }
    return data;
  });

  // 新增
  function addHandle() {
    const data = {
      id: '',
      menuId: searchInfo.menuId,
      allList: state.cacheList,
    };
    formRef.value?.init(data);
  }

  function init() {
    state.config = {};
    searchInfo.menuId = route.meta.modelId as string;

    state.columnList = columnList;
    getSearchSchemas();

    setLoading(true);
    getColumnList();
    nextTick(() => {
      // 有搜索列表
      searchFormSubmit();
    });
  }
  function getSearchSchemas() {
    const schemas = getSearchFormSchemas(searchList);
    state.searchSchemas = schemas;
    schemas.forEach(cur => {
      const config = cur.__config__;
      if (dyOptionsList.includes(config.lydcKey)) {
        if (config.dataType === 'dictionary') {
          if (!config.dictionaryType) return;
          getDictionaryDataSelector(config.dictionaryType).then(res => {
            updateSchema([{ field: cur.field, componentProps: { options: res.data.list } }]);
          });
        }
        if (config.dataType === 'dynamic') {
          if (!config.propsUrl) return;
          const query = { paramList: getParamList(config.templateJson) || [] };
          getDataInterfaceRes(config.propsUrl, query).then(res => {
            const data = Array.isArray(res.data) ? res.data : [];
            updateSchema([{ field: cur.field, componentProps: { options: data } }]);
          });
        }
      }
      cur.defaultValue = cur.value;
    });
  }
  function getColumnList() {
    // 没有权限
    let columnList = state.columnList;

    state.exportList = columnList.filter(o => !noGroupList.includes(o.__config__.lydcKey));
    let columns = columnList.map(o => ({
      ...o,
      title: o.label,
      dataIndex: o.prop,
      align: o.align,
      fixed: o.fixed == 'none' ? false : o.fixed,
      sorter: o.sortable ? { multiple: 1 } : o.sortable,
      width: o.width || 100,
    }));
    columns = getComplexColumns(columns);
    state.columns = columns.filter(o => o.prop.indexOf('-') < 0);
    getChildComplexColumns(columns);
  }
  function getComplexColumns(columns) {
    let complexHeaderList: any[] = [];
    if (!complexHeaderList.length) return columns;
    let childColumns: any[] = [];
    let firstChildColumns: string[] = [];
    for (let i = 0; i < complexHeaderList.length; i++) {
      const e = complexHeaderList[i];
      e.title = e.fullName;
      e.align = e.align;
      e.dataIndex = e.id;
      e.prop = e.id;
      e.children = [];
      e.lydcKey = 'complexHeader';
      if (e.childColumns?.length) {
        childColumns.push(...e.childColumns);
        for (let k = 0; k < e.childColumns.length; k++) {
          const item = e.childColumns[k];
          for (let j = 0; j < columns.length; j++) {
            const o = columns[j];
            if (o.prop == item && o.fixed !== 'left' && o.fixed !== 'right') e.children.push({ ...o });
          }
        }
      }
      if (e.children.length) firstChildColumns.push(e.children[0].prop);
    }
    complexHeaderList = complexHeaderList.filter(o => o.children.length);
    let list: any[] = [];
    for (let i = 0; i < columns.length; i++) {
      const e = columns[i];
      if (!childColumns.includes(e.prop)) {
        list.push(e);
      } else {
        if (firstChildColumns.includes(e.prop)) {
          const item = complexHeaderList.find(o => o.childColumns.includes(e.prop));
          list.push(item);
        }
      }
    }
    return list;
  }
  function getChildComplexColumns(columnList) {
    let list: any[] = [];
    for (let i = 0; i < columnList.length; i++) {
      const e = columnList[i];
      if (!e.prop.includes('-')) {
        list.push(e);
      } else {
        let prop = e.prop.split('-')[0];
        let vModel = e.prop.split('-')[1];
        let label = e.label.split('-')[0];
        let childLabel = e.label.replace(label + '-', '');
        let newItem = {
          align: 'center',
          lydcKey: 'table',
          prop,
          label,
          title: label,
          dataIndex: prop,
          children: [],
        };
        e.dataIndex = vModel;
        e.title = childLabel;
        if (!state.expandObj.hasOwnProperty(`${prop}Expand`)) state.expandObj[`${prop}Expand`] = false;
        if (!list.some(o => o.prop === prop)) list.push(newItem);
        for (let i = 0; i < list.length; i++) {
          if (list[i].prop === prop) {
            list[i].children.push(e);
            break;
          }
        }
      }
    }
    // 行内分组展示
    getMergeList(list);
    state.complexColumns = list;
    state.childColumnList = list.filter(o => o.lydcKey === 'table');
    // 子表分组展示宽度取100
    for (let i = 0; i < state.childColumnList.length; i++) {
      const e = state.childColumnList[i];
      if (e.children?.length) e.children = e.children.map(o => ({ ...o, width: 100 }));
    }
  }
  function getMergeList(list) {
    list.forEach(item => {
      if (item.lydcKey === 'table' && item.children && item.children.length) {
        item.children.forEach((child, index) => {
          if (index == 0) {
            child.customCell = () => ({
              rowspan: 1,
              colspan: item.children.length,
              class: 'child-table-box',
            });
          } else {
            child.customCell = () => ({
              rowspan: 0,
              colspan: 0,
            });
          }
        });
      }
    });
  }
  function handleColumnChange(data) {
    state.columnSettingList = data;
  }

  function handleSearchReset() {
    searchFormSubmit();
  }
  function handleSearchSubmit(data) {
    clearSelectedRowKeys();
    let obj = {
      ...defaultSearchInfo,
      superQueryJson: searchInfo.superQueryJson,
      ...data,
      ...(state.treeQueryJson || {}),
    };
    Object.keys(searchInfo).map(key => {
      delete searchInfo[key];
    });
    for (let [key, value] of Object.entries(obj)) {
      searchInfo[key.replaceAll('-', '_')] = value;
    }
    reload({ page: 1 });
  }
  // 文件预览
  function handlePreview(url) {
    const fileType = (url && url.split('.').pop()) || '';
    const fileName = (url && url.split('/').pop()) || '';

    // 图片预览
    if (imgTypeList.includes(fileType)) {
      const imageList = [apiUrl.value + url];
      createImgPreview({ imageList: imageList });
      return;
    }

    // 文件预览
    const params = {
      name: fileName,
      fileId: fileName,
      url,
    };
    filePreviewRef.value?.init(params);
  }
  // 文件下载
  function handleDownload(fileUrl) {
    downloadByUrl({ url: fileUrl, fileName: fileUrl });
  }

  onMounted(() => {
    init();
  });
</script>
