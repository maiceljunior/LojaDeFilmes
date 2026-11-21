// O iPhone (Safari) ignora "user-scalable=no", então barramos o gesto de pinça aqui.
// O toque duplo já é barrado pelo touch-action do CSS.
export function blockZoomGestures() {
  const prevent = (e: Event) => e.preventDefault();
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 1) e.preventDefault();
  };

  document.addEventListener("gesturestart", prevent, { passive: false });
  document.addEventListener("gesturechange", prevent, { passive: false });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
}
