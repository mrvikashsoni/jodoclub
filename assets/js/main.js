// JodoClub: The AI-Powered Operating System for Modern Libraries & Study Hubs
document.addEventListener('DOMContentLoaded', () => {
  initHeroSplitMockup();
  initStudentSeatSimulator();
  initOwnerBranchDashboard();
  initDevApiTabs();
  initWhatsAppAiSimulator();
  initModals();
  initSmoothScroll();
});

/* -------------------------------------------------------------
   1. HERO SPLIT UI: Real-Time Seat Matrix + AI Study Copilot
------------------------------------------------------------- */
function initHeroSplitMockup() {
  const seatGridEl = document.getElementById('hero-live-seat-grid');
  const shiftBtns = document.querySelectorAll('.hero-shift-btn');
  const aiSeatOutput = document.getElementById('hero-ai-seat-target');
  const aiPredictedScore = document.getElementById('hero-ai-score');
  const aiStreakEl = document.getElementById('hero-ai-streak');
  const aiMsgContent = document.getElementById('hero-ai-msg-text');
  const occupancyStatEl = document.getElementById('hero-occupancy-stat');

  if (!seatGridEl) return;

  const mockShiftSeats = {
    'morning': [
      { id: 'S1', type: 'Quiet Corner', status: 'selected', aiRecommended: true },
      { id: 'S2', type: 'AC Vent', status: 'occupied' },
      { id: 'S3', type: 'Power Desk', status: 'available' },
      { id: 'S4', type: 'Window Pod', status: 'available' },
      { id: 'S5', type: 'Quiet Corner', status: 'occupied' },
      { id: 'S6', type: 'Power Desk', status: 'available' },
      { id: 'S7', type: 'Window Pod', status: 'vacant-resale' },
      { id: 'S8', type: 'AC Vent', status: 'available' },
      { id: 'S9', type: 'Power Desk', status: 'occupied' },
      { id: 'S10', type: 'Quiet Corner', status: 'available' },
      { id: 'S11', type: 'Standard', status: 'occupied' },
      { id: 'S12', type: 'Window Pod', status: 'available' }
    ],
    'evening': [
      { id: 'S1', type: 'Quiet Corner', status: 'occupied' },
      { id: 'S2', type: 'AC Vent', status: 'occupied' },
      { id: 'S3', type: 'Power Desk', status: 'available' },
      { id: 'S4', type: 'Window Pod', status: 'selected', aiRecommended: true },
      { id: 'S5', type: 'Quiet Corner', status: 'vacant-resale' },
      { id: 'S6', type: 'Power Desk', status: 'available' },
      { id: 'S7', type: 'Window Pod', status: 'occupied' },
      { id: 'S8', type: 'AC Vent', status: 'available' },
      { id: 'S9', type: 'Power Desk', status: 'occupied' },
      { id: 'S10', type: 'Quiet Corner', status: 'occupied' },
      { id: 'S11', type: 'Standard', status: 'available' },
      { id: 'S12', type: 'Window Pod', status: 'available' }
    ],
    'night': [
      { id: 'S1', type: 'Quiet Corner', status: 'available' },
      { id: 'S2', type: 'AC Vent', status: 'available' },
      { id: 'S3', type: 'Power Desk', status: 'selected', aiRecommended: true },
      { id: 'S4', type: 'Window Pod', status: 'available' },
      { id: 'S5', type: 'Quiet Corner', status: 'available' },
      { id: 'S6', type: 'Power Desk', status: 'occupied' },
      { id: 'S7', type: 'Window Pod', status: 'available' },
      { id: 'S8', type: 'AC Vent', status: 'available' },
      { id: 'S9', type: 'Power Desk', status: 'available' },
      { id: 'S10', type: 'Quiet Corner', status: 'available' },
      { id: 'S11', type: 'Standard', status: 'available' },
      { id: 'S12', type: 'Window Pod', status: 'vacant-resale' }
    ]
  };

  let activeShift = 'morning';

  function renderHeroSeats() {
    seatGridEl.innerHTML = '';
    const currentSeats = mockShiftSeats[activeShift];

    let occupiedCount = 0;
    currentSeats.forEach(seat => {
      if (seat.status === 'occupied') occupiedCount++;

      const cell = document.createElement('div');
      cell.className = `hero-seat-cell ${seat.status}`;
      cell.innerHTML = `
        <span>${seat.id}</span>
        <span class="sub">${seat.type.split(' ')[0]}</span>
      `;

      if (seat.status !== 'occupied') {
        cell.addEventListener('click', () => {
          currentSeats.forEach(s => {
            if (s.status === 'selected') s.status = 'available';
          });
          seat.status = 'selected';
          renderHeroSeats();
          updateHeroAiWidget(seat);
        });
      }

      seatGridEl.appendChild(cell);
    });

    const total = currentSeats.length;
    const occPct = Math.round((occupiedCount / total) * 100);
    if (occupancyStatEl) {
      occupancyStatEl.textContent = `${occPct}% Occupancy • ${total - occupiedCount} Seats Open`;
    }
  }

  function updateHeroAiWidget(seat) {
    if (aiSeatOutput) aiSeatOutput.textContent = `Assigned: ${seat.id} (${seat.type})`;
    if (aiPredictedScore) aiPredictedScore.textContent = `${88 + Math.floor(Math.random() * 8)}%`;
    if (aiStreakEl) aiStreakEl.textContent = `🔥 24-Day Streak`;

    if (aiMsgContent) {
      if (seat.type.includes('Quiet')) {
        aiMsgContent.textContent = `Optimal choice. Desk ${seat.id} offers an isolated acoustic profile with 98% silence rating, increasing your focused study duration by ~1.4 hrs.`;
      } else if (seat.type.includes('Window')) {
        aiMsgContent.textContent = `Natural lighting on Desk ${seat.id} supports circadian study habits during ${activeShift} shift. Wi-Fi latency benchmark: 14ms.`;
      } else {
        aiMsgContent.textContent = `High-power desk ${seat.id} detected with dedicated charging hub and 100% generator power backup.`;
      }
    }
  }

  shiftBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shiftBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeShift = btn.getAttribute('data-shift');
      renderHeroSeats();
      const currentSelected = mockShiftSeats[activeShift].find(s => s.status === 'selected') || mockShiftSeats[activeShift][0];
      updateHeroAiWidget(currentSelected);
    });
  });

  renderHeroSeats();
  const initSelected = mockShiftSeats['morning'].find(s => s.status === 'selected');
  if (initSelected) updateHeroAiWidget(initSelected);
}

