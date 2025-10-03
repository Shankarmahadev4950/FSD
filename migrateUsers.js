// ✅ ENHANCED LOGIN HANDLER WITH BETTER ERROR HANDLING
async function handleSignin(e) {
    e.preventDefault();
    
    if (isSubmitting) {
        NotificationManager.show('Please wait, processing your request...', 'info');
        return;
    }
    
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        NotificationManager.show('Please enter both email and password', 'error');
        return;
    }

    isSubmitting = true;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;

    try {
        console.log('🔄 Attempting login for:', email);
        
        const credentials = { email, password };
        const response = await loginUser(credentials);
        
        console.log('✅ Login successful:', response);
        
        // ✅ FIXED: Ensure user object has required arrays
        if (response.user) {
            response.user.skillsToLearn = response.user.skillsToLearn || [];
            response.user.skillsToTeach = response.user.skillsToTeach || [];
        }
        
        TokenManager.setToken(response.token);
        currentUser = response.user;
        
        // Initialize activity tracking
        ActivityTracker.initUserActivity();
        startAutoSessionTracking();
        
        // Update UI
        updateUIForLoggedInUser();
        
        NotificationManager.show(response.message || 'Login successful!', 'success');
        
        // Clear form and redirect
        e.target.reset();
        setTimeout(() => showSection('dashboard'), 100);
        
    } catch (error) {
        console.error('❌ Signin error:', error);
        
        // More specific error messages
        if (error.message.includes('Cannot read properties of undefined')) {
            NotificationManager.show('Database error. Please try again or contact support.', 'error');
        } else {
            NotificationManager.show(error.message || 'Login failed. Please check your credentials.', 'error');
        }
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        isSubmitting = false;
    }
}