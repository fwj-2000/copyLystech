<template>
  <div class="supplier-wrap">
    <component
      v-for="componentInfo in components"
      :key="componentInfo.componentId"
      :is="componentMap[componentInfo.componentName]"
      :values="componentInfo.values"
      :type="componentInfo.editType"
      :role="props.role || '1'"
      :recommendType="componentInfo.recommendType"
      :ref="setChildRef(componentInfo.componentId)"
      :orderStatus="props.orderStatus"
      :can-edit="props.canEdit"
      @onDetail="handleNodeDetail(componentInfo)"
      @onDelete="handleSplice(componentInfo.componentId)"
      @onUpdate="handleItemUpdate(componentInfo.componentId)">
    </component>
  </div>
  <NodeModal @register="registerModal"></NodeModal>
  <HistoryModal @register="registerHistoryModal"></HistoryModal>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { onBeforeMount, reactive, ref, defineAsyncComponent } from 'vue';
  import { buildUUID } from '/@/utils/uuid';
  import { NodeModal } from '/@/components/CustomComponents';
  import { useModal } from '/@/components/Modal';
  import { getNodelist } from '/@/api/engineering/newMateria';
  import { getSupplierNodeDetail } from '/@/api/purchase/newMateria';
  const SupplierItem = defineAsyncComponent(() => import('./Supplier.vue'));
  const MetarialEight = defineAsyncComponent(() => import('./MetarialEight.vue'));
  const HistoryModal = defineAsyncComponent(() => import('../HistoryModal.vue'));

  type RoleType = '1' | '2'; // 1: 采购；2：工程
  type RecommendType = 1 | 2; // 1: 替代材料； 2：供应商
  type ComponentEditType = 'add' | 'view';
  interface ComponentParams {
    componentName: string;
    values: Object;
    editType: ComponentEditType;
    recommendType: RecommendType;
    componentId: string;
  }
  const props = defineProps({
    role: {
      type: String as PropType<RoleType>,
      default: '1',
    },
    id: {
      type: String,
      default: '',
    },
    orderStatus: {
      type: [String, Number],
      default: '',
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  });

  const [registerModal, { openModal }] = useModal();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();
  function handleNodeDetail(data) {
    // 供应商
    if (data.recommendType == 2) {
      openHistoryModal(true, {
        api: getSupplierNodeDetail,
        params: {
          id: data.values.id,
        },
        role: props.role,
      });
    } else {
      // 现有材料
      openModal(true, {
        api: getNodelist,
        id: props.id,
      });
    }
  }

  const state = reactive<{
    changeIds: string[];
  }>({
    changeIds: [], // 更新的列表
  });

  const components = ref<ComponentParams[]>([]);
  const componentMap = {
    MetarialEight,
    SupplierItem,
  };

  const childRefs = ref<{ [key: string]: any }>({});
  const setChildRef = (id: string) => (el: any) => {
    if (el) {
      childRefs.value[id] = el;
    } else {
      delete childRefs.value[id];
    }
  };

  function handleComponent({ recommendType, editType, values }: { recommendType: RecommendType; editType: ComponentEditType; values?: Object }) {
    const _id = buildUUID();
    console.log(recommendType, 'recommendType');
    components.value.unshift({
      componentName: recommendType == 2 ? 'SupplierItem' : 'MetarialEight',
      recommendType,
      values: values || {},
      editType,
      componentId: _id,
    });
    console.log(components.value, 'components');
    if (editType == 'add') {
      state.changeIds.unshift(_id);
    }
  }

  // 新增组件
  function handleAdd(recommendType: RecommendType) {
    handleComponent({ recommendType, editType: 'add' });
  }

  // 更新组件
  function handleUpdate(list: any[], editType: ComponentEditType) {
    list.forEach(el => {
      const { recommendType } = el;
      handleComponent({ recommendType, editType: editType, values: el });
    });
  }

  // 更新单项组件信息
  function handleItemUpdate(componentId: string) {
    state.changeIds.unshift(componentId);
  }

  // 清除当前组件
  function handleClear() {
    components.value = [];
    childRefs.value = {};
  }

  // 清除新增组件
  function handleClearNew() {
    for (let i = 0; i < components.value.length; i++) {
      if (components.value[i].editType == 'add') {
        components.value.splice(i, 1);
        i--;
      }
    }
  }

  // 删减单个组件
  function handleSplice(id: string) {
    const index = components.value.findIndex(el => el.componentId == id);
    components.value.splice(index, 1);
    delete childRefs.value[id];
  }

  // 获取值：只获取新增和修改的值
  function getValues() {
    const supplierMaterialsUpInputs: any = [];
    const existingMaterialsUpInputs: any = [];
    for (const id in childRefs.value) {
      // 识别该id是否在变动里
      if (state.changeIds.includes(id)) {
        const child = childRefs.value[id];
        if (child && typeof child.getValues === 'function') {
          const _item = child.getValues();
          if (_item) {
            _item.recommendType == 2 ? supplierMaterialsUpInputs.push(_item.values) : existingMaterialsUpInputs.push(_item.values);
          }
        }
      }
    }
    const params: any = {};
    if (supplierMaterialsUpInputs.length) {
      params.supplierMaterialsUpInputs = supplierMaterialsUpInputs;
    }
    if (existingMaterialsUpInputs.length) {
      params.existingMaterialsUpInputs = existingMaterialsUpInputs;
    }
    return params;
  }

  // 填充值
  function resetValues(list: any[], type: ComponentEditType) {
    list.forEach(el => {
      const { recommendType } = el;
      handleComponent({ recommendType, editType: type });
    });
  }

  onBeforeMount(() => {
    // 清理引用，避免内存泄漏
    childRefs.value = {};
  });

  defineExpose({
    handleAdd,
    handleSplice,
    getValues,
    resetValues,
    handleClear,
    handleUpdate,
    handleClearNew,
  });
</script>
