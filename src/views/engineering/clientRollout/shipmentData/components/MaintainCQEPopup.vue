<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('dict.CommonCol.maintainCQE')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup p-10px">
    <div class="title-stick">
      <div class="gun"></div>
      <div class="title">{{ t('dict.CommonCol.maintainCQE') }}</div>
    </div>

    <Grid style="height: calc(100% - 74px)">
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCQEColumn, editRules } from '../config';
  import { TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { maintenanceCqe, getCqeUserInfo, getProductStageList } from '/@/api/engineering/clientRollout';
  import { cloneDeep } from 'lodash-es';
  import { getFactoryList } from '/@/api/engineering/sample';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { getprojectlist, getInnermaterialnumber } from '/@/api/business/quantitation';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    // const [Grid, { reloadData, remove, validate, getDataSource, reloadColumn, setRow }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-shipmentData-maintainCQEList',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      // mouseConfig: {
      //   area: true, // 是否开启区域选取
      // },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      pagerConfig: {
        autoHidden: true,
      },
      editRules,
    },
  });

  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }
    // 项目复制处理
    handleAfterPasterInsideProjectCode(cols, rows, pasteCellData);

    // 工厂复制处理
    handleAfterPasterFactoryId(cols, rows, pasteCellData);

    // CQE人员
    handleAfterPasterUser(cols, rows, { id: 'cqeUserId', name: 'cqeUserName' });

    // 产品内部料号复制
    handleAfterPasterInsidePartNumber(cols, rows, pasteCellData);

    return true;
  }

  /**
   * 产品内部料号复制
   * @param cols
   * @param rows
   * @param pasteCells
   */
  function handleAfterPasterInsidePartNumber(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'insidePartNumber');
    if (targetIndex == -1) return false;
    // 产品内部料号如果有关联项目和工厂，则需要一起关联
    const dataList = rows.map(async (item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const { data } = await getInnermaterialnumber({ innerMaterialNumber: targetValue });
      const res = await getCqeUserInfo({ insidePartNumber: targetValue });
      const productStageListRes = await getProductStageList({ insidePartNumber: targetValue });
      const customerProductStage = productStageListRes.data?.[0]?.customerProductStage;
      const internalProductStage = productStageListRes.data?.[0]?.internalProductStage;
      return Object.assign(item, {
        insideProjectCode: data[0]?.InsideProjectCode,
        insideProjectCodeName: data[0]?.InsideProjectCode,
        factoryCode: data[0]?.Factory,
        factoryName: data[0]?.FactoryFullName,
        cqeUserId: res.data?.[0]?.userId,
        cqeUserName: res.data?.[0]?.userName,
        customerProductStage,
        internalProductStage,
        insidePartNumber: targetValue,
        insidePartNumberName: targetValue,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 项目复制处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  function handleAfterPasterInsideProjectCode(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'insideProjectCode');
    if (targetIndex == -1) return false;
    // 1、判断当前复制的项目是否存在，存在则被复制的行的产品内部料号的下拉选项数据需跟项目匹配，否则就无需匹配项目（通过isMemorize控制） 2、产品内部料号清空
    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      return Object.assign(item, {
        isMemorize: !projectlist.value.some(project => project.InsideProjectCode === item.insideProjectCode),
        insidePartNumber: '',
        insidePartNumberName: '',
        insideProjectCode: targetValue,
        insideProjectCodeName: targetValue,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 工厂复制处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  function handleAfterPasterFactoryId(cols: Array<{ field: string }>, rows: Array<{ factoryId: string }>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'factoryCode');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const code = targetValue.split('/')[0];
      const name = targetValue.split('/')[1];
      const target = factoryList.value.find(unit => unit.Name === name || unit.Code === code);
      return Object.assign(item, {
        factoryId: target?.Id || '',
        factoryName: target?.Code + '/' + target?.Name || '',
        factoryCode: target?.Code + '/' + target?.Name || '',
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param fieldConfig 赋值字段配置
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item[fieldConfig.id] || '';
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-clearn',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  const handleDelete = row => {
    gridApi.remove(row);
  };

  const maintainType = ref('');

  const factoryList = ref<any[]>([]);
  const projectlist = ref<any[]>([]);
  async function initFactoryList() {
    const { data } = await getFactoryList();
    factoryList.value = data;
  }
  async function initProjectlist() {
    const { data } = await getprojectlist({
      pageSize: 100,
    });
    projectlist.value = data;
  }

  // getprojectlist
  async function init({ type, list }) {
    initFactoryList();
    initProjectlist();
    maintainType.value = type;
    gridApi.reloadColumn(getCQEColumn(type));
    gridApi.reloadData(cloneDeep(list));
  }

  // 点击提交
  async function handleSaveFn() {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const dataList = gridApi.getDataSource().map(item => {
      return {
        id: item.id,
        cqeUserId: item.cqeUserId,
        insideProjectCode: item.insideProjectCode,
        insidePartNumber: item.insidePartNumber,
        factoryCode: item.factoryCode,
        customerProductStage: item.customerProductStage,
        internalProductStage: item.internalProductStage,
        productDate: item.productDate,
      };
    });
    changeLoading(true);
    const { code, msg } = await maintenanceCqe({ optType: maintainType.value === 'add' ? 1 : 2, dataList }).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
  }
</script>

<style lang="less" scoped>
  .title-stick {
    display: flex;
    align-items: center;
    margin: 20px 0;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }
</style>
