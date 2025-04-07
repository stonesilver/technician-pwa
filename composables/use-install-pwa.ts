import type { TechnicianContext } from "~/types/auth"

export const useInstallPwa = () => {
  type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
  }

  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const showModal = ref(true)
  const technician = useState<TechnicianContext>("technician")

  const nuxtApp = useNuxtApp()
  const route = useRoute()

  const handleActionOnClick = async () => {
    await nuxtApp?.$pwa?.updateServiceWorker(true)
    window.location.reload()
  }

  const showInstallModal = computed(() => {
    return (
      showModal.value &&
      nuxtApp?.$pwa?.showInstallPrompt &&
      route.meta.layout === "default" &&
      technician.value?.has_changed_password &&
      !!deferredPrompt.value
    )
  })

  const handleInstallPrompt = (event: Event) => {
    const installEvent = event as BeforeInstallPromptEvent
    installEvent.preventDefault()
    deferredPrompt.value = installEvent
    showModal.value = true
    console.log("Install prompt available")
  }

  const handleAppInstalled = () => {
    showModal.value = false
    deferredPrompt.value = null
    // redirectAfterInstall()
  }

  // const redirectAfterInstall = () => {
  //   const redirectUrl = import.meta.env.VITE_BASE_DOMAIN || "/"
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

  onMounted(() => {
    window.addEventListener("beforeinstallprompt", handleInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener("beforeinstallprompt", handleInstallPrompt)
    window.removeEventListener("appinstalled", handleAppInstalled)
  })

  watch(
    () => nuxtApp?.$pwa?.needRefresh,
    (show) => {
      if (show) {
        useToast.info("New update available!", {
          action: { label: "Update", onClick: () => handleActionOnClick() },
          duration: Infinity,
          classes: { actionButton: "!bg-blue-500" },
        })
      }
    },
    { immediate: true }
  )

  return { showInstallModal, showModal, installPWA }
}
