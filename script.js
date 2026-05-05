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
  
  // Check if we're on the artworks page
  const loginModal = document.getElementById('loginModal');
  if (!loginModal) {
    console.log('Not on artworks page, skipping auth');
    return;
  }

  console.log('Auth system initializing...');

  let userRole = 'guest';
  const ADMIN_PASSWORD = '0000';
  const savedRole = sessionStorage.getItem('userRole');
  
  // Get all elements
  const guestBtn = document.getElementById('guestBtn');
  const adminBtn = document.getElementById('adminBtn');
  const passwordSection = document.getElementById('passwordSection');
  const passwordInput = document.getElementById('passwordInput');
  const submitPasswordBtn = document.getElementById('submitPasswordBtn');
  const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
  const userInfo = document.getElementById('userInfo');
  const roleDisplay = document.getElementById('roleDisplay');
  const logoutBtn = document.getElementById('logoutBtn');
  const uploadBtn = document.getElementById('upload-btn');

  // Debug: log elements
  console.log('Elements found:', {
    loginModal: !!loginModal,
    guestBtn: !!guestBtn,
    adminBtn: !!adminBtn
  });

  function showMainContent() {
    loginModal.style.display = 'none';
    userInfo.style.display = 'flex';
    roleDisplay.textContent = userRole === 'admin' ? 'Admin' : 'Guest';
    
    if (userRole === 'admin') {
      uploadBtn.style.display = 'block';
    } else {
      uploadBtn.style.display = 'none';
    }
    console.log('Main content shown, role:', userRole);
  }

  // If already logged in, show main content
  if (savedRole) {
    console.log('Found saved role:', savedRole);
    userRole = savedRole;
    showMainContent();
  } else {
    console.log('No saved role, showing login modal');
    loginModal.style.display = 'flex';
  }

  // Guest button click handler
  if (guestBtn) {
    guestBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Guest clicked!');
      userRole = 'guest';
      sessionStorage.setItem('userRole', 'guest');
      showMainContent();
      return false;
    };
  }

  // Admin button click handler
  if (adminBtn) {
    adminBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Admin clicked!');
      passwordSection.classList.add('active');
      passwordInput.focus();
      return false;
    };
  }

  // Submit password
  if (submitPasswordBtn) {
    submitPasswordBtn.onclick = function(e) {
      e.preventDefault();
      const pwd = passwordInput.value;
      console.log('Password submitted:', pwd === ADMIN_PASSWORD ? 'CORRECT' : 'WRONG');
      
      if (pwd === ADMIN_PASSWORD) {
        userRole = 'admin';
        sessionStorage.setItem('userRole', 'admin');
        passwordSection.classList.remove('active');
        passwordInput.value = '';
        showMainContent();
      } else {
        alert('Incorrect password! Try: 0000');
        passwordInput.value = '';
        passwordInput.focus();
      }
      return false;
    };
  }

  // Cancel password
  if (cancelPasswordBtn) {
    cancelPasswordBtn.onclick = function(e) {
      e.preventDefault();
      passwordSection.classList.remove('active');
      passwordInput.value = '';
      return false;
    };
  }

  // Enter key in password
  if (passwordInput) {
    passwordInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        submitPasswordBtn.click();
      }
    };
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Logout clicked');
      sessionStorage.removeItem('userRole');
      userRole = 'guest';
      loginModal.style.display = 'flex';
      userInfo.style.display = 'none';
      uploadBtn.style.display = 'none';
      passwordInput.value = '';
      passwordSection.classList.remove('active');
      return false;
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
  const uploadBtn = document.getElementById('upload-btn');
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
    deleteBtn.style.top = '50px';
    deleteBtn.style.right = '10px';
    deleteBtn.style.background = 'rgba(255, 59, 48, 0.9)';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '50%';
    deleteBtn.style.width = '30px';
    deleteBtn.style.height = '30px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.display = userRole === 'admin' ? 'none' : 'none';
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
      if (userRole === 'admin') {
        deleteBtn.style.display = 'block';
      }
    });

    wrapper.addEventListener('mouseleave', function() {
      downloadBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
    });
  }

  // Add download functionality to existing images
  galleryImages.forEach((img, index) => {
    addDownloadFunctionality(img, index);
  });
});
