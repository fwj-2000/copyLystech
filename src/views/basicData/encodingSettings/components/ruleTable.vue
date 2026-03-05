<template>
  <a-row :gutter="24">
    <a-col>
      <a-button type="primary" @click="handleEmits('addAction')">新增规则</a-button>
    </a-col>
    <a-col>
      <a-button @click="handleBatchDel">批量删除</a-button>
    </a-col>
  </a-row>
  <a-table
    class="ant-table-striped"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-height table-striped' : 'table-height')"
    :columns="columns"
    :data-source="props.data"
    :pagination="false"
    rowKey="Id"
    :loading="props.loading"
    :rowSelection="rowSelection"
    :scroll="{ y: '54vh' }">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'Type'">
        <div>{{ props.typeOption.find(item => item.sortCode === text)?.fullName }}</div>
      </template>
      <template v-else-if="column.dataIndex === 'edit'">
        <div @click="handleEmits('editSetting', record)">
          <span class="edit-text">配置编码</span>
          <SettingOutlined />
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'Status'">
        <a-switch :checkedValue="1" :unCheckedValue="0" v-model:checked="record.Status" @click="handleChangeActive(record)" />
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <div class="edit-box">
          <div class="icon-size" @click="handleEmits('editAction', record)">
            <img :src="EditOutlined" />
          </div>
          <a-popconfirm title="是否执行删除操作?" @confirm="onDelete(record.Id)">
            <div class="icon-size">
              <img :src="DeleteOutlined" />
            </div>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import EditOutlined from '../assets/EditOutlined.svg';
  import DeleteOutlined from '../assets/DeleteOutlined.svg';
  import { FileSearchOutlined, SettingOutlined } from '@ant-design/icons-vue';
  import { computed, defineEmits, defineProps, ref, unref, toRefs } from 'vue';
  import { message, Table } from 'ant-design-vue';
  import { deleteIdGeneratorRule, postIdsDelGeneratorRule, putIdGeneratorRuleDisable, putIdGeneratorRuleEnable } from '/@/api/basicData/encodingSettings';

  const emits = defineEmits(['addAction', 'getTable', 'editAction', 'editSetting']);
  // { data, loading, typeOption, pageState }
  const props = defineProps(['data', 'loading', 'typeOption', 'pageState']);

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'Name',
      key: 'Name',
      scopedSlots: { customRender: 'Name' },
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: '规则类型',
      dataIndex: 'Type',
      key: 'Type',
      scopedSlots: { customRender: 'Type' },
      sorter: (a, b) => a.Type - b.Type,
    },
    {
      title: '版本号',
      dataIndex: 'Version',
      key: 'Version',
      sorter: (a, b) => a.Version.localeCompare(b.Version),
    },
    {
      title: '组织',
      dataIndex: 'OrgId',
      key: 'OrgId',
      sorter: (a, b) => a.OrgId - b.OrgId,
    },
    {
      title: '描述',
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: '编辑配置',
      dataIndex: 'edit',
    },
    {
      title: '激活',
      dataIndex: 'Status',
      key: 'Status',
    },
    {
      title: '操作',
      dataIndex: 'action',
    },
  ];
  const selectedRowKeys = ref<string[] | number[]>([]);

  const onSelectChange = (changableRowKeys: string[]) => {
    selectedRowKeys.value = changableRowKeys;
  };
  // 禁用启用
  const handleChangeActive = async record => {
    const {
      pageState: { pageSize, current },
    } = props;
    console.log(pageSize)
    console.log(current)
    const { Id, Status } = record;
    const params = { pageSize: pageSize, currentPage: current };

    let res;
    if (Status === 1) {
      // 启用
      res = await putIdGeneratorRuleEnable(Id);
    } else {
      res = await putIdGeneratorRuleDisable(Id);
    }
    // 禁用
    const { code, msg } = res;
    message.destroy();
    emits('getTable', params);
    if (code === 200) {
      return message.success(msg);
    }
    return message.error(msg);
  };

  const rowSelection = computed(() => {
    return {
      selectedRowKeys: unref(selectedRowKeys),
      onChange: onSelectChange,
      hideDefaultSelections: true,
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    };
  });
  const handleEmits = (type: string, params = {}) => {
    emits(type, params);
  };
  // 批量删除
  const handleBatchDel = async () => {
    const {
      pageState: { pageSize, current },
    } = props;
    const ids = selectedRowKeys.value;
    if (ids.length === 0) {
      return message.warning('请选择需要删除的规则!');
    }
    try {
      const { code } = await postIdsDelGeneratorRule(ids);
      if (code === 200) {
        const params = { pageSize: pageSize, currentPage: current };
        emits('getTable', params);
        message.success('批量删除成功!');
      }
    } catch (e) {}
  };
  // 删除
  const onDelete = (key: string | number) => {
    deleteIdGeneratorRule(key).then(({ msg }) => {
      emits('getTable');
      return message.success(msg);
    });
  };
</script>

<style lang="less" scoped>
  .ant-table-striped {
    margin-top: 25px;
  }

  [data-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
  }

  [data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background: var(---, #f3f3f3);
  }

  :deep(.table-height > td) {
    //height: 46px;
    //box-sizing: border-box;
    //padding: 5px 16px;
    //background: #fff;
  }

  :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
    background: #fff;
  }

  .edit-text {
    color: #666;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  }

  .edit-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .icon-size {
    cursor: pointer;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 16px;
      height: 16px;
    }
  }

  .icon-size:first-child {
    //margin-right: 18px;
    margin-right: 26px;
  }
</style>
