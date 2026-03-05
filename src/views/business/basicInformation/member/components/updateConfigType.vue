<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSubmit"
    showOkBtn
    :okText="t('common.saveText')"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="getTitle"
    @visible-change="handleClose"
    class="full-popup">
    <div class="light-popup-innnre">
      <div class="bg-white filter-wrap">
        <a-form>
          <a-form-item label="主要制程" required>
            <LydcSelect v-model:value="mainProcess.val" :options="mainProcess.list" style="width: 200px" @change="changeProcessRole" />
          </a-form-item>
        </a-form>
      </div>
      <div class="config-role">
        <div class="config-role-left role-box">
          <div class="role-container">
            <div class="role-total">
              <div>
                <Checkbox v-model:checked="parent.checkedAll" :indeterminate="parent.indeterminate" @change="onCheckAllChange">
                  {{ parent.list.length }}项
                </Checkbox>
              </div>
              <span class="desc"> 所有角色 </span>
            </div>
            <CheckboxGroup class="role-content" v-model:value="parent.checkedList">
              <Checkbox v-for="(item, i) in parent.list" :key="i" :value="item.configType">{{ item.configColumnName }}</Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div class="config-role-right">
          <div v-for="(item, i) in sonsList" :key="i" class="config-role-son">
            <div class="role-transfer">
              <div class="role-transfer-left" @click="toRight(item)">
                <i class="icon-ym icon-ym-right"></i>
              </div>
              <div class="role-transfer-right" @click="toLeft(item)">
                <i class="icon-ym icon-ym-left"></i>
              </div>
            </div>
            <div class="role-box">
              <div class="flex align-center justify-start"><title-left-stick></title-left-stick> {{ item.name }}-成员配置</div>
              <div class="role-container">
                <div class="role-total">
                  <Checkbox
                    v-model:checked="item.checkedAll"
                    :indeterminate="item.indeterminate"
                    @change="
                      e => {
                        onCheckSonAllChange(e, i);
                      }
                    ">
                    {{ sons[item.listName].length }}项
                  </Checkbox>
                  <span class="desc"> 成员角色 </span>
                </div>
                <a-checkbox-group class="role-content" v-model:value="item.checkedList">
                  <a-checkbox v-for="(subItem, i) in sons[item.listName]" :key="i" :value="subItem.configType">
                    {{ subItem.configColumnName }}
                  </a-checkbox>
                </a-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getconfigtypelist, getSonconfigtypelist, saveConfig } from '/@/api/business/member';
  import { Checkbox, CheckboxGroup, message } from 'ant-design-vue';
  import titleLeftStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';
  import { cloneDeep } from 'lodash-es';
  import { getMainProcess } from './config';
  const { t } = useI18n();

  const getTitle = computed(() => {
    return '配置角色';
  });

  const mainProcess = reactive({
    list: [
      {
        id: 1,
        fullName: '模切',
      },
    ],
    val: '1',
  });

  const parent = reactive<any>({
    list: [],
    checkAll: false,
    indeterminate: false,
    checkedList: [],
    initList: [], // 初始完整的列表
  });

  const sonsList = ref([
    {
      name: '直接客户',
      listName: 'immediateCustomerCodeConfigList',
      checkedAll: false,
      indeterminate: false,
      checkedList: [],
    },
    {
      name: '料件号',
      listName: 'materialPartsNumberConfigList',
      checkedAll: false,
      indeterminate: false,
      checkedList: [],
    },
    {
      name: '内部项目代码',
      listName: 'insideProjectCodeConfigList',
      checkedAll: false,
      indeterminate: false,
      checkedList: [],
    },
  ]);
  const sons = reactive({
    immediateCustomerCodeConfigList: [],
    materialPartsNumberConfigList: [],
    insideProjectCodeConfigList: [],
  });

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { changeLoading, changeOkLoading, closePopup }] = usePopupInner(init);
  async function init() {
    changeLoading(true);
    mainProcess.list = await getMainProcess();
    const r = await getconfigtypelist();
    parent.initList = r.data;
    changeProcessRole();
  }

  // 变换主要制程
  async function changeProcessRole() {
    changeLoading(true);
    const res = await getSonconfigtypelist(mainProcess.val);
    sonsList.value.forEach(el => {
      el.checkedAll = false;
      el.checkedList = [];
    });
    parent.checkAll = false;
    parent.checkedList = [];

    const { data } = res;
    sons.immediateCustomerCodeConfigList = data.immediateCustomerCodeConfigList || [];
    sons.materialPartsNumberConfigList = data.materialPartsNumberConfigList || [];
    sons.insideProjectCodeConfigList = data.insideProjectCodeConfigList || [];
    let _list = cloneDeep(parent.initList);
    // 过滤出子项已有的数据，剩下的返回给父组件显示
    for (let k in sons) {
      for (const itemA of sons[k]) {
        _list.forEach((itemB, index) => {
          if (itemB.configType === itemA.configType) {
            _list.splice(index, 1);
          }
        });
      }
    }
    parent.list = _list;
    changeLoading(false);
  }

  const onCheckAllChange = (e: any) => {
    const { checked } = e.target;
    parent.checkAll = checked;
    if (checked) {
      parent.checkedList = parent.list.map(item => {
        return item.configType;
      });
    } else {
      parent.checkedList = [];
    }
    parent.indeterminate = false;
  };
  const onCheckSonAllChange = (e: any, index) => {
    const { checked } = e.target;
    sonsList.value[index].checkedAll = checked;
    if (checked) {
      sonsList.value[index].checkedList = sons[sonsList.value[index].listName].map(item => {
        return item.configType;
      });
    } else {
      sonsList.value[index].checkedList = [];
    }
    sonsList.value[index].indeterminate = false;
  };

  const transfer = (checkList, sourceList) => {
    const _list: any = [];
    let len = sourceList.length;
    for (let k = 0; k < len; k++) {
      const item = sourceList[k];
      if (checkList.indexOf(item.configType) > -1) {
        _list.push(item);
        sourceList.splice(k, 1);
        k--;
        len--;
      }
    }
    return _list;
  };
  // 子项配置
  // 取出父组件的对象，转移到选中的子组件，并重置选中数据
  const toRight = item => {
    const _list: any = transfer(parent.checkedList, parent.list);
    sons[item.listName] = sons[item.listName].concat(_list);
    parent.checkedList = [];
  };
  // 转移到父组件
  const toLeft = item => {
    const _list: any = transfer(item.checkedList, sons[item.listName]);
    item.checkedList = [];
    parent.list = parent.list.concat(_list);
  };

  //提交
  async function handleSubmit() {
    saveConfig({
      mainProcess: mainProcess.val,
      ...sons,
    }).then(res => {
      if (res.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        changeOkLoading(false);
        closePopup();
      }
    });
  }

  function handleClose() {
    emit('reload');
  }
