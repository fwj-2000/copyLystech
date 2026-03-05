<template>
  <div class="process-route-bom">
    <Subtitle title="工艺路线绑定" />
    <div class="select-bar">
      <div class="select-bar-text">{{ t('common.selectAll') }}</div>
      <div class="checkbox" v-show="noSelected" @click="handelAllSelect"></div>
      <img src="/@/assets/images/process/some_selected.png" class="icon-search" alt="" @click="handelAllSelect" v-show="someSelected" />
      <img src="/@/assets/images/process/all_selected.png" class="icon-search" alt="" @click="handelNoSelect" v-show="allSelected" />

      <a-button type="primary" ghost @click="handleClearBatch" class="ml-12px">{{ t('dict.CommonCol.clear') }}</a-button>
    </div>
    <div class="process-route-box">
      <div class="process-route-block">
        <draggable
          :list="state.processRoutes"
          :animation="300"
          handle=".option-drag"
          item-key="name"
          class="basic-group"
          ghost-class="ghost"
          @end="draggableEnd">
          <template #item="{ element: item, index }">
            <div class="process-route-item option-drag" @click="chooseNodeAssignInfo(item)">
              <div class="process-route-item-left">
                <div class="process-route-item-name">
                  <div class="flex justify-start">
                    <img class="mr-12px" :src="dragSvg" alt="拖拽" />

                    <div class="route-check-select" @click="item.selected = !item.selected">
                      <div class="checkbox" v-show="!item.selected"></div>
                      <img v-show="item.selected" src="/@/assets/images/process/all_selected.png" class="icon-search" alt="" />
                    </div>

                    <div class="process-route-item-name-small w-[200px] mr-20px">
                      <div class="mr-4px">{{ t('dict.CommonCol.processName') }}</div>
                      <div class="flex-1">
                        <a-select
                          v-model:value="item.processId"
                          style="border-color: #e6e6e6; width: 100%"
                          :options="processNameOptions"
                          :showSearch="true"
                          :filter-option="filterOption"
                          @change="processNameChange(item)"></a-select>
                      </div>
                    </div>

                    <div class="process-route-item-name-small w-[200px]">
                      <div class="mr-4px">{{ t('dict.CommonCol.presetDuration') }}</div>
                      <div class="flex-1 flex">
                        <a-input-number
                          @blur="processValChange()"
                          v-model:value="item.presetDuration"
                          :placeholder="t('common.inputText')"
                          class="flex-1"
                          style="border-color: #e6e6e6" />
                        <div class="ml-2px">{{ t('component.time.hours') }}</div>
                      </div>
                    </div>

                    <i class="icon-ym icon-ym-btn-clearn icon-delete ml-12px" @click="handleDelete(index)" />
                  </div>

                  <div class="process-route-item-name-small mt-4px">
                    <div class="mr-4px">{{ t('dict.CommonCol.remark') }}</div>
                    <div class="flex-1">
                      <a-textarea autosize @blur="processValChange()" v-model:value="item.remark" :placeholder="t('common.inputText')" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <a-button class="ml-10px w-200px" @click="addProcess">+ {{ t('dict.CommonCol.addProcess') }}</a-button>
      </div>
    </div>
  </div>

  <chooseNgModal @register="registerNgModal" @select="handlerNgSelect" class="chooseNgModal"></chooseNgModal>
  <saveNgTemplateModal @register="registerSaveNgTemplateModal"></saveNgTemplateModal>
