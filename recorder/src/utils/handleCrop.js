export const updateCropConfig = (dom) => {
  if (!dom) {
    return null;
  }
  const { left, top, width, height } = dom.getBoundingClientRect();
  console.log("top", top);
  const navHeight = window.outerHeight - window.innerHeight;
  const config = { startX: left, startY: top + navHeight, width, height };
  console.log("crop参数更新", config);
  return config;
};
/**
 * 观测dom的变化，一旦改变执行回调
 */
export const domObserver = (selector, callback) => {
  const dom = document.querySelector(selector);
  if (!dom) {
    return;
  }
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("Element is intersecting with viewport");
        callback && callback();
      } else {
        console.log("Element is not intersecting with viewport");
      }
    });
  });
  intersectionObserver.observe(dom);

  // ResizeObserver to detect size changes of the element
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      console.log("Element size changed:", entry.contentRect);
      callback && callback();
    }
  });
  resizeObserver.observe(dom);

  // MutationObserver to detect attribute changes of the element
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "style") {
        console.log("Element style attribute changed:", target.style.cssText);
        callback && callback();
      }
    });
  });
  mutationObserver.observe(dom, { attributes: true });
};
