document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('#contact form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      validateAndSubmitForm();
    });
  }
});

function validateAndSubmitForm() {
  // Get form elements with more specific selectors
  const firstName = document.querySelector('#contact form input[name="firstName"]');
  const lastName = document.querySelector('#contact form input[name="lastName"]');
  const email = document.querySelector('#contact form input[name="email"]');
  const subject = document.querySelector('#contact form input[name="subject"]');
  const message = document.querySelector('#contact form textarea[name="message"]');
  
  // Reset previous errors
  resetFormErrors();
  
  // Validate fields
  let isValid = true;
  let firstErrorField = null;
  
  if (!firstName.value.trim()) {
    markFieldAsError(firstName);
    isValid = false;
    if (!firstErrorField) firstErrorField = firstName;
  }
  
  if (!lastName.value.trim()) {
    markFieldAsError(lastName);
    isValid = false;
    if (!firstErrorField) firstErrorField = lastName;
  }
  
  if (!email.value.trim()) {
    markFieldAsError(email);
    isValid = false;
    if (!firstErrorField) firstErrorField = email;
  } else if (!isValidEmail(email.value)) {
    markFieldAsError(email);
    showFieldErrorMessage(email, 'Please enter a valid email address');
    isValid = false;
    if (!firstErrorField) firstErrorField = email;
  }
  
  if (!subject.value.trim()) {
    markFieldAsError(subject);
    isValid = false;
    if (!firstErrorField) firstErrorField = subject;
  }
  
  if (!message.value.trim()) {
    markFieldAsError(message);
    isValid = false;
    if (!firstErrorField) firstErrorField = message;
  }
  
  // If validation failed, focus on first error and show message
  if (!isValid) {
    firstErrorField.focus();
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }
  
  // If validation passed, submit form
  submitForm(firstName.value, lastName.value, email.value, subject.value, message.value);
}

function markFieldAsError(field) {
  field.classList.add('form-shake');
  field.style.borderColor = '#ef4444';
  field.style.borderWidth = '2px';
  
  // Remove animation class after it completes
  setTimeout(() => {
    field.classList.remove('form-shake');
  }, 500);
}

function showFieldErrorMessage(field, message) {
  // Create error message element if it doesn't exist
  let errorElement = field.parentNode.querySelector('.field-error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error-message text-red-500 text-sm mt-1';
    field.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

function resetFormErrors() {
  // Remove error styling from all fields
  const fields = document.querySelectorAll('#contact input, #contact textarea');
  fields.forEach(field => {
    field.style.borderColor = '';
    field.style.borderWidth = '';
  });
  
  // Remove error messages
  const errorMessages = document.querySelectorAll('.field-error-message');
  errorMessages.forEach(element => element.remove());
  
  // Hide form message
  hideFormMessage();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormMessage(text, type) {
  const messageContainer = document.getElementById('form-message');
  const messageText = document.getElementById('form-message-text');
  const messageIcon = document.getElementById('form-message-icon');
  
  if (messageContainer && messageText && messageIcon) {
    messageText.textContent = text;
    messageContainer.classList.remove('hidden');
    
    // Apply appropriate styling based on message type
    if (type === 'success') {
      messageContainer.classList.remove('form-error');
      messageContainer.classList.add('form-success');
      messageIcon.className = 'ri-check-circle-fill text-lg text-white';
    } else {
      messageContainer.classList.remove('form-success');
      messageContainer.classList.add('form-error');
      messageIcon.className = 'ri-error-warning-fill text-lg text-white';
    }
    
    // Add animation
    messageContainer.classList.add('animate-fade-in');
    
    // Scroll to message
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success message after 10 seconds
    if (type === 'success') {
      setTimeout(() => {
        hideFormMessage();
      }, 10000);
    }
  }
}

function hideFormMessage() {
  const messageContainer = document.getElementById('form-message');
  if (messageContainer) {
    messageContainer.classList.add('hidden');
    messageContainer.classList.remove('form-success', 'form-error', 'animate-fade-in');
  }
}

function showLoadingOverlay() {
  const loadingOverlay = document.getElementById('form-loading');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById('form-loading');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}

function submitForm(firstName, lastName, email, subject, message) {
  // Show loading overlay
  showLoadingOverlay();
  
  // Simulate form submission (in a real application, this would be an AJAX request)
  setTimeout(() => {
    // Hide loading overlay
    hideLoadingOverlay();
    
    // Show success message
    showFormMessage('✅ Message Sent Successfully! Our security team will contact you within 24 hours to address your inquiry.', 'success');
    
    // Reset form
    document.querySelector('#contact form').reset();
    
    // Reset field styles
    resetFormErrors();
  }, 2000);
}