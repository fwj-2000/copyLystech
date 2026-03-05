export function handleUnpack(bomContent?: HTMLElement | null, _mainContent?: HTMLElement | null, isPack?: boolean) {
  if (!bomContent) return !isPack;

  bomContent.style.transition = 'flex-basis 0.5s';
  bomContent.style.flex = isPack ? `0 0 10px` : `0 0 280px`;

  return !isPack;
}

export function registerMouseEvent(state, divider, container, bomContent, mainContent) {
  const dividerEl = divider?.value as HTMLElement | null;
  if (!dividerEl) return () => void 0;

  let isDragging = false;
  let rafId = 0;
  let containerLeft = 0;
  let pendingClientX = 0;

  const applyDrag = () => {
    rafId = 0;
    if (!isDragging) return;
    const bomEl = bomContent?.value as HTMLElement | null;
    const mainEl = mainContent?.value as HTMLElement | null;
    if (!bomEl || !mainEl) return;

    const offsetX = pendingClientX - containerLeft;
    bomEl.style.transition = 'none';
    bomEl.style.flex = `0 0 ${offsetX}px`;
    mainEl.style.flex = `1 1 auto`;

    if (state?.isPack && 'value' in state.isPack) {
      state.isPack.value = offsetX >= 140;
    } else if (state) {
      state.isPack = offsetX >= 140;
    }
  };

  const onMouseDown = () => {
    const containerEl = container?.value as HTMLElement | null;
    if (!containerEl) return;

    const containerRect = containerEl.getBoundingClientRect();
    containerLeft = containerRect.left;

    isDragging = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    pendingClientX = e.clientX;
    if (rafId) return;
    rafId = window.requestAnimationFrame(applyDrag);
  };

  const onMouseUp = () => {
    isDragging = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = 'default';
  };

  dividerEl.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  return () => {
    dividerEl.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    isDragging = false;
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = 'default';
  };
}
