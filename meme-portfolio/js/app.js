// Elements
const grid = document.getElementById('memeGrid');
const modal = document.getElementById('memeModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.getElementById('modalClose');
const clickSound = document.getElementById('clickSound');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

// Load meme data
fetch('data/memes.json')
  .then(response => response.json())
  .then(memes => {
    memes.forEach(meme => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        ${meme.type === 'image' ? 
          `<img src="${meme.src}" alt="${meme.title}" onerror="this.onerror=null;this.src='assets/memes/default-meme.png';">` : 
          `<video src="${meme.src}" muted loop></video>`}
        <div>${meme.title}</div>
      `;
      
      // Auto-play video on hover
      if (meme.type === 'video') {
        const video = card.querySelector('video');
        card.addEventListener('mouseenter', () => video.play());
        card.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      }
      
      card.addEventListener('click', () => openModal(meme));
      grid.appendChild(card);
    });
  })
  .catch(error => console.error('Error loading memes:', error));

// Modal functions
function openModal(meme) {
  playSound();
  
  modalTitle.textContent = meme.title;
  modalContent.innerHTML = meme.type === 'image' ? 
    `<img src="${meme.src}" alt="${meme.title}" onerror="this.onerror=null;this.src='assets/memes/default-meme.png';">` : 
    `<video src="${meme.src}" controls autoplay></video>`;
  
  modal.classList.remove('hidden');
  overlay.classList.add('active');
}

function closeModal() {
  playSound();
  modal.classList.add('hidden');
  overlay.classList.remove('active');
  
  // Pause any playing video in modal
  const video = modalContent.querySelector('video');
  if (video) video.pause();
}

// Event listeners
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Sound effect
function playSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(e => console.log("Audio play prevented:", e));
}

// Draggable modal (mouse & touch)
let isDragging = false;
let startX, startY;

const header = modal.querySelector('.modal-header');

// Mouse events
header.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX - modal.offsetLeft;
  startY = e.clientY - modal.offsetTop;
  modal.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const newX = e.clientX - startX;
  const newY = e.clientY - startY;
  const maxX = window.innerWidth - modal.offsetWidth;
  const maxY = window.innerHeight - modal.offsetHeight;
  modal.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
  modal.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
});
document.addEventListener('mouseup', () => {
  isDragging = false;
  modal.style.cursor = 'default';
});

// Touch events for mobile
header.addEventListener('touchstart', e => {
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX - modal.offsetLeft;
  startY = touch.clientY - modal.offsetTop;
  modal.style.cursor = 'grabbing';
}, { passive: false });
document.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const newX = touch.clientX - startX;
  const newY = touch.clientY - startY;
  const maxX = window.innerWidth - modal.offsetWidth;
  const maxY = window.innerHeight - modal.offsetHeight;
  modal.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
  modal.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
}, { passive: false });
document.addEventListener('touchend', () => {
  isDragging = false;
  modal.style.cursor = 'default';
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});