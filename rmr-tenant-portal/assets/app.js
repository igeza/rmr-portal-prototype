/*
  app.js — interaction wiring shared across every screen in this prototype.
  Anything simulated for the demo (no real backend) is called out inline.
*/

// Shared across payments.html's Balance Due banner and autopay.html: whether
// AutoPay has been scheduled from ANY entry point. A static multi-page
// prototype has no server to persist this, so a single localStorage flag is
// the only way "set it up on one screen" can carry over to another.
const RMR_AUTOPAY_KEY = 'rmr-autopay-scheduled';
function rmrIsAutopayScheduled() {
  try { return localStorage.getItem(RMR_AUTOPAY_KEY) === '1'; } catch (e) { return false; }
}
function rmrSetAutopayScheduled(value) {
  try {
    if (value) localStorage.setItem(RMR_AUTOPAY_KEY, '1');
    else localStorage.removeItem(RMR_AUTOPAY_KEY);
  } catch (e) { /* private browsing, etc. — demo state just won't persist */ }
}

// Shared between document-center.html's Renewal Available banner and
// document-sign.html's own Finish Signing flow — once the lease renewal
// document has been signed, the banner is done its job and shouldn't invite
// re-review of an already-completed renewal. Same pattern as the AutoPay flag.
const RMR_RENEWAL_SIGNED_KEY = 'rmr-renewal-signed';
function rmrIsRenewalSigned() {
  try { return localStorage.getItem(RMR_RENEWAL_SIGNED_KEY) === '1'; } catch (e) { return false; }
}
function rmrSetRenewalSigned(value) {
  try {
    if (value) localStorage.setItem(RMR_RENEWAL_SIGNED_KEY, '1');
    else localStorage.removeItem(RMR_RENEWAL_SIGNED_KEY);
  } catch (e) { /* private browsing, etc. — demo state just won't persist */ }
}

// Shared between document-center.html's Documents to Sign register and its
// Leases & Documents tree — same pattern as the renewal flag above, keyed
// per policy doc (RMR_SIGN_DOCS' own keys) since there's more than one.
const RMR_DOC_SIGNED_PREFIX = 'rmr-doc-signed:';
function rmrIsDocSigned(key) {
  try { return localStorage.getItem(RMR_DOC_SIGNED_PREFIX + key) === '1'; } catch (e) { return false; }
}
function rmrSetDocSigned(key, value) {
  try {
    if (value) localStorage.setItem(RMR_DOC_SIGNED_PREFIX + key, '1');
    else localStorage.removeItem(RMR_DOC_SIGNED_PREFIX + key);
  } catch (e) { /* private browsing, etc. — demo state just won't persist */ }
}