/* -------------------------------------------------------------
   2. STUDENT SEAT SIMULATOR & RESALE ENGINE
------------------------------------------------------------- */
function initStudentSeatSimulator() {
  const attendanceSlider = document.getElementById('student-attendance-slider');
  const daysDisplay = document.getElementById('student-days-display');
  const discountDisplay = document.getElementById('student-discount-display');
  const payableFeeDisplay = document.getElementById('student-payable-fee');
  const resaleBtn = document.getElementById('btn-student-resale-demo');
  const resaleOutput = document.getElementById('student-resale-feedback');

  if (!attendanceSlider) return;

  const baseMonthlyFee = 850;

  function updateAttendanceDiscount() {
    const days = parseInt(attendanceSlider.value, 10);
    let discountPct = 0;
    if (days >= 26) discountPct = 25;
    else if (days >= 20) discountPct = 18;
    else if (days >= 14) discountPct = 10;
    else if (days >= 8) discountPct = 5;

    const discountAmount = Math.round((baseMonthlyFee * discountPct) / 100);
    const finalFee = baseMonthlyFee - discountAmount;

    if (daysDisplay) daysDisplay.textContent = `${days} Days / Month`;
    if (discountDisplay) discountDisplay.textContent = `${discountPct}% Discount (-₹${discountAmount})`;
    if (payableFeeDisplay) payableFeeDisplay.textContent = `₹${finalFee}/mo`;
  }

  attendanceSlider.addEventListener('input', updateAttendanceDiscount);
  updateAttendanceDiscount();

  if (resaleBtn && resaleOutput) {
    resaleBtn.addEventListener('click', () => {
      resaleOutput.style.display = 'block';
      resaleOutput.innerHTML = `
        <div style="font-weight:700; color:#10b981; margin-bottom:4px;">✨ Vacant Seat Slot Monetized</div>
        <div>Your 4-day leave has been matched with on-demand micro-renters. <strong>₹240 cashback</strong> credited to your JodoClub wallet!</div>
      `;
    });
  }
}

