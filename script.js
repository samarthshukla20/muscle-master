document.addEventListener('DOMContentLoaded', () => {

  // --- 0. FULLSCREEN VIDEO LOADER ---
  const pageLoader = document.getElementById('page-loader');
  const heroVideo = document.querySelector('.hero-bg-video');

  if (pageLoader && heroVideo) {
    const removeLoader = () => {
      setTimeout(() => {
        pageLoader.classList.add('hidden');
        setTimeout(() => pageLoader.remove(), 600); 
      }, 1000); // Shortened delay since we are now waiting for actual playback
    };

    // Check if the video is already actively playing from cache
    if (heroVideo.currentTime > 0 && !heroVideo.paused && !heroVideo.ended && heroVideo.readyState > 2) { 
      removeLoader();
    } else {
      // Wait for the video to actually start rendering moving frames
      heroVideo.addEventListener('playing', removeLoader);
      
      // Fallback: If mobile strict-autoplay policies block the video, hide loader after 5 seconds
      setTimeout(removeLoader, 5000); 
    }
  }
  
  // 1. Initialize AOS
  AOS.init({ once: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });

// 2. Mobile Menu Toggle (Cleaned up for Desktop)
  const oldHamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (oldHamburger && navLinks) {
    // Clone the button to destroy any conflicting ghost event listeners
    const hamburger = oldHamburger.cloneNode(true);
    oldHamburger.parentNode.replaceChild(hamburger, oldHamburger);

    // Toggle menu
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle('mobile-active');
      hamburger.classList.toggle('toggle');
      // Notice: Removed the inline style properties here!
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        hamburger.classList.remove('toggle');
      });
    });

    // Close menu if user taps the dark background
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('mobile-active')) {
        navLinks.classList.remove('mobile-active');
        hamburger.classList.remove('toggle');
      }
    });
  }

  // 3. Dynamic Lead Capture (Functional EmailJS Integration)
  const leadForm = document.getElementById('leadCaptureForm');
  const submitBtn = document.getElementById('submitBtn');

  if (typeof emailjs !== 'undefined') {
    emailjs.init('5ulKAM2Aw4kb1dbCi'); 
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      const serviceID = 'service_1vgh8ha'; 
      const templateID = 'template_235xkas';

      emailjs.sendForm(serviceID, templateID, leadForm)
        .then(() => {
          submitBtn.style.background = '#28a745'; 
          submitBtn.style.opacity = '1';
          submitBtn.innerText = 'Request Sent!';
          leadForm.reset();

          setTimeout(() => {
            submitBtn.style.background = ''; 
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
          }, 3000);
        })
        .catch((err) => {
          console.error('Failed to send email:', err);
          submitBtn.style.background = '#dc3545'; 
          submitBtn.style.opacity = '1';
          submitBtn.innerText = 'Error. Try Again.';
          submitBtn.disabled = false;

          setTimeout(() => {
            submitBtn.style.background = ''; 
            submitBtn.innerText = originalText;
          }, 3000);
        });
    });
  }

  // 4. Class Trial Booking Hooks
  const trialButtons = document.querySelectorAll('.book-trial-btn');
  trialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const className = e.target.getAttribute('data-class');
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      
      const interestSelect = document.querySelector('select[name="interest"]');
      if (interestSelect) {
        interestSelect.value = 'classes';
      }
    });
  });

