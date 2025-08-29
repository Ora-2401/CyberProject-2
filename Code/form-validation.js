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
  }
}

// ... existing code ...

function submitForm(firstName, lastName, email, subject, message) {
  // Show loading overlay
  showLoadingOverlay();
  
  // Simulate form submission (in a real application, this would be an AJAX request)
  setTimeout(() => {
    // Hide loading overlay
    hideLoadingOverlay();
    
    // Show enhanced success message
    showFormMessage('✅ Message Sent Successfully! Our security team will review your inquiry and respond within 24 hours.', 'success');
    
    // Reset form
    document.querySelector('#contact form').reset();
    
    // Reset field styles
    resetFormErrors();
    
    // Auto-hide success message after 10 seconds
    setTimeout(() => {
      hideFormMessage();
    }, 10000);
  }, 2000);
}