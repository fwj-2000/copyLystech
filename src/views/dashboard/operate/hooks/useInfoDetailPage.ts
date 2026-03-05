// 运营指标明细页 hook 封装
import { ref, Ref, computed, watch, unref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { BasicColumn, useTable, PaginationProps } from '/@/components/Table';
import { getOrganization } from '/@/api/dashbord/operate';
import { TABLE_DETAIL_FIELD_DICTIONARY_MAPPING } from '/@/views/dashboard/operate/config';
import { saveTableDatasToExcel } from '/@/utils/file/download';
import { isEmpty } from 'lodash-es';

export interface Options {
  label?: string;
  value: string;
}

interface InfoDetailPageHookParams {
  resizeHeightOffset?: number;
  showColumns: BasicColumn[];
  searchFormValue: any;
  api: (data: any) => Promise<any>;
  fetchSetting?: Record<string, string>;
  downloadApi?: (data: any) => Promise<any>;
  afterFetch?: Fn;
  getFetchParams?: (data: any) => Record<string, any>;
}

export function useInfoDetailPage(params: InfoDetailPageHookParams) {
  // 下载明细加载
  const exportLoading = ref(false);

  const {
    api,
    resizeHeightOffset = 24,
    searchFormValue,
    showColumns,
    afterFetch: afterFetch,
    downloadApi,
    fetchSetting = {
      listField: 'list.list',
      totalField: 'list.pagination.total',
    },
    getFetchParams = () => ({}),
  } = params;

  // 取默认字段配置
  const columns: Ref<BasicColumn[]> = computed(() => {
    return showColumns.map(item => ({
      ...(TABLE_DETAIL_FIELD_DICTIONARY_MAPPING[item.dataIndex as string] || { title: item.dataIndex }),
      ...item,
    }));
  });

  const paginationInfo: Ref<PaginationProps> = ref({
    current: 1,
    pageSize: 100,
    total: 0,
    pageSizeOptions: ['100', '500', '1000'],
  });

  const ORG_CODE_OPTIONS = ref<Options[]>([]);

  const searchInfo = computed(() => {
    const fetchParam = getFetchParams(searchFormValue);
    return !isEmpty(fetchParam)
      ? fetchParam
      : {
          ...searchFormValue,
          ...(searchFormValue?.queryTime ? { queryTime: searchFormValue?.queryTime.unix() * 1000 } : {}),
        };
  });

  watch(
    () => searchInfo,
    () => {
      reloadFn();
    },
    { deep: true },
  );

  const exportToExcel = () => {
    const paginationRef = getPaginationRef();
    const total = (paginationRef && (paginationRef as PaginationProps).total) || 0;
    exportLoading.value = true;
    const hasDownloadApi = !!downloadApi;
    const fileName = '明细数据';
    if (hasDownloadApi) {
      downloadApi(unref(searchInfo))
        .then(res => {
          const { list = [] } = res.data || {};
          saveTableDatasToExcel({
            columns: unref(columns),
            tableList: list,
            fileName,
          });
          exportLoading.value = false;
        })
        .catch(() => {
          exportLoading.value = false;
        });
    } else {
      api({
        ...unref(searchInfo),
        ...(hasDownloadApi ? {} : { pageSize: total }),
      })
        .then(res => {
          const { list: { list = [] } = { list: [] } } = res.data || {};
          saveTableDatasToExcel({
            columns: unref(columns),
            tableList: list,
            fileName,
          });
          exportLoading.value = false;
        })
        .catch(() => {
          exportLoading.value = false;
        });
    }
  };

  const [registerTable, { reload, getPaginationRef }] = useTable({
    api,
    columns,
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    pagination: paginationInfo,
    striped: true,
    canResize: true,
    resizeHeightOffset,
    searchInfo,
    fetchSetting,
    afterFetch,
  });

  const reloadFn = useDebounceFn(reload, 500);

  // 获取组织架构列表
  getOrganization({ keyword: 1 }).then(res => {
    const {
      data: { list },
    } = res;
    ORG_CODE_OPTIONS.value = list.map(item => ({
      label: item.org_Name || item.Org_Name || '',
      value: item.org_Code || item.Org_Code || '',
    }));
  });

  return { ORG_CODE_OPTIONS, exportLoading, exportToExcel, registerTable };
}
