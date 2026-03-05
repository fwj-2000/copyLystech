<template>
  <BasicModal
    v-bind="$attrs"
    :defaultFullscreen="true"
    :width="1200"
    :title="$t('dict.FeedList.kindReminder')"
    @register="registerModal"
    showOkBtn
    @ok="handleSubmit">
    <div class="flex-col h-full">
      <div class="mb-10px">
        <span>系统检测到您导入的数据跟现有数据存在相似的情况，是否进行下面的匹配动作。</span>
        <span class="text-color-red">如不进行匹配，系统将直接新增导入不覆盖原数据。</span>
      </div>
      <div class="grid-wrap">
        <Grid>
          <template #customerCode="{ column }">
            <i :class="collapsable1 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable1Event"></i>
            <span>{{ column.title }}</span>
          </template>
          <template #customerCodeDB="{ column }">
            <i :class="collapsable2 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable2Event"></i>
            <span>{{ column.title }}</span>
          </template>
        </Grid>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { importSave } from '/@/api/customerSerivce/fcData';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, keyFields } from './matchConfing';
  const { createMessage } = useMessage();
  const emit = defineEmits(['ok', 'register']);

  const state = reactive({
    params: {},
    batchCode: '',
    importList: [],
    multipleList: [],
    allList: [],
  });

  // 默认隐藏的字段
  const defaultHiddenFields: {
    importTable: string[];
    dbTable: string[];
  } = {
    importTable: [],
    dbTable: [],
  };
  // 配置默认的隐藏字段
  const formatHiddenFields = () => {
    const importTable: string[] = [];
    const dbTable: string[] = [];
    columns.forEach(item => {
      if (!keyFields.includes(item.field)) {
        importTable.push(item.field);
        dbTable.push('dbTable_' + item.field);
      }
    });
    defaultHiddenFields.dbTable = dbTable;
    defaultHiddenFields.importTable = importTable;
  };
  // 动态生成列表
  const formatColumn = (list: any[]) => {
    const cols = list.map((item, index) => {
      return {
        ...item,
        slots:
          index == 0
            ? {
                header: 'customerCodeDB',
              }
            : null,
        field: 'dbTable_' + item.field,
        headerClassName: 'bg-purple',
      };
    });
    return [
      {
        field: 'checkbox',
        type: 'checkbox',
        width: 40,
      },
      {
        field: 'importTable',
        title: '导入数据',
        width: 300,
        children: [
          {
            field: 'number',
            title: 'excle行号',
            width: 100,
          },
        ].concat(list),
      },
      {
        field: 'dbTable',
        title: '数据库数据',
        headerClassName: 'bg-purple',
        children: [
          {
            field: 'dbTable_id',
            title: '数据ID',
            width: 70,
            headerClassName: 'bg-purple',
          },
        ].concat(cols),
      },
    ];
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'targetTable',
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      proxyConfig: {
        autoLoad: false,
      },
      position: 'modal',
      columns: formatColumn(columns),
      showIndexColumn: true,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
    },
  });

  const collapsable1 = ref(false);
  const collapsable2 = ref(false);
  const collapsable1Event = () => {
    collapsable1.value = !collapsable1.value;
    defaultHiddenFields.importTable.forEach(field => {
      if (collapsable1.value) {
        gridApi.grid.showColumn(field);
      } else {
        gridApi.grid.hideColumn(field);
      }
    });
  };

  const collapsable2Event = () => {
    collapsable2.value = !collapsable2.value;
    defaultHiddenFields.dbTable.forEach(field => {
      if (collapsable2.value) {
        gridApi.grid.showColumn(field);
      } else {
        gridApi.grid.hideColumn(field);
      }
    });
  };
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    changeOkLoading(false);
    const { matchData, batchCode, params } = data;

    state.batchCode = batchCode;
    state.params = params;
    state.allList = matchData.allFcUserList;
    state.importList = matchData.importList;

    gridApi.reloadData(transformTargetList(matchData));
    setTimeout(() => {
      if (!defaultHiddenFields.importTable.length) {
        formatHiddenFields();
      }
      const hideFields = defaultHiddenFields.importTable.concat(defaultHiddenFields.dbTable);
      hideFields.forEach(field => {
        gridApi.grid.hideColumn(field);
      });
    }, 300);
  }
  /**
   * 将后台返回的匹配结果转换为 TargetTable 所需的数据结构
   * indexList: 导入数据表和数据库表相匹配的数据列表
   * importList: 导入的数据列表
   * dbList: 数据库中已存在的数据列表
   * 把 importList 和 dbList 结合到 indexList 中，形成完整的匹配数据结构
   * @param matchData 后端返回的匹配数据
   * @return 转换后的数据结构
   */
  function transformTargetList(matchData) {
    const { indexList = [], importList = [], dbExistList = [] } = matchData || {};
    return indexList.map(item => {
      const importItem = importList.find(i => i.id === item.importId) || {};
      const dbItem = dbExistList.find(i => i.dataId === item.dbDataId) || {};
      const result: Record<string, any> = {
        ...importItem,
      };
      Object.keys(dbItem).forEach(key => {
        result['dbTable_' + key] = dbItem[key];
      });
      return result;
    });
  }
  // 提交
  async function handleSubmit() {
    changeOkLoading(true);
    const results = gridApi.getSelectRows();
    // 检查是否有重复的导入项被匹配
    const seenParts = new Set();
    const sameData = new Set();
    for (let i = 0; i < results.length; i++) {
      const part = results[i].id;
      const dataId = results[i].dbTable_dataId;
      if (seenParts.has(part) || sameData.has(dataId)) {
        // 找到第一个重复出现的行号
        for (let j = 0; j < i; j++) {
          const isimport = results[j].id === part;
          const isdataId = results[j].dbTable_dataId === dataId;
          if (isimport) {
            createMessage.info(`相同导入数据匹配多条数据，请重新匹配。重复excle行号为：${results[j].number}`);
            return changeOkLoading(false);
          }
          if (isdataId) {
            createMessage.info(`相同数据库数据被多条导入数据匹配，请重新匹配。重复数据ID为：${results[j].dbTable_id}`);
            return changeOkLoading(false);
          }
        }
      }
      sameData.add(dataId);
      seenParts.add(part);
    }
    // 未匹配的项,进行填充
    const patchList = gridApi.getDataSource();
    state.allList.forEach((item: any) => {
      // 比对匹配列表，若是存在，则进行第二轮比对：若是勾选，则saveNew为0，否则为1
      const hasPatch = patchList.some((fcItem: any) => fcItem.id === item.importId);
      if (hasPatch) {
        const findItem = results.find((fcItem: any) => fcItem.id === item.importId);
        if (findItem) {
          item.dbIndex = findItem.dbTable_id;
          item.dbBatchNumber = findItem.dbTable_batchNumber;
          item.dbDataId = findItem.dbTable_dataId;
          item.saveNew = 0;
        } else {
          item.saveNew = 1;
        }
      }
    });
    const _params = {
      ...state.params,
      fcDataConfirmList: state.allList,
    };
    importSave(state.batchCode, _params)
      .then(() => {
        emit('ok');
        closeModal();
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  onMounted(() => {
    formatHiddenFields();
  });
</script>
<style lang="less" scoped>
  .text-color-red {
    color: @primary-color;
    font-weight: 600;
  }

  .grid-wrap {
    height: calc(100% - 50px);
  }
</style>
