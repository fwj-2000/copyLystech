<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content flex-col">
        <div class="lydc-content-wrapper-search-box">
          <div class="search-box">
            <a-button v-auth="'btn_add'" type="primary" class="mx-12px" @click="handleApply('add')">{{ t('common.add2Text') }}</a-button>
            <a-button v-auth="'btn_modify'" type="primary" class="my-12px" ghost @click="handleApply('edit')">{{ t('dict.CommonCol.modify') }}</a-button>
            <a-input-search
              :placeholder="t('common.enterKeywords')"
              style="width: 456px; height: 30px; margin-left: 12px"
              class="search-input"
              v-model:value="searchKeyword"
              @search="handleQuery" />
            <a-button class="mx-12px" @click="handleReset">{{ t('common.resetText') }}</a-button>
            <a-button type="primary" class="my-12px" ghost @click="handleQuery">{{ t('common.query') }}</a-button>
          </div>
        </div>
        <div class="flex justify-start bg-white">
          <div class="left-section">
            <UpgradeTime ref="timeTreeRef" @select-log="onLogSelect" />
          </div>
          <div class="divider"></div>
          <div class="right-section">
            <upgradeCont :showTitle="true" :logId="selectedLogId" ref="contRef"></upgradeCont>
          </div>
        </div>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @refresh-list="loadLatestLog" @update-current-log="updateCurrentLog" @close="onApplyPopupClose" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './components/ApplyPopup.vue';
  import upgradeCont from './components/upgradeCont.vue';
  import UpgradeTime from './components/upgradeTime.vue';
  import { getToken } from '/@/utils/auth';
  import { ref, onMounted, useTemplateRef, nextTick } from 'vue';
  import { getLatestOneUpdateLog, getUpdateLogList, getUpdateTimeTree } from '/@/api/business/updateLogs';
  import { message } from 'ant-design-vue';
  import moment from 'moment';

  const { t } = useI18n();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const timeTreeRef = useTemplateRef('timeTreeRef');
  const contRef = useTemplateRef('contRef');
  const selectedLogId = ref('');
  const logData = ref<any>(null);
  const isManuallySelected = ref(false);
  const isDayLevelNode = ref(false);
  const searchKeyword = ref('');
  const originalTreeData = ref<any[]>([]);

  onMounted(() => {
    loadLatestLog();
  });

  const loadLatestLog = async () => {
    try {
      const res = await getLatestOneUpdateLog();
      if (res.code === 200 && res.data) {
        const latestLog = res.data;
        latestLog.Status = latestLog.Status ?? 0;
        latestLog.MajorVersion = latestLog.MajorVersion ?? 0;
        latestLog.MinorVersion = latestLog.MinorVersion ?? 0;
        latestLog.PatchVersion = latestLog.PatchVersion ?? 0;

        logData.value = latestLog;
        contRef.value?.setLog(latestLog);
        selectedLogId.value = latestLog.Id;

        const timeTreeRes = await getUpdateTimeTree({});
        if (timeTreeRes.code === 200 && timeTreeRes.data) {
          originalTreeData.value = timeTreeRes.data;
          timeTreeRef.value?.updateTreeData(timeTreeRes.data);
          timeTreeRef.value?.setSelected(latestLog.Id, false);
        }
      }
    } catch (error) {
      console.error('刷新日志失败:', error);
    }
  };

  // 展开所有节点
  const expandAllNodes = (treeData: any[]) => {
    if (!treeData || !timeTreeRef.value) return;

    const expandKeys: string[] = [];
    const collectKeys = (nodes: any[]) => {
      nodes.forEach(node => {
        expandKeys.push(node.key);
        if (node.children && node.children.length > 0) {
          collectKeys(node.children);
        }
      });
    };
    collectKeys(treeData);
    timeTreeRef.value.handleExpand(expandKeys);
  };

  // 修改筛选逻辑，支持纯时间匹配（忽略日期）
  const filterTreeByTime = (treeData: any[], timeInfo: any) => {
    return treeData
      .map(yearNode => {
        if (timeInfo.year && yearNode.label !== timeInfo.year.toString()) {
          console.log('年份不匹配：', yearNode.label, '≠', timeInfo.year);
          return null;
        }

        const filteredMonths = yearNode.children
          .map(monthNode => {
            const monthNum = Number.parseInt(monthNode.label);
            if (timeInfo.month && monthNum !== timeInfo.month) {
              console.log('月份不匹配：', monthNode.label, '≠', timeInfo.month);
              return null;
            }

            const filteredDays = monthNode.children.filter((dayNode: any) => {
              const timestamp = Number.parseInt(dayNode.label);
              const logTime = moment(timestamp);

              if (timeInfo.isOnlyTime) {
                const matches = logTime.hour() === timeInfo.targetHour && logTime.minute() === timeInfo.targetMinute;
                console.log('检查时间戳：', timestamp, '时间：', logTime.format('HH:mm'), '是否匹配：', matches);
                return matches;
              } else {
                const isInRange = timestamp >= timeInfo.startTime && timestamp <= timeInfo.endTime;
                return isInRange;
              }
            });

            return filteredDays.length > 0 ? { ...monthNode, children: filteredDays } : null;
          })
          .filter(Boolean);

        return filteredMonths.length > 0 ? { ...yearNode, children: filteredMonths } : null;
      })
      .filter(Boolean);
  };

  const parseTimeKeyword = (keyword: string) => {
    const result: any = {};
    const yearMatch = keyword.match(/(\d{4})年?/);
    const monthMatch = keyword.match(/(\d{1,2})月/);
    const dayMatch = keyword.match(/月(\d{1,2})日?/);
    const timeMatch = keyword.match(/(\d{1,2}):(\d{1,2})/);

    if (yearMatch) {
      result.year = Number.parseInt(yearMatch[1]);
      console.log('解析到年份：', result.year);
    }
    if (monthMatch) {
      result.month = Number.parseInt(monthMatch[1]);
      console.log('解析到月份：', result.month);
    }
    if (dayMatch) {
      result.day = Number.parseInt(dayMatch[1]);
      console.log('解析到日期：', result.day);
    }
    if (timeMatch) {
      result.hour = Number.parseInt(timeMatch[1]);
      result.minute = Number.parseInt(timeMatch[2]);
      if (result.hour >= 0 && result.hour < 24 && result.minute >= 0 && result.minute < 60) {
        console.log('解析到时间：', result.hour, ':', result.minute);
      } else {
        console.log('无效的时间格式：', timeMatch[0]);
        delete result.hour;
        delete result.minute;
      }
    }

    if (result.year || result.month || result.day || result.hour || result.minute) {
      const isOnlyTimeQuery = !result.year && !result.month && !result.day && result.hour !== undefined && result.minute !== undefined;

      if (isOnlyTimeQuery) {
        result.isOnlyTime = true;
        result.targetHour = result.hour;
        result.targetMinute = result.minute;
        console.log('纯时间查询，匹配所有日期的', result.hour, ':', result.minute);
      } else {
        const queryDate = moment()
          .year(result.year || moment().year())
          .month(result.month ? result.month - 1 : moment().month())
          .date(result.day || 1)
          .hour(result.hour || 0)
          .minute(result.minute || 0)
          .second(0);

        if (result.hour !== undefined && result.minute !== undefined) {
          result.startTime = queryDate.valueOf();
          result.endTime = queryDate.clone().second(59).valueOf();
        } else if (result.day) {
          result.startTime = queryDate.startOf('day').valueOf();
          result.endTime = queryDate.endOf('day').valueOf();
        } else if (result.month) {
          result.startTime = queryDate.startOf('month').valueOf();
          result.endTime = queryDate.endOf('month').valueOf();
        } else if (result.year) {
          result.startTime = queryDate.startOf('year').valueOf();
          result.endTime = queryDate.endOf('year').valueOf();
        }

        console.log(
          '计算时间范围：',
          'start:',
          moment(result.startTime).format('YYYY-MM-DD HH:mm:ss'),
          'end:',
          moment(result.endTime).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  };

  const buildContentSearchTree = (contentLogs: any[]) => {
    const yearMap: Record<string, any> = {};

    contentLogs.forEach(log => {
      const logTime = moment(log.CreatorTime);
      const year = logTime.year().toString();
      const month = (logTime.month() + 1).toString();
      const dayTimestamp = log.CreatorTime.toString();

      if (!yearMap[year]) {
        yearMap[year] = {
          label: year,
          key: `year_${year}`,
          children: [],
        };
      }
      const yearNode = yearMap[year];

      let monthNode = yearNode.children.find((node: any) => node.label === month);
      if (!monthNode) {
        monthNode = {
          label: month,
          key: `month_${year}_${month}`,
          children: [],
        };
        yearNode.children.push(monthNode);
      }

      monthNode.children.push({
        label: dayTimestamp,
        key: `log_${log.Id}`,
        id: log.Id,
        isContentMatch: true,
      });
    });

    return Object.values(yearMap);
  };

  const onLogSelect = async (logId: string, isDayLevel: boolean) => {
    if (!isDayLevel) {
      return;
    }

    if (!logId) return;
    isDayLevelNode.value = isDayLevel;

    try {
      const res = await getUpdateLogList({ id: logId });
      if (res.code === 200 && res.data.length > 0) {
        const targetLog = res.data[0];
        // 强制修正选中日志的状态和版本
        targetLog.Status = targetLog.Status ?? 0;
        targetLog.MajorVersion = targetLog.MajorVersion ?? 0;
        targetLog.MinorVersion = targetLog.MinorVersion ?? 0;
        targetLog.PatchVersion = targetLog.PatchVersion ?? 0;

        logData.value = targetLog;
        selectedLogId.value = logId;
        isManuallySelected.value = true;
      } else {
        logData.value = null;
        selectedLogId.value = '';
        isManuallySelected.value = false;
      }
    } catch (error) {
      console.error('加载选中日志失败:', error);
      message.error(t('common.loadSelectedFailed'));
    }
  };

  const findFirstLogId = (treeData: any[]): string | null => {
    for (const yearNode of treeData) {
      if (yearNode.children && yearNode.children.length > 0) {
        for (const monthNode of yearNode.children) {
          if (monthNode.children && monthNode.children.length > 0) {
            return monthNode.children[0].id;
          }
        }
      }
    }
    return null;
  };

  const handleQuery = async () => {
    const keyword = searchKeyword.value.trim();
    console.log('开始查询，关键词：', keyword);
    if (!keyword) {
      message.info(t('common.queryEnterKeyword'));
      return;
    }
    const isPureNumber = /^\d+$/.test(keyword);
    if (isPureNumber) {
      console.log('纯数字关键词，直接执行内容搜索');
      try {
        const contentRes = await getUpdateLogList({ keyword });
        if (contentRes.code !== 200 || contentRes.data.length === 0) {
          message.info(t('common.logNotMatching'));
          return;
        }

        const contentTreeData = buildContentSearchTree(contentRes.data);
        timeTreeRef.value?.updateTreeData(contentTreeData);
        await nextTick();
        expandAllNodes(contentTreeData);

        const firstLogId = contentRes.data[0]?.Id;
        if (firstLogId) {
          onLogSelect(firstLogId, true);
        }
      } catch (error) {
        console.error('内容搜索失败:', error);
        // message.error('查询失败，请重试');
      }
      return;
    }
    try {
      const timeInfo = parseTimeKeyword(keyword);
      console.log('解析时间信息：', timeInfo);

      const timeTreeRes = await getUpdateTimeTree({ keyword });
      console.log('后端时间查询结果：', timeTreeRes.code, '，返回节点数：', timeTreeRes.data?.length || 0);
      let treeData = timeTreeRes.code === 200 ? timeTreeRes.data : [];

      if (timeInfo) {
        treeData = originalTreeData.value.length > 0 ? filterTreeByTime(originalTreeData.value, timeInfo) : [];
        console.log('前端时间筛选后节点数：', treeData.length);
      }

      if (treeData.length > 0) {
        timeTreeRef.value?.updateTreeData(treeData);
        await nextTick();
        expandAllNodes(treeData);

        const firstLogId = findFirstLogId(treeData);
        if (firstLogId) {
          onLogSelect(firstLogId, true);
        }
        return;
      }

      console.log('时间查询无结果，尝试内容模糊搜索');
      const contentRes = await getUpdateLogList({ keyword });
      if (contentRes.code !== 200 || contentRes.data.length === 0) {
        console.log('内容搜索也无结果');
        message.info(t('common.logNotMatching'));
        return;
      }

      const contentTreeData = buildContentSearchTree(contentRes.data);
      timeTreeRef.value?.updateTreeData(contentTreeData);
      await nextTick();
      expandAllNodes(contentTreeData);
    } catch (error) {
      console.error('查询日志失败:', error);
      // message.error('查询失败，请重试');
    }
  };

  const handleReset = async () => {
    searchKeyword.value = '';
    if (originalTreeData.value.length > 0) {
      timeTreeRef.value?.updateTreeData(originalTreeData.value);
    } else {
      await loadLatestLog();
      return;
    }
    try {
      const res = await getLatestOneUpdateLog();
      if (res.code === 200 && res.data) {
        const latestLog = res.data;
        // 强制修正重置后的状态和版本
        latestLog.Status = latestLog.Status ?? 0;
        latestLog.MajorVersion = latestLog.MajorVersion ?? 0;
        latestLog.MinorVersion = latestLog.MinorVersion ?? 0;
        latestLog.PatchVersion = latestLog.PatchVersion ?? 0;

        logData.value = latestLog;
        selectedLogId.value = latestLog.Id;
        contRef.value?.setLog(latestLog);
        timeTreeRef.value?.setSelected(latestLog.Id, false);
      }
    } catch (error) {
      console.error('重置时加载最新日志失败:', error);
    }
    isManuallySelected.value = false;
  };

  function handleApply(type: 'add' | 'edit') {
    if (type === 'edit') {
      if (!isManuallySelected.value) {
        message.warning(t('common.logModifySelectFirst'));
        return;
      }
      if (!isDayLevelNode.value) {
        message.warning(t('common.ModifyOnlySpecificDate'));
        return;
      }
      if (!logData.value || !selectedLogId.value) {
        message.warning(t('common.LogSelectednotExist'));
        return;
      }
      // 传递完整的日志数据（含正确状态和版本）
      openApplyPop(true, { type, logId: selectedLogId.value, logData: logData.value });
    } else {
      openApplyPop(true, { type: 'add' });
    }
  }

  // 完整更新状态和版本字段，避免短暂异常
  const updateCurrentLog = (updatedData: any) => {
    if (contRef.value && updatedData.Id === selectedLogId.value) {
      const updatedLog = {
        ...logData.value,
        ...updatedData,
        Status: updatedData.Status ?? logData.value?.Status ?? 0,
        MajorVersion: updatedData.MajorVersion ?? logData.value?.MajorVersion ?? 0,
        MinorVersion: updatedData.MinorVersion ?? logData.value?.MinorVersion ?? 0,
        PatchVersion: updatedData.PatchVersion ?? logData.value?.PatchVersion ?? 0,
      };
      contRef.value.setLog(updatedLog);
      logData.value = updatedLog;
    }
  };

  const onApplyPopupClose = () => {
    if (timeTreeRef.value) {
      timeTreeRef.value.clearSelection();
    }
    isManuallySelected.value = false;
  };
</script>

<style lang="less" scoped>
  :deep(.log-title) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  :deep(.log-title-text) {
    color: #1a1a1a;

    /* 中文/标题16 */

    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
  }

  :deep(.orange-line) {
    border-radius: 4px;
    background: #ff7b00;
    width: 2px;
    height: 16px;
  }

  .mainContentBox {
    display: flex;
    height: 674px;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 8px;
    background: #f7f7f7;
  }

  .lydc-content-wrapper-content {
    position: relative;
    display: flex;
    height: 100%;
  }

  .left-section {
    width: 270px;
    height: 758px;
    display: flex;
  }

  .right-section {
    width: calc(100% - 280px);
    height: 758px;
    display: flex;
  }

  .divider {
    width: 1px;
    height: 758px;
    background-color: #dbdbdb;
    left: 270px;
    top: 0;
  }

  .search-box {
    height: 54px;
    display: flex;
    align-items: center;
  }

  .lydc-content-wrapper .lydc-content-wrapper-center .lydc-content-wrapper-search-box {
    padding: 0;
    margin-bottom: 2px;
  }
</style>