/* -------------------------------------------------------------
   3. OWNER MULTI-BRANCH SaaS CONTROLLER
------------------------------------------------------------- */
function initOwnerBranchDashboard() {
  const branchSelector = document.getElementById('owner-branch-select');
  const branchOccEl = document.getElementById('branch-occupancy-val');
  const branchRevEl = document.getElementById('branch-revenue-val');
  const branchActiveSeatsEl = document.getElementById('branch-active-seats-val');

  if (!branchSelector) return;

  const branchData = {
    'patna-central': { occ: '94%', rev: '₹1,42,800', seats: '118/125' },
    'kankarbagh-hub': { occ: '88%', rev: '₹98,400', seats: '88/100' },
    'boring-road-exec': { occ: '96%', rev: '₹1,84,000', seats: '144/150' },
    'muzaffarpur-branch': { occ: '82%', rev: '₹65,200', seats: '58/70' }
  };

  branchSelector.addEventListener('change', (e) => {
    const val = e.target.value;
    const data = branchData[val] || branchData['patna-central'];
    if (branchOccEl) branchOccEl.textContent = data.occ;
    if (branchRevEl) branchRevEl.textContent = data.rev;
    if (branchActiveSeatsEl) branchActiveSeatsEl.textContent = data.seats;
  });
}

/* -------------------------------------------------------------
   4. DEVELOPER & AI CLOUD LAYER: CODE TABS
------------------------------------------------------------- */
function initDevApiTabs() {
  const tabBtns = document.querySelectorAll('.code-tab-btn');
  const codeBody = document.getElementById('dev-code-snippet');

  if (!tabBtns.length || !codeBody) return;

  const codeSnippets = {
    'curl': `<span class="code-token-comment"># Verify Real-Time Seat Availability via Jodo Study Network API</span>
<span class="code-token-keyword">curl</span> -X GET <span class="code-token-string">"https://api.jodoclub.com/v1/spaces/patna-central/seats?shift=morning"</span> \\
  -H <span class="code-token-string">"Authorization: Bearer jodo_live_sec_99a8b7c6d5"</span> \\
  -H <span class="code-token-string">"Content-Type: application/json"</span>

<span class="code-token-comment"># Response: 200 OK</span>
{
  <span class="code-token-string">"spaceId"</span>: <span class="code-token-string">"lib_patna_01"</span>,
  <span class="code-token-string">"shift"</span>: <span class="code-token-string">"MORNING_06_12"</span>,
  <span class="code-token-string">"availableSeats"</span>: [<span class="code-token-string">"S1"</span>, <span class="code-token-string">"S3"</span>, <span class="code-token-string">"S4"</span>, <span class="code-token-string">"S6"</span>],
  <span class="code-token-string">"qrGateAccess"</span>: <span class="code-token-keyword">true</span>,
  <span class="code-token-string">"iotActiveTurnstiles"</span>: <span class="code-token-num">2</span>
}`,

    'node': `<span class="code-token-comment">// Node.js SDK: Instant Webhook & Shift Allocation</span>
<span class="code-token-keyword">import</span> { JodoClubClient } <span class="code-token-keyword">from</span> <span class="code-token-string">'@jodoclub/sdk'</span>;

<span class="code-token-keyword">const</span> jodo = <span class="code-token-keyword">new</span> JodoClubClient({
  apiKey: process.env.<span class="code-token-string">JODO_SECRET_KEY</span>,
});

<span class="code-token-keyword">async function</span> bookMemberSeat() {
  <span class="code-token-keyword">const</span> booking = <span class="code-token-keyword">await</span> jodo.bookings.create({
    memberId: <span class="code-token-string">'mem_aspirant_882'</span>,
    shift: <span class="code-token-string">'NIGHT_OWL'</span>,
    seatPreference: <span class="code-token-string">'QUIET_CORNER'</span>,
    autoQrPass: <span class="code-token-keyword">true</span>,
  });

  console.log(<span class="code-token-string">'Pass Generated:'</span>, booking.digitalPassUrl);
}`,

    'python': `<span class="code-token-comment"># Python SDK: Study Analytics & Autonomous Sync</span>
<span class="code-token-keyword">from</span> jodoclub <span class="code-token-keyword">import</span> JodoClient

client = JodoClient(api_key=<span class="code-token-string">"jodo_live_sec_99a8b7c6d5"</span>)

<span class="code-token-comment"># Fetch peer rank benchmark for BPSC 71st</span>
analytics = client.analytics.get_peer_benchmark(
    exam_id=<span class="code-token-string">"BPSC_71ST"</span>,
    student_id=<span class="code-token-string">"usr_aman_09"</span>
)

print(f<span class="code-token-string">"State Rank: {analytics.rank} | Verified Hours: {analytics.study_hours} hrs"</span>)`
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      codeBody.innerHTML = codeSnippets[lang] || codeSnippets['curl'];
    });
  });
}

