export default {
  beforeMount(el, binding) {
    el.__clickOutside__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event); 
      }
    };
    document.addEventListener("click", el.__clickOutside__);
  },

  unmounted(el) {
    document.removeEventListener("click", el.__clickOutside__);
  },
};
