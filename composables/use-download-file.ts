export const useDownloadFile = () => {
  const isDownloading = ref(false)

  const download = (src: string | File, filename: string) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onloadstart = () => {
      isDownloading.value = true
    }

    img.onerror = () => {
      isDownloading.value = false
      useToast.error("Failed to download image")
    }

    img.onload = function () {
      try {
        isDownloading.value = true
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)

        canvas.toBlob((blob) => {
          const link = document.createElement("a")
          link.download = filename
          link.href = URL.createObjectURL(blob as Blob)
          link.click()
          isDownloading.value = false
          URL.revokeObjectURL(link.href)
        }, "image/png")
      } catch (error) {
        isDownloading.value = false
      }
    }
    img.src = src instanceof File ? URL.createObjectURL(src) : src
  }

  return { download, isDownloading }
}
