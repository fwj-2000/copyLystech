<template>
  <div class="tem-container h-full">
    <div ref="printRef" class="tem_list">
      <h1>广东领益智造股份有限公司</h1>
      <h2>新 员 工 三 级 安 全 教 育 卡</h2>
      <div class="education-card">
        <table>
          <tr>
            <td style="width: 9%">姓名</td>
            <td style="width: 15%">{{ employee.trainerName }}</td>
            <td style="width: 18%">性别</td>
            <td style="width: 20%">{{ employee.trainerGender }}</td>
            <td style="width: 20%">出生日期</td>
            <td style="width: 25%">{{ dayjs(employee.trainerBirthday).format('YYYY-MM-DD') }}</td>
          </tr>
          <tr>
            <td>入厂时间</td>
            <td>{{ dayjs(employee.employmentDate).format('YYYY-MM-DD') }}</td>
            <td>部门</td>
            <td>{{ employee.trainerDepartment }}</td>
            <td>工作性质</td>
            <td>{{ employee.trainerJobNature }}</td>
          </tr>
          <tr>
            <td colspan="2">从前从事的工种</td>
            <td>{{ employee.trainerPreviousJob }}</td>
            <td>技术职称（等级）</td>
            <td colspan="2">{{ employee.trainerTechTitle }}</td>
          </tr>
          <tr>
            <td>培训级别</td>
            <td colspan="3">培训内容</td>
            <td colspan="2">培训结果评判</td>
          </tr>
          <tr>
            <td rowspan="2">公司级</td>
            <td colspan="3">
              <div v-for="(item, index) in employee.officeTrainContentList">
                {{ item }}
              </div>
            </td>
            <td> 培训时长：6H </td>
            <td> 合格 </td>
          </tr>
          <tr style="height: 80px">
            <td> 受训人签名/日期 </td>
            <td>
              <div style="translate: 0% -25%; transform: rotate(-90deg); transition: all 0.35s ease">
                <img :src="employee.officeTrainerSignatureImg" style="width: 85px; height: 120px" />
              </div>
              <!-- <div> {{ employee.officeTrainerSignTimeStr }} </div> -->
            </td>
            <td> 培训人签名/日期 </td>
            <td>
              <div v-if="employee.officeTrainTimeGroups && employee.officeTrainTimeGroups.length > 0">
                培训时间段：
                <p>{{ employee.officeTrainTimeGroups[0].TrainTimePeriod }}</p>
                <p>{{ employee.officeTrainTimeGroups[0].TrainDate }}</p>
              </div>
            </td>
            <td>
              <div style="translate: 0% -25%; transform: rotate(-90deg); transition: all 0.35s ease">
                <img :src="employee.officeMentorSignatureImg" style="width: 85px; height: 120px" />
              </div>
              <!-- <div v-if="employee.officeMentorSignTimeStr"> 签名时间：{{ employee.officeMentorSignTimeStr }} </div> -->
            </td>
          </tr>
          <tr>
            <td rowspan="2">车间级</td>
            <td colspan="3">
              <div v-for="(item, index) in employee.workShopTrainContentList">
                {{ item }}
              </div>
            </td>
            <td> 培训时长：8H </td>
            <td> 合格 </td>
          </tr>
          <tr>
            <td> 受训人签名/日期 </td>
            <td>
              <div style="translate: 0% -25%; transform: rotate(-90deg); transition: all 0.35s ease">
                <img :src="employee.officeTrainerSignatureImg" style="width: 85px; height: 120px" />
              </div>
              <!-- <div> {{ employee.officeTrainerSignTimeStr }} </div> -->
            </td>
            <td> 培训人签名/日期 </td>
            <td>
              <div v-if="employee.workShopTrainTimeGroups && employee.workShopTrainTimeGroups.length > 0">
                培训时间段：
                <p>{{ employee.workShopTrainTimeGroups[0].TrainTimePeriod }}</p>
                <p>{{ employee.workShopTrainTimeGroups[0].TrainDate }}</p>
              </div>
            </td>
            <td>
              <div style="translate: 0% -25%; transform: rotate(-90deg); transition: all 0.35s ease">
                <img :src="employee.workShopMentorSignatureImg" style="width: 85px; height: 120px" />
              </div>
              <!-- <div v-if="employee.workShopMentorSignTimeStr"> 签名时间：{{ employee.workShopMentorSignTimeStr }} </div> -->
            </td>
          </tr>
        </table>
      </div>

      <!-- 强制分页标记 -->
      <div className="page-break"></div>

      <div class="education-card">
        <table>
          <tr>
            <td rowspan="2" style="width: 9%">班组级</td>
            <td colspan="3" style="width: 53%">
              <div v-for="(item, index) in employee.teamLevelTrainContentList"> {{ item }} ; </div>
            </td>
            <td style="width: 20%"> 培训时长：10H </td>
            <td style="width: 25%"> 合格 </td>
          </tr>
          <tr>
            <td style="width: 15%"> 受训人签名/日期 </td>
            <td style="width: 18%">
              <div style="translate: 0% -25%; transform: rotate(-90deg); transition: all 0.35s ease">
                <img :src="employee.officeTrainerSignatureImg" style="width: 85px; height: 120px" />
              </div>
              <!-- <div> {{ employee.officeTrainerSignTimeStr }} </div> -->
            </td>
            <td> 培训人签名/日期 </td>
            <td>
              <div v-if="employee.teamLevelTrainTimeGroups && employee.teamLevelTrainTimeGroups.length > 0">
                培训时间段：
                <p>{{ employee.teamLevelTrainTimeGroups[0].TrainTimePeriod }}</p>
                <p>{{ employee.teamLevelTrainTimeGroups[0].TrainDate }}</p>
              </div>
              <div v-if="employee.teamLevelTrainTimeGroups && employee.teamLevelTrainTimeGroups.length > 1">
                <p>{{ employee.teamLevelTrainTimeGroups[1].TrainTimePeriod }}</p>
                <p>{{ employee.teamLevelTrainTimeGroups[1].TrainDate }}</p>
              </div>
            </td>
            <td>
              <div style="translate: 0% -25%; transform: rotate(-90deg); transition: all 0.35s ease">
                <img :src="employee.teamLevelMentorSignatureImg" style="width: 85px; height: 120px" />
              </div>
              <!-- <div v-if="employee.teamLevelMentorSignTimeStr">签名时间：{{ employee.teamLevelMentorSignTimeStr }} </div> -->
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <h5>备注：</h5>
              <div> 1. 该卡首先有HR与EHS部门进行公司级的培训，培训合格后将工人和该卡一起交予相应部门进行车间级的培训; </div>
              <div> 2.车间级培训合格后，将工人和该卡一起交班组长进行班组级的培训; </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, unref } from 'vue';
  import dayjs from 'dayjs';

  defineOptions({ name: 'content-to-print' });

  const printRef = ref();

  const props = defineProps({
    employee: {},
  });

  const { employee } = toRefs(props);
