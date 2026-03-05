<template>
  <div class="paper-settings">
    <div class="dropdown-container flex" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
      <div class="paper-btn">
        <i class="icon-ym icon-ym-customForm"></i>
        {{ curPaperType == 'other' ? '自定义' : curPaperType }}
      </div>

      <Transition name="dropdown">
        <div v-show="showDropdown" class="dropdown shadow-md">
          <div class="dropdown-item" v-for="(dimensions, size) in paperSizes" :key="size" @click="handleSizeClick(size, dimensions)">
            <i class="icon-ym icon-ym-customForm"></i>
            {{ size }} ({{ dimensions.width }}×{{ dimensions.height }})
          </div>
          <div class="dropdown-item custom" @click="showCustomDialog = true"> 自定义大小 </div>
        </div>
      </Transition>
    </div>

    <Transition name="fade">
      <div v-if="showCustomDialog" class="dialog">
        <div class="dialog-content">
          <h3>自定义纸张大小</h3>
          <div class="input-group">
            <label>宽度 (mm):</label>
            <input type="number" v-model="paperWidth" min="1" />
          </div>
          <div class="input-group">
            <label>高度 (mm):</label>
            <input type="number" v-model="paperHeight" min="1" />
          </div>
          <div class="dialog-actions">
            <button @click="handleCancel">取消</button>
            <button @click="handleConfirm">确定</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  interface PaperDimensions {
    width: number;
    height: number;
  }

  interface PaperSizes {
    [key: string]: PaperDimensions;
  }

  const props = withDefaults(
    defineProps<{
      paperSizes: PaperSizes;
      curPaperType: string;
    }>(),
    {
      paperSizes: () => ({
        A3: { width: 420, height: 296.6 },
        A4: { width: 210, height: 296.6 },
        A5: { width: 210, height: 147.6 },
        B3: { width: 500, height: 352.6 },
        B4: { width: 250, height: 352.6 },
        B5: { width: 250, height: 175.6 },
      }),
      curPaperType: 'A4',
    },
  );

  const paperHeight = defineModel('paperHeight');
  const paperWidth = defineModel('paperWidth');
  const showDropdown = ref(false);
  const showCustomDialog = ref(false);
  const emit = defineEmits(['size-selected', 'setPaper', 'setPaperOther']);

  const handleSizeClick = (size: string, dimensions: PaperDimensions) => {
    emit('setPaper', size, { width: props.paperSizes[size].width, height: props.paperSizes[size].height });
    showDropdown.value = false;
  };

  const handleCancel = () => {
    showCustomDialog.value = false;
  };

  const handleConfirm = () => {
    emit('setPaperOther');
    showCustomDialog.value = false;
    showDropdown.value = false;
  };
</script>

<style lang="less" scoped>
  @keyframes scale-in {
    from {
      transform: scale(0.95);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .paper-settings {
    position: relative;
    height: 100%;
    display: inline-block;
  }

  .dropdown-container {
    position: relative;
    height: 100%;
  }

  .paper-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: white;
    border-radius: 8px;
    min-width: 200px;
    z-index: 10;
    transform-origin: top center;
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: #f5f5f5;
    }
  }

  .dropdown-item.custom {
    border-top: 1px solid #eee;
  }

  /* 下拉菜单动画 */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }

  /* 对话框动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .dialog {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .dialog-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    transform-origin: center;
    animation: scale-in 0.2s ease;
  }

  .input-group {
    margin: 10px 0;
    display: flex;
    align-items: center;

    label {
      display: inline-block;
      width: 80px;
    }

    input {
      padding: 8px;
      width: 100px;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.2s ease;

      &:focus {
        border-color: #1890ff;
        outline: none;
      }
    }
  }

  .dialog-actions {
    margin-top: 20px;
    text-align: right;

    button {
      margin-left: 10px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:first-child {
        background: #f5f5f5;
        border: 1px solid #d9d9d9;

        &:hover {
          background: #e6e6e6;
        }
      }

      &:last-child {
        background: #1890ff;
        color: white;
        border: 1px solid #1890ff;

        &:hover {
          background: #40a9ff;
        }
      }
    }
  }
</style>
