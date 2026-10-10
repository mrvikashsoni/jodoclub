// Jodo Club & Jodo Library Interactive Application Logic
document.addEventListener('DOMContentLoaded', () => {
  initPersonaSwitcher();
  initSeatMapDemo();
  initLeaderboardFilter();
  initModals();
  initSmoothScroll();
});

/* -------------------------------------------------------------
   1. Persona View Switcher
------------------------------------------------------------- */
function initPersonaSwitcher() {
  const personaButtons = document.querySelectorAll('.persona-btn');
  const studentSection = document.getElementById('student-features');
  const ownerSection = document.getElementById('owner-features');
  const vcSection = document.getElementById('vc-investment-thesis');

  personaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      personaButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetPersona = btn.getAttribute('data-persona');

      if (targetPersona === 'all') {
        if (studentSection) studentSection.style.display = 'block';
        if (ownerSection) ownerSection.style.display = 'block';
        if (vcSection) vcSection.style.display = 'block';
      } else if (targetPersona === 'student') {
        if (studentSection) {
          studentSection.style.display = 'block';
          studentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (targetPersona === 'owner') {
        if (ownerSection) {
          ownerSection.style.display = 'block';
          ownerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (targetPersona === 'vc') {
        if (vcSection) {
          vcSection.style.display = 'block';
          vcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* -------------------------------------------------------------
   2. Interactive Movie-Style Seat Map Simulator
------------------------------------------------------------- */
function initSeatMapDemo() {
  const seatsGrid = document.getElementById('interactive-seats-grid');
  const shiftChips = document.querySelectorAll('.shift-chip');
  const selectedSeatNameEl = document.getElementById('summary-seat-name');
  const selectedShiftNameEl = document.getElementById('summary-shift-name');
  const basePriceEl = document.getElementById('summary-base-price');
  const discountValEl = document.getElementById('summary-discount-val');
  const totalPriceEl = document.getElementById('summary-total-price');
  const attendanceSlider = document.getElementById('attendance-slider');
  const attendanceDaysEl = document.getElementById('attendance-days-val');
  const attendanceDiscountPill = document.getElementById('attendance-discount-pct');
  const resellCalcBtn = document.getElementById('btn-simulate-resale');
  const resaleResultBox = document.getElementById('resale-result-box');

  if (!seatsGrid) return;

  // Define 24 sample seats with realistic attributes
  const seatData = [
    { id: 'A1', type: 'Corner Quiet', baseMultiplier: 1.05, status: 'occupied' },
    { id: 'A2', type: 'Near AC Vent', baseMultiplier: 1.1, status: 'available' },
    { id: 'A3', type: 'Charging Point', baseMultiplier: 1.0, status: 'available' },
    { id: 'A4', type: 'Window View', baseMultiplier: 1.15, status: 'available' },
    { id: 'A5', type: 'Charging Point', baseMultiplier: 1.0, status: 'occupied' },
    { id: 'A6', type: 'Corner Quiet', baseMultiplier: 1.05, status: 'available' },

    { id: 'B1', type: 'Silent Pod', baseMultiplier: 1.1, status: 'available' },
    { id: 'B2', type: 'Standard', baseMultiplier: 1.0, status: 'occupied' },
    { id: 'B3', type: 'Charging Point', baseMultiplier: 1.0, status: 'available' },
    { id: 'B4', type: 'Near AC Vent', baseMultiplier: 1.1, status: 'available' },
    { id: 'B5', type: 'Standard', baseMultiplier: 1.0, status: 'available' },
    { id: 'B6', type: 'Window View', baseMultiplier: 1.15, status: 'available' },

    { id: 'C1', type: 'Corner Quiet', baseMultiplier: 1.05, status: 'available' },
    { id: 'C2', type: 'Charging Point', baseMultiplier: 1.0, status: 'available' },
    { id: 'C3', type: 'Silent Pod', baseMultiplier: 1.15, status: 'available' },
    { id: 'C4', type: 'Standard', baseMultiplier: 1.0, status: 'occupied' },
    { id: 'C5', type: 'Near AC Vent', baseMultiplier: 1.1, status: 'available' },
    { id: 'C6', type: 'Charging Point', baseMultiplier: 1.0, status: 'available' },

    { id: 'D1', type: 'Window View', baseMultiplier: 1.15, status: 'available' },
    { id: 'D2', type: 'Standard', baseMultiplier: 1.0, status: 'available' },
    { id: 'D3', type: 'Charging Point', baseMultiplier: 1.0, status: 'occupied' },
    { id: 'D4', type: 'Near AC Vent', baseMultiplier: 1.1, status: 'available' },
    { id: 'D5', type: 'Silent Pod', baseMultiplier: 1.15, status: 'available' },
    { id: 'D6', type: 'Corner Quiet', baseMultiplier: 1.05, status: 'available' }
  ];

  // Shift pricing rates (Patna average benchmark ₹500 - ₹1200)
  const shiftRates = {
    'morning': { name: 'Morning (6 AM - 12 PM)', price: 600 },
    'afternoon': { name: 'Afternoon (12 PM - 6 PM)', price: 550 },
    'evening': { name: 'Evening (6 PM - 11 PM)', price: 650 },
    'night': { name: 'Night Owl (11 PM - 6 AM)', price: 500 },
    'fullday': { name: 'Full-Day 24x7 Unlimited', price: 1100 }
  };

  let currentShift = 'morning';
  let selectedSeat = seatData.find(s => s.id === 'A4'); // Default select Window Seat A4

  // Render seats
  function renderSeats() {
    seatsGrid.innerHTML = '';
    seatData.forEach(seat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `seat-button ${seat.status}`;
      if (selectedSeat && selectedSeat.id === seat.id) {
        btn.classList.add('selected');
      }

      btn.innerHTML = `
        <span>${seat.id}</span>
        <span class="seat-sub">${seat.type.split(' ')[0]}</span>
      `;

      if (seat.status !== 'occupied') {
        btn.addEventListener('click', () => {
          selectedSeat = seat;
          updateCheckout();
          renderSeats();
        });
      }

      seatsGrid.appendChild(btn);
    });
  }

  // Update calculation
  function updateCheckout() {
    if (!selectedSeat) return;

    const shiftInfo = shiftRates[currentShift];
    const base = Math.round(shiftInfo.price * selectedSeat.baseMultiplier);
    
    // Attendance discount calculation:
    // Slider: 0 to 30 days.
    // If attended >= 20 days, get up to 20% discount. 25+ days = 25% discount.
    const daysAttended = parseInt(attendanceSlider.value, 10);
    let discountPct = 0;
    if (daysAttended >= 25) discountPct = 25;
    else if (daysAttended >= 20) discountPct = 18;
    else if (daysAttended >= 15) discountPct = 10;
    else if (daysAttended >= 10) discountPct = 5;

    const discountAmount = Math.round((base * discountPct) / 100);
    const finalTotal = base - discountAmount;

    // DOM update
    selectedSeatNameEl.textContent = `Seat ${selectedSeat.id} (${selectedSeat.type})`;
    selectedShiftNameEl.textContent = shiftInfo.name;
    basePriceEl.textContent = `₹${base}`;
    discountValEl.textContent = `-₹${discountAmount} (${discountPct}%)`;
    totalPriceEl.textContent = `₹${finalTotal}/mo`;

    attendanceDaysEl.textContent = `${daysAttended} Days`;
    attendanceDiscountPill.textContent = `${discountPct}% Discount Applied`;
  }

  // Handle Shift Selection
  shiftChips.forEach(chip => {
    chip.addEventListener('click', () => {
      shiftChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      currentShift = chip.getAttribute('data-shift');
      updateCheckout();
    });
  });

  // Handle Attendance Slider
  if (attendanceSlider) {
    attendanceSlider.addEventListener('input', () => {
      updateCheckout();
    });
  }

  // Handle Sell My Seat Resale Simulation
  if (resellCalcBtn && resaleResultBox) {
    resellCalcBtn.addEventListener('click', () => {
      const daysGone = 6; // Exam travel or home visit
      const perDayRate = Math.round(shiftRates[currentShift].price / 30);
      const earnings = Math.round(daysGone * perDayRate * 0.85); // 85% returned to student

      resaleResultBox.style.display = 'block';
      resaleResultBox.innerHTML = `
        <div style="font-weight: 700; color: #10b981; margin-bottom: 4px;">🎉 Seat Listed for Re-rental!</div>
        <div>Agar aap <strong>6 din</strong> exam travel ke liye ghar jaate hain, aapki vacant seat automatically book hokar aapko <strong>₹${earnings} cashback</strong> degi! Paisa waste nahi hoga!</div>
      `;
    });
  }

  // Initial render
  renderSeats();
  updateCheckout();
}

/* -------------------------------------------------------------
   3. Competitor Insights & Leaderboard
------------------------------------------------------------- */
function initLeaderboardFilter() {
  const examFilter = document.getElementById('exam-leaderboard-filter');
  const lbContainer = document.getElementById('leaderboard-dynamic-rows');

  if (!examFilter || !lbContainer) return;

  const mockLeaderboards = {
    'BPSC': [
      { rank: 1, name: 'Aman Kumar', badge: 'gold', exam: 'BPSC 71st CCE', library: 'Patliputra Study Hub, Boring Rd', hours: '11.4 hrs/day', streak: '🔥 48 Day Streak' },
      { rank: 2, name: 'Priya Kumari', badge: 'silver', exam: 'BPSC 71st CCE', library: 'Sankalp Library, Kankarbagh', hours: '10.8 hrs/day', streak: '🔥 39 Day Streak' },
      { rank: 3, name: 'Rohit Raj', badge: 'bronze', exam: 'BPSC 71st CCE', library: 'Vision Point, Musallahpur', hours: '10.2 hrs/day', streak: '🔥 31 Day Streak' },
      { rank: 14, name: 'Aap (Your Rank)', badge: 'user', exam: 'BPSC 71st CCE', library: 'Jodo Verified Study Space', hours: '8.5 hrs/day', streak: '🔥 14 Day Streak' }
    ],
    'UPSC': [
      { rank: 1, name: 'Shubham Verma', badge: 'gold', exam: 'UPSC CSE 2026', library: 'Chanakya Reading Room, Boring Rd', hours: '12.1 hrs/day', streak: '🔥 62 Day Streak' },
      { rank: 2, name: 'Sneha Singh', badge: 'silver', exam: 'UPSC CSE 2026', library: 'Quiet Zone, Bailey Road', hours: '11.5 hrs/day', streak: '🔥 45 Day Streak' },
      { rank: 3, name: 'Aditya Raj', badge: 'bronze', exam: 'UPSC CSE 2026', library: 'IAS Aspirants Pod, Kankarbagh', hours: '10.9 hrs/day', streak: '🔥 28 Day Streak' },
      { rank: 8, name: 'Aap (Your Rank)', badge: 'user', exam: 'UPSC CSE 2026', library: 'Jodo Verified Study Space', hours: '9.2 hrs/day', streak: '🔥 19 Day Streak' }
    ],
    'SSC': [
      { rank: 1, name: 'Vikram Paswan', badge: 'gold', exam: 'SSC CGL 2026', library: 'Pragya Library, Musallahpur Haat', hours: '11.8 hrs/day', streak: '🔥 54 Day Streak' },
      { rank: 2, name: 'Ravi Teja', badge: 'silver', exam: 'SSC CGL 2026', library: 'Target Point, Bhikhana Pahari', hours: '11.0 hrs/day', streak: '🔥 42 Day Streak' },
      { rank: 3, name: 'Alok Ranjan', badge: 'bronze', exam: 'SSC CGL 2026', library: 'Success Hub, Bazar Samiti', hours: '10.4 hrs/day', streak: '🔥 36 Day Streak' },
      { rank: 19, name: 'Aap (Your Rank)', badge: 'user', exam: 'SSC CGL 2026', library: 'Jodo Verified Study Space', hours: '8.1 hrs/day', streak: '🔥 11 Day Streak' }
    ]
  };

  function renderLeaderboard(examKey) {
    const list = mockLeaderboards[examKey] || mockLeaderboards['BPSC'];
    lbContainer.innerHTML = '';

    list.forEach(item => {
      const row = document.createElement('div');
      row.className = `lb-row ${item.badge === 'user' ? 'highlight-user' : ''}`;

      let badgeHtml = '';
      if (item.badge === 'gold') badgeHtml = `<div class="rank-badge gold">1</div>`;
      else if (item.badge === 'silver') badgeHtml = `<div class="rank-badge silver">2</div>`;
      else if (item.badge === 'bronze') badgeHtml = `<div class="rank-badge bronze">3</div>`;
      else badgeHtml = `<div class="rank-badge" style="background:#2563eb; color:#fff;">${item.rank}</div>`;

      row.innerHTML = `
        <div class="lb-left">
          ${badgeHtml}
          <div class="lb-avatar">${item.name.charAt(0)}</div>
          <div class="lb-info">
            <div class="lb-name">${item.name}</div>
            <div class="lb-sub">${item.library} • ${item.exam}</div>
          </div>
        </div>
        <div class="lb-right">
          <div class="lb-hours">${item.hours}</div>
          <div class="lb-streak">${item.streak}</div>
        </div>
      `;

      lbContainer.appendChild(row);
    });
  }

  examFilter.addEventListener('change', (e) => {
    renderLeaderboard(e.target.value);
  });

  renderLeaderboard('BPSC');
}

/* -------------------------------------------------------------
   4. Modals & Dialog Handling (HTML5 <dialog>)
------------------------------------------------------------- */
function initModals() {
  const earlyAccessModal = document.getElementById('early-access-modal');
  const vcModal = document.getElementById('vc-modal');
  const ownerModal = document.getElementById('owner-modal');

  // Trigger buttons
  document.querySelectorAll('[data-open-modal="early-access"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (earlyAccessModal) earlyAccessModal.showModal();
    });
  });

  document.querySelectorAll('[data-open-modal="vc-deck"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (vcModal) vcModal.showModal();
    });
  });

  document.querySelectorAll('[data-open-modal="owner-lms"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (ownerModal) ownerModal.showModal();
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) modal.close();
    });
  });

  // Light dismiss by clicking outside modal backdrop
  [earlyAccessModal, vcModal, ownerModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  });

  // Form submit handles
  const forms = document.querySelectorAll('form[data-ajax-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentModal = form.closest('dialog');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Dhanyawad! Aapki request successfully submit ho gayi hai. Jodo Team aapse turant connect karegi.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
        if (parentModal) parentModal.close();
      }, 700);
    });
  });
}

/* -------------------------------------------------------------
   5. Smooth Scroll Navigation
------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.startsWith('#!')) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