</script>
<style lang="less" scoped>
  .tem-container {
    background: @app-main-background;
    overflow: auto;
    position: relative;
    padding: 0;

    .signs {
      position: absolute;
      right: 10px;
      top: 70px;

      &.print {
        top: 20px;
      }
    }

    .tem_list {
      width: 800px;
      margin: 0 auto;
      background: @component-background;
      color: @text-color-label;
      position: relative;
      //padding: 0 20px 15px;
      font-size: 12px;
    }

    h1 {
      padding-top: 36px;
      font-size: 24px;
    }

    h2 {
      font-size: 18px;
    }

    h1,
    h2 {
      text-align: center;
      color: @text-color-label;
      font-weight: 700;
    }

    .title {
      border-bottom: 2px dashed #000;
      padding-left: 30px;
      line-height: 30px;
      font-size: 12px;
    }

    .education-card {
      width: 750px;
      margin: 0 auto;
      //padding-left: -10px;
      box-shadow: 2px 2px 5px rgb(0 0 0 / 10%);
    }

    .education-card h1 {
      text-align: center;
    }

    .education-card table {
      width: 100%;
      border-collapse: collapse;
    }

    .education-card td {
      border: 1px solid #000;
      padding: 8px;
    }

    // .training-content {
    //   margin-top: 20px;
    // }

    // .training-content h2 {
    //   margin-bottom: 10px;
    // }

    // .training-content ul {
    //   list-style-type: none;
    //   padding: 0;
    // }

    // .training-content li {
    //   margin-bottom: 5px;
    // }
  }
</style>
