function createLightning() {
  const lightning = document.querySelector('.lightning');
  const bolt = document.createElement('div');
  bolt.className = 'bolt';
  bolt.style.left = Math.random() * 100 + '%';
  bolt.style.animationDelay = Math.random() + 's';
  lightning.appendChild(bolt);
  
  // Remove bolt after animation
  setTimeout(() => {
    bolt.remove();
  }, 1000);
}

// Create new lightning bolts periodically
setInterval(createLightning, 500); 