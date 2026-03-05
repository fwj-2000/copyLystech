<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('common.showDelCol') }}</span>
    </template>
    <a-checkbox v-model:checked="checked" @change="handleCheck">
      <span>{{ t('common.showDelCol') }}</span>
    </a-checkbox>
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'DelColSetting',
    components: {
      Tooltip,
    },
    setup() {
      const checked = ref(false);
      const table = useTableContext();
      const { t } = useI18n();
      const dataStatus = 'deleteMark';
      function handleCheck(e) {
        // 获取当前选中状态
        const { checked } = e.target;
        const _cols = table.getColumns();
        const _len = _cols.length;
        if (checked) {
          // 若是选中，则把数据列填充进去
          for (let i = 0; i < _len; i++) {
            if (_cols[i].dataIndex) {
              _cols.splice(i, 0, {
                title: t('component.basicTable.dataStatus'),
                dataIndex: dataStatus,
                width: 100,
                customRender: ({ text }) => {
                  const _delStatus = text && text != 0;
                  const _color = _delStatus ? '#FF4D4F' : '#52C41A';
                  const _text = _delStatus ? t('common.delText') : t('common.normalText');
                  return h('span', { style: { color: _color } }, _text);
                },
              });
              break;
            }
          }
        } else {
          for (let i = 0; i < _len; i++) {
            if (_cols[i].dataIndex == dataStatus) {
              _cols.splice(i, 1);
              break;
            }
          }
        }
        table.setColumns(_cols);
        table.setProps({
          deleteMark: checked ? 1 : 0,
        });
        table.reload();
      }

      return { t, checked, handleCheck };
    },
  });
</script>
