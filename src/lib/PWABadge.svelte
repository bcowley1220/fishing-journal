<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let deferredPrompt: any;
  let showInstallButton = false;

  onMount(() => {
    if (!browser) return;

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      showInstallButton = true;
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      showInstallButton = false;
      deferredPrompt = null;
    });

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      showInstallButton = false;
    }
  });

  async function installApp() {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    deferredPrompt = null;
    showInstallButton = false;
  }

  function dismissInstall() {
    showInstallButton = false;
    deferredPrompt = null;
  }
</script>

{#if showInstallButton}
  <div class="pwa-install-banner">
    <div class="install-content">
      <span class="install-text">Install Fishing Journal for a better experience!</span>
      <div class="install-buttons">
        <button class="install-btn" on:click={installApp}>
          📱 Install
        </button>
        <button class="dismiss-btn" on:click={dismissInstall}>
          ✕
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .pwa-install-banner {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .install-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .install-text {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .install-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .install-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .install-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  .dismiss-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .dismiss-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 640px) {
    .pwa-install-banner {
      left: 10px;
      right: 10px;
      bottom: 10px;
    }

    .install-content {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    .install-text {
      font-size: 13px;
    }
  }
</style>