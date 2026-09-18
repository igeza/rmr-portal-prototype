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
        <p class="rmr-sign-doc__date">4/15/2026</p>
        <p>Samantha Carpenter</p>
        <p>Dear Samantha Carpenter:</p>
        <p>Riverview Apartments is updating its parking policy effective 4/20/2026. Please review the details below.</p>
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
        <p class="rmr-sign-doc__date">5/30/2026</p>
        <p>Samantha Carpenter</p>
        <p>Dear Samantha Carpenter:</p>
        <p>Riverview Apartments is updating its pet policy effective 6/2/2026. Please review the details below.</p>
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
  if (document.body.dataset.screen === 'document-sign') {
    const doc = RMR_SIGN_DOCS[new URLSearchParams(location.search).get('doc')];
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

  document.querySelectorAll('[data-modal-backdrop]').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
    backdrop.querySelectorAll('[data-action="close-modal"]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => closeModal(backdrop));
    });
  });

  // AutoPay setup — amount option selection (Total Balance / Current Balance
  // / Specific Amount), mirroring the Make a Payment radio-card pattern.
  document.querySelectorAll('[data-action="ap-select-amount"]').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('[data-action="ap-select-amount"]').forEach((o) => {
        const selected = o === opt;
        o.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', selected);
      });
    });
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

  // Review Multiple Term Offers — selecting a different term card, same
  // radio-card pattern as pmt-select-amount (visual selection only; each
  // card's own numbers are fixed, real content from the source frame).
  document.querySelectorAll('[data-action="offer-select"]').forEach((card) => {
    card.addEventListener('click', () => {
      card.parentElement.querySelectorAll('[data-action="offer-select"]').forEach((c) => {
        const selected = c === card;
        c.classList.toggle('rmr-offer-card--selected', selected);
        c.querySelector('.rmr-pmt-radio').classList.toggle('rmr-pmt-radio--selected', selected);
      });
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

  // Sign Document — "Sign" in the Add Signature modal finishes the wizard
  // directly (no separate Document Signature preview step to confirm first —
  // that's only needed for documents with more than one signature spot,
  // which this prototype doesn't have): fills in the document's own embedded
  // lease-preference value and cursive signature line, and marks the sidebar
  // Sign button as done so Finish Signing can proceed straight to Submit.
  document.querySelectorAll('[data-action="sign-complete"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wizard = btn.closest('[data-modal-backdrop]');
      if (wizard) closeModal(wizard);
      const leaseValue = document.querySelector('[data-sign-lease-value]');
      if (leaseValue) leaseValue.textContent = '12-month lease renewal';
      const fieldAttention = document.querySelector('[data-sign-field-attention]');
      if (fieldAttention) {
        fieldAttention.classList.remove('rmr-field-attention');
        // The lease-preference dropdown is a real answer that stays visible
        // after signing; the Parking/Pet policy docs' own field-attention is
        // just a "sign here" prompt with nothing to keep showing once the
        // cursive signature below it takes over.
        if ('signHideOnSign' in fieldAttention.dataset) fieldAttention.hidden = true;
      }
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
  // the Document Center banner reflects it on return. Only applies to the
  // lease renewal itself; signing a Parking Policy or Pet Policy doc
  // shouldn't hide the unrelated Renewal Available banner.
  document.querySelectorAll('[data-modal-target="document-signed-success"]').forEach((btn) => {
    btn.addEventListener('click', () => { if (!rmrSignDocIsPolicy) rmrSetRenewalSigned(true); });
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

  function svcRenderSelectedSlots() {
    if (!svcSelectedList) return;
    svcSelectedList.innerHTML = svcSelectedSlots.map((slot, i) => {
      const modifier = i === 0 ? 'preferred' : 'alternate';
      const card = `
        <div class="rmr-svc-selected__card rmr-svc-selected__card--${modifier}">
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

  // Submit -> populate the Confirmation step's summary rows from whatever
  // was actually selected above, then switch modals (same close-current/
  // open-target pattern as data-action="switch-modal" elsewhere).
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
      title: 'Thermostat not working', created: 'Created: 02/04/26', status: 'open',
      schedule: { type: 'confirmed', day: 'Thursday, Feb 05', time: '8:00 AM - 12:00 PM', tech: 'Alan Watson' },
      category: 'Other', repeat: 'Yes',
      description: "For the past week the thermostat doesn't record the temperature correctly. On top of that no matter what I set it to nothing changes.",
      pets: 'Yes', entry: 'Yes', resolution: null, attachments: SVC_ATTACHMENTS,
      comments: {
        title: 'Messages', mode: 'two-way',
        messages: [
          { sender: 'Melissa Summers', time: '02/17/26 9:30 AM', text: 'Any update?' },
          { sender: 'Riverview Apartments', time: '02/17/26 10:30 AM', text: 'Purchasing a part, will schedule when purchased' },
          { sender: 'Riverview Apartments', time: '02/17/26 10:30 AM', text: 'I will be on my way around 11', attachments: SVC_MSG_ATTACHMENTS },
          { sender: 'You', time: '02/17/36 10:37 AM', text: 'Sounds good thanks', self: true },
        ],
      },
    },
    'open-130': {
      title: 'Leaky faucet in kitchen', created: 'Created: 02/02/26', status: 'open',
      schedule: {
        type: 'pending',
        slots: [
          { label: 'Preferred', day: 'Thursday, Feb 05', time: '8:00 AM - 12:00 PM' },
          { label: 'Alternate 1', day: 'Thursday, Feb 05', time: '12:00 PM - 4:00 PM' },
          { label: 'Alternate 2', day: 'Thursday, Feb 05', time: '8:00 AM - 12:00 PM' },
        ],
      },
      category: 'Plumbing', repeat: null,
      description: "The kitchen faucet has a steady drip that won't stop, even when fully shut off.",
      pets: 'Yes', entry: 'No', resolution: null, attachments: SVC_ATTACHMENTS,
      comments: {
        title: 'Notes', mode: 'notes',
        entries: [
          { sender: 'Riverview Apartments', time: '02/17/2026 11:17 AM', text: 'Attached an image', attachment: { name: 'IMG_6700.jpg', src: '../assets/images/service-issues/attach-6.png' } },
          { sender: 'Riverview Apartments', time: '02/17/2026 10:42 AM', text: 'Need to order part' },
        ],
      },
    },
    'open-97': {
      title: 'Water stain on ceiling', created: 'Created: 01/31/26', status: 'open',
      schedule: null, category: 'Plumbing', repeat: null,
      description: 'A brownish water stain has appeared on the living room ceiling and seems to be slowly spreading.',
      pets: 'Yes', entry: 'No', resolution: null,
      attachments: null, comments: null,
    },
    'closed-175': {
      title: 'Closet door broken', created: 'Created: 02/04/26', status: 'closed',
      schedule: null, category: 'Other', repeat: null,
      description: "The primary bedroom closet door came off its track and won't slide or close properly.",
      pets: 'Yes', entry: 'Yes', resolution: 'Replaced with new door',
      attachments: SVC_ATTACHMENTS,
      comments: {
        title: 'Notes', mode: 'notes',
        entries: [
          { sender: 'Riverview Apartments', time: '02/17/2026 11:17 AM', text: 'Attached an image', attachment: { name: 'IMG_6700.jpg', src: '../assets/images/service-issues/attach-6.png' } },
          { sender: 'Riverview Apartments', time: '02/17/2026 10:42 AM', text: 'Need to order part' },
        ],
      },
    },
    'closed-130': {
      title: 'Kitchen sink leaking', created: 'Created: 02/02/26', status: 'closed',
      schedule: null, category: 'Plumbing', repeat: null,
      description: 'Water was pooling under the kitchen sink cabinet, likely from a leaking pipe connection.',
      pets: 'No', entry: 'Yes', resolution: 'Installed new valve',
      attachments: null,
      comments: {
        title: 'Messages', mode: 'closed',
        messages: [
          { sender: 'Riverview Apartments', time: '02/17/26 10:30 AM', text: 'I will be on my way around 11' },
          { sender: 'You', time: '02/17/36 10:37 AM', text: 'Sounds good thanks', self: true },
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

  document.querySelectorAll('[data-action="open-issue-details"]').forEach((row) => {
    row.addEventListener('click', () => {
      const key = row.dataset.svcKey;
      const number = row.querySelector('td').textContent.trim();
      const data = SVC_ISSUES[key] || svcBuildFallback(row);
      svcOpenIssueDetails(number, data);
    });
  });

  // Deep-linking into a specific issue, e.g. from the Dashboard's "View
  // Issue" / "View Comment" links (maintenance.html?issue=open-175) — switch
  // to the row's Open/Closed tab first, then open its Issue Details modal.
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

  // Truncated-text tooltips — every register's ellipsis-truncated cells
  // (Payments & Charges, Documents to Sign, the Leases & Documents tree's
  // own names) get the full text as a native hover tooltip, but only while
  // actually truncated (scrollWidth > clientWidth), so an untruncated cell
  // doesn't get a redundant tooltip. Re-scans on resize (a container query
  // can truncate a cell that wasn't before, or the reverse) and on any DOM
  // change — tab switches, tree expand/collapse, Document Sign's own
  // content swap — via MutationObserver rather than hand-wiring every
  // action that can change which cells are truncated.
  let rmrTooltipRaf = null;
  function rmrRefreshTruncationTooltips() {
    document.querySelectorAll('td, .rmr-doc-tree__row-inner > :last-child').forEach((el) => {
      if (getComputedStyle(el).textOverflow !== 'ellipsis') return;
      const text = el.textContent.trim();
      if (el.scrollWidth > el.clientWidth + 1 && text) {
        if (el.title !== text) el.title = text;
      } else if (el.title) {
        el.removeAttribute('title');
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
