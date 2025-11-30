function sortFiles(files) {
  return Array.from(files).sort((a, b) => a.name.localeCompare(b.name, 'zh'))
}

function showThumbnails(files) {
  const grid = document.getElementById('imagePreview')
  grid.innerHTML = ''
  sortFiles(files).forEach(f => {
    const url = URL.createObjectURL(f)
    const item = document.createElement('div')
    item.className = 'preview-item'
    const img = document.createElement('img')
    img.src = url
    const cap = document.createElement('div')
    cap.className = 'small mt-2 text-secondary'
    cap.textContent = f.name
    item.appendChild(img)
    item.appendChild(cap)
    grid.appendChild(item)
  })
}

async function ocrFiles(files) {
  const ordered = sortFiles(files)
  const parts = []
  for (let i = 0; i < ordered.length; i++) {
    const f = ordered[i]
    const { data } = await Tesseract.recognize(f, 'chi_sim+eng')
    let t = data.text || ''
    t = t.replace(/[\u0000-\u001F]/g, '').replace(/[ ]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n')
    parts.push(t.trim())
  }
  return parts.join('\n\n')
}

async function handleOcr(toGenerate) {
  const input = document.getElementById('imageInput')
  const files = getSelectedFiles()
  if (!files || files.length === 0) return
  const text = await ocrFiles(files)
  document.getElementById('inputText').value = text
  if (toGenerate) {
    const fontFamily = document.getElementById('fontFamily').value
    const inkStrength = Number(document.getElementById('inkStrength').value)
    const lineHeight = Number(document.getElementById('lineHeight').value)
    const margin = Number(document.getElementById('margin').value)
    const imgs = generateImages(text, { fontFamily, inkStrength, lineHeight, margin })
    renderPreviews(imgs)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('imageInput')
  input.addEventListener('change', e => showThumbnails(e.target.files))
  document.getElementById('ocrExtractBtn').addEventListener('click', () => handleOcr(false))
  document.getElementById('ocrGenerateBtn').addEventListener('click', () => handleOcr(true))
  setupPasteSupport()
})

let pastedFiles = []

function getSelectedFiles() {
  const input = document.getElementById('imageInput')
  if (pastedFiles && pastedFiles.length) return pastedFiles
  return input.files
}

function setupPasteSupport() {
  document.addEventListener('paste', async (e) => {
    const items = e.clipboardData && e.clipboardData.items ? e.clipboardData.items : []
    const imgs = []
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (it.type.indexOf('image') !== -1) {
        const blob = it.getAsFile()
        if (blob) imgs.push(new File([blob], `pasted_${Date.now()}_${i}.png`, { type: blob.type }))
      }
    }
    if (imgs.length) {
      pastedFiles = imgs
      showThumbnails(imgs)
      handleOcr(true)
    }
  })
}
