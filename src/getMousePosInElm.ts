export const getMousePosInElm = (elm: HTMLElement, e: MouseEvent) => {
  return {
    x: e.pageX - elm.getBoundingClientRect().left - window.scrollX,
    y: e.pageY - elm.getBoundingClientRect().top - window.scrollY,
  }
}