/* -------------------------------------------------------------
   5. AUTONOMOUS AI WHATSAPP AGENT SIMULATOR
------------------------------------------------------------- */
function initWhatsAppAiSimulator() {
  const chips = document.querySelectorAll('.quick-chip');
  const chatContainer = document.getElementById('whatsapp-chat-container');

  if (!chips.length || !chatContainer) return;

  const responses = {
    'shift': {
      user: 'Bhaiya mujhe kal ki shift Morning se Night Owl me switch karni hai.',
      bot: 'Namaste Aman! 🤖 Aapki request Jodo AI ne process kar li hai. Kal ke liye Seat N4 (Night Owl 11 PM - 6 AM) confirm kar di gayi hai. Aapka QR Entry pass auto-update ho chuka hai!'
    },
    'discount': {
      user: 'Mera is month ka attendance discount kitna bana?',
      bot: 'Aapne is month 24 days QR check-in complete kiya hai! Aapko 20% Automated Attendance Discount unlock ho chuka hai. Renewal fee: ₹850 ki jagah sirf ₹680 lagengi.'
    },
    'wifi': {
      user: 'Cabin 3 me Wi-Fi speed thodi slow aa rahi hai.',
      bot: 'Ticket #409 generated! Library Manager Sunil ji ko direct alert bhej diya gaya hai aur Secondary Router mesh auto-activate kar diya gaya hai. Expected resolution: 5 mins.'
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-query');
      const data = responses[type];
      if (!data) return;

      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = data.user;
      chatContainer.appendChild(userBubble);

      setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.innerHTML = `<strong>JodoClub AI Agent:</strong><br>${data.bot}`;
        chatContainer.appendChild(botBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 500);

      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  });
}

/* -------------------------------------------------------------
   6. MODALS HANDLING (HTML5 <dialog>)
------------------------------------------------------------- */
function initModals() {
  const portalModal = document.getElementById('portal-modal');
  const apiModal = document.getElementById('api-modal');

  document.querySelectorAll('[data-open-modal="portal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (portalModal) portalModal.showModal();
    });
  });

  document.querySelectorAll('[data-open-modal="api"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (apiModal) apiModal.showModal();
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) modal.close();
    });
  });

  [portalModal, apiModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inDialog) modal.close();
    });
  });

  document.querySelectorAll('form[data-ajax-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentModal = form.closest('dialog');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Authenticating...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Welcome to JodoClub Cloud! Aapka access request verify ho gaya hai.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
        if (parentModal) parentModal.close();
      }, 700);
    });
  });
}

/* -------------------------------------------------------------
   7. SMOOTH SCROLL NAVIGATION
------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.startsWith('#!')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