// --- 5. SMART IMAGE LOADER & LIGHTBOX LOGIC ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  
  // Select BOTH gallery images and trainer images
  const allLazyImages = document.querySelectorAll('.gallery-img, .trainer-photo img'); 

  if (allLazyImages.length > 0) {
    allLazyImages.forEach(img => {
      
      // --- A. Loader Logic ---
      const revealImage = () => {
        img.classList.add('loaded');
        const loader = img.previousElementSibling;
        if (loader && loader.classList.contains('loader')) {
          loader.style.display = 'none';
        }
      };

      // Check if image loaded successfully
      if (img.complete && img.naturalHeight !== 0) {
        revealImage();
      } else {
        // Wait for it to download...
        img.addEventListener('load', revealImage);
        
        // IF THE IMAGE IS MISSING (404 Error)
        img.addEventListener('error', () => {
          // Grab the alt text (e.g., "Rahul Sharma" or "Muscle Master")
          const altText = img.alt || 'Gym';
          
          // Swap the broken src with a dynamically generated, premium avatar placeholder matching your color theme
          img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(altText)}&background=1a1a1a&color=FF6B35&size=500&font-size=0.33`;
          
          // Because we changed the src, the browser will try to download this new image, 
          // triggering the 'load' event above, and smoothly fading it in!
        });
      }

      // --- B. Lightbox Click Logic (Only apply to gallery images) ---
      if (lightbox && img.classList.contains('gallery-img')) {
        img.addEventListener('click', (e) => {
          lightbox.style.display = 'block';
          lightboxImg.src = e.target.src;
          document.body.style.overflow = 'hidden'; 
        });
      }
    });
  }

  // Lightbox Close Logic
  if (lightbox && closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto'; 
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // --- 6. BMI CALCULATOR LOGIC ---
  const bmiForm = document.getElementById('bmiForm');
  const bmiScore = document.getElementById('bmiScore');
  const bmiStatus = document.getElementById('bmiStatus');
  const bmiAdvice = document.getElementById('bmiAdvice');
  const bmiCtaBtn = document.getElementById('bmiCtaBtn');

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const heightCm = parseFloat(document.getElementById('bmiHeight').value);
      const weightKg = parseFloat(document.getElementById('bmiWeight').value);
      
      if (heightCm > 0 && weightKg > 0) {
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);
        
        bmiScore.innerText = bmi;
        
        let status = '';
        let advice = '';
        let color = '';
        let ctaText = '';
        let ctaLink = '';

        if (bmi < 18.5) {
          status = 'Underweight';
          advice = 'You might need to build some muscle mass. Check out our Elite plan for a custom meal and workout guide!';
          color = '#3498db'; 
          ctaText = 'View Elite Plan';
          ctaLink = '#membership';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
          status = 'Normal Weight';
          advice = 'Great job! Maintain your fitness with our unlimited group classes and daily gym access.';
          color = '#2ecc71'; 
          ctaText = 'Explore Classes';
          ctaLink = '#classes';
        } else if (bmi >= 25 && bmi <= 29.9) {
          status = 'Overweight';
          advice = 'A mix of our HIIT classes and strength training will help you hit your goals in no time.';
          color = '#f39c12'; 
          ctaText = 'Book a Free Trial';
          ctaLink = '#classes';
        } else {
          status = 'Obese';
          advice = 'Our personal trainers are ready to create a safe, effective, and custom transformation plan just for you.';
          color = '#e74c3c'; 
          ctaText = 'View Elite Plan';
          ctaLink = '#membership';
        }
        
        bmiStatus.innerText = status;
        bmiStatus.style.color = color;
        bmiScore.style.color = color;
        bmiAdvice.innerText = advice;

        bmiCtaBtn.innerText = ctaText;
        bmiCtaBtn.href = ctaLink;
        bmiCtaBtn.style.display = 'inline-block';
        
        bmiCtaBtn.animate([
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 400, fill: 'forwards' });
      }
    });
  }

// --- 7. BULLETPROOF SMOOTH SCROLLING ---
  // Select all links that have a hashtag (anchor links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Stop the browser from instantly jumping
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      // Ignore if it's just a dead link
      if (targetId === '#') return; 
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Find out exactly how tall your navigation bar is dynamically
        const navHeight = document.getElementById('navbar').offsetHeight;
        
        // Calculate the perfect scroll position (Target element position minus the navbar height)
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        // Command the browser to scroll smoothly to that exact pixel
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});