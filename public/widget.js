(function() {
  // Get the current script tag to read data attributes
  const script = document.currentScript || document.querySelector('script[data-waitlistkit]');
  const projectSlug = script.getAttribute('data-project');
  const apiUrl = script.getAttribute('data-api') || (script.src.includes('localhost') ? 'http://localhost:3000' : 'https://waitlistkit.vercel.app');
  
  if (!projectSlug) {
    console.error('WaitlistKit: data-project attribute is required');
    return;
  }

  // Create widget container
  const widgetId = 'waitlistkit-widget-' + projectSlug;
  
  // Check if widget already exists
  if (document.getElementById(widgetId)) {
    return;
  }

  // Create and inject styles
  const style = document.createElement('style');
  style.textContent = `
    .waitlistkit-widget {
      max-width: 500px;
      margin: 0 auto;
      padding: 2rem;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--wk-primary, #6366f1) 0%, var(--wk-secondary, #8b5cf6) 100%);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .waitlistkit-widget h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.875rem;
      font-weight: bold;
    }
    .waitlistkit-widget p {
      margin: 0 0 1.5rem 0;
      opacity: 0.95;
      font-size: 1.125rem;
    }
    .waitlistkit-form {
      display: flex;
      gap: 0.75rem;
      flex-direction: column;
    }
    @media (min-width: 640px) {
      .waitlistkit-form {
        flex-direction: row;
      }
    }
    .waitlistkit-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      outline: none;
    }
    .waitlistkit-button {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      border: none;
      background: white;
      color: var(--wk-primary, #6366f1);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .waitlistkit-button:hover {
      transform: scale(1.05);
    }
    .waitlistkit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .waitlistkit-success {
      text-align: center;
    }
    .waitlistkit-position {
      font-size: 3rem;
      font-weight: bold;
      margin: 1rem 0;
    }
    .waitlistkit-referral {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
    }
    .waitlistkit-referral-input {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.5rem;
      border-radius: 4px;
      border: none;
      font-size: 0.875rem;
      background: rgba(255, 255, 255, 0.9);
    }
    .waitlistkit-error {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: rgba(239, 68, 68, 0.9);
      border-radius: 4px;
      font-size: 0.875rem;
    }
  `;
  document.head.appendChild(style);

  // Create widget container
  const container = document.createElement('div');
  container.id = widgetId;
  container.className = 'waitlistkit-widget';
  
  // Insert widget after the script tag
  script.parentNode.insertBefore(container, script.nextSibling);

  // Fetch project data
  fetch(`${apiUrl}/api/project/${projectSlug}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        container.innerHTML = '<p>Error loading waitlist</p>';
        return;
      }

      const project = data.project;
      
      // Set custom color if provided
      if (project.primaryColor) {
        container.style.setProperty('--wk-primary', project.primaryColor);
      }

      renderForm(project);
    })
    .catch(err => {
      console.error('WaitlistKit error:', err);
      container.innerHTML = '<p>Error loading waitlist</p>';
    });

  function renderForm(project) {
    // Check if user has referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');

    container.innerHTML = `
      <h2>${project.headline}</h2>
      <p>${project.subheadline}</p>
      <form class="waitlistkit-form" id="waitlistkit-form-${projectSlug}">
        <input 
          type="email" 
          class="waitlistkit-input" 
          placeholder="Enter your email" 
          required
          id="waitlistkit-email-${projectSlug}"
        />
        <button type="submit" class="waitlistkit-button" id="waitlistkit-submit-${projectSlug}">
          ${project.buttonText}
        </button>
      </form>
      <div id="waitlistkit-error-${projectSlug}"></div>
    `;

    const form = document.getElementById(`waitlistkit-form-${projectSlug}`);
    const emailInput = document.getElementById(`waitlistkit-email-${projectSlug}`);
    const submitBtn = document.getElementById(`waitlistkit-submit-${projectSlug}`);
    const errorDiv = document.getElementById(`waitlistkit-error-${projectSlug}`);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = emailInput.value;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining...';
      errorDiv.innerHTML = '';

      try {
        const response = await fetch(`${apiUrl}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            projectId: project.id,
            referredBy: referralCode
          })
        });

        const result = await response.json();

        if (result.error) {
          errorDiv.innerHTML = `<div class="waitlistkit-error">${result.error}</div>`;
          submitBtn.disabled = false;
          submitBtn.textContent = project.buttonText;
          return;
        }

        renderSuccess(result.signup, project);
      } catch (err) {
        console.error('Signup error:', err);
        errorDiv.innerHTML = '<div class="waitlistkit-error">Something went wrong. Please try again.</div>';
        submitBtn.disabled = false;
        submitBtn.textContent = project.buttonText;
      }
    });
  }

  function renderSuccess(signup, project) {
    const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${signup.referralCode}`;
    
    container.innerHTML = `
      <div class="waitlistkit-success">
        <h2>🎉 You're on the list!</h2>
        <div class="waitlistkit-position">#${signup.position}</div>
        <p>You're ${signup.position === 1 ? 'first' : `#${signup.position}`} in line</p>
        
        <div class="waitlistkit-referral">
          <p><strong>Move up the list!</strong></p>
          <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">Share your referral link. Each friend who joins moves you up:</p>
          <input 
            type="text" 
            class="waitlistkit-referral-input" 
            value="${referralUrl}" 
            readonly
            onclick="this.select(); document.execCommand('copy');"
          />
        </div>
      </div>
    `;
  }
})();
