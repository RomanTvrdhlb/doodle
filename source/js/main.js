//-----vars--------------------------------------------
const activeMode = "active-mode",
  activeClass = "active",
  windowEl = window,
  documentEl = document,
  htmlEl = document.documentElement,
  bodyEl = document.body,
  overlay = document.querySelector("[data-overlay]"),
  modals = [...document.querySelectorAll("[data-popup]")],
  modalsButton = [...document.querySelectorAll("[data-btn-modal]")],
  innerButtonModal = [...document.querySelectorAll("[data-btn-inner]")];
//-----------------------------------------------------

//-----custom-functions--------------------------------
const removeCustomClass = (item, customClass = "active") => {
    item.classList.remove(customClass);
  };

  const addCustomClass = (item, customClass = "active") => {
    item.classList.add(customClass);
  };

  const removeClassInArray = (arr, customClass = "active") => {
    arr.forEach((item) => {
      item.classList.remove(customClass);
    });
  };

  const disableScroll = () => {
    const fixBlocks = document?.querySelectorAll(".fixed-block");
    const pagePosition = window.scrollY;
    const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;
  
    htmlEl.style.scrollBehavior = "none";
    fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    bodyEl.style.paddingRight = paddingOffset;
    bodyEl.classList.add("dis-scroll");
    bodyEl.dataset.position = pagePosition;
    bodyEl.style.top = `-${pagePosition}px`;
  };
  
  const enableScroll = () => {
    const fixBlocks = document?.querySelectorAll(".fixed-block");
    const pagePosition = parseInt(bodyEl.dataset.position, 10);
    fixBlocks.forEach((el) => {
      el.style.paddingRight = "0px";
    });
    bodyEl.style.paddingRight = "0px";
  
    bodyEl.style.top = "auto";
    bodyEl.classList.remove("dis-scroll");
    window.scroll({
      top: pagePosition,
      left: 0,
    });
  };

  const fadeIn = (el, timeout, display) => {
    el.style.opacity = 0;
    el.style.display = display || "block";
    el.style.transition = `all ${timeout}ms`;
    setTimeout(() => {
      el.style.opacity = 1;
    }, 10);
  };
  
  const fadeOut = (el, timeout) => {
    el.style.opacity = 1;
    el.style.transition = `all ${timeout}ms ease`;
    el.style.opacity = 0;
  
    setTimeout(() => {
      el.style.display = "none";
    }, timeout);
  };
//-----------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('[data-parent]');

    if (form) {
        const button = form.querySelector('[data-copy-btn]');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const box = form.querySelector('.main-form__box');

            const pElement = box.querySelector('p');
            if (pElement) {
                pElement.remove();
            }

            const code = Array.from({ length: 35 }, () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                return chars.charAt(Math.floor(Math.random() * chars.length));
            }).join('');

            const html = `
                <label class="main-form__label" for="address">
                    <input readonly type="text" name="address" id="address" class="main-form__input" value="${code}">
                </label>
            `;

            box.style.marginBottom = '13px';
            box.insertAdjacentHTML('afterbegin', html);
            button.textContent = 'Copy';
            button.removeEventListener('click', arguments.callee);

            button.addEventListener('click', async function(e) {
                e.preventDefault();
                try {
                    await navigator.clipboard.writeText(code);
                    const input = box.querySelector('#address');
                    input.value = 'Success';
                    input.style.color = 'rgb(42 233 42)';
                    input.style.fontWeight = '500';
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const copyForm = document.querySelector('[data-parent-copy]');

    if (copyForm) {
        const copyButton = copyForm.querySelector('[data-copy]');
        const input = copyForm.querySelector('input');
        const originalValue = input.value;

        copyButton.addEventListener('click', async function(e) {
            e.preventDefault();
            if (input.value === originalValue) {
                try {
                    await navigator.clipboard.writeText(input.value);
                    input.value = 'Success';
                    input.style.color = 'rgb(42 233 42)';
                    input.style.fontWeight = '500';
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            }
        });
    }
});

//-------------------modals----------------------------

let innerButton;
const commonFunction = function () {
  removeCustomClass(overlay, activeMode);
  removeCustomClass(overlay, activeClass);
  removeCustomClass(overlay, "mode");
  removeClassInArray(modals, activeClass);

  modals.forEach((modal) => fadeOut(modal, 300));
  enableScroll();
};

function findAttribute(element, attributeName) {
  let target = element;
  while (target && target !== document) {
    if (target.hasAttribute(attributeName)) {
      return target.getAttribute(attributeName);
    }
    target = target.parentNode;
  }
  return null;
}

function buttonClickHandler(e, buttonAttribute, activeClass) {
  e.preventDefault();
  const currentModalId = findAttribute(e.target, buttonAttribute);
  if (!currentModalId) {
    return;
  }

  const currentModal = overlay.querySelector(
    `[data-popup="${currentModalId}"]`
  );

  removeClassInArray(modals, activeClass);

  if (currentModal && currentModal.getAttribute("data-popup") === "filter") {
    addCustomClass(overlay, "mode");
  }

  addCustomClass(overlay, activeClass);
  addCustomClass(overlay, activeMode);
  addCustomClass(currentModal, activeClass);
  fadeIn(currentModal, 200, "flex");

  disableScroll();
  innerButton = overlay.querySelector(
    `${"[data-popup]"}.${activeClass} .close`
  );
}

function overlayClickHandler(e, activeClass) {
  if (e.target === overlay || e.target === innerButton) commonFunction();
}

function modalInit(buttonsArray, buttonAttribute, activeClass) {
  buttonsArray.map(function (btn) {
    btn.addEventListener("click", (e) =>
      buttonClickHandler(e, buttonAttribute, activeClass)
    );
  });
}

document.addEventListener("DOMContentLoaded", function (e) {
  overlay &&
    overlay.addEventListener("click", function (e) {
      overlayClickHandler(e, activeClass);
    });

  modalInit(modalsButton, "data-btn-modal", activeClass);
});