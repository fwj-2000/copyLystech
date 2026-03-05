<template>
  <div class="w-full h-38px mt-16px mb-20px flex justify-start">
    <!-- 默认展示：没有数据时显示 ---- -->
    <div v-if="processedData.length === 0" class="process-box-one process-box-active">
      <div class="process-box-num flex process-box-num-active">1</div>
      <div class="process-box-text process-box-text-active">--</div>
      <div class="process-box-right-arrow process-box-right-arrow-active"></div>
    </div>

    <!-- 有数据时展示流程节点 -->
    <div ref="scrollContainer" class="process-scroll-container">
      <div class="process-content-wrapper">
        <div
          v-for="(item, index) in processedData"
          :key="item.id"
          :class="[getProcessBoxClass(index), { 'process-box-active': isShowOrange(item.id) }]"
          class="process-box-one">
          <div class="process-box-num flex" :class="{ 'process-box-num-active': isShowOrange(item.id) }">{{ index + 1 }}</div>
          <div class="process-box-text" :class="{ 'process-box-text-active': isShowOrange(item.id) }">{{ item.processName }}</div>

          <!-- 第一项不显示左箭头 -->
          <div v-if="index > 0" class="process-box-left-top-arrow" :class="{ 'process-box-left-top-arrow-active': isShowOrange(item.id) }"></div>
          <div v-if="index > 0" class="process-box-left-bottom-arrow" :class="{ 'process-box-left-bottom-arrow-active': isShowOrange(item.id) }"></div>

          <!-- 最后一项不显示右箭头 -->
          <div
            v-if="index < processedData.length - 1"
            class="process-box-right-arrow"
            :class="{ 'process-box-right-arrow-active': isShowOrange(item.id) }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, computed, onMounted, onUnmounted, nextTick, toRaw } from 'vue';
  import { getProcessroutemapbyid } from '/@/api/productionDeal/processroutebind';
  let routeData = {};
  // 数据
  const scrollContainer = ref(null);

  // 拖动状态
  const isDown = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);
  const processedData = ref([]);
  const isClear = ref(false);
  const getRouteList = async data => {
    routeData = toRaw(data);
    getProcessroutemapbyid(routeData.routeId).then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => {
          item.isCurrent = item.id === routeData?.routeNodeId;
        });
        processedData.value = res.data;
        scrollToSelected();
      } else {
        processedData.value = [];
      }
    });
  };

  const isShowOrange = nodeId => {
    return nodeId === routeData.routeNodeId;
  };

  // box class
  const getProcessBoxClass = index => {
    if (processedData.value.length <= 1) return '';
    if (index === processedData.value.length - 1) return 'last-width ml-[25px]';
    if (index > 0) return 'ml-[25px]';
    return '';
  };

  // 鼠标拖动逻辑（scrollLeft）
  const handleMouseDown = e => {
    if (!scrollContainer.value) return;
    isDown.value = true;
    scrollContainer.value.style.cursor = 'grabbing';
    startX.value = e.pageX - scrollContainer.value.offsetLeft;
    scrollLeft.value = scrollContainer.value.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.value = false;
    if (scrollContainer.value) scrollContainer.value.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    isDown.value = false;
    if (scrollContainer.value) scrollContainer.value.style.cursor = 'grab';
  };

  const handleMouseMove = e => {
    if (!isDown.value || !scrollContainer.value) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.value.offsetLeft;
    const walk = (x - startX.value) * 1; // 可调节灵敏度
    scrollContainer.value.scrollLeft = scrollLeft.value - walk;
  };

  // ⭐ 关键：初始化时滚动到选中项
  const scrollToSelected = () => {
    nextTick(() => {
      const container = scrollContainer.value;
      if (!container) return;

      // 找到选中项索引
      const index = processedData.value.findIndex(item => item.isCurrent);
      if (index === -1) return;

      // 单个 item 的宽度（含 margin）
      const itemWidth = 149 + 25; // 你定义的 149px + ml-25px
      const visibleCount = 5.5; // 可见的个数

      // 如果选中项超出可见范围，就滚动
      if (index >= visibleCount) {
        container.scrollTo({
          left: (index - visibleCount + 1) * itemWidth,
          behavior: 'smooth',
        });
      }
    });
  };
  onMounted(() => {
    const el = scrollContainer.value;
    if (!el) return;
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);
    el.style.cursor = 'grab';
  });

  onUnmounted(() => {
    const el = scrollContainer.value;
    if (!el) return;
    el.removeEventListener('mousedown', handleMouseDown);
    el.removeEventListener('mouseleave', handleMouseLeave);
    el.removeEventListener('mouseup', handleMouseUp);
    el.removeEventListener('mousemove', handleMouseMove);
  });
  defineExpose({
    getRouteList,
  });
</script>

<style lang="less" scoped>
  .process-scroll-container {
    display: flex;
    align-items: center;
    overflow: auto hidden;
    -ms-overflow-style: none; /* IE and Edge */
    cursor: grab;
    width: 100%; /* 确保容器有明确的宽度 */
    user-select: none;

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }

  .process-content-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: transform 0.1s ease-out;
  }

  .process-box-one {
    position: relative;
    height: 100%;
    width: 149px;
    background: #f0f2f5;
    display: flex;
    align-items: center;
    padding: 7px 6px 7px 12px;
    flex-shrink: 0; /* 防止子元素被压缩 */
  }

  .process-box-active {
    background: url('/@/assets/images/process.png') no-repeat;
    background-size: 100% 100%;
  }

  .process-box-right-arrow {
    position: absolute;
    top: 0;
    left: 100%;
    width: 14px;
    height: 100%;
    border-left: 14px solid #f0f2f5;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
  }

  .process-box-right-arrow-active {
    border-left: 14px solid #ff7b00;
  }

  .process-box-left-top-arrow {
    position: absolute;
    top: 0;
    left: -15px;
    width: 25px;
    height: 19px;
    border-top: 17px solid #f0f2f5;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
  }

  .process-box-left-top-arrow-active {
    border-top: 17px solid #ff7b00;
  }

  .process-box-left-bottom-arrow {
    position: absolute;
    bottom: 0;
    left: -15px;
    width: 25px;
    height: 19px;
    border-bottom: 17px solid #f0f2f5;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
  }

  .process-box-left-bottom-arrow-active {
    border-bottom: 17px solid #ff7b00;
  }

  .process-box-num {
    width: 23px;
    height: 23px;
    background: #d8d8d8;
    text-shadow: 0 0 4px rgb(0 0 0 / 40%);
    border-radius: 50%;
    font-size: 17px;
    color: #fff;
    font-weight: bold;
    margin-right: 8px;
  }

  .process-box-text {
    color: #666;
    white-space: nowrap; /* 防止文字换行 */
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }

  .process-box-num-active {
    color: #fff;
    background-color: rgb(255 255 255 / 30%);
    text-shadow: none;
  }

  .process-box-text-active {
    color: #fff;
  }

  // 保持原有的样式不变
</style>
