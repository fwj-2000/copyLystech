<script lang="ts" setup>
  import SmoothSignature from 'smooth-signature';
  import { onMounted, ref } from 'vue';
  import { getViewportDimensions } from '/@/adapter/utils';
  import { useMessage } from '/@/hooks/web/useMessage';

  const signature = ref(null);
  const { createMessage } = useMessage();

  let signatureInstance = null;
  const emit = defineEmits(['submit', 'close']);

  onMounted(() => {
    if (!signature.value) return;
    const { width, height } = getViewportDimensions();
    signatureInstance = new SmoothSignature(signature.value, {
      width: width - 55,
      height: height,
      scale: 2,
      minWidth: 4,
      maxWidth: 10,
      bgColor: '#efefef',
    });
  });

  function handleReWrite() {
    if (!signatureInstance) return;
    signatureInstance.clear();
  }

  function handleSubmit() {
    if (signatureInstance.isEmpty()) return createMessage.warning('请先签字');
    const dataURL = signatureInstance.toDataURL();
    emit('submit', dataURL);
    emit('close');
  }
</script>

<template>
  <canvas ref="signature" />
  <a-space class="fixed z-10 top-full right-[-100px] rotate-90 transform origin-left-top translate-y-[calc(-100%-120px)]">
    <a-button
      @click="
        () => {
          emit('close');
        }
      "
      >返回</a-button
    >
    <a-button @click="handleReWrite">重新签字</a-button>
    <a-button type="primary" ghost @click="handleSubmit">确认签字 </a-button>
  </a-space>
</template>

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
      padding: 0 40px 15px;
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

    .lip {
      padding: 20px 0;
    }

    .table-box {
      padding: 0 1px 0 0;
    }

    .demo-form-inline {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .temdate {
      text-align: right;
      margin: 20px 60px;
    }

    .seal {
      text-align: right;
      margin: 10px 120px;
      padding-bottom: 40px;
    }

    .sigbut {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @text-color-label;
      padding: 8px;
      border: 1px solid @border-color-base1;
      border-top: 0;

      .left-bu {
        display: flex;
        align-items: center;

        .clear-bu,
        .sure {
          margin-left: 5px;
        }
      }
    }

    .online-sig {
      border: 1px solid @border-color-base1;
      border-top: 0;
      height: 150px;
      padding-top: 10px;
    }
  }
</style>