</script>

<style lang="less">
  .light-popup-innnre {
    background: #ebeef5;
    height: 100%;

    .filter-wrap {
      padding: 16px 10px 1px;
    }

    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0;
    }
  }
</style>

<style lang="less" scoped>
  .config-role {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding-top: 10px;

    > div {
      width: 100%;
    }

    .role-transfer {
      min-height: 160px;
      padding: 0 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 0 2px 1px rgb(0 0 0 / 5%), 0 0 2px 0 rgb(45 45 46 / 20%);

      &-left,
      &-right {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border-radius: 4px;
        border: 1px solid #dbdbdb;
        cursor: pointer;
      }

      &-left.disabled,
      &-right.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .role-box {
      border: 14px solid #fff;
      background: #fff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-height: 160px;

      .role-container {
        background: #f7f7f7;
        border-radius: 6px;
        flex: 1;
      }

      .role-total {
        display: flex;
        padding: 8px;
        justify-content: space-between;
        align-items: flex-start;
        align-self: stretch;
        border-bottom: 1px solid #dbdbdb;
      }

      .role-content {
        padding: 8px;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        gap: 10px 20px;
      }
    }

    &-son {
      min-height: 160px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .role-box {
        height: 100%;
        width: 100%;
        border: 8px solid #fff;
      }
    }

    .desc {
      color: #999;
    }
  }
</style>
