// Highlight active page link with gradient + glowing underline animation
const currentPage = location.pathname.split("/").pop();
document.querySelectorAll(".nav a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.style.pointerEvents = "none";
    link.style.position = "relative";
    link.style.color = "white";
    link.style.background = "linear-gradient(135deg, var(--blue-4), var(--blue-5))";
    link.style.boxShadow = "0 0 10px rgba(0, 150, 255, 0.6)";
    link.style.overflow = "hidden";

    const underline = document.createElement("span");
    underline.style.position = "absolute";
    underline.style.bottom = "4px";
    underline.style.left = "20%";
    underline.style.width = "60%";
    underline.style.height = "3px";
    underline.style.borderRadius = "2px";
    underline.style.backgroundColor = "white";
    underline.style.boxShadow = "0 0 6px rgba(255, 255, 255, 0.8)";
    underline.style.transform = "scaleX(0)";
    underline.style.transformOrigin = "center";
    underline.style.transition = "transform 0.4s ease-out";
    link.appendChild(underline);

    // Trigger animation after append
    requestAnimationFrame(() => {
      underline.style.transform = "scaleX(1)";
    });
  }
});

// Image zoom modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // ===== Authentication System =====
  
  const authModal = document.getElementById('authModal');
  const loginModal = document.getElementById('loginModal');
  let userRole = 'guest';
  const ADMIN_PASSWORD = '0000';
  const savedRole = sessionStorage.getItem('userRole');

  if (authModal) {
    const guestBtn = document.getElementById('guestAuthBtn');
    const adminBtn = document.getElementById('adminAuthBtn');
    const passwordPrompt = document.getElementById('passwordPrompt');
    const passwordInput = document.getElementById('authPassword');
    const confirmPasswordBtn = document.getElementById('confirmPasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const userBadge = document.getElementById('userBadge');
    const roleText = document.getElementById('roleText');
    const logoutBtn = document.getElementById('logoutBtn');

    function showUserView() {
      authModal.classList.add('hidden');
      userBadge.classList.add('show');
      roleText.textContent = userRole === 'admin' ? 'Admin' : 'Guest';
      passwordPrompt.classList.remove('show');
      passwordInput.value = '';
    }

    function showAuthView() {
      authModal.classList.remove('hidden');
      userBadge.classList.remove('show');
      passwordPrompt.classList.remove('show');
      passwordInput.value = '';
    }

    if (savedRole) {
      userRole = savedRole;
      showUserView();
    } else {
      showAuthView();
    }

    guestBtn.onclick = function(e) {
      e.preventDefault();
      userRole = 'guest';
      sessionStorage.setItem('userRole', 'guest');
      showUserView();
      return false;
    };

    adminBtn.onclick = function(e) {
      e.preventDefault();
      passwordPrompt.classList.add('show');
      passwordInput.focus();
      return false;
    };

    confirmPasswordBtn.onclick = function(e) {
      e.preventDefault();
      if (passwordInput.value === ADMIN_PASSWORD) {
        userRole = 'admin';
        sessionStorage.setItem('userRole', 'admin');
        showUserView();
      } else {
        alert('Incorrect password. Use 0000 for admin.');
        passwordInput.value = '';
        passwordInput.focus();
      }
      return false;
    };

    cancelPasswordBtn.onclick = function(e) {
      e.preventDefault();
      passwordPrompt.classList.remove('show');
      passwordInput.value = '';
      return false;
    };

    passwordInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        confirmPasswordBtn.click();
      }
    };

    logoutBtn.onclick = function(e) {
      e.preventDefault();
      sessionStorage.removeItem('userRole');
      userRole = 'guest';
      showAuthView();
      return false;
    };
  }

  // ===== Artworks Page Specific =====
  const userInfo = document.getElementById('userInfo');
  const roleDisplay = document.getElementById('roleDisplay');
  const logoutBtnArtworks = document.getElementById('logoutBtn');
  const uploadBtn = document.getElementById('upload-btn');

  if (userInfo && roleDisplay && logoutBtnArtworks) {
    if (savedRole) {
      userInfo.style.display = 'flex';
      roleDisplay.textContent = userRole === 'admin' ? 'Admin' : 'Guest';
    }
    if (uploadBtn) {
      uploadBtn.style.display = userRole === 'admin' ? 'block' : 'none';
    }

    logoutBtnArtworks.onclick = function() {
      sessionStorage.removeItem('userRole');
      userRole = 'guest';
      location.reload(); // Reload to update all button visibilities
    };
  }

  // ===== Image Zoom & Gallery Functionality =====
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.close');
  const gallery = document.querySelector('.gallery');

  let scale = 1;
  let isDragging = false;
  let startX, startY, initialX, initialY;

  // Function to add zoom functionality to an image
  function addZoomFunctionality(img) {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      resetZoom();
    });
  }

  // Add zoom functionality to existing images
  const galleryImages = document.querySelectorAll('.gallery img');
  galleryImages.forEach(addZoomFunctionality);

  // Close modal
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    resetZoom();
  });

  // Close modal when clicking outside image
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      resetZoom();
    }
  });

  // Zoom functionality with mouse wheel
  modalImg.addEventListener('wheel', function(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= zoomFactor;
    scale = Math.max(0.5, Math.min(3, scale)); // Limit zoom between 0.5x and 3x
    updateZoom();
  });

  // Pan functionality
  let panX = 0, panY = 0;
  
  modalImg.addEventListener('mousedown', function(e) {
    if (scale > 1) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      modalImg.classList.add('dragging');
    }
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panX += dx;
      panY += dy;
      startX = e.clientX;
      startY = e.clientY;
      updateZoom();
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    modalImg.classList.remove('dragging');
  });

  function updateZoom() {
    modalImg.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;
    if (scale > 1) {
      modalImg.classList.add('zoomed');
    } else {
      modalImg.classList.remove('zoomed');
    }
  }

  function resetZoom() {
    scale = 1;
    panX = 0;
    panY = 0;
    modalImg.style.transform = 'translate(-50%, -50%) scale(1)';
    modalImg.classList.remove('zoomed', 'dragging');
  }

  // Upload functionality
  const uploadInput = document.getElementById('upload-input');

  uploadBtn.addEventListener('click', function() {
    uploadInput.click();
  });

  uploadInput.addEventListener('change', function(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.alt = file.name;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.maxHeight = '400px';
          img.style.borderRadius = '8px';
          img.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.15)';
          img.style.cursor = 'pointer';

          // Add zoom functionality to new image
          addZoomFunctionality(img);

          gallery.appendChild(img);

          // Add download functionality to new image
          addDownloadFunctionality(img, gallery.children.length - 1);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Function to add download functionality to an image
  function addDownloadFunctionality(img, index) {
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '⬇️';
    downloadBtn.className = 'download-btn';
    downloadBtn.style.position = 'absolute';
    downloadBtn.style.top = '10px';
    downloadBtn.style.right = '10px';
    downloadBtn.style.background = 'rgba(0, 0, 0, 0.7)';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '50%';
    downloadBtn.style.width = '30px';
    downloadBtn.style.height = '30px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.display = 'none';
    downloadBtn.style.zIndex = '10';

    downloadBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const link = document.createElement('a');
      link.href = img.src;
      link.download = img.alt || `artwork-${index}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Create delete button for admin
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.position = 'absolute';
    deleteBtn.style.top = '10px';
    deleteBtn.style.right = '50px';
    deleteBtn.style.background = 'rgba(255, 59, 48, 0.9)';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '50%';
    deleteBtn.style.width = '30px';
    deleteBtn.style.height = '30px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.display = userRole === 'admin' ? 'block' : 'none';
    deleteBtn.style.zIndex = '10';

    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this image?')) {
        wrapper.remove();
      }
    });

    // Create wrapper for relative positioning
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(downloadBtn);
    wrapper.appendChild(deleteBtn);

    // Show buttons on hover
    wrapper.addEventListener('mouseenter', function() {
      downloadBtn.style.display = 'block';
    });

    wrapper.addEventListener('mouseleave', function() {
      downloadBtn.style.display = 'none';
    });
  }

  // Add download functionality to existing images
  galleryImages.forEach((img, index) => {
    addDownloadFunctionality(img, index);
  });
});
