<template>
  <div class="print">
    <div class="print-header">
      <img src="/@/assets/images/lylogo2.png" alt="Logo" />
      <div class="print-title">
        <div>镒韬科技（东莞）有限公司</div>
        <div>模具出货检验报告</div>
      </div>
    </div>
    <div class="print-content">
      <div class="row">
        <div class="col">
          <div class="label">客户料号</div>
          <div class="value fs-14">{{ data.mouldNo }}</div>
        </div>
        <div class="col">
          <div class="label">工单号</div>
          <div class="value fs-14">{{ data.workOrderNo }}</div>
        </div>
        <div class="col">
          <div class="label">出货日期</div>
          <div class="value fs-14 bd-0">
            {{ data.checkDate ? dayjs(data.checkDate).format('YYYY-MM-DD') : '' }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">齿数（T）</div>
          <div class="value fs-14">{{ data.teethQuantity }}</div>
        </div>
        <div class="col">
          <div class="label">模具类型</div>
          <div class="value fs-14">{{ data.moldTypeName }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">硬度(HRC)</div>
          <div class="value fs-14">{{ data.hardness }}</div>
        </div>
        <div class="col">
          <div class="label">模切类型</div>
          <div class="value fs-14">{{ data.dieCutTypeName }}</div>
        </div>
      </div>

      <div class="row check-block">
        <div class="check-block-title">出货检验项目</div>
        <div class="check-result pl-6px">判定</div>
      </div>

      <div class="row exteriorList">
        <div class="col">
          <div class="label">外观</div>
          <div class="check-content">
            <div v-for="item in data.exteriorList" class="check-content-block">
              <div class="check-info">
                <div> 检测项：{{ item.checkCodeName }}/ NG数：{{ item.ngQuantity }}</div>
                <div v-if="item.remark"> 备注：{{ item.remark }} </div>
              </div>
              <div class="check-result pl-6px">
                <!-- <SvgIcon class="svg-icon" size="22" name="#icon-minus-rectangle" />
                <SvgIcon class="svg-icon" size="22" name="#icon-check-rectangle-filled" /> -->
                <a-checkbox-group v-model:value="item.checkResult">
                  <a-checkbox value="OK">OK</a-checkbox>
                  <!-- <span>&nbsp;</span> -->
                  <a-checkbox value="NG">NG</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row exteriorList">
        <div class="col">
          <div class="label">包规</div>
          <div class="check-content">
            <div v-for="item in data.packList" class="check-content-block">
              <div class="check-info">
                <div> 检测项：{{ item.checkCodeName }}/ NG数：{{ item.ngQuantity }}</div>
                <div v-if="item.remark"> 备注：{{ item.remark }} </div>
              </div>
              <div class="check-result pl-6px"> <a-checkbox-group v-model:value="item.checkResult" :options="['OK', 'NG']" /> </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row pl-6px"> 测量工具： T：二次元 DC：数显卡尺 MM:千分尺 HD：硬度测试仪 </div>
      <div class="row">
        <div class="col w-1">
          <div class="label">角度（A）</div>
          <div class="value pl-0 w-1">
            <div class="sub-col">
              <div class="sub-label">(刀体角度)A1</div>
              <div class="sub-value">{{ data.bladeAngleA1 }}</div>
            </div>
            <div class="sub-col">
              <div class="sub-label">(刀体角度)A2</div>
              <div class="sub-value">{{ data.bladeAngleA2 }}</div>
            </div>
            <div class="sub-col">
              <div class="sub-label">(刀锋角度)A3</div>
              <div class="sub-value">{{ data.bladeEdgeAngleA3 }}</div>
            </div>
            <div class="sub-col">
              <div class="sub-label">(刀锋角度)A4</div>
              <div class="sub-value">{{ data.bladeEdgeAngleA4 }}</div>
            </div>
            <div class="sub-col w-1">
              <div class="sub-label">判定</div>
              <div class="w-1"> <a-checkbox-group v-model:value="data.bladeCheckResult" :options="['OK', 'NG']" /> </div>
            </div>
            <div class="sub-col w-1">
              <div class="sub-label">刀锋类型</div>
              <div class="pl-10px">
                <a-checkbox-group
                  style="display: flex; flex-wrap: wrap; padding-left: 6px"
                  v-model:value="data.bladeTypeName"
                  :options="state.bladeTypeOptions" />
              </div>
            </div>
          </div>
          <!-- <div class="remark">11 </div> -->
        </div>
      </div>

      <div class="row">
        <div class="col w-1">
          <div class="label">高度（H）</div>
          <div class="value pl-0 w-1">
            <div class="sub-col">
              <div class="sub-label">(刀体高度)H1</div>
              <div class="sub-value">{{ data.bladeHeightH1 }}</div>
            </div>
            <div class="sub-col">
              <div class="sub-label">(刀体高度)H2</div>
              <div class="sub-value">{{ data.bladeHeightH2 }}</div>
            </div>
            <div class="sub-col">
              <div class="sub-label">(刀锋高度)H3</div>
              <div class="sub-value">{{ data.bladeEdgeHeightH3 }}</div>
            </div>
            <div class="sub-col">
              <div class="sub-label">(刀锋高度)H4</div>
              <div class="sub-value">{{ data.bladeEdgeHeightH4 }}</div>
            </div>
            <div class="sub-col w-1">
              <div class="sub-label">判定</div>
              <div class="w-1"> <a-checkbox-group v-model:value="data.bladeCheckResult" :options="['OK', 'NG']" /> </div>
            </div>
            <div class="sub-col w-1">
              <div class="sub-label">刀高类型</div>
              <div class="w-1 pl-10px">
                <a-checkbox-group
                  style="display: flex; flex-wrap: wrap; padding-left: 6px"
                  v-model:value="data.knifeHeightTypeName"
                  :options="state.knifeHeightTypeOptions" />
              </div>
            </div>
          </div>
          <!-- <div class="remark"> </div> -->
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">尺寸</div>
          <div class="value pl-0">
            <div class="sub-col">
              <div>
                <div> 图面尺寸</div>
                <div> (mm) </div>
              </div>
              <div class="sub-value"></div>
            </div>
            <div class="sub-col">
              <div>
                <div> 公差(+/-)</div>
              </div>
              <div class="sub-value"></div>
            </div>
            <div class="sub-col">
              <div>测量工具</div>
              <div class="sub-value"></div>
            </div>
            <div class="sub-col size-block">
              <div class="sub-label">实测尺寸（mm）</div>
              <div class="sub-value size-block-value">
                <div>1</div>
                <div>2</div>
                <div>3</div>
              </div>
            </div>
          </div>
          <div class="remark"> 判定 </div>
        </div>
      </div>

      <div class="row" v-for="(item, i) in getSizeList(data.sizeList)">
        <div class="col">
          <div class="label">{{ i + 1 }}</div>
          <div class="value pl-0">
            <div class="sub-col">
              <div> </div>
              <div class="sub-value">{{ item.drawingSize || '-' }}</div>
            </div>
            <div class="sub-col">
              <div> </div>
              <div>
                {{ item.tolerance || '-' }}
              </div>
            </div>
            <div class="sub-col">
              <div class="sub-value">{{ item.measureTools || '-' }}</div>
            </div>
            <div class="sub-col size-block">
              <div class="sub-value size-block-value">
                <div>&nbsp;{{ item.actualSize1 || '-' }}</div>
                <div>&nbsp;{{ item.actualSize2 || '-' }}</div>
                <div>&nbsp;{{ item.actualSize3 || '-' }}</div>
              </div>
            </div>
          </div>
          <div class="check-result"> <a-checkbox-group v-model:value="item.checkResult" :options="['OK', 'NG']" v-if="item.drawingSize" /> </div>
        </div>
      </div>
    </div>
    <div class="print-footer">
      <div class="print-footer-info">
        <div> 最终判定结论： {{ data.checkResult }}</div>
        <div class="sign">
          <img class="chgz-logo" src="/@/assets/images/chgz.png" alt="Logo" />
          出货确认：<span class="bdb-1">{{ getUserInfo.userName }}</span>
        </div>
      </div>
      <div class="print-footer-tips"> 注：{{ data.remark }} </div>
    </div>
  </div>
  <div class="print-break"></div>
</template>
<script setup lang="ts">
  import dayjs from 'dayjs';
  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});
  import { ref, reactive, toRefs, computed, onMounted, toRef } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { SvgIcon } from '/@/components/Icon';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  const defaultNum = 5;

  const props = defineProps({
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const { data } = toRefs(props);
  const state = reactive({
    bladeTypeOptions: [] as any,
    knifeHeightTypeOptions: [] as any,
  });
  function getSizeList(list: any[]) {
    const template = {
      drawingSize: '',
      tolerance: '',
      measureTools: '',
      actualSize1: '',
      actualSize2: '',
      actualSize3: '',
    };
    console.log(list);
    if (!list) return Array.from({ length: defaultNum }, () => ({ ...template }));
    const lens = list.length;
    let emptyTemplates: any = [];
    if (lens < defaultNum) {
      emptyTemplates = Array.from({ length: defaultNum - lens }, () => ({ ...template }));
    }
    return [...list, ...emptyTemplates];
  }

  onMounted(async () => {
    const _knifeHeightType: any = await baseStore.getDictionaryData('knifeHeightType');
    const _bladeType: any = await baseStore.getDictionaryData('bladeType');

    _knifeHeightType.forEach(item => {
      state.knifeHeightTypeOptions.push(item.fullName);
    });
    _bladeType.forEach(item => {
      state.bladeTypeOptions.push(item.fullName);
    });
  });
</script>

<style lang="less" scoped>
  @import url('./printTemplate.css');
  // :deep(.ant-checkbox-wrapper) {
  //   width: 44px !important;
  // }
</style>
