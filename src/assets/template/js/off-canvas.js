const initOffCanvas = () => {
  'use strict';
  $(function() {
    $('[data-toggle="offcanvas"]').on("click", function() {
      $('.sidebar-offcanvas').toggleClass('active')
    });
  });
};

//export default initOffCanvas;
initOffCanvas();