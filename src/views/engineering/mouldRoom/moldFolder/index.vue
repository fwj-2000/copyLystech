<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>

      <div class="lydc-content-wrapper-content bg-white p-12px">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('dict.CommonCol.moldDataFile') }}</div>
        </div>

        <div class="scroll-content">
          <div class="folders">
            <div class="folders-item" v-for="(item, index) in folderList" :key="index" @click="openDetail(item)">
              <img src="/@/assets/images/folder.png" class="img" alt="" />

              <a-tooltip placement="topLeft" :title="item.factoryMoldNo ? `${item.moldNo}(${item.factoryMoldNo})` : item.moldNo" arrow-point-at-center>
                <div class="No">
                  <span>{{ item.moldNo }}</span>
                  <span class="blue-color" v-if="item.factoryMoldNo">({{ item.factoryMoldNo }})</span>
                </div>
              </a-tooltip>
              <div class="item-foot">
                <div class="time">{{ item.creatorTime ? dayjs(item.creatorTime).format('YYYY-MM-DD') : '' }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex ct-end foot-wrapper">
          <a-pagination
            v-model:current="pagination.current"
            size="small"
            :total="pagination.total"
            :pageSize="pagination.size"
            show-size-changer
            showQuickJumper
            @change="handlePageChange"
            @showSizeChange="handleSizeChange" />
          <div class="pagination-total">
            共
            <span style="margin: 0 4px">{{ pagination.total }}</span>
            条数据
          </div>
        </div>
      </div>
    </div>
    <DetailPopup @register="registerDetailPop" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import dayjs from 'dayjs';
  import DetailPopup from './DetailPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { getMoldfilePage } from '/@/api/engineering/mould';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { message } from 'ant-design-vue';

  defineOptions({ name: 'engineering-mouldRoom-moldFolder' });

  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();

  const { t } = useI18n();

  const { hasBtnP } = usePermission();
  const state = ref({
    creatorTimeStart: '',
    creatorTimeEnd: '',
    moldNo: '',
  });

  const pagination = ref({
    total: 0,
    current: 1,
    size: 20,
  });
  const folderList = ref<any[]>([]);

  const [registerForm] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: [
      {
        field: 'pickerVal',
        label: '',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
        },
      },

      // 模具编号
      {
        field: 'moldNo',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '请输入模具编号',
        },
      },
    ],
    fieldMapToTime: [['pickerVal', ['creatorTimeStart', 'creatorTimeEnd']]],
  });

  const getData = async () => {
    const { data } = await getMoldfilePage({
      ...state.value,
      currentPage: pagination.value.current,
      pageSize: pagination.value.size,
    });
    pagination.value.total = data.pagination.total;
    folderList.value = data.list;
  };

  function handleSubmit(values) {
    pagination.value.current = 1;
    state.value = {
      ...values,
    };
    getData();
  }

  function handleReset() {
    pagination.value.current = 1;
    state.value = {
      creatorTimeStart: '',
      creatorTimeEnd: '',
      moldNo: '',
    };
    getData();
  }

  const handlePageChange = page => {
    pagination.value.current = page;
    getData();
  };

  const handleSizeChange = (_, size) => {
    pagination.value.size = size;
    getData();
  };

  const openDetail = record => {
    if (!hasBtnP('btn_detail')) return message.warning(t('common.noViewingPermission'));
    openDetailPop(true, { fileList: record.fileList, moldNo: record.moldNo, factoryMoldNo: record.factoryMoldNo });
  };

  onMounted(() => {
    getData();
  });
</script>
<style lang="less" scoped>
  .title-stick {
    display: flex;
    align-items: center;

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

  .scroll-content {
    height: calc(100% - 50px);
    overflow: auto;

    .folders {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;

      .folders-item {
        cursor: pointer;
        width: calc((100% - 48px) / 5);
        height: fit-content;
        margin-right: 12px;
        margin-bottom: 12px;
        border: 1px dashed #ffd4ac;
        background: #fff9f3;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 14px;

        &:nth-child(5n) {
          margin-right: 0;
        }

        .img {
          width: 98px;
          height: 76px;
        }

        .No {
          width: 100%;
          color: #1a1a1a;
          font-size: 16px;
          line-height: 22px;
          margin: 10px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .blue-color {
          color: #1890ff;
        }

        .item-foot {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .time {
            font-size: 16px;
            line-height: 22px;
            color: #888;
          }
        }
      }
    }
  }

  .foot-wrapper {
    padding-top: 10px;

    .pagination-total {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      margin-left: 20px;
    }
  }
</style>
