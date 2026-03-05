<template>
  <BasicPopup @register="registerPopup" v-bind="$attrs" destroyOnClose>
    <template #title>
      <div class="header-title">绑定命令</div>
    </template>
    <BasicTable @register="registerTable" @fetch-success="res => setKey(res)">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.status === 1 ? t('common.yesText') : t('common.noText') }}</a-tag>
        </template>
      </template>
    </BasicTable>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { parmByFormat, addParm, deleteParm } from '/@/api/equipment/connSettings';
  const { t } = useI18n();
  interface State {
    param: any[];
  }

  const state = reactive<State>({
    param: [],
  });

  const columnsTCP: BasicColumn[] = [];

  const columnsUDP: BasicColumn[] = [
    { title: '协议类型', dataIndex: 'commMethod', align: 'center' },
    { title: '编码', dataIndex: 'code', align: 'center' },
    { title: '设备类型', dataIndex: 'equipmentType' },
    { title: '报头', dataIndex: 'header' },
    { title: '系统', dataIndex: 'systemNumber' },
    { title: '参数类型', dataIndex: 'parameterType' },
    { title: '轴号', dataIndex: 'axisNumber' },
    { title: '参数代码', dataIndex: 'parameterCode' },
    { title: '参数名称', dataIndex: 'parameterName' },
    { title: '参数值', dataIndex: 'parameterValue' },
    { title: '报尾', dataIndex: 'tail' },
    { title: '是否启用', dataIndex: 'status' },
    { title: '备注', dataIndex: 'remark' },
  ];

  const columnsModbusTcp: BasicColumn[] = [
    { title: '协议类型', dataIndex: 'commMethod', align: 'center' },
    { title: '编码', dataIndex: 'code', align: 'center' },
    { title: '设备类型', dataIndex: 'equipmentType' },
    { title: '从站地址', dataIndex: 'slaveId' },
    { title: '功能码', dataIndex: 'funCode' },
    { title: '起始地址', dataIndex: 'startAddress' },
    { title: '地址数量', dataIndex: 'addressNum' },
    { title: '是否启用', dataIndex: 'status' },
    { title: '备注', dataIndex: 'remark' },
  ];

  const [registerTable, { setColumns, setProps, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'id',
    canResize: true, //自适应高度
    showTableSetting: false, //是否显示工具按钮
    bordered: true, //显示表格边框
    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 50,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
      onSelect: (e, b) => {
        const list = [e].map(o => {
          return {
            formatId: state.param.id,
            parmId: o.id,
          };
        });

        if (b) {
          //绑定命令
          addParm(list);
        } else {
          //解绑命令
          deleteParm(list);
        }
      },
      onSelectAll: (b, arr, change) => {
        console.log(change);
        const list = change.map(o => {
          return {
            formatId: state.param.id,
            parmId: o.id,
          };
        });
        if (b) {
          //绑定
          addParm(list);
        } else {
          //解绑
          deleteParm(list);
        }
      },
    },
  });

  const [registerPopup, { closePopup }] = usePopupInner(init);

  function init(data) {
    state.param = data.param;
    if (data.param.commMethod == 'TCP') {
      setColumns(columnsTCP);
    }
    if (data.param.commMethod == 'UDP') {
      setColumns(columnsUDP);
    }
    if (data.param.commMethod == 'ModbusTcp') {
      setColumns(columnsModbusTcp);
    }
    setProps({
      api: parmByFormat,
      searchInfo: {
        id: data.param.id,
        commMethod: data.param.commMethod,
      },
    });
  }

  function setKey(data) {
    const _selectList: any = [];
    data.items.forEach(o => {
      if (o.formatId) {
        _selectList.push(o.id);
      }
    });
    setSelectedRowKeys(_selectList);
  }
</script>
