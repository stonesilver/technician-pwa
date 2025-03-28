import type { TechnicianContext } from "~/types/auth"

export const useInstallPwa = () => {
  // const showModal = ref(false)
  // const deferredPrompt = ref<any>(null)

  // // Detect if the PWA install prompt is available
  // onMounted(() => {
  //   window.addEventListener("beforeinstallprompt", (event) => {
  //     event.preventDefault() // Prevent the default install prompt
  //     deferredPrompt.value = event
  //     showModal.value = true // Show the modal
  //   })

  //   console.log("I am mounted!!!!")
  // })

  // onMounted(() => {
  //   window.addEventListener("appinstalled", () => {
  //     // Hide the app-provided install promotion
  //     showModal.value = false
  //     // Clear the deferredPrompt so it can be garbage collected
  //     deferredPrompt.value = null
  //     window.location.href = import.meta.env.VITE_BASE_DOMAIN || "/"
  //     // Optionally, send analytics event to indicate successful install
  //   })
  // })

  // // Handle PWA installation when button is clicked
  // const installPWA = async () => {
  //   if (deferredPrompt.value) {
  //     deferredPrompt.value.prompt()
  //     const choiceResult = await deferredPrompt.value.userChoice

  //     if (choiceResult.outcome === "accepted") {
  //     } else {
  //       showModal.value = false
  //     }

  //     deferredPrompt.value = null // Reset after interaction
  //   }
  // }

  type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
  }

  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const showModal = ref(false)
  const technician = useState<TechnicianContext>("technician")

  // Combined lifecycle hooks
  onMounted(() => {
    window.addEventListener("beforeinstallprompt", handleInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    console.log("PWA listeners mounted")
  })

  onUnmounted(() => {
    window.removeEventListener("beforeinstallprompt", handleInstallPrompt)
    window.removeEventListener("appinstalled", handleAppInstalled)
    console.log("PWA listeners cleaned up")
  })

  const handleInstallPrompt = (event: Event) => {
    const installEvent = event as BeforeInstallPromptEvent
    installEvent.preventDefault()
    deferredPrompt.value = installEvent
    showModal.value = true
    console.log("Install prompt available")
  }

  const handleAppInstalled = () => {
    console.log("PWA was installed")
    showModal.value = false
    deferredPrompt.value = null
    // redirectAfterInstall()
  }

  // const redirectAfterInstall = () => {
  //   const redirectUrl = import.meta.env.VITE_BASE_DOMAIN || "/"
  //   // Consider using Nuxt's navigateTo for SPA navigation
  //   window.location.href = redirectUrl
  // }

  const installPWA = async (): Promise<void> => {
    if (!deferredPrompt.value) {
      console.warn("No install prompt available")
      showModal.value = false
      return
    }

    try {
      deferredPrompt.value.prompt()
      const choiceResult = await deferredPrompt.value.userChoice

      console.log(`User ${choiceResult.outcome} the install prompt`)
      showModal.value = false

      if (choiceResult.outcome === "accepted") {
        trackInstallation(true)
      } else {
        trackInstallation(false)
      }
    } catch (error) {
      console.error("Error showing install prompt:", error)
    } finally {
      deferredPrompt.value = null
    }
  }

  // Optional analytics tracking
  const trackInstallation = (accepted: boolean): void => {
    // Implement your analytics logic here
    console.log(`${accepted ? "accepted" : "declined"}`)
  }

  return { showModal, installPWA }
}
