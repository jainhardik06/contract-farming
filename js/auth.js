// --- Simulated Authentication Logic ---
// Replace this with actual API calls to your PHP backend

// DOM Elements (Auth Pages)
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginErrorDiv = document.getElementById('loginError');
const signupErrorDiv = document.getElementById('signupError');
const signupSuccessDiv = document.getElementById('signupSuccess');

// DOM Elements (Dashboards)
const logoutButton = document.getElementById('logoutButton');
const welcomeUserSpan = document.getElementById('welcomeUser');

// --- Event Listeners ---
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}

// --- Simulated User Data ---
// In a real app, this check happens on the server side (PHP/MongoDB)
const SIMULATED_USERS = {
    'admin@example.com': { password: 'adminpassword', role: 'admin', name: 'Admin User' },
    'user@example.com': { password: 'userpassword', role: 'user', name: 'Regular User' },
    'farmer@example.com': { password: 'password', role: 'user', name: 'Alice Farmer'},
    'buyer@example.com': { password: 'password', role: 'user', name: 'Bob Buyer'}
};

// --- Functions ---

async function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    if (!emailInput || !passwordInput || !submitButton) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    setButtonLoading(submitButton, true);
    hideElement(loginErrorDiv);

    // --- SIMULATION ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const user = SIMULATED_USERS[email];

    if (user && user.password === password) {
        // Login successful (simulation)
        console.log('Simulated login success:', user);
        // Store session info (use sessionStorage for demo - clears on browser close)
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userRole', user.role);
        sessionStorage.setItem('userName', user.name);
        sessionStorage.setItem('userEmail', email);

        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    } else {
        // Login failed
        console.log('Simulated login failed');
        showElement(loginErrorDiv);
        setButtonLoading(submitButton, false);
    }
    // --- END SIMULATION ---

    // ** REAL IMPLEMENTATION WOULD BE: **
    // try {
    //   const response = await fetch('php/login.php', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
    //   const result = await response.json();
    //   if (result.success) {
    //     // Server confirms login, session starts via PHP header
    //     // Redirect based on result.role
    //        sessionStorage.setItem('userLoggedIn', 'true'); // Still useful for frontend checks
    //        sessionStorage.setItem('userRole', result.role);
    //        sessionStorage.setItem('userName', result.name);
    //     window.location.href = result.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
    //   } else {
    //     showElement(loginErrorDiv);
    //     loginErrorDiv.textContent = result.message || 'Invalid credentials.';
    //   }
    // } catch (error) {
    //   console.error('Login fetch error:', error);
    //   showElement(loginErrorDiv);
    //   loginErrorDiv.textContent = 'Login failed. Please try again.';
    // } finally {
    //    setButtonLoading(submitButton, false);
    // }
}

async function handleSignup(event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const roleSelect = document.getElementById('role');
    const submitButton = signupForm.querySelector('button[type="submit"]');

    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !roleSelect || !submitButton) return;

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const role = roleSelect.value; // Get selected role

    setButtonLoading(submitButton, true);
    hideElement(signupErrorDiv);
    hideElement(signupSuccessDiv);


    if (password !== confirmPassword) {
        showElement(signupErrorDiv);
        signupErrorDiv.textContent = 'Passwords do not match.';
        setButtonLoading(submitButton, false);
        return;
    }

     // Basic client-side validation (add more as needed)
    if (password.length < 6) {
        showElement(signupErrorDiv);
        signupErrorDiv.textContent = 'Password must be at least 6 characters long.';
        setButtonLoading(submitButton, false);
        return;
    }


    // --- SIMULATION ---
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    // Simulate checking if email exists (optional for demo)
    if (SIMULATED_USERS[email]) {
         showElement(signupErrorDiv);
         signupErrorDiv.textContent = 'Email address already registered.';
         setButtonLoading(submitButton, false);
         return;
    }

    // Simulate successful registration
    console.log('Simulated signup success:', { name, email, role });
     // You might add the new user to SIMULATED_USERS here for demo purposes
     // SIMULATED_USERS[email] = { password: password, role: role, name: name };

    showElement(signupSuccessDiv);
    signupForm.reset(); // Clear form

    // Redirect to login after a short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000); // 2 seconds delay
    // --- END SIMULATION ---

    // ** REAL IMPLEMENTATION WOULD BE: **
    // try {
    //   const response = await fetch('php/signup.php', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password, role }) // Send role if backend handles it
    //   });
    //   const result = await response.json();
    //   if (result.success) {
    //     showElement(signupSuccessDiv);
    //     signupForm.reset();
    //     setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    //   } else {
    //     showElement(signupErrorDiv);
    //     signupErrorDiv.textContent = result.message || 'Signup failed.';
    //   }
    // } catch (error) {
    //   console.error('Signup fetch error:', error);
    //   showElement(signupErrorDiv);
    //   signupErrorDiv.textContent = 'Signup failed. Please try again.';
    // } finally {
        // No need to call setButtonLoading(false) here because we redirect or show success
    // }
}


function handleLogout() {
    console.log('Logging out...');
    // Clear session storage
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');

    // Redirect to login page
    window.location.href = 'login.html';

    // ** REAL IMPLEMENTATION WOULD BE: **
    // Send request to PHP logout script to destroy server session
    // fetch('php/logout.php')
    //   .then(() => {
    //      // Clear frontend storage AFTER server confirmation if needed
    //     sessionStorage.clear();
    //     window.location.href = 'login.html';
    //   })
    //   .catch(error => console.error('Logout error:', error));
}

// --- Auth Check (Call this on dashboard pages) ---
function checkAuth(requiredRole = null) {
    const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');

    console.log('Auth Check: LoggedIn=', isLoggedIn, 'Role=', userRole, 'RequiredRole=', requiredRole);


    if (!isLoggedIn) {
        console.log('User not logged in, redirecting to login.');
        window.location.href = 'login.html';
        return; // Stop further execution
    }

    // If a specific role is required, check it
    if (requiredRole && userRole !== requiredRole) {
        console.warn(`User role '${userRole}' does not match required role '${requiredRole}'. Redirecting.`);
        // Redirect to a general access page or login page
         alert('Access denied. You do not have the required permissions for this page.');
        window.location.href = 'login.html'; // Or maybe user-dashboard.html if they are a user trying admin page
        return;
    }

    // Update welcome message if element exists
    if (welcomeUserSpan && userName) {
        welcomeUserSpan.textContent = `Welcome, ${userName}!`;
    }

    console.log('Auth check passed.');
}


// --- Utility Functions (can be moved to a separate utils.js) ---
function setButtonLoading(buttonElement, isLoading) {
    if (!buttonElement) return;
    const textSpan = buttonElement.querySelector('.btn-text');
    const spinnerSpan = buttonElement.querySelector('.spinner');

    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.classList.add('loading'); // Add loading class if defined in CSS
        if(textSpan) textSpan.style.visibility = 'hidden';
        if(spinnerSpan) spinnerSpan.classList.remove('hidden');
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove('loading');
        if(textSpan) textSpan.style.visibility = 'visible';
        if(spinnerSpan) spinnerSpan.classList.add('hidden');
    }
}

function showElement(element) {
    if (element) element.classList.remove('hidden');
}

function hideElement(element) {
     if (element) element.classList.add('hidden');
}