</template>
<script setup lang="ts">
  import dragSvg from '/@/assets/svg/report/drag.svg';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { reactive, ref, watch, onMounted, computed } from 'vue';
  import chooseNgModal from './chooseNgModal.vue';
  import saveNgTemplateModal from './saveNgTemplateModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProcessroutemapbyid } from '/@/api/productionDeal/processroutebind';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { buildBitUUID } from '/@/utils/uuid';
  import draggable from 'vuedraggable';
  const { t } = useI18n();

  const { createMessage } = useMessage();
  const [registerNgModal, { openModal: openNgModal, closeModal }] = useModal();
  const [registerSaveNgTemplateModal, { openModal: openSaveNgTemplateModal }] = useModal();

  const emit = defineEmits(['chooseNodeAssignInfo', 'bindMaterialListChange', 'resetPanelInfo']);
  const props = defineProps({
    bindMaterialList: {
      type: Array,
      default: () => [],
    },
    processNameOptions: {
      type: Array,
      default: () => [],
    },
  });

  // 没有一个选择（状态）
  const noSelected = computed(() => {
    return state.processRoutes.every(item => !item.selected);
  });
  // 半选（状态）
  const someSelected = computed(() => {
    return state.processRoutes.some(item => item.selected) && state.processRoutes.some(item => !item.selected);
  });
  // 全选（状态）
  const allSelected = computed(() => {
    return state.processRoutes.length && state.processRoutes.every(item => item.selected);
  });

  interface State {
    processRoutes: any;
  }

  const state = reactive<State>({
    processRoutes: [],
  });

  watch(
    () => props.bindMaterialList,
    val => {
      state.processRoutes = cloneDeep(val);
      state.processRoutes = state.processRoutes.map(item => {
        return {
          ...item,
          selected: item.selected || false,
        };
      });
    },
    {
      immediate: true,
    },
  );

  onMounted(async () => {});

  const handelAllSelect = () => {
    state.processRoutes = state.processRoutes.map(item => {
      return { ...item, selected: true };
    });
  };

  // 全不选
  const handelNoSelect = () => {
    state.processRoutes = state.processRoutes.map(item => {
      return { ...item, selected: false };
    });
  };

  const handleClearBatch = () => {
    state.processRoutes = state.processRoutes.map(item => {
      if (item.selected) {
        return {
          ...item,
          isUpdateNgRoute: false,
          nodeId: '',
          processId: '',
          processName: '',
          processRouteId: '',
          presetDuration: '',
          currentNodeDetail: {},
          remark: '',
          selected: false,
        };
      } else {
        return { ...item };
      }
    });
    // state.processRoutes = state.processRoutes.filter(item => !item.selected);
    processValChange();
    emit('resetPanelInfo');
  };

  const handleDelete = index => {
    state.processRoutes.splice(index, 1);
    processValChange();
  };

  const draggableEnd = () => {
    processValChange();
  };

  // 工序下拉模糊搜索
  const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  // 工序名称改变后也要赋值补充信息form
  const processNameChange = item => {
    chooseNodeAssignInfo(item);
    processValChange();
  };

  const processValChange = () => {
    // bindMaterialListChange，节点的数据改变之后要将父组件里的节点数组数据做改变，补充信息form子组件如是，又父组件控制数据
    emit('bindMaterialListChange', state.processRoutes);
  };

  function addProcess() {
    state.processRoutes.push({
      isUpdateNgRoute: false,
      nodeId: '',
      processId: '',
      processRouteId: '',
      currentNodeDetail: {},
      uuid: buildBitUUID(),
      selected: false,
    });
    processValChange();
  }

  // 点击节点，赋值补充信息form
  const chooseNodeAssignInfo = item => {
    if (item.processId) {
      item.processName = (props.processNameOptions as any).find(option => option.value === item.processId).label;
    }
    emit('chooseNodeAssignInfo', item);
  };

  // 存为模板
  function saveNgTemplateFn(item) {
    openSaveNgTemplateModal(true, { data: item });
  }

  // 删除节点NG路线
  function delNgRoute(i, item) {
    item.isUpdateNgRoute = true;
    item.ngRouteNodeList.splice(i, 1);
    processValChange();
  }

  const currentuuid = ref('');
  // 新增节点NG路线
  function openNgModalFn(item) {
    if (!item.processId) {
      createMessage.warning(t('dict.CommonCol.addProcess'));
      return;
    }
    currentuuid.value = item.uuid;
    openNgModal(true, { ngRouteNodeList: item.ngRouteNodeList });
  }
  async function handlerNgSelect({ list }) {
    const { id } = list[0];
    try {
      const { data, code } = await getProcessroutemapbyid(id);
      if (code === 200) {
        if (!data?.length) return;
        state.processRoutes = state.processRoutes.map(item => {
          if (item.uuid === currentuuid.value) {
            item.ngRouteId = id;
            item.ngRouteNodeList = data;
          }
          return item;
        });
      }
      processValChange();
    } catch (error) {}
  }
