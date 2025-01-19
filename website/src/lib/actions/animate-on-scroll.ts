let lastAnimationTimestamp = 0;
const MINIMUM_ANIMATION_INTERVAL = 150; // Increased delay between animations

export function animateOnScroll(node: HTMLElement) {
  // Initially hide the element with a more noticeable transform
  node.style.opacity = '0';
  node.style.transform = 'translateY(10px)';
  node.style.visibility = 'hidden'; // Ensure it's completely hidden initially

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const now = Date.now();
        const timeSinceLastAnimation = now - lastAnimationTimestamp;
        const additionalDelay = Math.max(0, MINIMUM_ANIMATION_INTERVAL - timeSinceLastAnimation);

        setTimeout(() => {
          node.style.visibility = 'visible';
          node.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          lastAnimationTimestamp = Date.now();
        }, additionalDelay);

        observer.unobserve(node);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-50px' // Only trigger when element is well into view
  });

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    }
  };
}