// Make a Payment — Current Balance submission. This static demo can only
// back one payment amount with real numbers (the default "My Current
// Balance" option — "Other Amount" isn't wired to a live total anywhere
// else on this screen), so Submit always pays that amount in full: the
// Balance Due card zeroes out, Open Charges empties, and a payment entry
// appears in All Activity. Persisted the same way as the AutoPay/renewal/
// signature flags above, so it survives navigating away and back.
const RMR_PAYMENT_PAID_KEY = 'rmr-payment-paid';
function rmrIsPaymentPaid() {
  try { return localStorage.getItem(RMR_PAYMENT_PAID_KEY) === '1'; } catch (e) { return false; }
}
function rmrSetPaymentPaid(value) {
  try {
    if (value) localStorage.setItem(RMR_PAYMENT_PAID_KEY, '1');
    else localStorage.removeItem(RMR_PAYMENT_PAID_KEY);
  } catch (e) { /* private browsing, etc. — demo state just won't persist */ }
}
function rmrApplyPaymentPaid() {
  // Dashboard hero's single "Balance Due" figure — the Payments screen's own
  // Balance Due card uses the data-balance-state swap below instead, per its
  // real "4.2.5 Charges - Paid off" design (node 2001:1008).
  document.querySelectorAll('[data-pay-remaining]').forEach((el) => { el.textContent = '$0.00'; });

  document.querySelectorAll('[data-balance-state="open"]').forEach((el) => { el.hidden = true; });
  document.querySelectorAll('[data-balance-state="complete"]').forEach((el) => { el.hidden = false; });
  document.querySelectorAll('.rmr-pay-payment-buttons .rmr-btn--primary').forEach((btn) => { btn.disabled = true; });

  document.querySelectorAll('.rmr-pay-table[data-pay-view="open"]').forEach((table) => {
    const tbody = table.querySelector('tbody');
    if (!tbody || tbody.dataset.paid) return;
    tbody.dataset.paid = '1';
    const lateFeeTh = table.querySelector('thead th.rmr-pay-col-latefee');
    if (lateFeeTh) lateFeeTh.hidden = true;
    const cols = table.querySelectorAll('thead th:not([hidden])').length;
    tbody.innerHTML = `<tr class="rmr-pay-table__empty-row"><td class="rmr-pay-table__empty" colspan="${cols}">There are no open charges!</td></tr>`;
  });
  document.querySelectorAll('.rmr-pay-table-footer[data-pay-view="open"]').forEach((el) => {
    el.textContent = '0 Total Open Charges';
  });

  document.querySelectorAll('.rmr-pay-table[data-pay-view="all"]').forEach((table) => {
    const tbody = table.querySelector('tbody');
    if (!tbody || tbody.dataset.paid) return;
    tbody.dataset.paid = '1';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Date">11/01/26</td>
      <td data-label="Type">Payment</td>
      <td data-label="Details">Online Payment</td>
      <td data-label="Reference Number">5323423</td>
      <td data-align="right" data-label="Charge Amount">-$1,577.28</td>
      <td data-align="right" class="rmr-pay-col-latefee" data-label="Late Fee">$0.00</td>
      <td data-align="right" data-label="Balance">$0.00</td>
    `;
    tbody.prepend(row);
  });
  document.querySelectorAll('.rmr-pay-table-footer[data-pay-view="all"]').forEach((el) => {
    const m = el.textContent.match(/Showing (\d+) of (\d+) Transactions/);
    if (m) el.textContent = `Showing ${Number(m[1]) + 1} of ${Number(m[2]) + 1} Transactions`;
  });
}

// Document Signature wizard — once the tenant has signed anything at all,
// a real e-sign flow remembers that signature: every later "Click to
// Sign"/"Sign" entry point should open the Document Signature preview
// (node 3012:22514, signature already filled in) instead of the blank Add
// Signature step. Same persisted-flag pattern as the flags above.
const RMR_HAS_SIGNATURE_KEY = 'rmr-has-signature';
function rmrHasSignature() {
  try { return localStorage.getItem(RMR_HAS_SIGNATURE_KEY) === '1'; } catch (e) { return false; }
}
function rmrSetHasSignature(value) {
  try {
    if (value) localStorage.setItem(RMR_HAS_SIGNATURE_KEY, '1');
    else localStorage.removeItem(RMR_HAS_SIGNATURE_KEY);
  } catch (e) { /* private browsing, etc. — demo state just won't persist */ }
}

document.addEventListener('DOMContentLoaded', () => {
  // Collapse/expand the left nav — mirrors the real Menu component's
  // Expanded=True/False variants from the RMR design system (icon-only pills,
  // no labels, and the Collapse control itself swaps to the "expand" glyph).
  // Persisting the choice per-user is real-app behavior, not prototyped here.
  const collapseBtn = document.querySelector('[data-action="toggle-menu"]');
  const menu = document.querySelector('.rmr-menu');
  const collapseIcon = collapseBtn ? collapseBtn.querySelector('[data-collapse-icon]') : null;
  const collapseLabel = collapseBtn ? collapseBtn.querySelector('[data-collapse-label]') : null;
  if (collapseBtn && menu) {
    collapseBtn.addEventListener('click', () => {
      const collapsed = menu.classList.toggle('rmr-menu--collapsed');
      if (collapseIcon) {
        collapseIcon.src = collapsed
          ? '../assets/icons/expand.svg'
          : '../assets/icons/collapse.svg';
      }
      if (collapseLabel) collapseLabel.textContent = collapsed ? 'Expand' : 'Collapse';
    });
  }

  // Sign Document — the document shown must match whichever Document Center
  // "Sign" link was actually clicked, not always the hardcoded Lease Renewal
  // Request text. document-sign.html?doc=parking-policy / ?doc=pet-policy
  // swap in their own title/body here; the default (no ?doc, or
  // ?doc=lease-renewal from the Renewal Offer's Accept Offer button) is left
  // as the page's own static markup, since it's the only one with the
  // lease-preference dropdown wizard step. Runs before the dropdown/open-modal
  // wiring below so any swapped-in content is what gets bound.
  const RMR_SIGN_DOCS = {
    'parking-policy': {
      title: 'Sign Document - Parking Policy',
      bodyHTML: `
        <h1>PARKING POLICY ACKNOWLEDGMENT</h1>
        <p class="rmr-sign-doc__date">12/15/2026</p>
        <p>Samantha Carpenter</p>
        <p>Dear Samantha Carpenter:</p>
        <p>Riverview Apartments is updating its parking policy effective 12/20/2026. Please review the details below.</p>
        <p>Each unit is assigned one (1) reserved parking space, marked with your unit number. Guest parking is limited to designated visitor spots only. A vehicle parked in a reserved space without a valid permit, or left in a visitor spot for more than 48 hours, is subject to towing at the owner's expense.</p>
        <p>By signing below, you acknowledge that you have read and agree to abide by the parking policy described above.</p>
        <p>Please sign this letter electronically to confirm your acknowledgment.</p>
        <p>Sincerely,</p>
        <p>Carrie Loveland</p>
        <div class="rmr-sign-doc__select rmr-field-attention" data-sign-field-attention data-sign-hide-on-sign>
          <svg class="rmr-field-attention__pointer" width="24" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0.5 21V0.5H14.5L23.5 10.5L14.4643 21H0.5Z" fill="#F4F6A8" stroke="#616466"/>
          </svg>
          <button type="button" class="rmr-sign-doc__signhere rmr-field-attention__control" data-action="open-modal" data-modal-target="add-signature">Click to Sign</button>
        </div>
        <p data-sign-signature-line hidden class="rmr-sign-doc__signed">Samantha Carpenter</p>
      `,
    },
    'pet-policy': {
      title: 'Sign Document - Pet Policy Update',
      bodyHTML: `
        <h1>PET POLICY UPDATE</h1>
        <p class="rmr-sign-doc__date">1/30/2027</p>
        <p>Samantha Carpenter</p>
        <p>Dear Samantha Carpenter:</p>
        <p>Riverview Apartments is updating its pet policy effective 2/2/2027. Please review the details below.</p>
        <p>Residents with an approved pet must provide current vaccination records annually and keep pets leashed at all times in common areas. A refundable pet deposit of $300 and monthly pet rent of $35 per pet apply to all units with an approved pet.</p>
        <p>By signing below, you acknowledge that you have read and agree to the updated pet policy described above.</p>
        <p>Please sign this letter electronically to confirm your acknowledgment.</p>
        <p>Sincerely,</p>
        <p>Carrie Loveland</p>
        <div class="rmr-sign-doc__select rmr-field-attention" data-sign-field-attention data-sign-hide-on-sign>
          <svg class="rmr-field-attention__pointer" width="24" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0.5 21V0.5H14.5L23.5 10.5L14.4643 21H0.5Z" fill="#F4F6A8" stroke="#616466"/>
          </svg>
          <button type="button" class="rmr-sign-doc__signhere rmr-field-attention__control" data-action="open-modal" data-modal-target="add-signature">Click to Sign</button>
        </div>
        <p data-sign-signature-line hidden class="rmr-sign-doc__signed">Samantha Carpenter</p>
      `,
    },
  };
  let rmrSignDocIsPolicy = false;
  let rmrSignDocKey = null;
  if (document.body.dataset.screen === 'document-sign') {
    rmrSignDocKey = new URLSearchParams(location.search).get('doc');
    const doc = RMR_SIGN_DOCS[rmrSignDocKey];
    if (doc) {
      rmrSignDocIsPolicy = true;
      document.title = `${doc.title} — rmResident Portal`;
      const heroTitle = document.querySelector('[data-sign-hero-title]');
      if (heroTitle) heroTitle.textContent = doc.title;
      const docContent = document.querySelector('[data-sign-doc-content]');
      if (docContent) docContent.innerHTML = doc.bodyHTML;
      // These policy docs are a plain acknowledgment + signature, not a
      // lease-term choice, so Sign goes straight to Add Signature instead
      // of opening the lease-preference modal.
      const signBtn = document.querySelector('[data-sign-btn]');
      if (signBtn) signBtn.dataset.modalTarget = 'add-signature';
    } else {
      // Default (lease renewal) letter only — pre-fill its lease-preference
      // dropdown with whichever term card was picked on the previous screen
      // (Review Multiple Term Offers' Accept Offer, see offer-select above),
      // instead of always opening blank.
      const term = new URLSearchParams(location.search).get('term');
      const dropdown = document.querySelector('[data-sign-lease-dropdown]');
      const option = term && dropdown ? dropdown.querySelector(`[data-lease-term="${term}"]`) : null;
      if (option) {
        dropdown.querySelectorAll('[data-dropdown-option]').forEach((o) => o.classList.remove('rmr-dropdown__option--selected'));
        option.classList.add('rmr-dropdown__option--selected');
        const valueEl = dropdown.querySelector('[data-dropdown-value]');
        if (valueEl) valueEl.textContent = option.textContent;
      }
    }
  }

  // Fake "Make a Payment" / "Start" / "Sign" actions do nothing beyond
  // preventing navigation — there is no backend behind this prototype, and
  // an unwired click shouldn't have side effects like dismissing whatever
  // overlay it happens to be inside. Delegated on document (rather than
  // bound per-element) so it also covers fake-submit triggers inside content
  // added later via innerHTML — e.g. the Issue Details modal, built per-issue
  // by app.js. Flows that really do need to close (and confirm) after a fake
  // action get their own dedicated data-action/handler instead, e.g.
  // decline-all-submit below.
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action="fake-submit"]');
    if (!el) return;
    e.preventDefault();
    const menu = el.closest('.rmr-account-menu');
    if (menu) closeAccountMenu();
  });

  // Overlays (Lease Track, Flex, Contact Us, Cash Pay, Email Property Manager)
  // — real content from the Dashboard section's overlay frames. Open via the
  // ad banners / footer links, close via the X, backdrop click, or Escape.
  document.querySelectorAll('[data-action="open-modal"]').forEach((el) => {
    el.addEventListener('click', () => {
      const backdrop = document.querySelector(`[data-modal-backdrop="${el.dataset.modalTarget}"]`);
      if (backdrop) backdrop.hidden = false;
    });
  });

  // Community page — calendar event details. One shared modal (see the
  // event-details backdrop in community.html) populated from whichever
  // event button was clicked — its own data-event-* attributes — rather than
  // a modal per event. Delegated on document since the "+x" day popover's
  // event buttons above are only created after the popover opens.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="open-modal"][data-modal-target="event-details"]');
    if (!btn) return;
    const backdrop = document.querySelector('[data-modal-backdrop="event-details"]');
    if (!backdrop) return;
    backdrop.querySelector('[data-event-detail-title]').textContent = btn.dataset.eventTitle || '';
    backdrop.querySelector('[data-event-detail-category]').textContent = btn.dataset.eventCategory || '';
    backdrop.querySelector('[data-event-detail-property]').textContent = btn.dataset.eventProperty || '';
    backdrop.querySelector('[data-event-detail-location]').textContent = btn.dataset.eventLocation || '';
    backdrop.querySelector('[data-event-detail-date]').textContent = btn.dataset.eventDate || '';
    backdrop.querySelector('[data-event-detail-time]').textContent = btn.dataset.eventTime || '';
    backdrop.querySelector('[data-event-detail-description]').textContent = btn.dataset.eventDescription || '';
    backdrop.hidden = false;
    const popover = document.querySelector('[data-cal-day-popover]');
    if (popover) popover.hidden = true;
  });

  // Violation Details (node 2021:4928) — one modal shared by every row in
  // both Open and Closed Violations, populated from that row's own table
  // cells (plus an optional image, since only some violations have one)
  // rather than duplicating a static modal per row.
  document.querySelectorAll('[data-action="open-violation-details"]').forEach((row) => {
    row.addEventListener('click', () => {
      const backdrop = document.querySelector('[data-modal-backdrop="violation-details"]');
      if (!backdrop) return;
      const cells = row.querySelectorAll('td');
      backdrop.querySelector('[data-vio-detail-date]').textContent = cells[0].textContent.trim();
      backdrop.querySelector('[data-vio-detail-code]').textContent = cells[1].textContent.trim();
      backdrop.querySelector('[data-vio-detail-ccr]').textContent = cells[2].textContent.trim();
      backdrop.querySelector('[data-vio-detail-description]').textContent = cells[3].textContent.trim();
      backdrop.querySelector('[data-vio-detail-duedate]').textContent = cells[4].textContent.trim();

      // .rmr-modal__field sets display:flex, which beats the [hidden] UA
      // style at equal specificity — toggle display directly instead.
      const imageWrap = backdrop.querySelector('[data-vio-detail-image-wrap]');
      const image = row.dataset.vioImage;
      imageWrap.style.display = image ? '' : 'none';
      if (image) backdrop.querySelector('[data-vio-detail-image]').src = image;

      backdrop.hidden = false;
    });
  });

  // Note Details (node 2231:5065) — one modal shared by every row in the
  // Notes register, populated from that row's own table cells; the Files
  // field only appears when the row's own Files cell shows an attachment
  // icon, same show/matching-the-row logic as Violation Details' image above.
  document.querySelectorAll('[data-action="open-note-details"]').forEach((row) => {
    row.addEventListener('click', () => {
      const backdrop = document.querySelector('[data-modal-backdrop="note-details"]');
      if (!backdrop) return;
      const cells = row.querySelectorAll('td');
      backdrop.querySelector('[data-note-detail-date]').textContent = cells[0].textContent.trim();
      backdrop.querySelector('[data-note-detail-notes]').textContent = cells[1].textContent.trim();
      const filesWrap = backdrop.querySelector('[data-note-detail-files-wrap]');
      filesWrap.style.display = cells[2].querySelector('img') ? '' : 'none';
      backdrop.hidden = false;
    });
  });

  // Architectural Requests — shared detail data for every request/vote row
  // (keyed by each row's own data-arq-key), reused by both the My Requests
  // "Request Details" modal (open-arq-details) and the Requests to Review
  // "Vote Details" modal (open-arq-vote). Only "paint" is the real
  // Figma-sourced example (full Description/Attachments/urgent flag/mixed
  // vote breakdown); every other key reuses the same field shape with
  // request-appropriate mock content so every register row opens a fully
  // populated, matching detail view rather than a placeholder toast.
  const ARQ_REQUESTS = {
    paint: { description: 'I want to update the color of the front door', attachments: ['../assets/images/architectural-requests/attach-1.png', '../assets/images/architectural-requests/attach-2.png'], urgent: 'Yes', votes: [['Anna Moore', 'No Response', ''], ['Diene Bailey', 'Approved', ''], ['William Morgan', 'Denied', 'Not in the budget for this year.']] },
    fence: { description: "I'd like to install a wooden fence along the back property line for added privacy and security.", attachments: [], urgent: 'No' },
    patio: { description: "I'd like to add a paved patio in the backyard for outdoor seating.", attachments: [], urgent: 'No' },
    lighting: { description: "I'd like to install low-voltage lighting along the front walkway for better visibility at night.", attachments: [], urgent: 'No' },
    flowerbeds: { description: "I'd like to plant flower beds along the front of the unit to improve curb appeal.", attachments: [], urgent: 'No' },
    pathway: { description: "I'd like to lay a stone pathway through the side garden.", attachments: [], urgent: 'No' },
    deck: { description: "I'd like to build a small wood deck off the back entrance.", attachments: [], urgent: 'No' },
    firepit: { description: "I'd like to install a permanent fire pit in the backyard for gatherings.", attachments: [], urgent: 'Yes' },
    waterfeature: { description: "I'd like to add a small fountain to the front garden bed.", attachments: [], urgent: 'No' },
    trellis: { description: "I'd like to install a trellis along the side fence for climbing plants.", attachments: [], urgent: 'No' },
  };
  // A request without its own sourced vote breakdown (every key but "paint")
  // gets one derived from that row's own register Status cell instead —
  // nobody's voted yet on a Pending request, a Board Review has a vote or
  // two trickling in, and a Denied one nets out mostly against.
  function arqVotesForStatus(status) {
    if (status === 'Denied') return [['Anna Moore', 'Denied', ''], ['Diene Bailey', 'Approved', ''], ['William Morgan', 'Denied', 'Not enough support from the board.']];
    if (status === 'In Board Review') return [['Anna Moore', 'Approved', ''], ['Diene Bailey', 'No Response', ''], ['William Morgan', 'No Response', '']];
    return [['Anna Moore', 'No Response', ''], ['Diene Bailey', 'No Response', ''], ['William Morgan', 'No Response', '']];
  }
  function arqStatusDotClass(status) {
    if (status === 'Denied') return 'denied';
    if (status === 'In Board Review') return 'review';
    return 'open'; // Pending — same yellow as Service Issues' own --open
  }
  function arqFillCommon(backdrop, prefix, request, status, submitted, submittedBy, data) {
    backdrop.querySelector(`[data-arq-${prefix}-title]`).textContent = request;
    backdrop.querySelector(`[data-arq-${prefix}-status]`).textContent = status;
    backdrop.querySelector(`[data-arq-${prefix}-status-dot]`).className = `rmr-svc-status-dot rmr-svc-status-dot--${arqStatusDotClass(status)}`;
    backdrop.querySelector(`[data-arq-${prefix}-submitted]`).textContent = submitted;
    backdrop.querySelector(`[data-arq-${prefix}-submitted-by]`).textContent = submittedBy;
    backdrop.querySelector(`[data-arq-${prefix}-description]`).textContent = data.description;
    backdrop.querySelector(`[data-arq-${prefix}-urgent]`).textContent = data.urgent;
    const attachWrap = backdrop.querySelector(`[data-arq-${prefix}-attachments-wrap]`);
    attachWrap.style.display = data.attachments.length ? '' : 'none';
    if (data.attachments.length) {
      backdrop.querySelector(`[data-arq-${prefix}-attachments]`).innerHTML = data.attachments.map((src) => `<img class="rmr-svc-attach__thumb-img" src="${src}" alt="" />`).join('');
    }
  }

  document.querySelectorAll('[data-action="open-arq-details"]').forEach((row) => {
    row.addEventListener('click', () => {
      const backdrop = document.querySelector('[data-modal-backdrop="arq-details"]');
      if (!backdrop) return;
      const cells = row.querySelectorAll('td');
      const data = ARQ_REQUESTS[row.dataset.arqKey] || { description: '', attachments: [], urgent: 'No' };
      arqFillCommon(backdrop, 'detail', cells[2].textContent.trim(), cells[1].textContent.trim(), cells[0].textContent.trim(), 'Samantha Carpenter', data);
      backdrop.hidden = false;
    });
  });

  document.querySelectorAll('[data-action="open-arq-vote"]').forEach((row) => {
    row.addEventListener('click', () => {
      const backdrop = document.querySelector('[data-modal-backdrop="arq-vote"]');
      if (!backdrop) return;
      const cells = row.querySelectorAll('td');
      const status = cells[4].textContent.trim();
      const data = ARQ_REQUESTS[row.dataset.arqKey] || { description: '', attachments: [], urgent: 'No' };
      arqFillCommon(backdrop, 'vote', cells[3].textContent.trim(), status, cells[0].textContent.trim(), cells[1].textContent.trim(), data);
      backdrop.querySelector('[data-arq-vote-body]').innerHTML = (data.votes || arqVotesForStatus(status))
        .map(([name, vote, note]) => `<tr><td>${name}</td><td>${vote}</td><td>${note}</td></tr>`).join('');
      backdrop.hidden = false;
    });
  });

  // Make a Payment flow — modal-to-modal navigation (Select Amount ->
  // Payment Method -> Success). Closes the current overlay and opens the
  // next one, rather than opening on top of it.
  document.querySelectorAll('[data-action="switch-modal"]').forEach((el) => {
    el.addEventListener('click', () => {
      const current = document.querySelector(`[data-modal-backdrop="${el.dataset.modalCloseCurrent}"]`);
      const next = document.querySelector(`[data-modal-backdrop="${el.dataset.modalTarget}"]`);
      if (current) current.hidden = true;
      if (next) next.hidden = false;
    });
  });

  // Make a Payment — amount selection ("My Current Balance" vs "Other
  // Amount"). Selecting "Other Amount" swaps in the itemized table (checkbox
  // per charge + editable Pay Amount, node 2175:11880) in place of the plain
  // read-only one used for "My Current Balance".
  document.querySelectorAll('[data-action="pmt-select-amount"]').forEach((card) => {
    card.addEventListener('click', () => {
      card.parentElement.querySelectorAll('[data-action="pmt-select-amount"]').forEach((c) => {
        const selected = c === card;
        c.classList.toggle('rmr-pmt-amount-card--selected', selected);
        c.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', selected);
      });
      const isOther = card.dataset.amountOption === 'other';
      document.querySelectorAll('[data-pmt-table]').forEach((table) => {
        table.hidden = (table.dataset.pmtTable === 'other') !== isOther;
      });
    });
  });

  // Make a Payment — Submit. Same modal-to-modal navigation as switch-modal
  // above, plus actually applying the payment (see rmrApplyPaymentPaid):
  // otherwise "Payment Submitted" would show a success screen while the
  // Balance Due card, Open Charges, and All Activity all stayed untouched.
  document.querySelectorAll('[data-action="pmt-submit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.querySelector(`[data-modal-backdrop="${btn.dataset.modalCloseCurrent}"]`);
      const next = document.querySelector(`[data-modal-backdrop="${btn.dataset.modalTarget}"]`);
      if (current) current.hidden = true;
      if (next) next.hidden = false;
      rmrApplyPaymentPaid();
      rmrSetPaymentPaid(true);
    });
  });

  document.querySelectorAll('[data-modal-backdrop]').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
    backdrop.querySelectorAll('[data-action="close-modal"]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => closeModal(backdrop));
    });
  });

  // AutoPay setup — Balance step (payments.html/dashboard.html's
  // autopay-amount modal). Amount option selection (Total Balance / Current
  // Balance / Specific Amount) swaps in the matching amount field (Max
  // Amount vs. the required "Amount" field, node 2044:20657's Specific
  // Amount variant) and, together with the Frequency/Start Date inputs,
  // drives the summary card live instead of it showing static placeholder
  // copy — an empty Max Amount omits the "Up to" column entirely (see
  // apUpdateSummary), and Quarterly/Semiannually additionally preview every
  // date in the next 12 months the payment will actually run on, since
  // "Every quarter starting on 11/01/26" alone doesn't make the other three
  // dates obvious.
  const AP_FREQUENCY_PERIODS = { Weekly: 'week', Monthly: 'month', Quarterly: 'quarter', Semiannually: '6 months', Annually: 'year' };
  const AP_FREQUENCY_MONTHS = { Quarterly: 3, Semiannually: 6 }; // only these two get a "processed on" date list — Monthly/Weekly would list too many, Annually's one date just repeats Start Date
  const AP_MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function apFormatAmount(raw) {
    const trimmed = (raw || '').trim();
    if (!trimmed) return '';
    return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
  }
  document.querySelectorAll('[data-modal-backdrop="autopay-amount"]').forEach((backdrop) => {
    const modal = backdrop.querySelector('.rmr-modal');
    const amountOptions = modal ? modal.querySelectorAll('[data-action="ap-select-amount"]') : [];
    const summaryRows = modal ? modal.querySelector('[data-ap-summary-rows]') : null;
    if (!modal || !amountOptions.length || !summaryRows) return;

    const balanceField = modal.querySelector('[data-ap-amount-field="balance"]');
    const specificField = modal.querySelector('[data-ap-amount-field="specific"]');
    const maxInput = modal.querySelector('[data-ap-max-input]');
    const specificInput = modal.querySelector('[data-ap-specific-input]');
    const freqValueEl = modal.querySelector('[data-ap-frequency-value]');
    const freqDropdown = modal.querySelector('[data-ap-frequency-dropdown]');
    const dayValueEl = modal.querySelector('[data-ap-day-value]');
    const dayDropdown = dayValueEl ? dayValueEl.closest('[data-dropdown]') : null;
    const startInput = modal.querySelectorAll('.rmr-ap-date-input')[0];
    const endInput = modal.querySelectorAll('.rmr-ap-date-input')[1];

    function selectedAmountOption() {
      const active = Array.from(amountOptions).find((o) => o.querySelector('.rmr-pmt-radio').classList.contains('rmr-pmt-radio--selected'));
      return active ? active.dataset.amountOption : 'current';
    }
    function apProcessedDates(startDate, intervalMonths) {
      const count = 12 / intervalMonths;
      const dates = [];
      for (let i = 0; i < count; i++) {
        const d = new Date(startDate.getFullYear(), startDate.getMonth() + intervalMonths * i, startDate.getDate());
        dates.push(`${AP_MONTH_ABBR[d.getMonth()]} ${d.getDate()}`);
      }
      return dates.join(', ');
    }
    function apUpdateSummary() {
      const mode = selectedAmountOption();
      const freq = (freqValueEl && freqValueEl.textContent.trim()) || 'Monthly';
      const startVal = startInput ? startInput.value.trim() : '';
      let rowsHtml = '';

      if (mode === 'specific') {
        const amt = apFormatAmount(specificInput && specificInput.value);
        rowsHtml += `<div class="rmr-pmt-field"><span class="rmr-pmt-field__label">You will pay</span><span class="rmr-pmt-field__value">${amt || '—'}</span></div>`;
      } else {
        const label = mode === 'current' ? 'Current Balance Due' : 'Total Balance Due';
        const maxAmt = apFormatAmount(maxInput && maxInput.value);
        if (maxAmt) {
          rowsHtml += `<div class="rmr-pmt-form-row"><div class="rmr-pmt-field"><span class="rmr-pmt-field__label">You will pay</span><span class="rmr-pmt-field__value">${label}</span></div><div class="rmr-pmt-field"><span class="rmr-pmt-field__label">Up to</span><span class="rmr-pmt-field__value">${maxAmt}</span></div></div>`;
        } else {
          rowsHtml += `<div class="rmr-pmt-field"><span class="rmr-pmt-field__label">You will pay</span><span class="rmr-pmt-field__value">${label}</span></div>`;
        }
      }

      rowsHtml += `<div class="rmr-pmt-field"><span class="rmr-pmt-field__label">Every ${AP_FREQUENCY_PERIODS[freq] || 'month'} starting on</span><span class="rmr-pmt-field__value">${startVal || '—'}</span></div>`;

      const intervalMonths = AP_FREQUENCY_MONTHS[freq];
      const startDate = startVal ? drParseDate(startVal) : null;
      if (intervalMonths && startDate) {
        rowsHtml += `<div class="rmr-pmt-field"><span class="rmr-pmt-field__label">Your payments will be processed on</span><span class="rmr-pmt-field__value">${apProcessedDates(startDate, intervalMonths)}</span></div>`;
      }
      summaryRows.innerHTML = rowsHtml;
    }
    // Both fields carry an inline style="display:flex", which beats the
    // [hidden] UA rule at equal specificity (same pitfall as Violation
    // Details' image wrap elsewhere in this file) — toggle display directly.
    function apShowAmountField(mode) {
      if (balanceField) balanceField.style.display = mode === 'specific' ? 'none' : 'flex';
      if (specificField) specificField.style.display = mode === 'specific' ? 'flex' : 'none';
    }
    function apResetForm() {
      amountOptions.forEach((o) => {
        o.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', o.dataset.amountOption === 'current');
      });
      apShowAmountField('current');
      if (maxInput) maxInput.value = '';
      if (specificInput) specificInput.value = '';
      if (freqValueEl && freqDropdown) {
        freqValueEl.textContent = 'Monthly';
        freqDropdown.querySelectorAll('[data-dropdown-option]').forEach((o) => {
          o.classList.toggle('rmr-dropdown__option--selected', o.textContent.trim() === 'Monthly');
        });
      }
      if (dayValueEl && dayDropdown) {
        dayValueEl.textContent = '1';
        dayDropdown.querySelectorAll('[data-dropdown-option]').forEach((o) => {
          o.classList.toggle('rmr-dropdown__option--selected', o.textContent.trim() === '1');
        });
      }
      if (startInput) startInput.value = '11/01/26';
      if (endInput) endInput.value = '';
      apUpdateSummary();
    }

    amountOptions.forEach((opt) => {
      opt.addEventListener('click', () => {
        amountOptions.forEach((o) => {
          o.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', o === opt);
        });
        apShowAmountField(opt.dataset.amountOption);
        apUpdateSummary();
      });
    });
    if (maxInput) maxInput.addEventListener('input', apUpdateSummary);
    if (specificInput) specificInput.addEventListener('input', apUpdateSummary);
    // setTimeout, not a direct call: this listener is attached (and so
    // fires) before the generic dropdown wiring's own option click handler
    // further down the file, which is what actually writes the picked
    // option into data-ap-frequency-value — reading it synchronously here
    // would still see the previous value.
    if (freqDropdown) freqDropdown.querySelectorAll('[data-dropdown-option]').forEach((o) => o.addEventListener('click', () => setTimeout(apUpdateSummary, 0)));
    if (dayDropdown) dayDropdown.querySelectorAll('[data-dropdown-option]').forEach((o) => o.addEventListener('click', () => setTimeout(apUpdateSummary, 0)));
    if (startInput) startInput.addEventListener('input', apUpdateSummary); // the calendar picker dispatches 'input' on pick, see apPick below

    // Reset to the empty state (Current Balance Due, no Max Amount, no End
    // Date) every time the flow is entered fresh — but not on "Back" from
    // the Payment Method step, which uses data-action="switch-modal" and so
    // never reaches this open-modal listener.
    document.querySelectorAll(`[data-action="open-modal"][data-modal-target="${backdrop.dataset.modalBackdrop}"]`).forEach((btn) => {
      btn.addEventListener('click', apResetForm);
    });

    apShowAmountField(selectedAmountOption());
    apUpdateSummary();
  });

  // Edit-in-place payment method form (pencil icon replaces the plain
  // method row with the real, pre-filled "Edit Saved Payment Method" card;
  // Cancel Changes/Save swap it back) — shared by Make a Payment, AutoPay
  // setup, and the Payment Settings page, so each toggle is scoped to its
  // own modal rather than always finding the first row/form in the page.
  // Per node 2045:7618, the form REPLACES the row (one card, never both at
  // once) rather than expanding underneath it.
  document.querySelectorAll('[data-action="ap-toggle-edit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const scope = btn.closest('.rmr-modal') || document;
      const form = scope.querySelector('[data-ap-edit-form]');
      const row = scope.querySelector('[data-ap-method-row]');
      if (form) form.hidden = !form.hidden;
      if (row) row.hidden = !row.hidden;
    });
  });

  // Payment Methods page — pencil/Cancel swap between the read-only view
  // (node 2099:7654) and the editable form (node 2045:418393).
  document.querySelectorAll('[data-action="pmm-toggle-edit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = document.querySelector('[data-pmm-view]');
      const edit = document.querySelector('[data-pmm-edit]');
      if (view) view.hidden = !view.hidden;
      if (edit) edit.hidden = !edit.hidden;
    });
  });

  // Custom dropdown (replaces native <select> so the open list can match the
  // design system's real "Dropdown" component instead of OS chrome — see
  // rmr.css). Every instance in this prototype has exactly one option, same
  // as the native selects they replaced, so opening one just re-confirms the
  // pre-filled value rather than offering a real choice.
  document.querySelectorAll('[data-dropdown]').forEach((dd) => {
    const trigger = dd.querySelector('[data-dropdown-trigger]');
    const valueEl = dd.querySelector('[data-dropdown-value]');
    const menu = dd.querySelector('[data-dropdown-menu]');
    const closeMenu = () => {
      menu.hidden = true;
      dd.classList.remove('rmr-dropdown--open', 'rmr-dropdown--menu-up');
    };
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = menu.hidden;
      document.querySelectorAll('[data-dropdown].rmr-dropdown--open').forEach((other) => {
        if (other !== dd) {
          other.querySelector('[data-dropdown-menu]').hidden = true;
          other.classList.remove('rmr-dropdown--open', 'rmr-dropdown--menu-up');
        }
      });
      if (willOpen) {
        // A plain scrolling ancestor (e.g. the Make a Payment/AutoPay method
        // step's .rmr-pmt-scroll) clips an absolutely-positioned menu the
        // same as any other overflowing content — unlike the native <select>
        // popup this replaced, which renders outside normal layout/clipping
        // entirely. Flip the menu above the trigger when there isn't room
        // below the nearest scrolling ancestor (falling back to the
        // viewport), so a field near the bottom of a scroll region still
        // shows its options instead of having them cut off.
        let scrollAncestor = dd.parentElement;
        while (scrollAncestor && scrollAncestor !== document.body) {
          const overflowY = getComputedStyle(scrollAncestor).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') break;
          scrollAncestor = scrollAncestor.parentElement;
        }
        const boundBottom = scrollAncestor && scrollAncestor !== document.body
          ? scrollAncestor.getBoundingClientRect().bottom
          : window.innerHeight;
        const estimatedMenuHeight = Math.min(menu.querySelectorAll('[data-dropdown-option]').length * 40 + 2, 240);
        // data-dropdown-no-flip opts a dropdown out of the flip check entirely
        // — meant for one sitting inside a short, non-scrolling modal (like
        // Polls' question steps) whose own overflow-y:auto is just a passive
        // long-content safety net, not a real scroll region the menu needs to
        // fit inside; the flip math above would otherwise measure that
        // modal's current (pre-menu) bottom edge and almost always flip, even
        // though the modal has plenty of headroom to grow and show the menu
        // below the trigger.
        const flip = !dd.hasAttribute('data-dropdown-no-flip')
          && trigger.getBoundingClientRect().bottom + estimatedMenuHeight > boundBottom;
        dd.classList.toggle('rmr-dropdown--menu-up', flip);
      }
      menu.hidden = !willOpen;
      dd.classList.toggle('rmr-dropdown--open', willOpen);
    });
    menu.querySelectorAll('[data-dropdown-option]').forEach((option) => {
      option.addEventListener('click', () => {
        menu.querySelectorAll('[data-dropdown-option]').forEach((o) => o.classList.remove('rmr-dropdown__option--selected'));
        option.classList.add('rmr-dropdown__option--selected');
        valueEl.textContent = option.textContent;
        valueEl.classList.remove('rmr-dropdown__value--placeholder');
        closeMenu();
      });
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('[data-dropdown].rmr-dropdown--open').forEach((dd) => {
      dd.querySelector('[data-dropdown-menu]').hidden = true;
      dd.classList.remove('rmr-dropdown--open', 'rmr-dropdown--menu-up');
    });
  });

  // Community page — the "View" dropdown (real Dropdown component, same markup/behavior as every
  // other dropdown above) additionally switches which calendar panel is showing, since unlike
  // every other dropdown in this prototype its options aren't just cosmetic. Month/Week/Day panels
  // ([data-comm-cal-view]) and the nav row's per-view date labels ([data-comm-cal-label]) both key
  // off the same option's data-comm-view value.
  document.querySelectorAll('[data-comm-view-select]').forEach((dd) => {
    dd.querySelectorAll('[data-dropdown-option]').forEach((option) => {
      option.addEventListener('click', () => {
        const view = option.dataset.commView;
        document.querySelectorAll('[data-comm-cal-view]').forEach((panel) => {
          panel.hidden = panel.dataset.commCalView !== view;
        });
        document.querySelectorAll('[data-comm-cal-label]').forEach((label) => {
          label.hidden = label.dataset.commCalLabel !== view;
        });
      });
    });
  });

  // Community page — Month view's "+x" overflow indicator (a day cell only
  // ever shows one event tile before it, so every cell stays the same fixed
  // size regardless of how many events land on that day). Clicking it opens
  // a single shared popover listing every event for that day, positioned off
  // the trigger's own rect rather than embedded in the cell, so it can't get
  // clipped by the calendar grid's overflow:hidden even from the bottom row.
  const CAL_DAY_EVENTS = {
    'oct-29': {
      label: 'Thu, Oct 29',
      events: [
        { time: '2:00 PM', endTime: '3:00 PM', label: 'Open House', category: 'Community Event', location: 'Leasing Office', description: 'Tour available units and meet the leasing team. Refreshments provided.' },
        { time: '4:00 PM', endTime: '5:00 PM', label: 'Halloween Contest', modifier: 'error', category: 'Community Event', location: 'Clubhouse Courtyard', description: 'Show off your best costume for a chance to win prizes.' },
        { time: '5:00 PM', endTime: '6:00 PM', label: 'Pumpkin Carving', category: 'Community Event', location: 'Clubhouse Courtyard', description: 'Pumpkins and carving tools provided — bring the family!' },
        { time: '6:00 PM', endTime: '7:00 PM', label: 'Trick-or-Treat Safety Patrol', category: 'Community Event', location: 'Property Grounds', description: 'Staff will patrol the grounds to keep trick-or-treaters safe.' },
        { time: '7:00 PM', endTime: '9:00 PM', label: 'Halloween Movie Night', modifier: 'movie', category: 'Movie Night', location: 'Clubhouse', description: 'A spooky double feature under the stars — popcorn included.' },
      ],
    },
  };
  const calDayPopover = document.querySelector('[data-cal-day-popover]');
  if (calDayPopover) {
    const closeCalDayPopover = () => { calDayPopover.hidden = true; };
    document.querySelectorAll('[data-action="cal-day-popover-open"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const data = CAL_DAY_EVENTS[btn.dataset.calDayKey];
        if (!data) return;
        calDayPopover.querySelector('[data-cal-day-popover-title]').textContent = data.label;
        calDayPopover.querySelector('[data-cal-day-popover-list]').innerHTML = data.events.map((ev) => `
          <button type="button" class="rmr-comm-cal__event${ev.modifier ? ` rmr-comm-cal__event--${ev.modifier}` : ''}" data-action="open-modal" data-modal-target="event-details" data-event-title="${ev.label}" data-event-category="${ev.category}" data-event-property="Riverview Apartments" data-event-location="${ev.location}" data-event-date="10/29/26" data-event-time="${ev.time} - ${ev.endTime}" data-event-description="${ev.description}">
            <span class="rmr-comm-cal__event-time">${ev.time}</span><span class="rmr-comm-cal__event-label">${ev.label}</span>
          </button>
        `).join('');

        const rect = btn.getBoundingClientRect();
        calDayPopover.style.top = `${rect.bottom + 4}px`;
        calDayPopover.style.left = `${rect.left}px`;
        calDayPopover.hidden = false;

        // Flip above/left if the popover would run off the viewport — same
        // idea as the Dropdown component's own flip check above.
        const pRect = calDayPopover.getBoundingClientRect();
        if (pRect.bottom > window.innerHeight) calDayPopover.style.top = `${rect.top - pRect.height - 4}px`;
        if (pRect.right > window.innerWidth) calDayPopover.style.left = `${window.innerWidth - pRect.width - 8}px`;
      });
    });
    document.querySelectorAll('[data-action="cal-day-popover-close"]').forEach((btn) => {
      btn.addEventListener('click', closeCalDayPopover);
    });
    document.addEventListener('click', (e) => {
      if (calDayPopover.hidden) return;
      if (!e.target.closest('[data-cal-day-popover]') && !e.target.closest('[data-action="cal-day-popover-open"]')) closeCalDayPopover();
    });
  }

  // Date Range picker — shared by every register page's "Date Range" filter
  // (Meter Readings, Service Issues, Architectural Requests, Payments &
  // Charges, Notes, Reports). Functionally modeled on Angular Material's
  // date-range-picker (material.angular.dev/components/datepicker/overview
  // #date-range-picker-forms): Start and End can each be set on their own,
  // not just as a single two-click range — but the field itself stays the
  // one merged box already defined for this prototype (two <span>s, a
  // divider, one calendar icon), not Material's own two-input layout. Which
  // span was clicked decides the mode: clicking the Start or End text edits
  // just that bound (pick a day, done, closes immediately); clicking the
  // icon (or the divider) opens the original whole-range picker instead.
  // One popover is built once and reused across every field on the page,
  // same approach as the Community calendar's "+x" day popover above. Every
  // commit re-runs the same live filter (see drFilterTables) immediately.
  const DR_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DR_WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Monday-first, per the real Date Range Field component (node 308:1878)

  function drParseDate(str) {
    const m = str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (!m) return null;
    let [, mo, day, yr] = m;
    if (yr.length === 2) yr = `20${yr}`;
    return new Date(Number(yr), Number(mo) - 1, Number(day));
  }
  function drFormatDate(date, fourDigitYear) {
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const yr = fourDigitYear ? String(date.getFullYear()) : String(date.getFullYear()).slice(-2);
    return `${mo}/${day}/${yr}`;
  }
  function drSameDay(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  // Top-level (not nested in the `if (drFieldEls.length)` block below) since
  // the AutoPay Schedule single-date picker further down reuses it too, on
  // pages (autopay.html) that have no Date Range Field and so never enter
  // that block.
  function drMondayIndex(date) { return (date.getDay() + 6) % 7; } // Sunday=0..Saturday=6 -> Monday=0..Sunday=6

  // Composable row filters — a register can have a Date Range field AND a
  // Status/Utility/etc. dropdown filtering the same table, so each filter
  // hides a row via its own dataset flag (rmrSetRowFilter) instead of the
  // usual straight `row.hidden = …`; a row shows only while every active
  // filter agrees, and the last filter to run can't clobber an earlier
  // one's hide state. Top-level (not nested in the `if (drFieldEls.length)`
  // block below) since the Status/Utility dropdown filters further down
  // need it on pages with no Date Range field too.
  function rmrFilterFooter(table) {
    if (table.dataset.payView) return document.querySelector(`.rmr-pay-table-footer[data-pay-view="${table.dataset.payView}"]`);
    const wrap = table.closest('.rmr-pay-table-wrap');
    let sib = wrap ? wrap.nextElementSibling : table.nextElementSibling;
    while (sib && !sib.matches('.rmr-acct-table-footer, .rmr-pay-table-footer')) sib = sib.nextElementSibling;
    return sib;
  }
  function rmrSetRowFilter(row, filterKey, show) {
    row.dataset[`filter${filterKey}`] = show ? '' : 'hide';
    row.hidden = Object.keys(row.dataset).some((k) => k.indexOf('filter') === 0 && row.dataset[k] === 'hide');
  }
  function rmrRefreshTableFooter(table) {
    const rows = Array.from(table.querySelectorAll(':scope > tbody > tr'));
    const visible = rows.filter((r) => !r.hidden).length;
    const footer = rmrFilterFooter(table);
    if (!footer) return;
    if (!footer.dataset.footerNoun) {
      const m = footer.textContent.match(/of\s+\d+\s+(.+)$/);
      footer.dataset.footerNoun = m ? m[1] : 'Items';
    }
    footer.textContent = `Showing ${visible} of ${rows.length} ${footer.dataset.footerNoun}`;
  }

  const drFieldEls = document.querySelectorAll('[data-action="open-daterange"]');
  if (drFieldEls.length) {
    const popover = document.createElement('div');
    popover.className = 'rmr-daterange-popover';
    popover.hidden = true;
    popover.innerHTML = `
      <div class="rmr-daterange-popover__nav">
        <button type="button" class="rmr-daterange-popover__nav-btn" data-dr-prev aria-label="Previous"><img src="../assets/icons/community/cal-arrow-left.svg" alt="" /></button>
        <button type="button" class="rmr-daterange-popover__month-label" data-dr-month-label aria-label="Choose year"></button>
        <button type="button" class="rmr-daterange-popover__nav-btn" data-dr-next aria-label="Next"><img src="../assets/icons/community/cal-arrow-right.svg" alt="" /></button>
      </div>
      <div class="rmr-daterange-popover__weekdays" data-dr-weekdays>${DR_WEEKDAYS.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="rmr-daterange-popover__days" data-dr-days></div>
      <div class="rmr-daterange-popover__footer" data-dr-footer>
        <button type="button" class="rmr-daterange-popover__footer-btn" data-dr-today>Today</button>
        <button type="button" class="rmr-daterange-popover__footer-btn" data-dr-clear>Clear</button>
      </div>
    `;
    document.body.appendChild(popover);

    const monthLabel = popover.querySelector('[data-dr-month-label]');
    const daysEl = popover.querySelector('[data-dr-days]');
    const weekdaysEl = popover.querySelector('[data-dr-weekdays]');
    const footerEl = popover.querySelector('[data-dr-footer]');
    const prevBtn = popover.querySelector('[data-dr-prev]');
    const nextBtn = popover.querySelector('[data-dr-next]');
    let activeField = null;
    let activeRole = null; // 'start' | 'end' | 'range' — which part of the field was clicked
    let fourDigitYear = false;
    let viewYear, viewMonth, rangeStart, rangeEnd;
    // drView cycles day -> year -> month -> day (node 308:1878): clicking
    // the "Month Year" label opens a scrollable Year list, picking a year
    // opens a scrollable Month list for it, and picking a month returns to
    // the day grid for that month/year. "‹" in Year/Month steps back one
    // level instead of paging (see drRender).
    let drView = 'days'; // 'days' | 'months' | 'years'

    function drSpans(field) {
      const spans = field.querySelectorAll(':scope > span:not(.rmr-pay-field__divider)');
      return { startSpan: spans[0], endSpan: spans[1] };
    }
    function drRoleFromTarget(field, target) {
      const { startSpan, endSpan } = drSpans(field);
      if (startSpan && (target === startSpan || startSpan.contains(target))) return 'start';
      if (endSpan && (target === endSpan || endSpan.contains(target))) return 'end';
      return 'range';
    }

    // Every table[data-date-col] in the same card as `field` (both tabs, if
    // the page has them, so a tab switched to later still reflects the last-
    // applied range) gets its rows hidden/shown by its own date-col cell,
    // and its own "Showing X of Y ___" footer recomputed to match — rather
    // than the date field being decorative like every other filter in this
    // prototype (see PROTOTYPE.md).
    function drFilterTables(field, start, end) {
      const scope = field.closest('.rmr-settings-card, .rmr-comm-card, .rmr-pay-section') || document;
      scope.querySelectorAll('table[data-date-col]').forEach((table) => {
        const colIdx = Number(table.dataset.dateCol);
        table.querySelectorAll(':scope > tbody > tr').forEach((row) => {
          const cell = row.children[colIdx];
          const date = cell ? drParseDate(cell.textContent.trim()) : null;
          rmrSetRowFilter(row, 'Date', !date || (date >= start && date <= end));
        });
        rmrRefreshTableFooter(table);
      });
    }

    // Clear removes the filter entirely (every row shows again, footer count
    // restored to the real total) rather than trying to represent an "empty"
    // range within a start/end that's otherwise always some real date — the
    // field's own two spans fall back to "Start date"/"End date" placeholder
    // text (same var(--text-accent) italic treatment every other input's
    // ::placeholder already uses in this file) to match Material's range
    // picker clearing back to its own unset placeholder state.
    function drClearAll(field) {
      const scope = field.closest('.rmr-settings-card, .rmr-comm-card, .rmr-pay-section') || document;
      scope.querySelectorAll('table[data-date-col]').forEach((table) => {
        table.querySelectorAll(':scope > tbody > tr').forEach((row) => rmrSetRowFilter(row, 'Date', true));
        rmrRefreshTableFooter(table);
      });
      const { startSpan, endSpan } = drSpans(field);
      if (startSpan) { startSpan.textContent = 'Start date'; startSpan.classList.add('rmr-daterange-placeholder'); }
      if (endSpan) { endSpan.textContent = 'End date'; endSpan.classList.add('rmr-daterange-placeholder'); }
    }

    function drCommit(field) {
      if (!rangeStart) return;
      const { startSpan, endSpan } = drSpans(field);
      if (startSpan) { startSpan.textContent = drFormatDate(rangeStart, fourDigitYear); startSpan.classList.remove('rmr-daterange-placeholder'); }
      if (endSpan) { endSpan.textContent = drFormatDate(rangeEnd || rangeStart, fourDigitYear); endSpan.classList.remove('rmr-daterange-placeholder'); }
      drFilterTables(field, rangeStart, rangeEnd || rangeStart);
    }

    function drRenderDays() {
      daysEl.className = 'rmr-daterange-popover__days';
      const firstWeekday = drMondayIndex(new Date(viewYear, viewMonth, 1));
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
      let html = '';
      for (let i = firstWeekday - 1; i >= 0; i--) {
        html += `<button type="button" class="rmr-daterange-popover__day" disabled><span class="rmr-daterange-popover__day-inner">${daysInPrevMonth - i}</span></button>`;
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(viewYear, viewMonth, d);
        const isStart = drSameDay(date, rangeStart);
        const isEnd = drSameDay(date, rangeEnd);
        const inRange = rangeStart && rangeEnd && date > rangeStart && date < rangeEnd;
        const classes = ['rmr-daterange-popover__day'];
        if (isStart || inRange || isEnd) classes.push('rmr-daterange-popover__day--in-range');
        if (isStart) classes.push('rmr-daterange-popover__day--range-start');
        if (isEnd) classes.push('rmr-daterange-popover__day--range-end');
        html += `<button type="button" class="${classes.join(' ')}" data-dr-day="${d}"><span class="rmr-daterange-popover__day-inner">${d}</span></button>`;
      }
      const trailing = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
      for (let d = 1; d <= trailing; d++) {
        html += `<button type="button" class="rmr-daterange-popover__day" disabled><span class="rmr-daterange-popover__day-inner">${d}</span></button>`;
      }
      daysEl.innerHTML = html;
      daysEl.querySelectorAll('[data-dr-day]').forEach((btn) => {
        btn.addEventListener('click', () => drPickDate(new Date(viewYear, viewMonth, Number(btn.dataset.drDay))));
      });
    }

    // Year/Month are their own scrollable single-column lists (node 308:1878
    // — a plain list of rows with the current one highlighted, not a grid),
    // not just a compact grid variant of the day view.
    function drRenderMonths() {
      daysEl.className = 'rmr-daterange-popover__list';
      daysEl.innerHTML = DR_MONTHS.map((m, i) => {
        const current = i === viewMonth ? ' rmr-daterange-popover__list-item--current' : '';
        return `<button type="button" class="rmr-daterange-popover__list-item${current}" data-dr-month="${i}">${m}</button>`;
      }).join('');
      daysEl.querySelectorAll('[data-dr-month]').forEach((btn) => {
        btn.addEventListener('click', () => {
          viewMonth = Number(btn.dataset.drMonth);
          drView = 'days';
          drRender();
        });
      });
      daysEl.querySelector('.rmr-daterange-popover__list-item--current')?.scrollIntoView({ block: 'center' });
    }

    function drRenderYears() {
      daysEl.className = 'rmr-daterange-popover__list';
      let html = '';
      for (let y = viewYear - 50; y <= viewYear + 50; y++) {
        const current = y === viewYear ? ' rmr-daterange-popover__list-item--current' : '';
        html += `<button type="button" class="rmr-daterange-popover__list-item${current}" data-dr-year="${y}">${y}</button>`;
      }
      daysEl.innerHTML = html;
      daysEl.querySelectorAll('[data-dr-year]').forEach((btn) => {
        btn.addEventListener('click', () => {
          viewYear = Number(btn.dataset.drYear);
          drView = 'months';
          drRender();
        });
      });
      daysEl.querySelector('.rmr-daterange-popover__list-item--current')?.scrollIntoView({ block: 'center' });
    }

    // Day's "‹›" pair page by month; Year/Month only ever show "‹" and it
    // steps back one level in the day -> year -> month chain instead of
    // paging (there's nothing to page — each is one continuous scroll list).
    function drRender() {
      weekdaysEl.hidden = drView !== 'days';
      nextBtn.hidden = drView !== 'days';
      // Today/Clear act on the picked date, which only exists as a concept
      // in the day grid — Year/Month are just a way to get there faster.
      footerEl.hidden = drView !== 'days';
      if (drView === 'years') {
        monthLabel.textContent = 'Year';
        prevBtn.setAttribute('aria-label', 'Back to calendar');
        drRenderYears();
      } else if (drView === 'months') {
        monthLabel.textContent = 'Month';
        prevBtn.setAttribute('aria-label', 'Back to year');
        drRenderMonths();
      } else {
        monthLabel.textContent = `${DR_MONTHS[viewMonth]} ${viewYear}`;
        prevBtn.setAttribute('aria-label', 'Previous month');
        drRenderDays();
      }
    }

    // Shared by a day-cell click and the Today button — same branching
    // either way, since "Today" is just a shortcut for picking today's date.
    function drPickDate(date) {
      if (activeRole === 'start') {
        // Editing Start on its own — move End along with it if that would
        // otherwise put the range backwards, same as Material clamps an
        // out-of-order edit rather than rejecting it.
        rangeStart = date;
        if (rangeEnd && rangeStart > rangeEnd) rangeEnd = date;
        drCommit(activeField);
        drClose();
      } else if (activeRole === 'end') {
        rangeEnd = date;
        if (rangeStart && rangeEnd < rangeStart) rangeStart = date;
        drCommit(activeField);
        drClose();
      } else {
        // Opened from the icon/divider — the original two-click sequence:
        // first click starts a fresh range, second finishes it and commits/
        // closes immediately (no separate Apply button, consistent with the
        // single-bound edits above).
        if (!rangeStart || (rangeStart && rangeEnd)) {
          rangeStart = date;
          rangeEnd = null;
          drRender();
        } else if (date < rangeStart) {
          rangeEnd = rangeStart;
          rangeStart = date;
          drCommit(activeField);
          drClose();
        } else {
          rangeEnd = date;
          drCommit(activeField);
          drClose();
        }
      }
    }

    function drPosition(anchor) {
      const rect = anchor.getBoundingClientRect();
      popover.style.top = `${rect.bottom + 4}px`;
      popover.style.left = `${rect.left}px`;
      popover.hidden = false;
      const pRect = popover.getBoundingClientRect();
      if (pRect.bottom > window.innerHeight) popover.style.top = `${rect.top - pRect.height - 4}px`;
      if (pRect.right > window.innerWidth) popover.style.left = `${window.innerWidth - pRect.width - 8}px`;
    }

    function drOpen(field, role) {
      activeField = field;
      activeRole = role;
      drView = 'days';
      const { startSpan, endSpan } = drSpans(field);
      // Read from the field's own remembered format (set once from its
      // initial value below) rather than re-inferring from the current span
      // text each time — after Clear empties both spans, a 4-digit-year
      // page (Architectural Requests, Payments & Charges) would otherwise
      // silently fall back to a 2-digit year on the next pick.
      fourDigitYear = field.dataset.drFourDigitYear === 'true';
      rangeStart = drParseDate(startSpan?.textContent || '') || new Date();
      rangeEnd = drParseDate(endSpan?.textContent || '') || null;
      const focusDate = role === 'end' ? (rangeEnd || rangeStart) : rangeStart;
      viewYear = focusDate.getFullYear();
      viewMonth = focusDate.getMonth();
      drRender();

      document.querySelectorAll('.rmr-pay-field__input--active').forEach((el) => el.classList.remove('rmr-pay-field__input--active'));
      field.classList.add('rmr-pay-field__input--active');

      drPosition(field);
    }
    function drClose() {
      popover.hidden = true;
      if (activeField) activeField.classList.remove('rmr-pay-field__input--active');
      activeField = null;
      activeRole = null;
    }

    drFieldEls.forEach((field) => {
      const { startSpan } = drSpans(field);
      field.dataset.drFourDigitYear = String((startSpan?.textContent || '').length > 8);
      field.addEventListener('click', (e) => {
        e.stopPropagation();
        const role = drRoleFromTarget(field, e.target);
        if (!popover.hidden && activeField === field && activeRole === role) { drClose(); return; }
        drOpen(field, role);
      });
    });
    prevBtn.addEventListener('click', () => {
      if (drView === 'years') { drView = 'days'; }
      else if (drView === 'months') { drView = 'years'; }
      else { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } }
      drRender();
    });
    nextBtn.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      drRender();
    });
    // Clicking "Month Year" opens the Year list (only from the day grid —
    // Year/Month's own headers are plain labels, not another forward step).
    monthLabel.addEventListener('click', () => {
      if (drView === 'days') {
        drView = 'years';
        drRender();
      }
    });
    popover.querySelector('[data-dr-today]').addEventListener('click', () => {
      const today = new Date();
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      drPickDate(new Date(viewYear, viewMonth, today.getDate()));
    });
    popover.querySelector('[data-dr-clear]').addEventListener('click', () => {
      if (activeField) drClearAll(activeField);
      drClose();
    });
    popover.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
      if (!popover.hidden && !e.target.closest('.rmr-daterange-popover') && !e.target.closest('[data-action="open-daterange"]')) drClose();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !popover.hidden) drClose(); });
  }

  // Status / Utility / etc. dropdown filters — e.g. Meter Readings' Utility
  // filter, Architectural Requests' Status filter. A dropdown opts in with
  // data-filter-target="<name>"; every table in the same card that carries a
  // matching data-<name>-col="N" gets its row N-th cell compared against the
  // picked option text (an exact match, or "All"). Reuses the same
  // composable rmrSetRowFilter/rmrRefreshTableFooter as the Date Range field
  // above so the two combine instead of one undoing the other, and a table
  // with two tabs (e.g. My Requests / Requests to Review) both stay filtered
  // even while one tab is hidden, so switching tabs doesn't lose it.
  document.querySelectorAll('[data-dropdown][data-filter-target]').forEach((dropdown) => {
    const key = dropdown.dataset.filterTarget;
    const colAttr = `data-${key}-col`;
    const scope = dropdown.closest('.rmr-settings-card, .rmr-comm-card, .rmr-pay-section') || document;
    dropdown.querySelectorAll('[data-dropdown-option]').forEach((option) => {
      option.addEventListener('click', () => {
        const selected = option.textContent.trim();
        scope.querySelectorAll(`table[${colAttr}]`).forEach((table) => {
          const colIdx = Number(table.getAttribute(colAttr));
          table.querySelectorAll(':scope > tbody > tr').forEach((row) => {
            const cell = row.children[colIdx];
            const text = cell ? cell.textContent.trim() : '';
            rmrSetRowFilter(row, key, selected === 'All' || text === selected);
          });
          rmrRefreshTableFooter(table);
        });
      });
    });
  });

  // AutoPay Schedule — Start Date / End Date (payments.html, dashboard.html,
  // autopay.html). Same calendar visuals as the Date Range Field above
  // (rmr-daterange-popover), reusing its month/weekday helpers, but each
  // field just picks one plain date into its own <input> rather than a
  // start/end pair tied to table filtering.
  const apDateInputs = document.querySelectorAll('.rmr-ap-date-input');
  if (apDateInputs.length) {
    const apPopover = document.createElement('div');
    apPopover.className = 'rmr-daterange-popover';
    apPopover.hidden = true;
    apPopover.innerHTML = `
      <div class="rmr-daterange-popover__nav">
        <button type="button" class="rmr-daterange-popover__nav-btn" data-ap-cal-prev aria-label="Previous month"><img src="../assets/icons/community/cal-arrow-left.svg" alt="" /></button>
        <span class="rmr-daterange-popover__month-label" data-ap-cal-month-label></span>
        <button type="button" class="rmr-daterange-popover__nav-btn" data-ap-cal-next aria-label="Next month"><img src="../assets/icons/community/cal-arrow-right.svg" alt="" /></button>
      </div>
      <div class="rmr-daterange-popover__weekdays">${DR_WEEKDAYS.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="rmr-daterange-popover__days" data-ap-cal-days></div>
    `;
    document.body.appendChild(apPopover);

    const apMonthLabel = apPopover.querySelector('[data-ap-cal-month-label]');
    const apDaysEl = apPopover.querySelector('[data-ap-cal-days]');
    let apActiveInput = null;
    let apViewYear, apViewMonth, apPicked;

    function apRenderDays() {
      const firstWeekday = drMondayIndex(new Date(apViewYear, apViewMonth, 1));
      const daysInMonth = new Date(apViewYear, apViewMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(apViewYear, apViewMonth, 0).getDate();
      let html = '';
      for (let i = firstWeekday - 1; i >= 0; i--) {
        html += `<button type="button" class="rmr-daterange-popover__day" disabled><span class="rmr-daterange-popover__day-inner">${daysInPrevMonth - i}</span></button>`;
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(apViewYear, apViewMonth, d);
        const selected = drSameDay(date, apPicked) ? ' rmr-daterange-popover__day--range-start' : '';
        html += `<button type="button" class="rmr-daterange-popover__day${selected}" data-ap-cal-day="${d}"><span class="rmr-daterange-popover__day-inner">${d}</span></button>`;
      }
      const trailing = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
      for (let d = 1; d <= trailing; d++) {
        html += `<button type="button" class="rmr-daterange-popover__day" disabled><span class="rmr-daterange-popover__day-inner">${d}</span></button>`;
      }
      apDaysEl.innerHTML = html;
      apDaysEl.querySelectorAll('[data-ap-cal-day]').forEach((btn) => {
        btn.addEventListener('click', () => apPick(new Date(apViewYear, apViewMonth, Number(btn.dataset.apCalDay))));
      });
    }
    function apRender() {
      apMonthLabel.textContent = `${DR_MONTHS[apViewMonth]} ${apViewYear}`;
      apRenderDays();
    }
    function apPick(date) {
      if (apActiveInput) {
        apActiveInput.value = drFormatDate(date, false);
        // Programmatic .value doesn't fire 'input' on its own — the AutoPay
        // Balance summary card listens for it to recompute live.
        apActiveInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      apClose();
    }
    function apPosition(anchor) {
      const rect = anchor.getBoundingClientRect();
      apPopover.style.top = `${rect.bottom + 4}px`;
      apPopover.style.left = `${rect.left}px`;
      apPopover.hidden = false;
      const pRect = apPopover.getBoundingClientRect();
      if (pRect.bottom > window.innerHeight) apPopover.style.top = `${rect.top - pRect.height - 4}px`;
      if (pRect.right > window.innerWidth) apPopover.style.left = `${window.innerWidth - pRect.width - 8}px`;
    }
    function apOpen(input) {
      apActiveInput = input;
      apPicked = drParseDate(input.value) || new Date();
      apViewYear = apPicked.getFullYear();
      apViewMonth = apPicked.getMonth();
      apRender();
      apPosition(input.closest('.rmr-ap-date-wrap') || input);
    }
    function apClose() {
      apPopover.hidden = true;
      apActiveInput = null;
    }

    // Read-only (not disabled): still focusable/clickable to open the
    // calendar, just not hand-typeable — the calendar icon has
    // pointer-events:none (see rmr.css) so a click anywhere on the field,
    // icon included, lands on the input itself.
    apDateInputs.forEach((input) => {
      input.setAttribute('readonly', '');
      input.addEventListener('click', (e) => { e.stopPropagation(); apOpen(input); });
    });
    apPopover.querySelector('[data-ap-cal-prev]').addEventListener('click', () => {
      apViewMonth--; if (apViewMonth < 0) { apViewMonth = 11; apViewYear--; }
      apRender();
    });
    apPopover.querySelector('[data-ap-cal-next]').addEventListener('click', () => {
      apViewMonth++; if (apViewMonth > 11) { apViewMonth = 0; apViewYear++; }
      apRender();
    });
    apPopover.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
      if (!apPopover.hidden && !e.target.closest('.rmr-daterange-popover') && !e.target.closest('.rmr-ap-date-wrap')) apClose();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !apPopover.hidden) apClose(); });
  }

  // Payment Methods page — Bank Account / Card type selection.
  document.querySelectorAll('[data-action="pmm-select-type"]').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-action="pmm-select-type"]').forEach((c) => {
        const selected = c === card;
        c.classList.toggle('rmr-pmm-type-card--selected', selected);
        c.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', selected);
      });
      const type = card.dataset.methodType;
      document.querySelectorAll('[data-pmm-fields]').forEach((fieldset) => {
        fieldset.hidden = fieldset.dataset.pmmFields !== type;
      });
    });
  });

  // Payment Methods page — Save stays disabled (matching the design's
  // default state) until Terms and Conditions is checked.
  const pmmTerms = document.querySelector('[data-pmm-terms]');
  const pmmSave = document.querySelector('[data-pmm-save]');
  if (pmmTerms && pmmSave) {
    pmmTerms.addEventListener('change', () => {
      pmmSave.disabled = !pmmTerms.checked;
    });
  }

  // AutoPay setup — "Schedule" finishes the flow: close the wizard, show the
  // Success screen, and flip the Balance Due AutoPay banner from its empty
  // "Set up AutoPay" state to "AutoPay Scheduled" once Success is dismissed.
  // Also persists the shared "scheduled" flag so autopay.html (reached via
  // Payment Settings) reflects it too, per the "empty unless already set up
  // on the Payments screen" instruction.
  document.querySelectorAll('[data-action="ap-schedule"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const method = document.querySelector('[data-modal-backdrop="autopay-method"]');
      const success = document.querySelector('[data-modal-backdrop="autopay-success"]');
      if (method) method.hidden = true;
      if (success) success.hidden = false;
      const emptyBanner = document.querySelector('[data-autopay-state="empty"]');
      const scheduledBanner = document.querySelector('[data-autopay-state="scheduled"]');
      if (emptyBanner) emptyBanner.hidden = true;
      if (scheduledBanner) scheduledBanner.hidden = false;
      rmrSetAutopayScheduled(true);
    });
  });

  // Balance Due AutoPay banner — defaults to "empty" in the HTML, but should
  // reflect AutoPay already having been scheduled from the *other* entry
  // point (Payment Settings' AutoPay page) on load.
  if (rmrIsAutopayScheduled()) {
    const emptyBanner = document.querySelector('[data-autopay-state="empty"]');
    const scheduledBanner = document.querySelector('[data-autopay-state="scheduled"]');
    if (emptyBanner && scheduledBanner) {
      emptyBanner.hidden = true;
      scheduledBanner.hidden = false;
    }
  }

  // Payment Settings' AutoPay row — same shared flag, same "empty unless
  // already scheduled elsewhere" default.
  if (rmrIsAutopayScheduled()) {
    const emptyRow = document.querySelector('[data-autopay-row-state="empty"]');
    const scheduledRow = document.querySelector('[data-autopay-row-state="scheduled"]');
    if (emptyRow && scheduledRow) {
      emptyRow.hidden = true;
      scheduledRow.hidden = false;
    }
  }

  // Balance Due card, Open Charges, and All Activity — reflect a payment
  // already submitted (from either this visit or an earlier one).
  if (rmrIsPaymentPaid()) rmrApplyPaymentPaid();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('[data-modal-backdrop]').forEach((backdrop) => {
      if (!backdrop.hidden) closeModal(backdrop);
    });
  });

  // Document Center — Renewal Available banner hides itself once the lease
  // renewal document has already been signed via document-sign.html (see
  // sign-complete/submit-signed-doc below), the same "already done, don't
  // invite re-review" pattern as the AutoPay banner's own persisted state.
  if (rmrIsRenewalSigned()) {
    document.querySelectorAll('[data-renewal-banner]').forEach((banner) => { banner.hidden = true; });
  }

  // Document Center — Documents to Sign / Leases & Documents. Once the
  // tenant has signed a policy doc (data-dts-row, keyed the same as
  // RMR_SIGN_DOCS), its signer count reflects that signature — and once
  // that brings it to its full required signer count (Parking Policy:
  // 1 of 2 -> 2 of 2), it's actually DONE and moves into its real Leases &
  // Documents folder (data-dtl-row, same key, hidden until then). A doc
  // still short a signer after the tenant's own (Pet Policy Update:
  // 0 of 2 -> 1 of 2) just stays in the register with its bumped count —
  // either way its Sign link is spent, since the tenant's own part is done
  // regardless of whether the whole document is.
  document.querySelectorAll('[data-dts-row]').forEach((row) => {
    if (!rmrIsDocSigned(row.dataset.dtsRow)) return;
    const cell = row.querySelector('[data-dts-signers]');
    let complete = false;
    if (cell) {
      const [signed, total] = cell.dataset.dtsSigners.split(',').map(Number);
      const nowSigned = Math.min(signed + 1, total);
      cell.textContent = `${nowSigned} of ${total}`;
      complete = nowSigned >= total;
    }
    const signLink = row.querySelector('[data-dts-sign-link]');
    if (signLink) {
      signLink.textContent = 'Signed';
      signLink.removeAttribute('href');
      signLink.toggleAttribute('disabled', true);
    }
    if (complete) row.hidden = true;
  });
  document.querySelectorAll('[data-dtl-row]').forEach((row) => {
    if (rmrIsDocSigned(row.dataset.dtlRow)) row.hidden = false;
  });
  const dtsFooter = document.querySelector('[data-dts-footer]');
  if (dtsFooter) {
    const visible = document.querySelectorAll('[data-dts-row]:not([hidden])').length;
    dtsFooter.textContent = `${visible} Total Document${visible === 1 ? '' : 's'}`;
  }

  // Review Multiple Term Offers — selecting a different term card, same
  // radio-card pattern as pmt-select-amount (visual selection only; each
  // card's own numbers are fixed, real content from the source frame).
  // Accept Offer carries the picked term (data-offer-term) through to
  // document-sign.html as ?term=, so the letter's own lease-preference
  // dropdown can open pre-filled with it instead of a blank "Select an
  // option" — see the matching read of ?term= there.
  document.querySelectorAll('[data-action="offer-select"]').forEach((card) => {
    card.addEventListener('click', () => {
      card.parentElement.querySelectorAll('[data-action="offer-select"]').forEach((c) => {
        const selected = c === card;
        c.classList.toggle('rmr-offer-card--selected', selected);
        c.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', selected);
      });
      const acceptLink = document.querySelector('[data-accept-offer-link]');
      if (acceptLink && card.dataset.offerTerm) {
        const url = new URL(acceptLink.href, location.href);
        url.searchParams.set('term', card.dataset.offerTerm);
        acceptLink.href = `${url.pathname}${url.search}`;
      }
    });
  });

  // Decline All Offers — closes both the Decline All Offers modal and the
  // Review Multiple Term Offers modal underneath it (the generic fake-submit
  // handler only closes the one ancestor backdrop, which isn't enough here
  // since these are two separate, non-nested overlays).
  document.querySelectorAll('[data-action="decline-all-submit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const declineAll = document.querySelector('[data-modal-backdrop="decline-all-offers"]');
      const review = document.querySelector('[data-modal-backdrop="review-offers"]');
      if (declineAll) closeModal(declineAll);
      if (review) closeModal(review);
      showToast('Your renewal offers have been declined.');
    });
  });

  // Sign Document — once the tenant has a signature on file (rmrHasSignature,
  // set below the first time they actually sign something), every later
  // "Click to Sign"/footer Sign entry point should open the Document
  // Signature preview (signature already filled in) instead of the blank
  // Add Signature step, matching a real e-sign flow that remembers your
  // signature — "Enter a New Signature" there still reaches Add Signature.
  // Capture phase so the trigger's data-modal-target is rewritten before the
  // open-modal/switch-modal handlers (which read it at click time) run.
  document.addEventListener('click', (e) => {
    if (!rmrHasSignature()) return;
    const trigger = e.target.closest('[data-modal-target="add-signature"]');
    if (trigger) trigger.dataset.modalTarget = 'document-signature';
  }, true);

  // Sign Document — "Sign" in the Add Signature (or the remembered-signature
  // Document Signature preview, see rmrHasSignature below) modal finishes
  // the wizard: fills in the document's own embedded lease-preference value
  // and cursive signature line, marks the sidebar Sign button as done so
  // Finish Signing can proceed straight to Submit, and remembers that this
  // tenant now has a signature on file for next time.
  document.querySelectorAll('[data-action="sign-complete"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      rmrSetHasSignature(true);
      const wizard = btn.closest('[data-modal-backdrop]');
      if (wizard) closeModal(wizard);
      // Respects whatever's already showing (prefilled from the previous
      // screen's term card, or manually picked from the dropdown's now-real
      // 6/12/24/MTM options) — only falls back to a default if the tenant
      // reached Sign without ever touching it.
      const leaseValue = document.querySelector('[data-sign-lease-value]');
      if (leaseValue && leaseValue.textContent === 'Select an option') leaseValue.textContent = '12-month lease renewal';
      // The lease renewal letter carries two attention fields (its own
      // lease-preference dropdown, plus the Click to Sign box added at the
      // bottom of the letter) where the Parking/Pet policy docs only ever
      // have the one — querySelectorAll so signing clears both.
      document.querySelectorAll('[data-sign-field-attention]').forEach((fieldAttention) => {
        fieldAttention.classList.remove('rmr-field-attention');
        // The lease-preference dropdown is a real answer that stays visible
        // after signing; the Click to Sign box (default letter and the
        // Parking/Pet policy docs alike) is just a "sign here" prompt with
        // nothing to keep showing once the cursive signature below it
        // takes over.
        if ('signHideOnSign' in fieldAttention.dataset) fieldAttention.hidden = true;
      });
      const signatureLine = document.querySelector('[data-sign-signature-line]');
      if (signatureLine) signatureLine.hidden = false;
      const signBtn = document.querySelector('[data-sign-btn]');
      if (signBtn) {
        signBtn.classList.add('rmr-sign-footer__action--done');
        signBtn.dataset.signed = 'true';
        const label = signBtn.querySelector('[data-sign-btn-label]');
        if (label) label.textContent = 'Signed';
      }
    });
  });

  // Finish Signing — if the document hasn't been signed yet, show the real
  // Missing Required Fields error (matching the source content exactly,
  // "Add Signature" listed as the missing field on Page 1); otherwise go
  // straight to the Submit Signed Document confirmation.
  document.querySelectorAll('[data-action="sign-finish"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const signBtn = document.querySelector('[data-sign-btn]');
      const signed = signBtn && signBtn.dataset.signed === 'true';
      const target = document.querySelector(`[data-modal-backdrop="${signed ? 'submit-signed-doc' : 'missing-fields'}"]`);
      if (target) target.hidden = false;
    });
  });

  // Submit Signed Document — Submit persists the "already signed" flag so
  // Document Center reflects it on return: the lease renewal itself hides
  // the Renewal Available banner, while a Parking/Pet policy doc is tracked
  // per its own RMR_SIGN_DOCS key instead (see the Documents to
  // Sign/Leases & Documents wiring below).
  document.querySelectorAll('[data-modal-target="document-signed-success"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (rmrSignDocIsPolicy) rmrSetDocSigned(rmrSignDocKey, true);
      else rmrSetRenewalSigned(true);
    });
  });

  // Submit Signed Document — Submit, node 2677:26211's "Loading overlay":
  // closes the confirmation modal and shows the "document is being
  // finalized" spinner over the document itself for a couple seconds before
  // Document Signed Successfully opens, instead of switching modals
  // instantly like every other step in this flow.
  document.querySelectorAll('[data-action="sign-submit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.querySelector(`[data-modal-backdrop="${btn.dataset.modalCloseCurrent}"]`);
      const next = document.querySelector(`[data-modal-backdrop="${btn.dataset.modalTarget}"]`);
      const loading = document.querySelector('[data-sign-loading]');
      if (current) closeModal(current);
      if (loading) loading.hidden = false;
      setTimeout(() => {
        if (loading) loading.hidden = true;
        if (next) next.hidden = false;
      }, 2200);
    });
  });

  // Account dropdown (User Info popover) — from the "2.0.2 Tasks on Linked
  // Account" frame. Opens/closes; every item inside is otherwise inert
  // (handled by fake-submit above).
  const accountToggle = document.querySelector('[data-action="toggle-account-menu"]');
  if (accountToggle) {
    accountToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = document.querySelector('[data-account-menu]');
      if (!menu) return;
      menu.hidden = !menu.hidden;
    });
  }
  document.addEventListener('click', (e) => {
    const menu = document.querySelector('[data-account-menu]');
    if (menu && !menu.hidden && !menu.contains(e.target) && e.target !== accountToggle && !(accountToggle && accountToggle.contains(e.target))) {
      closeAccountMenu();
    }
  });

  // Account page — Details/Contacts/Settings/Linked Accounts tabs (real
  // "Tabs" component, file GHtjX6TVj9OpVUXTyShguj, underline style rather
  // than the segmented Option Toggle used for Open Charges/All Activity).
  // Also deep-linkable via a URL hash (e.g. "account.html#linked") so the
  // header's account menu can jump straight to a tab — both on first load
  // and via a same-page hash click, which doesn't fire a fresh page load.
  const acctTabs = document.querySelectorAll('[data-action="acct-tab"]');
  if (acctTabs.length) {
    const selectAcctTab = (target) => {
      let matched = false;
      acctTabs.forEach((t) => {
        const selected = t.dataset.acctTarget === target;
        if (selected) matched = true;
        t.classList.toggle('rmr-acct-tab--selected', selected);
        t.setAttribute('aria-selected', String(selected));
      });
      if (!matched) return;
      document.querySelectorAll('[data-acct-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.acctPanel !== target;
      });
    };
    acctTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        selectAcctTab(tab.dataset.acctTarget);
        // Keep the URL hash in sync with a manually-clicked tab (replaceState
        // rather than assigning location.hash, so this doesn't itself fire a
        // hashchange or add a history entry per tab click) — otherwise a
        // repeat click on the account-menu's "Linked Accounts" link could
        // no-op if the hash was already "#linked" from an earlier visit.
        history.replaceState(null, '', `#${tab.dataset.acctTarget}`);
      });
    });
    const acctTabFromHash = () => {
      const hash = location.hash.replace('#', '');
      if (hash) selectAcctTab(hash);
    };
    acctTabFromHash();
    window.addEventListener('hashchange', acctTabFromHash);
  }

  // Account Details' kebab (⋮) menu — same open/close-on-outside-click
  // pattern as the header's account menu, scoped to its own toggle/menu pair
  // instead of a single page-wide singleton.
  document.querySelectorAll('[data-action="toggle-kebab-menu"]').forEach((btn) => {
    const menu = btn.closest('.rmr-acct-kebab')?.querySelector('[data-kebab-menu]');
    if (!menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('[data-kebab-menu]').forEach((menu) => {
      if (!menu.hidden && !menu.contains(e.target)) menu.hidden = true;
    });
  });

  // Settings tab — Community Directory sub-options (Include Phone Number /
  // Include Email) only make sense while the directory listing itself is on.
  document.querySelectorAll('[data-action="acct-toggle-directory"]').forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const options = document.querySelector('[data-acct-directory-options]');
      if (options) options.hidden = !toggle.checked;
    });
  });

  // Linked Accounts table / Contact Information modal — single-select radio
  // ("Default" account, "Primary Phone") scoped to the enclosing table so
  // each table's own radio group is independent.
  document.querySelectorAll('[data-action="acct-select-default"]').forEach((radio) => {
    radio.addEventListener('click', () => {
      const scope = radio.closest('table') || document;
      scope.querySelectorAll('[data-action="acct-select-default"]').forEach((r) => {
        r.classList.toggle('rmr-pmt-radio--selected', r === radio);
      });
    });
  });

  // Payments & Charges "Open Charges" / "All Activity" toggle — real Option
  // Toggle control switching between frames 4.1.2 and 4.1.3's table content.
  document.querySelectorAll('[data-action="pay-toggle"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.payTarget;
      document.querySelectorAll('[data-action="pay-toggle"]').forEach((b) => {
        const active = b === btn;
        b.classList.toggle('rmr-pay-toggle__btn--active', active);
        b.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('[data-pay-view]').forEach((el) => {
        el.hidden = el.dataset.payView !== target;
      });
    });
  });

  // Service Issues register (maintenance.html) — Open Issues / Closed Issues
  // tabs. Reuses the same underline "Tabs" component/classes as Account
  // Settings (.rmr-acct-tab / .rmr-acct-tab--selected), confirmed to be the
  // identical component in file 41cZMQjGcwZBmHWS8NggER.
  document.querySelectorAll('[data-action="svc-tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.svcTarget;
      document.querySelectorAll('[data-action="svc-tab"]').forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('rmr-acct-tab--selected', selected);
        b.setAttribute('aria-selected', String(selected));
      });
      document.querySelectorAll('[data-svc-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.svcPanel !== target;
      });
    });
  });

  // Amenity Reservations (reservations.html) — Upcoming / Past Requests
  // tabs. Same real underline "Tabs" component/classes as Account Settings
  // and Service Issues above (.rmr-acct-tab / .rmr-acct-tab--selected).
  document.querySelectorAll('[data-action="rsv-tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.rsvTarget;
      document.querySelectorAll('[data-action="rsv-tab"]').forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('rmr-acct-tab--selected', selected);
        b.setAttribute('aria-selected', String(selected));
      });
      document.querySelectorAll('[data-rsv-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.rsvPanel !== target;
      });
    });
  });

  // Reservation Details — one shared "Reservation Details" modal (node
  // 2027:2947) for every Approved/Pending/Completed booking across the "My
  // Reservations" list and the full Amenities calendar (month/week/day
  // views), plus a second shared modal for Denied ones (node 2059:459901,
  // only ever reached by the one real Denied example), populated from each
  // clicked item's own data-rsv-* attributes rather than the two static,
  // single-instance modals this page started with. Only Theater Room's own
  // fee/description/image are the real sourced values (its Oct 24 booking);
  // Clubhouse Room 1's are prototype-only mock content, same convention as
  // every other invented amenity in this file.
  const RSV_AMENITIES = {
    'Theater Room': { image: '../assets/images/reservations/room-2.png', description: 'Located near the main office.', fee: '$15.00' },
    'Clubhouse Room 1': { image: '../assets/images/reservations/room-1.png', description: 'A spacious multipurpose room with a full kitchen, ideal for parties and gatherings.', fee: '$25.00' },
  };
  function rsvStatusDotColor(status) {
    if (status === 'Pending') return 'yellow';
    if (status === 'Denied') return 'red';
    if (status === 'Completed') return 'gray';
    return 'green'; // Approved
  }
  // Every sourced time on this page is a plain on-the-hour/half-hour start
  // (e.g. "7:00 PM") with the modal always showing a 1-hour block, so the
  // end time is computed rather than needing its own attribute per item.
  function rsvEndTime(start) {
    const m = start.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return start;
    let hour = Number(m[1]) % 12;
    if (m[3].toUpperCase() === 'PM') hour += 12;
    let endHour = (hour + 1) % 24;
    const endAp = endHour >= 12 ? 'PM' : 'AM';
    let displayHour = endHour % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour}:${m[2]} ${endAp}`;
  }
  document.querySelectorAll('[data-action="open-reservation-details"]').forEach((el) => {
    el.addEventListener('click', () => {
      const amenity = el.dataset.rsvAmenity;
      const date = el.dataset.rsvDate;
      const start = el.dataset.rsvTime;
      const status = el.dataset.rsvStatus;
      const info = RSV_AMENITIES[amenity] || { image: '', description: '', fee: '' };
      const timeRange = `${start} - ${rsvEndTime(start)}`;

      if (status === 'Denied') {
        const backdrop = document.querySelector('[data-modal-backdrop="reservation-details-denied"]');
        if (!backdrop) return;
        backdrop.querySelector('[data-rsv-denied-amenity]').textContent = amenity;
        backdrop.querySelector('[data-rsv-denied-date]').textContent = date;
        backdrop.querySelector('[data-rsv-denied-time]').textContent = timeRange;
        backdrop.querySelector('[data-rsv-denied-description]').textContent = info.description;
        backdrop.querySelector('[data-rsv-denied-fee]').textContent = info.fee;
        backdrop.hidden = false;
        return;
      }

      const backdrop = document.querySelector('[data-modal-backdrop="reservation-details"]');
      if (!backdrop) return;
      backdrop.querySelector('[data-rsv-detail-status-dot]').className = `rmr-rsv-status__dot rmr-rsv-status__dot--${rsvStatusDotColor(status)}`;
      backdrop.querySelector('[data-rsv-detail-status-text]').textContent = status;
      backdrop.querySelector('[data-rsv-detail-amenity]').textContent = amenity;
      backdrop.querySelector('[data-rsv-detail-date]').textContent = date;
      backdrop.querySelector('[data-rsv-detail-time]').textContent = timeRange;
      backdrop.querySelector('[data-rsv-detail-description]').textContent = info.description;
      backdrop.querySelector('[data-rsv-detail-fee]').textContent = info.fee;
      backdrop.querySelector('[data-rsv-detail-image]').src = info.image;
      // A Completed reservation is already in the past — there's nothing left
      // to cancel. The footer's own inline display:flex (for its
      // justify-content) beats [hidden] at equal specificity, same pitfall as
      // Violation Details' image wrap above — toggle display directly instead.
      backdrop.querySelector('[data-rsv-detail-cancel]').style.display = status === 'Completed' ? 'none' : '';
      backdrop.hidden = false;
    });
  });

  // Amenities filter (reservations.html's calendar) — hides the individual
  // event pill, not its whole day cell, so a day keeps showing its other
  // amenity's booking (or stays visible but empty) when filtered. Every
  // .rmr-rsv-event variant sets its own `display` in the stylesheet, which
  // beats the UA [hidden] rule regardless of specificity (an author rule
  // always wins over a same-weight UA one) — same pitfall as the Cancel
  // button above, so this sets style.display directly instead of .hidden.
  const rsvAmenityFilter = document.querySelector('[data-rsv-amenity-filter]');
  if (rsvAmenityFilter) {
    // Scoped to the calendar card (.rmr-comm-main), not the whole document —
    // the dropdown sits above the calendar only, so it shouldn't also filter
    // the separate "My Reservations" sidebar list beside it.
    const rsvCalendarScope = rsvAmenityFilter.closest('.rmr-comm-main') || document;
    rsvAmenityFilter.querySelectorAll('[data-dropdown-option]').forEach((option) => {
      option.addEventListener('click', () => {
        const selected = option.textContent.trim();
        rsvCalendarScope.querySelectorAll('[data-rsv-amenity]').forEach((el) => {
          el.style.display = (selected !== 'All' && el.dataset.rsvAmenity !== selected) ? 'none' : '';
        });
      });
    });
  }

  // Architectural Requests (architectural-requests.html) — My Requests /
  // Requests to Review tabs. Same real underline "Tabs" component/classes as
  // Account Settings, Service Issues, and Amenity Reservations above
  // (.rmr-acct-tab / .rmr-acct-tab--selected).
  document.querySelectorAll('[data-action="arq-tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.arqTarget;
      document.querySelectorAll('[data-action="arq-tab"]').forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('rmr-acct-tab--selected', selected);
        b.setAttribute('aria-selected', String(selected));
      });
      document.querySelectorAll('[data-arq-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.arqPanel !== target;
      });
    });
  });

  // Violations Register (violations.html) — Open Violations / Closed
  // Violations tabs. Same real underline "Tabs" component/classes as
  // Account Settings, Service Issues, Amenity Reservations, and
  // Architectural Requests above (.rmr-acct-tab / .rmr-acct-tab--selected).
  document.querySelectorAll('[data-action="vio-tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.vioTarget;
      document.querySelectorAll('[data-action="vio-tab"]').forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('rmr-acct-tab--selected', selected);
        b.setAttribute('aria-selected', String(selected));
      });
      document.querySelectorAll('[data-vio-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.vioPanel !== target;
      });
    });
  });

  // New Reservation overlay's day-schedule side panel — the block matching
  // the form's own Start/End Time is a real drag-to-move / drag-to-resize
  // control, not just a static preview: dragging its body moves the whole
  // reservation (same duration); dragging its bottom edge stretches the end
  // time later/earlier, and its top edge stretches the start time
  // earlier/later, each independently of the other end, in 15-minute
  // increments; all three write straight into the Start Time / End Time
  // display fields — per direct instruction, those fields and this block are
  // "the same thing, just displayed differently," not two independent
  // controls.
  document.querySelectorAll('[data-rsv-current]').forEach((slot) => {
    const grid = slot.closest('[data-rsv-grid]');
    const col = slot.closest('[data-rsv-col]');
    const scope = slot.closest('.rmr-modal') || document;
    if (!grid || !col) return;
    const label = slot.querySelector('[data-rsv-current-label]');
    const resizeTop = slot.querySelector('[data-rsv-resize-top]');
    const resizeBottom = slot.querySelector('[data-rsv-resize-bottom]');
    const startField = scope.querySelector('[data-rsv-field="start"]');
    const endField = scope.querySelector('[data-rsv-field="end"]');
    const gridStartMin = parseInt(grid.dataset.rsvGridStartMin, 10);
    const pxPerMin = 56 / 60;
    const snapMin = 15;
    const snapPx = snapMin * pxPerMin;
    const minDurationMin = 30;
    const rowCount = col.querySelectorAll('.rmr-rsv-side__row').length;
    const colHeightPx = rowCount * 56;

    const snap = (px) => Math.round(px / snapPx) * snapPx;

    const minutesToLabel = (totalMin) => {
      const h24 = Math.floor(totalMin / 60) % 24;
      const m = totalMin % 60;
      const period = h24 < 12 ? 'AM' : 'PM';
      let h = h24 % 12;
      if (h === 0) h = 12;
      return `${h}:${String(m).padStart(2, '0')} ${period}`;
    };

    const render = () => {
      const startMin = parseInt(slot.dataset.startMin, 10);
      const durationMin = parseInt(slot.dataset.durationMin, 10);
      const topPx = (startMin - gridStartMin) * pxPerMin;
      const heightPx = durationMin * pxPerMin;
      slot.style.top = `${topPx}px`;
      slot.style.height = `${heightPx}px`;
      const startLabel = minutesToLabel(startMin);
      const endLabel = minutesToLabel(startMin + durationMin);
      if (label) label.textContent = `${startLabel} - ${endLabel}`;
      if (startField) startField.textContent = startLabel;
      if (endField) endField.textContent = endLabel;
    };

    slot.addEventListener('pointerdown', (e) => {
      if (e.target === resizeTop || e.target === resizeBottom) return;
      e.preventDefault();
      slot.setPointerCapture(e.pointerId);
      const startY = e.clientY;
      const startTopPx = (parseInt(slot.dataset.startMin, 10) - gridStartMin) * pxPerMin;
      const durationMin = parseInt(slot.dataset.durationMin, 10);
      const heightPx = durationMin * pxPerMin;
      const onMove = (moveEvent) => {
        const rawTop = startTopPx + (moveEvent.clientY - startY);
        const clampedTop = Math.min(Math.max(snap(rawTop), 0), colHeightPx - heightPx);
        slot.dataset.startMin = Math.round(gridStartMin + clampedTop / pxPerMin);
        render();
      };
      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    // Bottom edge — stretches the end time, start time stays put.
    if (resizeBottom) {
      resizeBottom.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizeBottom.setPointerCapture(e.pointerId);
        const startY = e.clientY;
        const durationMin = parseInt(slot.dataset.durationMin, 10);
        const startHeightPx = durationMin * pxPerMin;
        const topPx = (parseInt(slot.dataset.startMin, 10) - gridStartMin) * pxPerMin;
        const onMove = (moveEvent) => {
          const rawHeight = startHeightPx + (moveEvent.clientY - startY);
          const minHeightPx = minDurationMin * pxPerMin;
          const clampedHeight = Math.min(Math.max(snap(rawHeight), minHeightPx), colHeightPx - topPx);
          slot.dataset.durationMin = Math.round(clampedHeight / pxPerMin);
          render();
        };
        const onUp = () => {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
      });
    }

    // Top edge — stretches the start time, end time stays put.
    if (resizeTop) {
      resizeTop.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizeTop.setPointerCapture(e.pointerId);
        const startY = e.clientY;
        const startMin0 = parseInt(slot.dataset.startMin, 10);
        const durationMin0 = parseInt(slot.dataset.durationMin, 10);
        const endMin = startMin0 + durationMin0;
        const startTopPx = (startMin0 - gridStartMin) * pxPerMin;
        const onMove = (moveEvent) => {
          const rawTop = startTopPx + (moveEvent.clientY - startY);
          const minHeightPx = minDurationMin * pxPerMin;
          const endTopPx = (endMin - gridStartMin) * pxPerMin;
          const clampedTop = Math.min(Math.max(snap(rawTop), 0), endTopPx - minHeightPx);
          const newStartMin = Math.round(gridStartMin + clampedTop / pxPerMin);
          slot.dataset.startMin = newStartMin;
          slot.dataset.durationMin = endMin - newStartMin;
          render();
        };
        const onUp = () => {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
      });
    }

    render();
  });

  // Add Service Issue overlay's three Yes/No questions ("Has this happened
  // before?", pets, technician entry) each get their own independent
  // radio-dot pair, scoped by data-svc-question so selecting one question's
  // Yes/No doesn't affect the others.
  document.querySelectorAll('[data-action="svc-select-choice"]').forEach((choice) => {
    choice.addEventListener('click', () => {
      const question = choice.dataset.svcQuestion;
      document.querySelectorAll(`[data-action="svc-select-choice"][data-svc-question="${question}"]`).forEach((c) => {
        c.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', c === choice);
      });
    });
  });

  // Add Service Issue overlay — removing an attached example file (each
  // thumbnail's own x badge) just removes that thumbnail from the DOM;
  // there's no real upload behind this prototype to keep in sync.
  document.querySelectorAll('[data-action="svc-remove-attachment"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const thumb = btn.closest('.rmr-svc-attach__thumb');
      if (thumb) thumb.remove();
    });
  });

  // Schedule Service Issue step (node 2792:94769, "3.3.2/3.3.3 Add Issue -
  // MS 1/2" — the same screen before and after time slots are picked, not
  // two separate steps). Clicking a slot toggles it, up to 3; selection
  // order drives the Preferred / Alternate 1 / Alternate 2 labels shown both
  // on the slot itself and in the "Selected Time Slots" panel.
  const svcSlotLabels = ['Preferred', 'Alternate 1', 'Alternate 2'];
  let svcSelectedSlots = [];
  const svcSelectedList = document.querySelector('[data-svc-selected-list]');
  const svcSelectedEmpty = document.querySelector('[data-svc-selected-empty]');
  const svcSelectedHint = document.querySelector('[data-svc-selected-hint]');
  const svcSubmitScheduleBtn = document.querySelector('[data-svc-submit-schedule]');

  // Availability behind the Schedule step's calendar — three real weeks
  // around this prototype's "today" (Mon, Oct 19, 2026) so the prev/next
  // arrows have somewhere to scroll to in both directions; the default page
  // (below) lands on Wed 21 / Thu 22 / Fri 23, just after today.
  const SVC_CAL_DAYS = [
    { name: 'Mon', num: '12', full: 'Monday, October 12', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Tue', num: '13', full: 'Tuesday, October 13', times: ['12:00 PM - 4:00 PM'] },
    { name: 'Wed', num: '14', full: 'Wednesday, October 14', times: ['12:00 PM - 4:00 PM'] },
    { name: 'Thurs', num: '15', full: 'Thursday, October 15', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Fri', num: '16', full: 'Friday, October 16', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Mon', num: '19', full: 'Monday, October 19', times: ['8:00 AM - 12:00 PM'] },
    { name: 'Tue', num: '20', full: 'Tuesday, October 20', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Wed', num: '21', full: 'Wednesday, October 21', times: ['12:00 PM - 4:00 PM'] },
    { name: 'Thurs', num: '22', full: 'Thursday, October 22', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Fri', num: '23', full: 'Friday, October 23', times: ['8:00 AM - 12:00 PM'] },
    { name: 'Mon', num: '26', full: 'Monday, October 26', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Tue', num: '27', full: 'Tuesday, October 27', times: ['12:00 PM - 4:00 PM'] },
    { name: 'Wed', num: '28', full: 'Wednesday, October 28', times: ['12:00 PM - 4:00 PM'] },
    { name: 'Thurs', num: '29', full: 'Thursday, October 29', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
    { name: 'Fri', num: '30', full: 'Friday, October 30', times: ['8:00 AM - 12:00 PM', '12:00 PM - 4:00 PM'] },
  ];
  const SVC_CAL_PAGE_SIZE = 3;
  let svcCalStart = 7; // defaults to the Wed 21 / Thu 22 / Fri 23 page

  const svcCalDaysEl = document.querySelector('[data-svc-cal-days]');
  const svcCalPrevBtn = document.querySelector('[data-action="svc-cal-prev"]');
  const svcCalNextBtn = document.querySelector('[data-action="svc-cal-next"]');

  function svcRenderCalendarDays() {
    if (!svcCalDaysEl) return;
    const days = SVC_CAL_DAYS.slice(svcCalStart, svcCalStart + SVC_CAL_PAGE_SIZE);
    svcCalDaysEl.innerHTML = days.map((day) => `
      <div class="rmr-svc-cal__col">
        <div class="rmr-svc-cal__day-head">
          <span class="rmr-svc-cal__day-name">${day.name}</span>
          <span class="rmr-svc-cal__day-num">${day.num}</span>
        </div>
        <div class="rmr-svc-cal__slots">
          ${day.times.map((time) => `
            <button class="rmr-svc-slot" type="button" data-action="svc-select-slot" data-slot-day="${day.full}" data-slot-time="${time}">
              <span class="rmr-svc-slot__time">${time}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');
    document.querySelectorAll('[data-action="svc-select-slot"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const day = btn.dataset.slotDay;
        const time = btn.dataset.slotTime;
        const idx = svcSelectedSlots.findIndex((s) => s.day === day && s.time === time);
        if (idx !== -1) {
          svcSelectedSlots.splice(idx, 1);
        } else if (svcSelectedSlots.length < 3) {
          svcSelectedSlots.push({ day, time });
        }
        svcSyncSlotButtons();
        svcRenderSelectedSlots();
      });
    });
    svcSyncSlotButtons();
    if (svcCalPrevBtn) svcCalPrevBtn.disabled = svcCalStart <= 0;
    if (svcCalNextBtn) svcCalNextBtn.disabled = svcCalStart + SVC_CAL_PAGE_SIZE >= SVC_CAL_DAYS.length;
  }

  if (svcCalPrevBtn) {
    svcCalPrevBtn.addEventListener('click', () => {
      svcCalStart = Math.max(0, svcCalStart - 1);
      svcRenderCalendarDays();
    });
  }
  if (svcCalNextBtn) {
    svcCalNextBtn.addEventListener('click', () => {
      svcCalStart = Math.min(SVC_CAL_DAYS.length - SVC_CAL_PAGE_SIZE, svcCalStart + 1);
      svcRenderCalendarDays();
    });
  }
  svcRenderCalendarDays();

  // Selected-panel cards are drag-reorderable (right-side "Drag to rearrange
  // preferences" hint) — dragging a card to a new position re-sorts
  // svcSelectedSlots, and the Preferred/Alternate 1/Alternate 2 labels
  // (which are purely positional) update to match.
  let svcDragIndex = null;

  function svcRenderSelectedSlots() {
    if (!svcSelectedList) return;
    svcSelectedList.innerHTML = svcSelectedSlots.map((slot, i) => {
      const modifier = i === 0 ? 'preferred' : 'alternate';
      const card = `
        <div class="rmr-svc-selected__card rmr-svc-selected__card--${modifier}" draggable="true" data-slot-index="${i}">
          <p class="rmr-svc-selected__card-day">${slot.day}</p>
          <p class="rmr-svc-selected__card-time">${slot.time}</p>
          <span class="rmr-svc-slot__badge rmr-svc-slot__badge--${modifier}">${svcSlotLabels[i]}</span>
          <button class="rmr-svc-selected__card-remove" type="button" data-action="svc-deselect-slot" data-slot-index="${i}">
            <img src="../assets/icons/service-issues/slot-remove-x.svg" alt="Remove" />
          </button>
        </div>
      `;
      // The Preferred card sits inside its own wrapper with a divider below
      // it (border-bottom + 24px padding), visually separating it from the
      // Alternate cards underneath — real anatomy from node 2438:33031, not
      // just an even list of three identical cards.
      return i === 0 ? `<div class="rmr-svc-selected__divider">${card}</div>` : card;
    }).join('');
    document.querySelectorAll('[data-action="svc-deselect-slot"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        svcSelectedSlots.splice(Number(btn.dataset.slotIndex), 1);
        svcSyncSlotButtons();
        svcRenderSelectedSlots();
      });
    });
    svcSelectedList.querySelectorAll('.rmr-svc-selected__card').forEach((card) => {
      card.addEventListener('dragstart', () => {
        svcDragIndex = Number(card.dataset.slotIndex);
        card.style.opacity = '0.5';
      });
      card.addEventListener('dragend', () => {
        card.style.opacity = '';
        svcSelectedList.querySelectorAll('.rmr-svc-selected__card--dragover').forEach((c) => c.classList.remove('rmr-svc-selected__card--dragover'));
      });
      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        card.classList.add('rmr-svc-selected__card--dragover');
      });
      card.addEventListener('dragleave', () => {
        card.classList.remove('rmr-svc-selected__card--dragover');
      });
      card.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropIndex = Number(card.dataset.slotIndex);
        if (svcDragIndex === null || svcDragIndex === dropIndex) return;
        const [moved] = svcSelectedSlots.splice(svcDragIndex, 1);
        svcSelectedSlots.splice(dropIndex, 0, moved);
        svcDragIndex = null;
        svcSyncSlotButtons();
        svcRenderSelectedSlots();
      });
    });
    if (svcSelectedEmpty) svcSelectedEmpty.hidden = svcSelectedSlots.length > 0;
    if (svcSelectedHint) svcSelectedHint.hidden = svcSelectedSlots.length === 0;
    if (svcSubmitScheduleBtn) svcSubmitScheduleBtn.disabled = svcSelectedSlots.length === 0;
  }

  function svcSyncSlotButtons() {
    document.querySelectorAll('[data-action="svc-select-slot"]').forEach((btn) => {
      const idx = svcSelectedSlots.findIndex((s) => s.day === btn.dataset.slotDay && s.time === btn.dataset.slotTime);
      const modifier = idx === 0 ? 'preferred' : 'alternate';
      btn.classList.remove('rmr-svc-slot--preferred', 'rmr-svc-slot--alternate');
      const existingBadge = btn.querySelector('.rmr-svc-slot__badge');
      if (existingBadge) existingBadge.remove();
      if (idx !== -1) {
        btn.classList.add(`rmr-svc-slot--${modifier}`);
        const badge = document.createElement('span');
        badge.className = `rmr-svc-slot__badge rmr-svc-slot__badge--${modifier}`;
        badge.textContent = svcSlotLabels[idx];
        btn.appendChild(badge);
      }
    });
  }

  // Open Issues table this Submit button below adds a new row + SVC_ISSUES
  // entry to, so a submitted issue actually shows up in the list instead of
  // only living on the confirmation screen.
  const svcOpenPanel = document.querySelector('[data-svc-panel="open"]');
  const svcOpenTbody = svcOpenPanel ? svcOpenPanel.querySelector('tbody') : null;
  const svcOpenFooter = svcOpenPanel ? svcOpenPanel.querySelector('.rmr-acct-table-footer') : null;
  let svcNextIssueNumber = 176;
  if (svcOpenTbody) {
    const existingNums = Array.from(svcOpenTbody.querySelectorAll('tr'))
      .map((r) => parseInt(r.querySelector('td').textContent, 10))
      .filter((n) => !Number.isNaN(n));
    if (existingNums.length) svcNextIssueNumber = Math.max(...existingNums) + 1;
  }

  // Submit -> populate the Confirmation step's summary rows from whatever
  // was actually selected above, add the issue to the Open Issues table,
  // then switch modals (same close-current/open-target pattern as
  // data-action="switch-modal" elsewhere).
  if (svcSubmitScheduleBtn) {
    svcSubmitScheduleBtn.addEventListener('click', () => {
      const rows = document.querySelector('[data-svc-confirm-rows]');
      if (rows) {
        rows.innerHTML = svcSelectedSlots.map((slot, i) => `
          <div class="rmr-svc-confirm-row">
            <span class="rmr-svc-confirm-row__label">${svcSlotLabels[i]}</span>
            <span class="rmr-svc-confirm-row__day">${slot.day}</span>
            <span class="rmr-svc-confirm-row__time">${slot.time}</span>
          </div>
        `).join('');
      }

      const addBackdrop = document.querySelector('[data-modal-backdrop="svc-add"]');
      if (addBackdrop && svcOpenTbody) {
        const svcChoiceValue = (question) => {
          const selected = addBackdrop.querySelector(`[data-svc-question="${question}"] .rmr-pmt-radio--selected`);
          const choice = selected ? selected.closest('[data-action="svc-select-choice"]') : null;
          return choice ? (choice.dataset.svcValue === 'yes' ? 'Yes' : 'No') : null;
        };
        const titleInput = addBackdrop.querySelector('.rmr-modal__input');
        const categoryEl = addBackdrop.querySelector('[data-dropdown-value]');
        const descriptionEl = addBackdrop.querySelector('[data-component="Description"]');

        const number = svcNextIssueNumber++;
        const key = `open-${number}`;
        const created = '10/19/26';
        const title = (titleInput && titleInput.value.trim()) || 'Service Issue';
        const category = (categoryEl && !categoryEl.classList.contains('rmr-dropdown__value--placeholder'))
          ? categoryEl.textContent.trim() : null;
        const description = (descriptionEl && descriptionEl.value.trim()) || null;

        SVC_ISSUES[key] = {
          title, created: `Created: ${created}`, status: 'open',
          schedule: {
            type: 'pending',
            slots: svcSelectedSlots.map((slot, i) => ({ label: svcSlotLabels[i], day: slot.day, time: slot.time })),
          },
          category, repeat: svcChoiceValue('add-repeat'),
          description, pets: svcChoiceValue('add-pets'), entry: svcChoiceValue('add-entry'),
          resolution: null, attachments: null, comments: null,
        };

        const row = document.createElement('tr');
        row.className = 'rmr-pay-table__row-link';
        row.dataset.action = 'open-issue-details';
        row.dataset.svcKey = key;
        row.innerHTML = `<td>${number}</td><td>${created}</td><td>${title}</td><td>New</td>`;
        svcBindIssueRow(row);
        svcOpenTbody.insertBefore(row, svcOpenTbody.firstChild);

        if (svcOpenFooter) {
          const count = svcOpenTbody.querySelectorAll('tr').length;
          svcOpenFooter.textContent = `Showing ${count} of ${count} Open Issues`;
        }

        // Reset the form so the next "Add Service Issue" starts blank.
        if (titleInput) titleInput.value = '';
        if (descriptionEl) descriptionEl.value = '';
        if (categoryEl) {
          categoryEl.textContent = 'Select a Category';
          categoryEl.classList.add('rmr-dropdown__value--placeholder');
          addBackdrop.querySelectorAll('[data-dropdown-option]').forEach((o) => o.classList.remove('rmr-dropdown__option--selected'));
        }
        addBackdrop.querySelectorAll('.rmr-pmt-radio--selected').forEach((el) => el.classList.remove('rmr-pmt-radio--selected'));
        svcSelectedSlots = [];
        svcSyncSlotButtons();
        svcRenderSelectedSlots();
      }

      const current = document.querySelector('[data-modal-backdrop="svc-schedule"]');
      const next = document.querySelector('[data-modal-backdrop="svc-confirm"]');
      if (current) current.hidden = true;
      if (next) next.hidden = false;
    });
  }

  // Issue Details overlay (node 2792:94770) — one flexible modal populated
  // per-issue from this map, rather than six separate static markups. Every
  // source frame shares the same left-column anatomy (status/title/
  // description/pets/entry/attachments, plus an optional schedule-status
  // card) and differs only in which comments state the right side is in —
  // see PROTOTYPE.md for which frame backs which key here. Rows without an
  // entry here (most Closed Issues) fall back to a generic closed summary
  // built from that row's own real register cells instead of inventing a
  // unique example for all 15.
  const SVC_ATTACHMENTS = [
    { type: 'image', src: '../assets/images/service-issues/attach-1.png' },
    { type: 'image', src: '../assets/images/service-issues/attach-2.png' },
    { type: 'file', name: 'GoogleNestInstructions.pdf' },
    { type: 'image', src: '../assets/images/service-issues/attach-3.png' },
    { type: 'image', src: '../assets/images/service-issues/attach-4.png' },
    { type: 'image', src: '../assets/images/service-issues/attach-5.png' },
  ];
  const SVC_MSG_ATTACHMENTS = [
    { type: 'image', src: '../assets/images/service-issues/attach-4.png' },
    { type: 'image', src: '../assets/images/service-issues/attach-5.png' },
    { type: 'image', src: '../assets/images/service-issues/attach-6.png' },
  ];
  const SVC_ISSUES = {
    'open-175': {
      title: 'Thermostat not working', created: 'Created: 10/19/26', status: 'open',
      schedule: { type: 'confirmed', day: 'Thursday, Oct 22', time: '8:00 AM - 12:00 PM', tech: 'Alan Watson' },
      category: 'Other', repeat: 'Yes',
      description: "For the past week the thermostat doesn't record the temperature correctly. On top of that no matter what I set it to nothing changes.",
      pets: 'Yes', entry: 'Yes', resolution: null, attachments: SVC_ATTACHMENTS,
      comments: {
        title: 'Messages', mode: 'two-way',
        messages: [
          { sender: 'Melissa Summers', time: '11/03/26 9:30 AM', text: 'Any update?' },
          { sender: 'Riverview Apartments', time: '11/03/26 10:30 AM', text: 'Purchasing a part, will schedule when purchased' },
          { sender: 'Riverview Apartments', time: '11/03/26 10:30 AM', text: 'I will be on my way around 11', attachments: SVC_MSG_ATTACHMENTS },
          { sender: 'You', time: '11/03/26 10:37 AM', text: 'Sounds good thanks', self: true },
        ],
      },
    },
    'open-130': {
      title: 'Leaky faucet in kitchen', created: 'Created: 10/19/26', status: 'open',
      schedule: {
        type: 'pending',
        slots: [
          { label: 'Preferred', day: 'Thursday, Oct 22', time: '8:00 AM - 12:00 PM' },
          { label: 'Alternate 1', day: 'Thursday, Oct 22', time: '12:00 PM - 4:00 PM' },
          { label: 'Alternate 2', day: 'Thursday, Oct 22', time: '8:00 AM - 12:00 PM' },
        ],
      },
      category: 'Plumbing', repeat: null,
      description: "The kitchen faucet has a steady drip that won't stop, even when fully shut off.",
      pets: 'Yes', entry: 'No', resolution: null, attachments: SVC_ATTACHMENTS,
      comments: {
        title: 'Notes', mode: 'notes',
        entries: [
          { sender: 'Riverview Apartments', time: '11/02/2026 11:17 AM', text: 'Attached an image', attachment: { name: 'IMG_6700.jpg', src: '../assets/images/service-issues/attach-6.png' } },
          { sender: 'Riverview Apartments', time: '11/02/2026 10:42 AM', text: 'Need to order part' },
        ],
      },
    },
    'open-97': {
      title: 'Water stain on ceiling', created: 'Created: 10/18/26', status: 'open',
      schedule: null, category: 'Plumbing', repeat: null,
      description: 'A brownish water stain has appeared on the living room ceiling and seems to be slowly spreading.',
      pets: 'Yes', entry: 'No', resolution: null,
      attachments: null, comments: null,
    },
    'closed-175': {
      title: 'Closet door broken', created: 'Created: 10/19/26', status: 'closed',
      schedule: null, category: 'Other', repeat: null,
      description: "The primary bedroom closet door came off its track and won't slide or close properly.",
      pets: 'Yes', entry: 'Yes', resolution: 'Replaced with new door',
      attachments: SVC_ATTACHMENTS,
      comments: {
        title: 'Notes', mode: 'notes',
        entries: [
          { sender: 'Riverview Apartments', time: '11/03/2026 11:17 AM', text: 'Attached an image', attachment: { name: 'IMG_6700.jpg', src: '../assets/images/service-issues/attach-6.png' } },
          { sender: 'Riverview Apartments', time: '11/03/2026 10:42 AM', text: 'Need to order part' },
        ],
      },
    },
    'closed-130': {
      title: 'Kitchen sink leaking', created: 'Created: 10/19/26', status: 'closed',
      schedule: null, category: 'Plumbing', repeat: null,
      description: 'Water was pooling under the kitchen sink cabinet, likely from a leaking pipe connection.',
      pets: 'No', entry: 'Yes', resolution: 'Installed new valve',
      attachments: null,
      comments: {
        title: 'Messages', mode: 'closed',
        messages: [
          { sender: 'Riverview Apartments', time: '11/02/26 10:30 AM', text: 'I will be on my way around 11' },
          { sender: 'You', time: '11/02/26 10:37 AM', text: 'Sounds good thanks', self: true },
        ],
      },
    },
  };

  function svcAttachmentsHTML(attachments) {
    return attachments.map((a) => a.type === 'file'
      ? `<div class="rmr-svc-attach__thumb rmr-svc-attach__thumb--file"><img class="rmr-svc-attach__file-icon" src="../assets/icons/service-issues/file-paper.svg" alt="" /><p class="rmr-svc-attach__thumb-name">${a.name}</p></div>`
      : `<img class="rmr-svc-attach__thumb-img" src="${a.src}" alt="" />`
    ).join('');
  }

  function svcSetupAttachCarousel(backdrop) {
    const track = backdrop.querySelector('[data-svc-attach-track]');
    const nav = backdrop.querySelector('[data-svc-attach-nav]');
    const fade = backdrop.querySelector('[data-svc-attach-fade]');
    const prevBtn = backdrop.querySelector('[data-svc-attach-prev]');
    const nextBtn = backdrop.querySelector('[data-svc-attach-next]');
    if (!track || !nav) return;

    // Both arrows stay visible the whole time the row overflows — only
    // their color/clickability changes, based on whether that direction
    // actually has more attachments to reveal, rather than the arrow
    // itself appearing/disappearing.
    function update() {
      const hasOverflow = track.scrollWidth > track.clientWidth + 1;
      nav.hidden = !hasOverflow;
      if (!hasOverflow) {
        if (fade) fade.hidden = true;
        return;
      }
      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      prevBtn.classList.toggle('rmr-svc-attach__nav-btn--active', !atStart);
      prevBtn.disabled = atStart;
      nextBtn.classList.toggle('rmr-svc-attach__nav-btn--active', !atEnd);
      nextBtn.disabled = atEnd;
      if (fade) fade.hidden = atEnd;
    }

    track.scrollLeft = 0;
    track.onscroll = update;
    prevBtn.onclick = () => track.scrollBy({ left: -176, behavior: 'smooth' });
    nextBtn.onclick = () => track.scrollBy({ left: 176, behavior: 'smooth' });
    update();
  }

  function svcScheduleCardHTML(schedule) {
    if (!schedule) return '';
    if (schedule.type === 'confirmed') {
      return `
        <div class="rmr-svc-schedule-card">
          <div class="rmr-svc-schedule-card__left">
            <span class="rmr-svc-schedule-card__badge rmr-svc-schedule-card__badge--confirmed">Confirmed</span>
            <div class="rmr-svc-schedule-card__confirmed-info">
              <div class="rmr-svc-schedule-card__slot-row">
                <span class="rmr-svc-schedule-card__slot-day">${schedule.day}</span>
                <span class="rmr-svc-schedule-card__slot-time">${schedule.time}</span>
              </div>
              <a href="#" class="rmr-svc-schedule-card__link" data-action="fake-submit" data-fake-message="Adding to your calendar isn't included in this example.">Add to Calendar</a>
            </div>
          </div>
          <div class="rmr-svc-schedule-card__tech">
            <span class="rmr-svc-schedule-card__tech-label">Your tech will be:</span>
            <div class="rmr-svc-schedule-card__tech-row">
              <img class="rmr-svc-schedule-card__tech-avatar" src="../assets/images/avatar.png" alt="" />
              <span class="rmr-svc-schedule-card__tech-name">${schedule.tech}</span>
            </div>
          </div>
        </div>`;
    }
    return `
      <div class="rmr-svc-schedule-card">
        <span class="rmr-svc-schedule-card__badge rmr-svc-schedule-card__badge--pending">Pending</span>
        <div class="rmr-svc-schedule-card__body">
          <p>Has not been scheduled. You selected the below times when submitting this issue:</p>
          <div class="rmr-svc-schedule-card__slots">
            ${schedule.slots.map((s, i) => `
              ${i > 0 ? '<div class="rmr-svc-schedule-card__slot-divider"></div>' : ''}
              <div>
                <div class="rmr-svc-schedule-card__slot-label">${s.label}</div>
                <div class="rmr-svc-schedule-card__slot-value">${s.day}</div>
                <div class="rmr-svc-schedule-card__slot-time">${s.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  function svcCommentsHTML(comments) {
    return comments.messages.map((m) => `
      <div class="rmr-svc-comments__msg${m.self ? ' rmr-svc-comments__msg--self' : ''}">
        <span class="rmr-svc-comments__meta${m.self ? ' rmr-svc-comments__meta--self' : ''}">
          <span class="rmr-svc-comments__meta-sender">${m.sender}</span>
          <span class="rmr-svc-comments__meta-time">${m.time}</span>
        </span>
        <div class="rmr-svc-comments__bubble-row">
          <div class="rmr-svc-comments__bubble">${m.text}</div>
          ${m.self ? '<img class="rmr-svc-comments__kebab" src="../assets/icons/service-issues/kebab-vert.svg" alt="" />' : ''}
        </div>
        ${m.attachments ? `<div class="rmr-svc-comments__attachments">${m.attachments.map((a) => `<img src="${a.src}" alt="" />`).join('')}</div>` : ''}
      </div>
    `).join('');
  }

  function svcNotesTimelineHTML(entries) {
    return entries.map((e, i) => `
      <div class="rmr-svc-notes__entry">
        <div class="rmr-svc-notes__rail">
          <div class="rmr-svc-notes__rail-line rmr-svc-notes__rail-line--stub${i > 0 ? ' rmr-svc-notes__rail-line--visible' : ''}"></div>
          <div class="rmr-svc-notes__dot"></div>
          <div class="rmr-svc-notes__rail-line rmr-svc-notes__rail-line--fill${i < entries.length - 1 ? ' rmr-svc-notes__rail-line--visible' : ''}"></div>
        </div>
        <div class="rmr-svc-notes__content">
          <div class="rmr-svc-notes__meta">
            <span class="rmr-svc-notes__meta-sender">${e.sender}</span>
            <span class="rmr-svc-notes__meta-time">${e.time}</span>
          </div>
          <p class="rmr-svc-notes__body">${e.text}</p>
          ${e.attachment ? `<div class="rmr-svc-notes__attach-row"><img class="rmr-svc-notes__attach-icon" src="../assets/icons/service-issues/attach-image.svg" alt="" /><span class="rmr-svc-notes__attach-link">${e.attachment.name}</span></div>` : ''}
        </div>
      </div>
    `).join('');
  }

  function svcCommentsFooterHTML(mode) {
    if (mode === 'notes') return '';
    if (mode === 'two-way') {
      return `
        <div class="rmr-svc-comments__input-row">
          <input class="rmr-svc-comments__input" type="text" placeholder="Type your comment here" data-svc-comment-input />
          <button class="rmr-svc-comments__input-btn" type="button" data-action="fake-submit" data-fake-message="Attaching a file to a comment isn't included in this example."><img src="../assets/icons/service-issues/attach-file.svg" alt="Attach" /></button>
          <button class="rmr-svc-comments__input-btn" type="button" data-action="fake-submit" data-fake-message="Sending a comment isn't included in this example."><img src="../assets/icons/service-issues/send.svg" alt="Send" /></button>
        </div>`;
    }
    if (mode === 'disabled') return `<p class="rmr-svc-comments__disabled-bar">Communication is disabled.</p>`;
    if (mode === 'closed') return `<p class="rmr-svc-comments__disabled-bar">Issue is closed.</p>`;
    return '';
  }

  function svcBuildFallback(row) {
    const cells = row.querySelectorAll('td');
    const title = cells[2] ? cells[2].textContent.trim() : 'Service Issue';
    return {
      title,
      created: `Closed: ${cells[1] ? cells[1].textContent.trim() : ''}`,
      status: 'closed',
      schedule: null, category: 'Other', repeat: null,
      description: `${title} was reported and has since been resolved by the property team.`,
      pets: 'Yes', entry: 'Yes',
      resolution: cells[3] ? cells[3].textContent.trim() : null,
      attachments: null, comments: null,
    };
  }

  function svcOpenIssueDetails(number, data) {
    const backdrop = document.querySelector('[data-modal-backdrop="svc-details"]');
    if (!backdrop) return;
    backdrop.querySelector('[data-svc-detail-number]').textContent = `Issue #${number}`;
    const dot = backdrop.querySelector('[data-svc-detail-status-dot]');
    dot.className = `rmr-svc-status-dot rmr-svc-status-dot--${data.status}`;
    backdrop.querySelector('[data-svc-detail-status-text]').textContent = data.status === 'open' ? 'Open' : 'Closed';
    backdrop.querySelector('[data-svc-detail-title]').textContent = data.title;
    backdrop.querySelector('[data-svc-detail-created]').textContent = data.created;
    backdrop.querySelector('[data-svc-detail-schedule]').innerHTML = svcScheduleCardHTML(data.schedule);

    const categoryWrap = backdrop.querySelector('[data-svc-detail-category-wrap]');
    categoryWrap.hidden = !data.category;
    if (data.category) backdrop.querySelector('[data-svc-detail-category]').textContent = data.category;

    const descWrap = backdrop.querySelector('[data-svc-detail-description-wrap]');
    descWrap.hidden = !data.description;
    if (data.description) backdrop.querySelector('[data-svc-detail-description]').textContent = data.description;

    const repeatWrap = backdrop.querySelector('[data-svc-detail-repeat-wrap]');
    repeatWrap.hidden = !data.repeat;
    if (data.repeat) backdrop.querySelector('[data-svc-detail-repeat]').textContent = data.repeat;

    const petsField = backdrop.querySelector('[data-svc-detail-pets]').closest('div');
    petsField.hidden = !data.pets;
    if (data.pets) backdrop.querySelector('[data-svc-detail-pets]').textContent = data.pets;

    const entryField = backdrop.querySelector('[data-svc-detail-entry]').closest('div');
    entryField.hidden = !data.entry;
    if (data.entry) backdrop.querySelector('[data-svc-detail-entry]').textContent = data.entry;

    const resWrap = backdrop.querySelector('[data-svc-detail-resolution-wrap]');
    resWrap.hidden = !data.resolution;
    if (data.resolution) backdrop.querySelector('[data-svc-detail-resolution]').textContent = data.resolution;

    // Attachments added inline in a Notes-mode entry also appear here as image
    // previews, alongside whatever was attached on the original issue.
    const noteAttachments = (data.comments && data.comments.mode === 'notes')
      ? data.comments.entries.filter((e) => e.attachment && e.attachment.src).map((e) => ({ type: 'image', src: e.attachment.src }))
      : [];
    const allAttachments = [...(data.attachments || []), ...noteAttachments];

    const attachWrap = backdrop.querySelector('[data-svc-detail-attachments-wrap]');
    attachWrap.hidden = allAttachments.length === 0;
    if (allAttachments.length) backdrop.querySelector('[data-svc-detail-attachments]').innerHTML = svcAttachmentsHTML(allAttachments);

    const commentsWrap = backdrop.querySelector('[data-svc-detail-comments-wrap]');
    commentsWrap.hidden = !data.comments;
    // Without a Notes/Messages column the modal itself shrinks to just the
    // left column's own width instead of keeping its full two-column size
    // and leaving that half empty (see .rmr-svc-details-modal--solo).
    const detailsModal = backdrop.querySelector('.rmr-svc-details-modal');
    if (detailsModal) detailsModal.classList.toggle('rmr-svc-details-modal--solo', !data.comments);
    if (data.comments) {
      backdrop.querySelector('[data-svc-detail-comments-title]').textContent = data.comments.title;
      const thread = backdrop.querySelector('[data-svc-detail-thread]');
      thread.innerHTML = data.comments.mode === 'notes'
        ? svcNotesTimelineHTML(data.comments.entries)
        : svcCommentsHTML(data.comments);
      backdrop.querySelector('[data-svc-detail-comments-footer]').innerHTML = svcCommentsFooterHTML(data.comments.mode);
      thread.scrollTop = thread.scrollHeight;
    }

    backdrop.hidden = false;
    if (allAttachments.length) svcSetupAttachCarousel(backdrop);
  }

  function svcBindIssueRow(row) {
    row.addEventListener('click', () => {
      const key = row.dataset.svcKey;
      // Register rows carry the issue number in their first <td>; a
      // standalone trigger (e.g. the Dashboard's "View Issue" buttons) has
      // no table cell, so fall back to the number embedded in the key.
      const td = row.querySelector('td');
      const number = td ? td.textContent.trim() : key.split('-')[1];
      const data = SVC_ISSUES[key] || svcBuildFallback(row);
      svcOpenIssueDetails(number, data);
    });
  }

  document.querySelectorAll('[data-action="open-issue-details"]').forEach(svcBindIssueRow);

  // Deep-linking into a specific issue via URL, e.g. maintenance.html?issue=
  // open-175 — switch to the row's Open/Closed tab first, then open its
  // Issue Details modal. (The Dashboard's own "View Issue"/"View Comment"
  // links no longer use this — they open the modal directly, see
  // data-action="open-issue-details" above.)
  const deepLinkIssueKey = new URLSearchParams(location.search).get('issue');
  if (deepLinkIssueKey) {
    const targetRow = document.querySelector(`[data-svc-key="${deepLinkIssueKey}"]`);
    if (targetRow) {
      const panelName = deepLinkIssueKey.startsWith('closed') ? 'closed' : 'open';
      const tabBtn = document.querySelector(`[data-action="svc-tab"][data-svc-target="${panelName}"]`);
      if (tabBtn) tabBtn.click();
      targetRow.click();
    }
  }

  // AutoPay full page (autopay.html) — the Toggle Slider drives three states
  // (file fPSZy4e0NwJMiTs345xXGy, node 3276:27067): disabled, a compact
  // scheduled summary with its own edit pencil, and a combined inline
  // setup/edit form (merging the section's "New" and "Edit scheduled"
  // frames, which differ only in whether the payment method starts
  // collapsed — collapsed is used for both here, consistent with every
  // other screen in this prototype). Defaults to disabled unless the shared
  // rmrIsAutopayScheduled() flag says otherwise.
  const apPageRoot = document.querySelector('[data-ap-has-schedule]');
  if (apPageRoot) {
    const apToggle = document.querySelector('[data-ap-page-toggle]');
    const apStatusTitle = document.querySelector('[data-ap-status-title]');
    const apStatusDesc = document.querySelector('[data-ap-status-desc]');
    const apScheduledCard = document.querySelector('[data-ap-scheduled-card]');
    const apEditCard = document.querySelector('[data-ap-edit-card]');
    const apTerms = document.querySelector('[data-ap-page-terms]');
    const apSave = document.querySelector('[data-ap-page-save]');

    const showDisabled = () => {
      apPageRoot.dataset.apHasSchedule = 'false';
      apToggle.checked = false;
      apStatusTitle.textContent = 'AutoPay is disabled';
      apStatusDesc.hidden = false;
      apScheduledCard.hidden = true;
      apEditCard.hidden = true;
    };
    const showScheduled = () => {
      apPageRoot.dataset.apHasSchedule = 'true';
      apToggle.checked = true;
      apStatusTitle.textContent = 'AutoPay is enabled';
      apStatusDesc.hidden = true;
      apScheduledCard.hidden = false;
      apEditCard.hidden = true;
    };
    const showEdit = () => {
      apToggle.checked = true;
      apStatusTitle.textContent = 'AutoPay is enabled';
      apStatusDesc.hidden = true;
      apScheduledCard.hidden = true;
      apEditCard.hidden = false;
    };

    if (rmrIsAutopayScheduled()) showScheduled();
    else showDisabled();

    apToggle.addEventListener('change', () => {
      if (apToggle.checked) {
        if (apPageRoot.dataset.apHasSchedule === 'true') showScheduled();
        else showEdit();
      } else {
        rmrSetAutopayScheduled(false);
        showDisabled();
      }
    });

    document.querySelector('[data-action="ap-page-edit"]')?.addEventListener('click', showEdit);

    document.querySelector('[data-action="ap-page-cancel"]')?.addEventListener('click', () => {
      if (apPageRoot.dataset.apHasSchedule === 'true') showScheduled();
      else showDisabled();
    });

    if (apTerms && apSave) {
      apTerms.addEventListener('change', () => { apSave.disabled = !apTerms.checked; });
    }

    document.querySelector('[data-action="ap-page-save"]')?.addEventListener('click', () => {
      rmrSetAutopayScheduled(true);
      showScheduled();
    });
  }

  // Document Center — Leases & Documents tree. Both the property level and
  // the lease-period level toggle collapsed/expanded (same real chevron
  // component at each level); a doc row never has children of its own.
  // Collapsing a row always hides every descendant regardless of that
  // descendant's own expanded state; expanding a row only reveals its
  // immediate children, each still respecting its own remembered state —
  // so re-expanding a property doesn't also force open a lease row you'd
  // deliberately left collapsed.
  function docTreeSetDescendantsHidden(parentId, hide) {
    document.querySelectorAll(`[data-doc-tree-parent="${parentId}"]`).forEach((child) => {
      child.hidden = hide;
      if (child.dataset.docTreeId) {
        const childExpanded = child.dataset.docTreeExpanded === 'true';
        docTreeSetDescendantsHidden(child.dataset.docTreeId, hide ? true : !childExpanded);
      }
    });
  }
  document.querySelectorAll('[data-action="doc-tree-toggle"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('[data-doc-tree-id]');
      if (!row) return;
      const expanded = row.dataset.docTreeExpanded === 'true';
      row.dataset.docTreeExpanded = String(!expanded);
      docTreeSetDescendantsHidden(row.dataset.docTreeId, expanded);
    });
  });

  // Document Center — Leases & Documents "Property" filter. Picking a
  // property hides every other property's root row (and, via
  // docTreeSetDescendantsHidden, that row's whole lease/doc subtree) while
  // leaving each property's own remembered expand/collapse state alone, so
  // switching back to "All Selected" restores rows exactly as left.
  const docLeasesCard = document.querySelector('.rmr-doc-card--leases');
  if (docLeasesCard) {
    const propertyDropdown = docLeasesCard.querySelector('[data-dropdown]');
    const leasesFooter = docLeasesCard.querySelector('.rmr-acct-table-footer');
    propertyDropdown?.querySelectorAll('[data-dropdown-option]').forEach((option) => {
      option.addEventListener('click', () => {
        const selected = option.textContent.trim();
        docLeasesCard.querySelectorAll('[data-doc-tree-property]').forEach((row) => {
          const match = selected === 'All Selected' || row.dataset.docTreeProperty === selected;
          row.hidden = !match;
          const expanded = row.dataset.docTreeExpanded === 'true';
          docTreeSetDescendantsHidden(row.dataset.docTreeId, !match || !expanded);
        });
        // docTreeSetDescendantsHidden unconditionally reveals every
        // descendant of an expanded row, including a [data-dtl-row] doc
        // that's meant to stay hidden until its Documents to Sign signature
        // completes (see the dts-row/dtl-row pairing above) — re-hide any
        // still-unsigned one so re-expanding a property doesn't jump it
        // into view early.
        docLeasesCard.querySelectorAll('[data-dtl-row]').forEach((row) => {
          if (!rmrIsDocSigned(row.dataset.dtlRow)) row.hidden = true;
        });
        if (leasesFooter) {
          const total = docLeasesCard.querySelectorAll('[data-doc-tree-lease]').length;
          const shown = docLeasesCard.querySelectorAll('[data-doc-tree-lease]:not([hidden])').length;
          leasesFooter.textContent = `Showing ${shown} of ${total} Leases`;
        }
      });
    });
  }

  // Truncated-text tooltips — every register's ellipsis-truncated cells
  // (Payments & Charges, Documents to Sign, the Leases & Documents tree's
  // own names) get the full text as a hover tooltip, but only while
  // actually truncated (scrollWidth > clientWidth), so an untruncated cell
  // doesn't get a redundant tooltip. Re-scans on resize (a container query
  // can truncate a cell that wasn't before, or the reverse) and on any DOM
  // change — tab switches, tree expand/collapse, Document Sign's own
  // content swap — via MutationObserver rather than hand-wiring every
  // action that can change which cells are truncated.
  //
  // Shown via a small custom bubble (proto.css .rmr-tooltip-bubble) rather
  // than the native `title` attribute — the browser's own title tooltip
  // has a slow, OS-controlled show delay that's too slow to read on a
  // quick hover over a register cell.
  let rmrTooltipRaf = null;
  function rmrRefreshTruncationTooltips() {
    document.querySelectorAll('td, .rmr-doc-tree__row-inner > :last-child').forEach((el) => {
      if (getComputedStyle(el).textOverflow !== 'ellipsis') return;
      const text = el.textContent.trim();
      if (el.scrollWidth > el.clientWidth + 1 && text) {
        el.dataset.rmrTooltip = text;
      } else if (el.dataset.rmrTooltip) {
        delete el.dataset.rmrTooltip;
      }
    });
  }
  function rmrScheduleTruncationTooltips() {
    if (rmrTooltipRaf) cancelAnimationFrame(rmrTooltipRaf);
    rmrTooltipRaf = requestAnimationFrame(rmrRefreshTruncationTooltips);
  }
  rmrScheduleTruncationTooltips();
  window.addEventListener('resize', rmrScheduleTruncationTooltips);
  new MutationObserver(rmrScheduleTruncationTooltips).observe(document.body, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'],
  });

  // 150ms is fast enough to feel immediate on a deliberate hover without
  // flickering on a quick pass-through, unlike the browser's own ~1s+
  // native tooltip delay.
  let rmrTooltipEl = null;
  let rmrTooltipShowTimer = null;
  function rmrShowTooltip(target) {
    const text = target.dataset.rmrTooltip;
    if (!text) return;
    if (!rmrTooltipEl) {
      rmrTooltipEl = document.createElement('div');
      rmrTooltipEl.className = 'rmr-tooltip-bubble';
      document.body.appendChild(rmrTooltipEl);
    }
    rmrTooltipEl.textContent = text;
    // An info-icon tooltip (the small "i" next to a label/link) always
    // shows on a white bubble, unlike the dark truncated-text bubble it
    // shares markup/positioning with.
    rmrTooltipEl.classList.toggle('rmr-tooltip-bubble--light', target.tagName === 'IMG');
    const rect = target.getBoundingClientRect();
    rmrTooltipEl.style.left = `${Math.round(rect.left)}px`;
    rmrTooltipEl.style.top = `${Math.round(rect.bottom + 6)}px`;
    rmrTooltipEl.classList.add('is-visible');
  }
  function rmrHideTooltip() {
    clearTimeout(rmrTooltipShowTimer);
    if (rmrTooltipEl) rmrTooltipEl.classList.remove('is-visible');
  }
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-rmr-tooltip]');
    if (!target) return;
    clearTimeout(rmrTooltipShowTimer);
    rmrTooltipShowTimer = setTimeout(() => rmrShowTooltip(target), 150);
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-rmr-tooltip]');
    if (!target || (e.relatedTarget && target.contains(e.relatedTarget))) return;
    rmrHideTooltip();
  });

  // Polls — Board Meeting's "What would you like for food?* (Choose up to
  // 2)" question. Once `max` boxes are checked, every other unchecked box
  // in the group is disabled (real disabled fill/label color, not just
  // dimmed) until one is unchecked again — same real state the source frame
  // itself shows for Five Guys/Other once Chipotle/Panera are checked.
  document.querySelectorAll('[data-poll-max-choice]').forEach((group) => {
    const max = parseInt(group.dataset.pollMaxChoice, 10);
    const checkboxes = Array.from(group.querySelectorAll('input[type="checkbox"]'));
    const update = () => {
      const checkedCount = checkboxes.filter((c) => c.checked).length;
      checkboxes.forEach((c) => { c.disabled = !c.checked && checkedCount >= max; });
    };
    checkboxes.forEach((c) => c.addEventListener('change', update));
    update();
  });

  // Polls — Board Meeting's star rating question. Click-to-select only (no
  // hover preview), same "final clicked value" level of fidelity as every
  // other input in this prototype.
  document.querySelectorAll('[data-poll-stars]').forEach((group) => {
    const stars = Array.from(group.querySelectorAll('[data-poll-star]'));
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        stars.forEach((s, i) => {
          s.querySelector('img').src = i <= index
            ? '../assets/icons/polls/star-filled.svg'
            : '../assets/icons/polls/star-outline.svg';
        });
      });
    });
  });
});

function closeAccountMenu() {
  const menu = document.querySelector('[data-account-menu]');
  if (menu) menu.hidden = true;
}

function closeModal(backdrop) {
  backdrop.hidden = true;
}

function showToast(message) {
  let toast = document.querySelector('.proto-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'proto-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}