</script>

<style lang="less" scoped>
  .icon-delete {
    cursor: pointer;
    color: red;
    font-weight: 400;
  }

  .option-drag {
    cursor: move;
  }

  .process-route {
    &-box {
      padding: 10px 0 0 20px;
      overflow-y: auto;
    }

    &-bom {
      display: inline-block;
      left: 0;
      bottom: 0;
      width: 100%;
      border-radius: 4px;
      border: 1px solid #dadada;
      background: #f5f7fa;
      padding: 11px 16px;
      overflow: auto;
    }

    &-block {
      // max-height: 240px;
      // overflow-y: auto;
    }

    &-item {
      padding: 0 10px;
      display: flex;
      min-height: 68px;
      padding-bottom: 32px;

      &-left {
        // min-width: 220px;
        margin-right: 20px;
        display: flex;
        align-items: top;
        position: relative;
        // border-right: 1px dashed #ccc;
        width: 100%;
      }

      &-right {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
      }

      &-circleIcon {
        position: absolute;
        right: -7px;
        top: 0;
        color: #fc7a2c;
        font-size: 12px;
        font-weight: 900;
        background: #f5f7fa;
        padding-top: 0;
      }

      &-arrowIcon {
        position: absolute;
        right: -6px;
        bottom: 0;
        color: #ccc;
        font-size: 12px;
        font-weight: 900;
        background: #f5f7fa;
      }

      &-name {
        font-size: 14px;
        text-align: left;
        display: inline-block;
        font-weight: 600;
        // width: 200px;
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #1890ff;
        border-left: 4px solid #1890ff;
        background: #daedff;
      }

      &-name-small {
        font-size: 12px;
        text-align: left;
        display: flex;
        align-items: center;
        // width: 180px;
        color: #3d3d3d;
        font-weight: 400;
      }

      &-btn {
        border-radius: 4px;
        align-items: baseline;
      }

      &-materialList {
        display: flex;
        align-items: top;
      }

      &-material {
        border: 1px solid #dbdbdb;
        background: #fff;
        text-align: center;
        height: 28px;
        line-height: 28px;
        border-radius: 4px;
        padding: 0 10px;
        margin-left: 12px;
        margin-bottom: 10px;
        position: relative;
      }
    }
  }

  .icon-ym-btn-add {
    color: #333;
    font-weight: 600;
    margin: 4px 0 0 10px;
    font-size: 12px;
  }

  .ym-custom-close {
    // font-size: 18px;
    margin-left: 2px;
    color: #666;
    cursor: pointer;
  }

  .wl {
    display: flex;
  }

  .line {
    border-bottom: 1px dashed #999;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  .ng {
    display: flex;
  }

  .save-btn {
    font-weight: 600;
    color: #ff7b00;
    background: none;
    cursor: pointer;
    border: none;

    &:hover {
      color: #bc5e06;
    }

    &:active {
      color: #ff7b00;
    }
  }

  .select-bar {
    display: flex;
    align-items: center;
    margin-left: 10px;

    .select-bar-text {
      color: rgb(26 26 26);
      font-size: 14px;
      margin-right: 8px;
    }

    .checkbox {
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border-radius: 1px;
      border: 1px solid #dbdbdb;
      background-color: #f0f0f0;
      cursor: pointer;
    }

    .icon-search {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .route-check-select {
    margin-right: 8px;
    cursor: pointer;

    .checkbox {
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border-radius: 1px;
      border: 1px solid #dbdbdb;
      background-color: #f0f0f0;
    }

    .icon-search {
      width: 20px;
      height: 20px;
    }
  }
</style>
<style>
  .chooseMaterialModal {
    .scroll-container {
      padding: 10px !important;
    }
  }
</style>
