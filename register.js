/**
 * Registration Page Interactive Animation and User Creation
 * Provides mouse-tracking box animation and handles new user registration
 */

document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".register-box");
  if (!box) return;

  // Animation configuration
  const followStrength = 0.05; // How strongly box follows cursor (5% of distance)
  let maxOffset = Math.min(window.innerWidth, window.innerHeight) * 0.1; // Max movement limit

  // Animation state tracking
  const state = {
    mouseX: window.innerWidth / 2,   // Current mouse X position
    mouseY: window.innerHeight / 2,   // Current mouse Y position
    tx: 0,                            // Current box translation X
    ty: 0,                            // Current box translation Y
    targetX: 0,                       // Target translation X
    targetY: 0                        // Target translation Y
  };

  /**
   * Linear interpolation helper function
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  const lerp = (a, b, t) => a + (b - a) * t;

  /**
   * Calculates target position for the box based on mouse position
   * Box moves toward cursor but is clamped to maxOffset
   */
  function updateTarget() {
    // Get box center position
    const rect = box.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Calculate distance from mouse to box center
    const dx = state.mouseX - cx;
    const dy = state.mouseY - cy;

    // Calculate target position (fraction of distance)
    let targetX = dx * followStrength;
    let targetY = dy * followStrength;

    // Clamp to maximum offset to prevent excessive movement
    const mag = Math.hypot(targetX, targetY);
    if (mag > maxOffset) {
      const k = maxOffset / mag;
      targetX *= k;
      targetY *= k;
    }

    state.targetX = targetX;
    state.targetY = targetY;
  }

  /**
   * Animation loop - smoothly transitions box to target position
   * Uses requestAnimationFrame for 60fps animation
   */
  function animate() {
    updateTarget();
    // Smoothly interpolate current position toward target
    state.tx = lerp(state.tx, state.targetX, 0.15);
    state.ty = lerp(state.ty, state.targetY, 0.15);

    // Update CSS custom properties for transform
    box.style.setProperty("--tx", `${state.tx.toFixed(2)}px`);
    box.style.setProperty("--ty", `${state.ty.toFixed(2)}px`);

    requestAnimationFrame(animate);
  }

  // Track mouse movement
  window.addEventListener("mousemove", (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  }, { passive: true });

  // Reset to center when mouse leaves window
  window.addEventListener("mouseleave", () => {
    state.mouseX = window.innerWidth / 2;
    state.mouseY = window.innerHeight / 2;
  });

  // Recalculate max offset on window resize
  window.addEventListener("resize", () => {
    maxOffset = Math.min(window.innerWidth, window.innerHeight) * 0.06;
  });

  // Start animation loop
  animate();

  /**
   * Registration form submission handler
   * Creates new user account and redirects to login
   */
  document.getElementById("register-form").addEventListener("submit", function (e) {
      e.preventDefault();

      // Collect form data
      const form = e.target;
      const data = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
      };

      // Send registration request to API
      const xhr = new XMLHttpRequest();
      xhr.open("POST", ("http://63.179.18.244/api/create_user?username="+ data.username + "&password=" + data.password + "&email=" + data.email), true);

      xhr.responseType = "json";

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
          // Registration successful - redirect to login page
          window.location.href = "/login";
        } else {
          // Registration failed - show error message
          alert("Registration failed: " + xhr.response.detail);
          console.error("Registration failed:", xhr.status, xhr.response);
        }
      };
      
      xhr.send(null);
    });
});

/**
 * Retrieves a cookie value by name
 * @param {string} cname - Cookie name to retrieve
 * @returns {string} Cookie value or empty string if not found
 */
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}