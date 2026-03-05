<template>
  <div class="process-route-bom">
    <Subtitle :title="t('common.bomMaterialBinding')" />
    <div class="process-route-box">
      <div class="process-route-block">
        <div class="process-route-item" v-for="item in state.processRoutes">
          <div class="process-route-item-left">
            <i class="process-route-item-circleIcon ym-custom ym-custom-checkbox-blank-circle-outline"></i>
            <i class="process-route-item-arrowIcon icon-ym icon-ym-unfold"></i>
            <span class="process-route-item-name"> {{ item.processName }}: </span>
          </div>
          <div style="width: 100%">
            <div class="wl">
              <a-button class="process-route-item-btn" @click="openMaterialModalFn(item)"
                ><i class="icon-ym icon-ym-btn-add" name="icon"></i>{{ t('common.addMaterials') }}</a-button
              >
              <div class="process-route-item-right" v-if="item.materials">
                <div v-for="(o, i) in transFormArr(item.materials)" :key="o.id" class="process-route-item-materialList">
                  <div class="process-route-item-material">
                    {{ o }}
                    <i class="ym-custom ym-custom-close" @click="delMaterials(i, item)"></i>
                  </div>
                  <i class="icon-ym icon-ym-btn-add" v-if="item.materials && i !== transFormArr(item.materials).length - 1"></i>
                </div>
              </div>
            </div>
            <div class="line"></div>
            <div class="ng">
              <a-button class="process-route-item-btn" @click="openNgModalFn(item)"
                ><i class="icon-ym icon-ym-btn-add" name="icon"></i>{{ t('common.ngRoute') }}</a-button
              >
              <div class="process-route-item-right" v-if="item.ngRouteNodeList">
                <div v-for="(o, i) in item.ngRouteNodeList" :key="o.id" class="process-route-item-materialList">
                  <div class="process-route-item-material">
                    {{ o.processName }}
                    <i class="ym-custom ym-custom-close" @click="delNgRoute(i, item)"></i>
                  </div>
                  <i class="icon-ym icon-ym-btn-add" v-if="item.ngRouteNodeList && i !== item.ngRouteNodeList.length - 1"></i>
                </div>
                <div class="process-route-item-material save-btn" @click="saveNgTemplateFn(item)"> {{ t('common.saveTemplate') }} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <chooseMaterialModal @register="registerMaterialModal" @select="handlerSelect" class="chooseMaterialModal"></chooseMaterialModal>
  <chooseNgModal @register="registerNgModal" @select="handlerNgSelect" class="chooseNgModal"></chooseNgModal>
  <saveNgTemplateModal @register="registerSaveNgTemplateModal"></saveNgTemplateModal>
</template>
<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { reactive, ref, watch } from 'vue';
  import chooseMaterialModal from './chooseMaterialModal.vue';
  import chooseNgModal from './chooseNgModal.vue';
  import saveNgTemplateModal from './saveNgTemplateModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProcessroutemapbyid } from '/@/api/productionDeal/processroutebind';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const { createMessage } = useMessage();
  const [registerMaterialModal, { openModal: openMaterialModal }] = useModal();
  const [registerNgModal, { openModal: openNgModal, closeModal }] = useModal();
  const [registerSaveNgTemplateModal, { openModal: openSaveNgTemplateModal }] = useModal();

  const emit = defineEmits(['select']);
  const props = defineProps({
    processRouteItem: {
      type: Object,
      default: () => {},
    },
  });

  interface State {
    processRoutes: any;
    activeList: any;
  }

  const state = reactive<State>({
    processRoutes: [],
    activeList: [],
  });

  watch(
    () => props.processRouteItem,
    val => {
      state.processRoutes = val.bindMaterialList;
      state.activeList = [];
    },
    {
      immediate: true,
    },
  );

  function saveNgTemplateFn(item) {
    openSaveNgTemplateModal(true, { data: item });
  }

  function delNgRoute(i, item) {
    item.isUpdateNgRoute = true;
    item.ngRouteNodeList.splice(i, 1);
    emit('select', state.processRoutes);
  }

  function delMaterials(i, item) {
    const _dataSource = transFormArr(item.materials);
    _dataSource.splice(i, 1);
    item.materials = _dataSource.join(',');
  }

  function transFormArr(data) {
    if (data === '') return [];
    return data.split(',');
  }
  function openMaterialModalFn(item) {
    if (!item.isFeedMaterials) {
      createMessage.error(t('dict.ProcessRouteColumn.enterProcessFeeding'));
      return;
    }
    openMaterialModal(true, { processName: item.processName, materials: item.materials });
  }
  function openNgModalFn(item) {
    console.log(item.processName);
    openNgModal(true, { processName: item.processName, ngRouteNodeList: item.ngRouteNodeList });
  }
  async function handlerNgSelect({ list, processName }) {
    const { id } = list[0];
    try {
      const { data, code } = await getProcessroutemapbyid(id);
      if (code === 200) {
        if (!data?.length) return;
        state.processRoutes = state.processRoutes.map(item => {
          if (item.processName === processName) {
            item.ngRouteId = id;
            item.ngRouteNodeList = data;
          }
          return item;
        });
      }
      emit('select', state.processRoutes);
    } catch (error) {}
  }
  function handlerSelect(data) {
    state.activeList = data.list;
    let materialsArr: any = [];
    data.list.forEach(item => {
      materialsArr.push(item.MaterialCode);
    });
    state.processRoutes = state.processRoutes.map(item => {
      if (item.processName === data.processName) {
        item.materials = materialsArr.join(',');
      }
      return item;
    });
    emit('select', state.processRoutes);
  }
</script>

<style lang="less" scoped>
  .process-route {
    &-box {
      padding: 10px 0 0 20px;
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
      overflow-y: auto;
    }

    &-block {
      // max-height: 240px;
      // overflow-y: auto;
    }

    &-item {
      position: relative;
      padding: 0 10px;
      display: flex;
      border-left: 1px dashed #ccc;
      min-height: 68px;
      padding-bottom: 32px;

      &-left {
        min-width: 80px;
        display: flex;
        align-items: top;
      }

      &-right {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
      }

      &-circleIcon {
        position: absolute;
        left: -6px;
        top: 0;
        color: #fc7a2c;
        font-size: 12px;
        font-weight: 900;
        background: #f5f7fa;
        padding-top: 0;
      }

      &-arrowIcon {
        position: absolute;
        left: -7px;
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
        padding: 0 0 0 6px;
        font-weight: 600;
        width: 120px;
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
</style>
<style>
  .chooseMaterialModal {
    .scroll-container {
      padding: 10px !important;
    }
  }
</style>
