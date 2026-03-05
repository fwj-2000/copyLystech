<template>
  <div class="origin-table-wrap">
    <div class="origin-table-title">匹配结果</div>
    <Grid>
      <template #status="{ row }">
        {{ row._isDisabled ? '已匹配' : '待匹配' }}
      </template>
      <template #actions="{ row }">
        <div class="table-actions flex">
          <!-- <a-tooltip :title="row._isDisabled ? '取消匹配' : '确认匹配'">
          </a-tooltip> -->
          <!-- <div class="text-danger" v-if="row._isDisabled" @click="unlock(row)">
            <CloseCircleOutlined />
          </div> -->
          <div class="table-a" v-if="!row._isDisabled" @click="lock(row)">
            <CheckCircleOutlined />
          </div>
          <div class="table-a ml-5px" @click="handleDel(row)">
            <span class="icon-ym icon-ym-delete"></span>
          </div>
        </div>
      </template>
    </Grid>

    <div class="match-icon">
      <i class="icon-ym ym-icon ym-diecut ym-diecut-link"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['lock', 'unlock']);

  const props = defineProps({
    gridOptions: {
      type: Object,
      default: () => {
        return {
          columns: [],
          matchDisplayField: 'seq',
        };
      },
    },
    validateSample: {
      type: Boolean,
      default: true,
    },
  });

  // 获取用于展示的字
  const columns = [
    {
      title: '导入数据表',
      field: 'importTable',
      minWidth: 100,
    },
    {
      title: '原有数据表',
      field: 'dbTable',
      minWidth: 100,
    },
    {
      title: t('状态'),
      field: 'status',
      width: 80,
      slots: { default: 'status' },
    },
    {
      title: t('common.action'),
      field: 'actions',
      slots: { default: 'actions' },
      fixed: 'right',
      width: 60,
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'targetTable',
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
      columns: props.gridOptions.columns.concat(columns),
    },
  });
  const { getDataSource } = gridApi;

  // 锁住当前
  function lock(row) {
    // 校验当前行数据是否与其他行数据重�?
    if (props.validateSample) {
      const data = getDataSource();
      console.log('data', data, row);
      // todo: 校验逻辑
    }
    row._isDisabled = true;
    emit('lock', row);
  }

  // 解开当前
  function unlock(row) {
    row._isDisabled = false;
    emit('unlock', row);
  }

  /**
   * 选中数据发生变化
   * @param data 新选择的匹配值数
   * @param id 对应的目标列 id
   * @param displayField 用于显示的字段名
   */
  function currentDataChange(data: any[], id: string): void {
    // 查询出非disable的行，若是有则变更改行的数据，若是没有，则新增一行
    const row = getDataSource().find(item => !item._isDisabled);
    if (row) {
      row[id] = data;
    } else {
      const newRow = { _isDisabled: false };
      newRow[id] = data;
      getDataSource().push(newRow);
    }
  }

  /**
   * 设置目标表格数据
   * @param dataList
   */
  function setTargetData(dataList: any[]) {
    gridApi.grid.reloadData(dataList);
  }

  function handleDel(row) {
    gridApi.grid.remove(row);
    emit('unlock', row);
  }

  defineExpose({
    currentDataChange,
    setTargetData,
    getDataSource,
  });
</script>

<style lang="less" scoped>
  .origin-table-wrap {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;

    .origin-table-title {
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      font-weight: 600;
      padding-left: 5px;
      color: #fff;
      background: linear-gradient(to right, @primary-color 0%, rgb(255 123 0 / 0%));
    }

    .match-icon {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      position: absolute;
      z-index: 10;
      top: 50%;
      left: -30px;
      color: #fff;
      background: @primary-color;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        font-size: 30px;
      }
    }

    .table-actions {
      font-size: 15px;
      text-align: center;
    }
  }
</style>
