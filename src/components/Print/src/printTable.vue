<template>
  <div class="table-container" :class="{ 'no-divider': !props.showDivider }">
    <Subtitle v-if="props.title" :title="props.title">
      <template #afterTitle>
        <slot name="afterTitle"></slot>
      </template>
    </Subtitle>

    <table v-if="data.length > 0" border="1" cellspacing="0" cellpadding="8">
      <colgroup>
        <col
          v-for="(item, index) in props.columns"
          :key="`col-${index}`"
          :style="{ width: item.width ? `${item.width}px` : 'unset', minWidth: item.minWidth ? `${item.minWidth}px` : 'unset' }" />
      </colgroup>
      <thead>
        <tr>
          <th v-for="(item, index) in props.columns" :key="`th-${index}`">
            <span>{{ item.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.data" :key="`tr-${index}`">
          <td v-for="(col, colIndex) in props.columns" :key="`td-${index}-${colIndex}`">
            <template v-if="col.type === 'seq'">
              {{ index + 1 }}
            </template>
            <template v-else-if="typeof col.format === 'function' && col.field">
              {{ col.format(item[col.field], item, index) || '/' }}
            </template>
            <template v-else-if="col.type === 'imageList' && col.field">
              <div class="cell-image-list">
                <!-- <span> {{ item[col.field] }} </span> -->
                <img v-for="src in item[col.field]" :src="src" class="cell-image" loading="eager" />
              </div>
            </template>
            <template v-else-if="col.field">
              {{ item[col.field] || '/' }}
            </template>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td v-for="(item, index) in props.footerData" :key="`tfoot-${index}`" style="font-weight: bold">
            {{ item || '' }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts" setup>
  import { Subtitle } from '/@/components/Subtitle';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    footerData: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    showDivider: {
      type: Boolean,
      default: true,
    },
  });
</script>

<style scoped lang="less">
  div.no-divider {
    border-top: none;
    margin-top: 0;
    padding-top: 0;
  }

  .table-container {
    border-top: 1px solid rgb(26 26 26 / 70%);
    margin-top: 20px;
    padding-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;

    th,
    td {
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
      padding: 8px 5px;
    }

    th {
      background-color: #f0f0f0;
      font-weight: 700;
    }

    td {
      border-bottom: 1px solid #f0f0f0;

      .cell-image {
        width: 90px;
        margin: 5px;
        object-fit: contain;
        display: inline-block;
      }
    }
  }
</style>
