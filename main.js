document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initStatsCounter();
  initProfitCalculator();
  initTextRotator();
  initVMSlider();
  initDeliverySlider();
  initEmployeeSlider();
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta-btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.animate-reveal');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

function initTextRotator() {
  const rotator = document.getElementById('text-rotator');
  if (!rotator) return;

  const words = ["quality", "comfort", "unique designs"];
  let index = 0;

  setInterval(() => {
    rotator.classList.add('fade-out');

    setTimeout(() => {
      index = (index + 1) % words.length;
      rotator.textContent = words[index];
      rotator.classList.remove('fade-out');
    }, 400);
  }, 3000);
}

function initStatsCounter() {
  const statsSection = document.querySelector('.trust-stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (!statsSection || statNumbers.length === 0) return;

  let animated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animated) {
          animated = true;
          statNumbers.forEach(numEl => {
            animateSingleCounter(numEl);
          });
        }
      } else {
        animated = false;
        statNumbers.forEach(numEl => {
          numEl.textContent = "0";
        });
      }
    });
  }, { threshold: 0.1 });

  statsObserver.observe(statsSection);

  function animateSingleCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(easeProgress * target);

      element.textContent = formatNumberWithComma(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = formatNumberWithComma(target);
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

function initProfitCalculator() {
  const capitalSlider = document.getElementById('package-slider');
  const resellInput = document.getElementById('resell-price');
  
  const capitalDisplay = document.getElementById('current-capital-display');
  const pcsResult = document.getElementById('pcs-result');
  const profitResult = document.getElementById('profit-result');
  const roiResult = document.getElementById('roi-result');
  
  if (!capitalSlider || !resellInput) return;

  const COST_PER_PCS = 18000;

  function calculateProfit() {
    const capital = parseInt(capitalSlider.value, 10);
    const resellPrice = parseInt(resellInput.value, 10) || 20000;

    const pcs = Math.floor(capital / COST_PER_PCS);
    const revenue = pcs * resellPrice;
    const profit = revenue - capital;
    const roi = Math.round((profit / capital) * 100);

    capitalDisplay.textContent = formatRupiah(capital);
    pcsResult.textContent = `${formatNumberWithDot(pcs)} Pcs`;
    
    if (profit >= 0) {
      profitResult.textContent = formatRupiah(profit);
      profitResult.style.color = '#0d4826';
      roiResult.textContent = `+${roi}%`;
      roiResult.className = 'text-green';
    } else {
      profitResult.textContent = `-${formatRupiah(Math.abs(profit))}`;
      profitResult.style.color = '#e74c3c';
      roiResult.textContent = `${roi}%`;
      roiResult.className = '';
    }
  }

  capitalSlider.addEventListener('input', calculateProfit);
  resellInput.addEventListener('input', calculateProfit);
  
  calculateProfit();
}

function formatNumberWithDot(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatNumberWithComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatRupiah(amount) {
  return `Rp ${formatNumberWithDot(amount)}`;
}

function initVMSlider() {
  const track = document.getElementById('vm-slider-track');
  const prevBtn = document.getElementById('vm-prev-btn');
  const nextBtn = document.getElementById('vm-next-btn');
  const progressBar = document.getElementById('vm-progress-bar');

  if (!track) return;

  function updateSliderControls() {
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 5;
    }
    if (nextBtn) {
      nextBtn.disabled = scrollLeft >= maxScroll - 5;
    }

    if (progressBar && maxScroll > 0) {
      const percentage = Math.min((scrollLeft / maxScroll) * 100, 100);
      progressBar.style.width = `${percentage}%`;
    }
  }

  track.addEventListener('scroll', updateSliderControls);
  window.addEventListener('resize', updateSliderControls);
  
  updateSliderControls();
  setTimeout(updateSliderControls, 100);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const card = track.querySelector('.vm-card');
      const cardWidth = card ? card.offsetWidth : 350;
      const gap = 32;
      track.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const card = track.querySelector('.vm-card');
      const cardWidth = card ? card.offsetWidth : 350;
      const gap = 32;
      track.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
    });
  }

  let isDown = false;
  let startX;
  let scrollLeftState;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('active');
    startX = e.pageX - track.offsetLeft;
    scrollLeftState = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('active');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('active');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5; 
    track.scrollLeft = scrollLeftState - walk;
  });
}

function initDeliverySlider() {
  const container = document.getElementById('delivery-image-container');
  const prevBtn = document.getElementById('delivery-prev-btn');
  const nextBtn = document.getElementById('delivery-next-btn');

  if (!container || !prevBtn || !nextBtn) return;

  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = index;
    const translateAmount = currentSlide * -50;
    container.style.transform = `translateX(${translateAmount}%)`;
  }

  prevBtn.addEventListener('click', () => {
    const newSlide = currentSlide === 0 ? 1 : 0;
    showSlide(newSlide);
  });

  nextBtn.addEventListener('click', () => {
    const newSlide = currentSlide === 1 ? 0 : 1;
    showSlide(newSlide);
  });
}

function initEmployeeSlider() {
  const container = document.getElementById('ea-image-container');
  const prevBtn = document.getElementById('ea-prev-btn');
  const nextBtn = document.getElementById('ea-next-btn');

  if (!container || !prevBtn || !nextBtn) return;

  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = index;
    const translateAmount = currentSlide * -50;
    container.style.transform = `translateX(${translateAmount}%)`;
  }

  prevBtn.addEventListener('click', () => {
    const newSlide = currentSlide === 0 ? 1 : 0;
    showSlide(newSlide);
  });

  nextBtn.addEventListener('click', () => {
    const newSlide = currentSlide === 1 ? 0 : 1;
    showSlide(newSlide);
  });
}
