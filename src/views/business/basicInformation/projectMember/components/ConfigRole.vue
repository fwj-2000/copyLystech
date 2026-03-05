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
    <div class="light-popup-inner">
      <!-- <div class="bg-white filter-wrap">
        <a-form>
          <a-form-item label="{{t('dict.MainProcess')}}" required>
            <LydcSelect v-model:value="mainProcess.val" :options="mainProcess.list" style="width: 200px" @change="changeProcessRole" />
          </a-form-item>
        </a-form>
      </div> -->
      <div class="config-role">
        <div class="config-role-left role-box">
          <div class="flex align-center justify-start"><title-left-stick></title-left-stick>{{ t('common.allRole') }} </div>
          <div class="role-container">
            <div class="role-total">
              <div>
                <Checkbox v-model:checked="parent.checkedAll" :indeterminate="parent.indeterminate" @change="onCheckAllChange">
                  {{ parent.list.length }} {{ t('common.item') }}
                </Checkbox>
              </div>
              <span class="desc"> {{ t('common.allRole') }} </span>
            </div>
            <CheckboxGroup class="role-content" v-model:value="parent.checkedList">
              <Checkbox v-for="(item, i) in parent.list" :key="i" :value="item.configType">{{ t('dict.ProjectMembersTypeEnum.' + item.configType) }}</Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div class="config-role-right">
          <div v-for="(item, i) in sonTypes" :key="i" class="config-role-son">
            <div class="role-transfer">
              <div class="role-transfer-left" @click="toRight(item)">
                <i class="icon-ym icon-ym-right"></i>
              </div>
              <div class="role-transfer-right" @click="toLeft(item)">
                <i class="icon-ym icon-ym-left"></i>
              </div>
            </div>
            <div class="role-box">
              <div class="flex align-center justify-start"><title-left-stick></title-left-stick> {{ item?.name }}</div>
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
                    {{ sonsItemList[item.listName].length }} {{ t('common.item') }}
                  </Checkbox>
                  <span class="desc"> {{ t('common.memberRole') }} </span>
                </div>
                <a-checkbox-group class="role-content" v-model:value="item.checkedList">
                  <a-checkbox v-for="(subItem, i) in sonsItemList[item.listName]" :key="i" :value="subItem.configType">
                    <!-- subItem.configColumnName -->
                    {{ t('dict.ProjectMembersTypeEnum.' + subItem.configType) }}
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
  import { getProjectMembersConfigs, getProjectMembersSonConfig, saveProjectMembersConfig, getEnumTypeList } from '/@/api/business/projectMember';
  import { Checkbox, CheckboxGroup, message } from 'ant-design-vue';
  import titleLeftStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';
  import { cloneDeep } from 'lodash-es';
  // import { getMainProcess } from './config';
  const { t } = useI18n();

  defineOptions({ name: 'configRole' });

  const getTitle = computed(() => {
    return t('common.configRole');
  });
  const state = reactive({
    mainProcess: '',
  });

  const parent = reactive<any>({
    list: [],
    checkAll: false,
    indeterminate: false,
    checkedList: [],
    initList: [], // 初始完整的列表
  });

  const sonTypes = ref<
    {
      name: string;
      listName: string;
      checkedAll: boolean;
      indeterminate: boolean;
      checkedList: any[];
    }[]
  >([]); // 子项类别
  const sonsItemList = ref({}); // 子项的详细数组数据

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { changeLoading, changeOkLoading, closePopup }] = usePopupInner(init);
  async function init(data) {
    changeLoading(true);
    state.mainProcess = data.mainProcess;
    const r = await getProjectMembersConfigs({
      mainProcess: data.mainProcess,
    });
    parent.initList = r.data;
    changeProcessRole();
  }

  // 变换制程
  async function changeProcessRole() {
    changeLoading(true);
    // 获取团队配置
    const teamTypeList = await getEnumTypeList(['TeamType']);
    sonsItemList.value = {};
    const _sonTypes: any = [];
    const _d = teamTypeList.data[0].typeList;
    for (let k in _d) {
      const listName = 'sonConfigList_' + k;
      sonsItemList.value[listName] = [];
      _sonTypes.push({
        name: t('dict.TeamType.' + k),
        listName: listName,
        checkedAll: false,
        indeterminate: false,
        checkedList: [],
      });
    }
    sonTypes.value = _sonTypes;

    // 获取团队数据
    const res = await getProjectMembersSonConfig({
      mainProcess: state.mainProcess,
    });
    parent.checkAll = false;
    parent.checkedList = [];
    const { data } = res;
    data.map(el => {
      const listName = 'sonConfigList_' + el.teamType;
      sonsItemList.value[listName] = el.configList || [];
    });
    let _list = cloneDeep(parent.initList);
    // 过滤出子项已有的数据，剩下的返回给父组件显示
    for (let k in sonsItemList.value) {
      for (const itemA of sonsItemList.value[k]) {
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

  // 选中所有
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
  // 子项：选中所有
  const onCheckSonAllChange = (e: any, index) => {
    const { checked } = e.target;
    sonTypes.value[index].checkedAll = checked;
    if (checked) {
      sonTypes.value[index].checkedList = sonsItemList.value[sonTypes.value[index].listName].map(item => {
        return item.configType;
      });
    } else {
      sonTypes.value[index].checkedList = [];
    }
    sonTypes.value[index].indeterminate = false;
  };

  // 转移数据
  const transfer = (checkList, sourceList) => {
    const movedList = sourceList.filter(item => checkList.includes(item.configType));
    const remainList = sourceList.filter(item => !checkList.includes(item.configType));

    sourceList.length = 0;
    sourceList.push(...remainList);

    return movedList;
  };
  // 子项配置
  // 取出父组件的对象，转移到选中的子组件，并重置选中数据
  const toRight = item => {
    const _list: any = transfer(parent.checkedList, parent.list);
    sonsItemList.value[item.listName] = sonsItemList.value[item.listName].concat(_list);
    parent.checkedList = [];
  };
  // 转移到父组件
  const toLeft = item => {
    const _list: any = transfer(item.checkedList, sonsItemList.value[item.listName]);
    item.checkedList = [];
    parent.list = parent.list.concat(_list);
  };

  //提交
  async function handleSubmit() {
    const params: any = [];
    for (let k in sonsItemList.value) {
      params.push({
        mainProcess: state.mainProcess,
        teamType: k.split('_')[1],
        configList: sonsItemList.value[k],
      });
    }
    saveProjectMembersConfig(params).then(res => {
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

<style lang="less" scoped>
  .light-popup-inner {
    height: 100%;
    padding: 0 30px;

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
    padding-top: 30px;

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
      // background: #fff;
      // box-shadow: 0 0 2px 1px rgb(0 0 0 / 5%), 0 0 2px 0 rgb(45 45 46 / 20%);

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
      border: 1px solid #dbdbdb;
      // background: #fff;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-height: 160px;

      .role-container {
        // background: #f7f7f7;
        border-radius: 6px;
        flex: 1;
      }

      .role-total {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        align-self: stretch;
        // padding: 8px;
        padding-top: 8px;
        // border-bottom: 1px solid #dbdbdb;
      }

      .role-content {
        // padding: 8px;
        padding-top: 8px;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        gap: 10px 20px;
      }
    }

    &-son {
      // min-height: 200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .role-box {
        min-height: 200px;
        width: 100%;
        // border: 8px solid #fff;
        border: 1px solid #dbdbdb;
      }
    }

    .desc {
      color: #999;
    }
  }
</style>
