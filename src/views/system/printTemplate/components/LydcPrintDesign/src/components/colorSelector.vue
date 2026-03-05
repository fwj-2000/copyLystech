<template>
  <div class="color-picker-container">
    <div class="color-picker-header">
      <span class="color-picker-title">{{ title }}</span>
    </div>

    <div class="color-panel" ref="panelRef" @mousedown="startPanelDrag">
      <div class="color-panel-bg" :style="panelBgStyle"></div>
      <div class="color-panel-thumb" :style="panelThumbStyle"></div>
    </div>

    <div class="color-input-container">
      <span class="color-input-label">颜色值</span>
      <div class="color-input">
        <input type="text" v-model="inputColor" @input="handleColorInput" @blur="validateColorInput" />
        <div class="color-preview" :style="previewStyle"></div>
      </div>
    </div>

    <div class="color-palette">
      <div
        v-for="(color, index) in presetColors"
        :key="index"
        class="color-block"
        :class="{ active: isColorActive(color) }"
        :style="{ backgroundColor: color }"
        @click="selectPresetColor(color)"></div>
    </div>

    <div class="color-actions">
      <a-button class="mr-10px" @click="cancel">取消</a-button>
      <a-button type="primary" @click="confirm">确定</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';

  interface HSVColor {
    h: number;
    s: number;
    v: number;
  }

  interface RGBAColor {
    r: number;
    g: number;
    b: number;
  }

  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      title?: string;
      presetColors?: string[];
    }>(),
    {
      modelValue: '#409EFF',
      title: '颜色选择器',
      presetColors: () => [
        '#FF0000',
        '#FF4500',
        '#FFA500',
        '#FFD700',
        '#90EE90',
        '#00FF00',
        '#00FA9A',
        '#00FFFF',
        '#1E90FF',
        '#0000FF',
        '#9370DB',
        '#FF00FF',
        '#FF1493',
        '#FF69B4',
        '#FFC0CB',
        '#FFFFFF',
        '#C0C0C0',
        '#808080',
        '#000000',
      ],
    },
  );

  const emit = defineEmits(['update:modelValue', 'change', 'cancel', 'confirm']);

  // Refs
  const panelRef = ref<HTMLElement | null>(null);
  const currentColor = ref<HSVColor>({
    h: 210,
    s: 100,
    v: 100,
  });
  const inputColor = ref(props.modelValue);
  const isPanelDragging = ref(false);

  // Computed
  const panelBgStyle = computed(() => {
    const hueColor = `hsl(${currentColor.value.h}, 100%, 50%)`;
    return {
      background: `linear-gradient(to right, #fff, ${hueColor})`,
    };
  });

  const panelThumbStyle = computed(() => {
    if (!panelRef.value) return {};
    const panelRect = panelRef.value.getBoundingClientRect();
    const x = (currentColor.value.s / 100) * panelRect.width;
    const y = ((100 - currentColor.value.v) / 100) * panelRect.height;
    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  });

  const previewStyle = computed(() => ({
    backgroundColor: hsvToHex(currentColor.value),
  }));

  // Methods
  function hexToRgba(hex: string): RGBAColor | null {
    if (!isValidColor(hex)) return null;

    hex = hex.replace('#', '');

    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }

    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }

  function rgbaToHsv(rgba: RGBAColor): HSVColor {
    let r = rgba.r / 255;
    let g = rgba.g / 255;
    let b = rgba.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return {
      h: h,
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }

  function hsvToRgba(color: HSVColor): RGBAColor {
    let h = color.h;
    let s = color.s / 100;
    let v = color.v / 100;

    let r, g, b;

    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  function rgbaToHex(rgba: RGBAColor): string {
    const r = rgba.r.toString(16).padStart(2, '0');
    const g = rgba.g.toString(16).padStart(2, '0');
    const b = rgba.b.toString(16).padStart(2, '0');

    return `#${r}${g}${b}`.toUpperCase();
  }

  function hsvToHex(color: HSVColor): string {
    const rgba = hsvToRgba(color);
    return rgbaToHex(rgba);
  }

  function hexToHsv(hex: string): HSVColor | null {
    const rgba = hexToRgba(hex);
    if (!rgba) return null;
    return rgbaToHsv(rgba);
  }

  function isValidColor(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }

  function startPanelDrag(e: MouseEvent) {
    isPanelDragging.value = true;
    updateColorFromPanel(e);
    document.addEventListener('mousemove', panelMouseMove);
    document.addEventListener('mouseup', panelMouseUp);
  }

  function panelMouseMove(e: MouseEvent) {
    if (isPanelDragging.value) {
      updateColorFromPanel(e);
    }
  }

  function panelMouseUp() {
    isPanelDragging.value = false;
    document.removeEventListener('mousemove', panelMouseMove);
    document.removeEventListener('mouseup', panelMouseUp);
  }

  function updateColorFromPanel(e: MouseEvent) {
    if (!panelRef.value) return;

    const rect = panelRef.value.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    currentColor.value.s = Math.round((x / rect.width) * 100);
    currentColor.value.v = 100 - Math.round((y / rect.height) * 100);

    updateUI();
  }

  function handleColorInput() {
    const colorStr = inputColor.value.trim();
    if (isValidColor(colorStr)) {
      const color = hexToHsv(colorStr);
      if (color) {
        currentColor.value = color;
        updateUI();
      }
    }
  }

  function validateColorInput() {
    if (!isValidColor(inputColor.value)) {
      inputColor.value = hsvToHex(currentColor.value);
    }
  }

  function selectPresetColor(color: string) {
    const hsvColor = hexToHsv(color);
    if (hsvColor) {
      currentColor.value = hsvColor;
      updateUI();
    }
  }

  function isColorActive(color: string): boolean {
    return color.toUpperCase() === hsvToHex(currentColor.value).toUpperCase();
  }

  function cancel() {
    emit('cancel');
  }

  function confirm() {
    emit('confirm', hsvToHex(currentColor.value));
  }

  function updateUI() {
    const hex = hsvToHex(currentColor.value);
    inputColor.value = hex;
    emit('update:modelValue', hex);
    emit('change', hex);
  }

  // Lifecycle
  onMounted(() => {
    const initialColor = hexToHsv(props.modelValue);
    if (initialColor) {
      currentColor.value = initialColor;
    }
  });
</script>

<style scoped>
  .color-picker-container {
    position: fixed;
    width: 340px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 15px;
  }

  .color-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .color-picker-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .color-input-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .color-input-label {
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
    width: 60px;
  }

  .color-input {
    flex: 1;
    position: relative;
  }

  .color-input input {
    width: 100%;
    height: 32px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: none;
    font-size: 14px;
    color: #606266;
    transition: border-color 0.2s;
  }

  .color-input input:focus {
    border-color: #ff9729;
  }

  .color-preview {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  .color-palette {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .color-block {
    width: 24px;
    height: 24px;
    margin: 0 8px 8px 0;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .color-block:hover {
    transform: scale(1.1);
  }

  .color-block.active {
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #409eff;
  }

  .color-actions {
    display: flex;
    justify-content: flex-end;
  }

  .el-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.1s;
    border: 1px solid transparent;
  }

  .el-button--default {
    color: #606266;
    background-color: #fff;
    border-color: #dcdfe6;
  }

  .el-button--default:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  .el-button--primary {
    color: #fff;
    background-color: #409eff;
  }

  .el-button--primary:hover {
    background-color: #66b1ff;
  }

  .el-button + .el-button {
    margin-left: 10px;
  }

  .color-panel {
    width: 100%;
    height: 150px;
    position: relative;
    margin-bottom: 15px;
    border-radius: 4px;
    overflow: hidden;
    cursor: crosshair;
  }

  .color-panel-bg {
    position: absolute;
    inset: 0;
  }

  .color-panel-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, #000);
  }

  .color-panel-thumb {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid #fff;
    position: absolute;
    transform: translate(-4px, -4px);
    box-shadow: 0 0 1px rgb(0 0 0 / 50%);
    pointer-events: none;
  }
</style>
