// ========================================
// EduMeet - PWA Registration & Features
// ========================================

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Show update notification
function showUpdateNotification() {
  if (confirm('A new version of EduMeet is available! Reload to update?')) {
    window.location.reload();
  }
}

// Install prompt
let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 Install prompt available');
  
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  
  // Store the event
  deferredPrompt = e;
  
  // Show install button
  if (installButton) {
    installButton.style.display = 'block';
  }
  
  // Show install banner
  showInstallBanner();
});

// Install button click
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    
    // Clear the deferred prompt
    deferredPrompt = null;
    
    // Hide install button
    installButton.style.display = 'none';
    hideInstallBanner();
  });
}

// Show install banner
function showInstallBanner() {
  // Check if banner was dismissed
  if (localStorage.getItem('installBannerDismissed')) {
    return;
  }
  
  const banner = document.createElement('div');
  banner.id = 'installBanner';
  banner.className = 'install-banner';
  banner.innerHTML = `
    <div class="install-banner-content">
      <div class="install-banner-icon">
        <i class="fas fa-download"></i>
      </div>
      <div class="install-banner-text">
        <strong>Install EduMeet</strong>
        <p>Install our app for a better experience!</p>
      </div>
      <div class="install-banner-actions">
        <button class="btn btn-primary btn-sm" onclick="installApp()">Install</button>
        <button class="btn btn-secondary btn-sm" onclick="dismissInstallBanner()">Later</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Animate in
  setTimeout(() => {
    banner.classList.add('show');
  }, 100);
}

// Hide install banner
function hideInstallBanner() {
  const banner = document.getElementById('installBanner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      banner.remove();
    }, 300);
  }
}

// Dismiss install banner
function dismissInstallBanner() {
  localStorage.setItem('installBannerDismissed', 'true');
  hideInstallBanner();
}

// Install app function
async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Install outcome: ${outcome}`);
    deferredPrompt = null;
    hideInstallBanner();
  }
}

// Detect if app is installed
window.addEventListener('appinstalled', () => {
  console.log('✅ EduMeet installed successfully!');
  hideInstallBanner();
  
  // Show success message
  if (typeof showAlert === 'function') {
    showAlert('EduMeet installed successfully! 🎉', 'success');
  }
});

// Detect standalone mode
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  console.log('📱 Running in standalone mode');
  document.body.classList.add('standalone-mode');
}

// Online/Offline detection
window.addEventListener('online', () => {
  console.log('🌐 Back online');
  if (typeof showAlert === 'function') {
    showAlert('You are back online! 🌐', 'success');
  }
  
  // Trigger background sync
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register('sync-bookings');
    });
  }
});

window.addEventListener('offline', () => {
  console.log('📵 Offline mode');
  if (typeof showAlert === 'function') {
    showAlert('You are offline. Some features may be limited. 📵', 'warning');
  }
});

// Check online status on load
if (!navigator.onLine) {
  console.log('📵 Starting in offline mode');
  if (typeof showAlert === 'function') {
    setTimeout(() => {
      showAlert('You are offline. Some features may be limited. 📵', 'warning');
    }, 1000);
  }
}

// Push notifications support
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('❌ Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    console.log('✅ Notification permission already granted');
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      return true;
    }
  }
  
  console.log('❌ Notification permission denied');
  return false;
}

// Subscribe to push notifications
async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('❌ Push notifications not supported');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Subscribe
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });
      
      console.log('✅ Subscribed to push notifications');
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    }
    
    return subscription;
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
  }
}

// Helper function for VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Share API
async function shareContent(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url
      });
      console.log('✅ Content shared successfully');
    } catch (error) {
      console.log('❌ Share failed:', error);
    }
  } else {
    console.log('❌ Web Share API not supported');
    // Fallback to copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      if (typeof showAlert === 'function') {
        showAlert('Link copied to clipboard!', 'success');
      }
    }
  }
}

// Add to home screen prompt for iOS
function showIOSInstallPrompt() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.navigator.standalone;
  
  if (isIOS && !isStandalone) {
    // Show iOS install instructions
    const iosPrompt = document.createElement('div');
    iosPrompt.className = 'ios-install-prompt';
    iosPrompt.innerHTML = `
      <div class="ios-prompt-content">
        <h3>Install EduMeet</h3>
        <p>Tap <i class="fas fa-share"></i> and then "Add to Home Screen"</p>
        <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
      </div>
    `;
    document.body.appendChild(iosPrompt);
  }
}

// Check for iOS and show prompt
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  setTimeout(showIOSInstallPrompt, 3000);
}

console.log('✅ PWA features loaded');
