const A4W = 1654
const A4H = 2339
const bgColor = '#fbfaf7'
const marginDefault = 120
const lineColor = '#e8e2d6'
const headerLineColor = '#d44e4e'
const pencilColors = ['#1a1a1a','#222222','#2a2a2a','#0f0f0f']

function createCanvas() {
  const c = document.createElement('canvas')
  c.width = A4W
  c.height = A4H
  return c
}

function drawPaper(ctx, margin) {
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, A4W, A4H)
  ctx.strokeStyle = headerLineColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(margin * 0.7, 0)
  ctx.lineTo(margin * 0.7, A4H)
  ctx.stroke()
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1
  for (let y = margin; y < A4H - margin; y += 48) {
    ctx.beginPath()
    ctx.moveTo(margin, y)
    ctx.lineTo(A4W - margin, y)
    ctx.stroke()
  }
}

function jitter(n) {
  return (Math.random() - 0.5) * n
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function drawSmudge(ctx, x, y) {
  const r = 2 + Math.random() * 3
  const opacity = 0.05 + Math.random() * 0.08
  ctx.fillStyle = `rgba(0,0,0,${opacity})`
  ctx.beginPath()
  ctx.arc(x + jitter(1), y + jitter(1), r, 0, Math.PI * 2)
  ctx.fill()
}

function drawHandText(ctx, text, x, y, options) {
  const { fontFamily, size, inkStrength } = options
  ctx.textBaseline = 'alphabetic'
  ctx.font = `${size}px ${fontFamily}, system-ui, sans-serif`
  let cursorX = x
  const baseColor = pick(pencilColors)
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const w = ctx.measureText(ch).width
    const tilt = jitter(0.06)
    const upDown = jitter(1.6)
    const darken = Math.max(0, Math.min(1, (inkStrength + jitter(10)) / 100))
    const rgb = Math.floor(20 + darken * 60)
    ctx.fillStyle = `rgb(${rgb},${rgb},${rgb})`
    ctx.save()
    ctx.translate(cursorX + jitter(0.8), y + upDown)
    ctx.rotate(tilt)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    if (Math.random() < 0.02) drawSmudge(ctx, cursorX, y)
    cursorX += w
  }
}

function paginate(text, ctx, margin, lineHeight, size, fontFamily) {
  const lines = []
  const words = text.split(/\n/)
  const maxWidth = A4W - margin * 2
  const tmpCtx = ctx
  tmpCtx.font = `${size}px ${fontFamily}, system-ui, sans-serif`
  words.forEach(line => {
    let current = ''
    for (let i = 0; i < line.length; i++) {
      const test = current + line[i]
      const w = tmpCtx.measureText(test).width
      if (w > maxWidth) {
        lines.push(current)
        current = line[i]
      } else {
        current = test
      }
    }
    lines.push(current)
  })
  const maxLinesPerPage = Math.floor((A4H - margin * 2) / lineHeight)
  const pages = []
  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    pages.push(lines.slice(i, i + maxLinesPerPage))
  }
  return pages
}

function generateImages(text, opts) {
  const margin = Number(opts.margin || marginDefault)
  const lineHeight = Number(opts.lineHeight || 44)
  const fontFamily = opts.fontFamily || 'KaiTi'
  const size = 28
  const inkStrength = Number(opts.inkStrength || 60)
  const c = createCanvas()
  const ctx = c.getContext('2d')
  const pages = paginate(text, ctx, margin, lineHeight, size, fontFamily)
  const images = []
  pages.forEach((page, idx) => {
    drawPaper(ctx, margin)
    let y = margin + lineHeight
    page.forEach(line => {
      drawHandText(ctx, line, margin + 8 + jitter(2), y, { fontFamily, size, inkStrength })
      y += lineHeight
    })
    const url = c.toDataURL('image/png')
    images.push({ url, idx: idx + 1 })
    ctx.clearRect(0, 0, A4W, A4H)
  })
  return images
}

function renderPreviews(images) {
  const grid = document.getElementById('previewGrid')
  grid.innerHTML = ''
  images.forEach(img => {
    const wrap = document.createElement('div')
    wrap.className = 'preview-item'
    const image = document.createElement('img')
    image.src = img.url
    const bar = document.createElement('div')
    bar.className = 'd-flex align-items-center justify-content-between mt-2'
    const label = document.createElement('span')
    label.textContent = `第 ${img.idx} 页`
    const btn = document.createElement('a')
    btn.className = 'btn btn-sm btn-outline-primary'
    btn.href = img.url
    btn.download = `A4_${String(img.idx).padStart(2,'0')}.png`
    btn.textContent = '下载'
    bar.appendChild(label)
    bar.appendChild(btn)
    wrap.appendChild(image)
    wrap.appendChild(bar)
    grid.appendChild(wrap)
  })
}

function handleGenerate() {
  const text = document.getElementById('inputText').value.trim()
  const fontFamily = document.getElementById('fontFamily').value
  const inkStrength = Number(document.getElementById('inkStrength').value)
  const lineHeight = Number(document.getElementById('lineHeight').value)
  const margin = Number(document.getElementById('margin').value)
  if (!text) return
  const images = generateImages(text, { fontFamily, inkStrength, lineHeight, margin })
  renderPreviews(images)
}

function handleClear() {
  document.getElementById('previewGrid').innerHTML = ''
}

function handleDownloadAll() {
  const items = Array.from(document.querySelectorAll('#previewGrid .preview-item a'))
  if (window.JSZip && items.length) {
    const zip = new JSZip()
    items.forEach(a => {
      const url = a.href
      const name = a.download || 'A4.png'
      const base64 = url.split(',')[1]
      zip.file(name, base64, { base64: true })
    })
    zip.generateAsync({ type: 'blob' }).then(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'A4_PNGs.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  } else {
    items.forEach(a => a.click())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateBtn').addEventListener('click', handleGenerate)
  document.getElementById('clearBtn').addEventListener('click', handleClear)
  document.getElementById('downloadAllBtn').addEventListener('click', handleDownloadAll)
})
