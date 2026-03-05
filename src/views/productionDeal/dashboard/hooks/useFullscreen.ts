import { ref, onMounted, onUnmounted, Ref } from 'vue';

export function useFullscreen(targetRef: Ref<HTMLElement | null>) {
  const isFullscreen = ref(false); // 是否处于全屏状态

  // 进入全屏
  const enterFullscreen = () => {
    if (targetRef.value) {
      if (targetRef.value.requestFullscreen) {
        targetRef.value.requestFullscreen();
      } else if (targetRef.value.mozRequestFullScreen) {
        // Firefox
        targetRef.value.mozRequestFullScreen();
      } else if (targetRef.value.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        targetRef.value.webkitRequestFullscreen();
      } else if (targetRef.value.msRequestFullscreen) {
        // IE/Edge
        targetRef.value.msRequestFullscreen();
      }
    }
  };

  // 退出全屏
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari, Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  };

  // 切换全屏
  const toggleFullscreen = () => {
    if (!isFullscreen.value) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  // 监听全屏状态变化
  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
