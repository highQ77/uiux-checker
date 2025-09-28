let shadowColor = 'rgba(63, 0, 0, 1)'

window.addEventListener("DOMContentLoaded", () => {
    setGlobalStyle()
    showScreenSize()
    showSize()
    showMark()
    let panel = genPanel()
    panel.innerHTML = '<div style="color: white; text-align: center; margin-bottom: 10px">UI/UX Checker</div>'

    addText(panel, 'css properties')
    addButton(panel, 'colors', btnFetchColors)
    addButton(panel, 'font-size', btnFetchFontSize)
    addButton(panel, 'font-family', btnFetchFontFamily)
    addButton(panel, 'border-radius', btnFetchBorderRadius)
    addButton(panel, 'border-width', btnFetchBorderWidth)
    addButton(panel, 'outline-width', btnFetchOutlineWidth)
    addButton(panel, 'z-index', btnFetchIndex)
    addText(panel, 'html structure')
    addButton(panel, 'tags-count', btnFetchTags)
    addButton(panel, 'dom-tree', btnFetchTree)
    addText(panel, 'note tools')
    addButton(panel, 'painter', btnPainter)
    addButton(panel, 'comments', btnComments)
    addButton(panel, 'printscreen', btnPrintscreen)
})

function addText(parent, labelText) {
    let label = document.createElement('div')
    label.innerHTML = labelText
    label.style.width = '100%'
    label.style.borderRadius = '100px'
    label.style.backgroundColor = '#FFFFFF22'
    label.style.margin = '0px 0px 5px'
    label.style.color = 'yellowgreen'
    label.style.fontSize = '14px'
    label.style.textAlign = 'center'
    label.style.marginTop = '10px'
    parent.appendChild(label)
}

function setGlobalStyle() {
    let style = document.createElement('style')
    style.textContent = `
        body *:not(#mainPanel, #mainPanel *, #panel, #panel *)::before { 
            content: attr(info); 
            font-size: 12px;
            position: absolute;
            background: #FFFFFFCC;
            color: white;
            border-radius: 5px;
            padding: 0px 5px;
            transform: translate(0px, 0px);
            scale: 0;
            z-index:99;
            transition: all .2s;
            pointer-events: none;
        }
        body *:not(#mainPanel, #mainPanel *, #panel, #panel *):hover::before{
            background: #006600cc;
            transform: translate(0px, -1.73em);
            scale: 1;
        }
        
        .vline::before{
            content: attr(info); 
            font-size: 12px;
            position: absolute;
            bottom: 0px;
            background: red;
            color: white;
            border-radius: 5px;
            padding: 0px 5px;
        }
    `
    document.body.append(style)
}

function genPanel() {
    let panel = document.createElement('div')
    panel.id = "mainPanel"
    panel.style.position = 'fixed'
    panel.style.width = '200px'
    panel.style.height = '100dvh'
    panel.style.left = '0px'
    panel.style.top = '0px'
    panel.style.padding = '10px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.transition = 'all .2s'
    panel.style.borderRight = '2px solid yellowgreen'
    panel.style.fontFamily = 'Arial'
    panel.addEventListener('mouseenter', () => {
        panel.style.left = '0px'
        panel.style.opacity = '1'
    })
    panel.addEventListener('mouseleave', () => {
        panel.style.left = '-188px'
        panel.style.opacity = '.2'
    })
    document.body.appendChild(panel)
    return panel
}

function addButton(parent, label = 'button', listener) {
    let btn = document.createElement('button')
    btn.innerHTML = label
    btn.style.width = '100%'
    btn.style.borderRadius = '100px'
    btn.style.backgroundColor = '#FFFFFF66'
    btn.style.margin = '0px 0px 5px'
    btn.style.color = 'white'
    btn.style.fontSize = '14px'
    btn.onclick = listener
    parent.appendChild(btn)
}

/**
 * RGB to HSB 顏色轉換
 * @param r 0~255
 * @param g 0~255
 * @param b 0~255
 * @returns [0~360, 0~100, 0~100]
 */
function RGB2HSB(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
}

function RGB2HEX(r, g, b) {
    return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}

function RGBA2HEX(r, g, b, a) {
    return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(~~(a * 255))).toUpperCase();
    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}

function btnFetchColors() {

    let colors = [...document.body.querySelectorAll('*')]
    let allColors = []
    let style = {}
    colors.forEach(c => {
        let color = window.getComputedStyle(c).color
        let bgcolor = window.getComputedStyle(c).backgroundColor
        let borderColor = window.getComputedStyle(c).borderColor
        let outlineColor = window.getComputedStyle(c).outlineColor
        allColors.push(color, bgcolor, borderColor, outlineColor)
        style[c] = c.style.boxShadow
    })
    allColors = [...new Set(allColors)]
    let moreColors = allColors.filter(c => c.match(/rgb/ig)?.length > 1)
    allColors = allColors.filter(c => c.match(/rgb/ig)?.length == 1)
    let moreColor = []
    moreColors.forEach((c, idx, all) => {
        for (let i = 0; i < all.length; i++) {
            let morec = c.slice(c.indexOf('rgb('), c.indexOf(')') + 1)
            moreColor.push(morec)
        }
    })
    allColors = [...new Set([...allColors, ...moreColor])].filter(c => c != shadowColor)

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all colors in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    allColors.forEach(color => {
        let [r, g, b, a] = color.split('(')[1].split(')')[0].split(',').map(i => parseFloat(i.trim()))
        let [h, s, br] = RGB2HSB(r, g, b)
        let colorInfo = document.createElement('div')
        colorInfo.innerHTML = `<div style="background-color:${color};color:${br > 50 ? 'black' : 'white'}; font-size:12px; padding: 5px 2px;">${a == undefined ? RGB2HEX(r, g, b) : RGBA2HEX(r, g, b, a)} | ${color}</div>`

        colorInfo.onmouseenter = () => {
            colors.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).color == color ||
                    window.getComputedStyle(c).backgroundColor == color ||
                    window.getComputedStyle(c).borderColor == color ||
                    window.getComputedStyle(c).outlineColor == color) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        colorInfo.onmouseleave = () => {
            colors.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(colorInfo)
    })

    return panel
}

function btnFetchTags() {

    let nodes = [...document.body.querySelectorAll('*')]
    let all = []
    let style = {}
    nodes.forEach(c => {
        all.push(c.tagName)
        style[c] = c.style.boxShadow
    })
    all = [...new Set(all.map(data => data.toLowerCase()))]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all tags in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    all.forEach(data => {

        if (data == 'script' || data == 'style') return

        let count = 0
        nodes.forEach(c => {
            if (c.tagName.toLowerCase() == data) {
                count++
            }
        })

        let tagInfo = document.createElement('div')
        tagInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${data} - <span style="color:orange;">${count}</span></div>`

        tagInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (c.tagName.toLowerCase() == data) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        tagInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(tagInfo)
    })

    return panel
}

function btnFetchTree() {

    let nodes = [...document.body.querySelectorAll('*')]
    let style = {}
    nodes.forEach(c => {
        style[c] = c.style.boxShadow
    })

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.minWidth = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    panel.style.maxHeight = '600px'
    panel.style.overflow = 'auto'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ dom tree in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    nodes.forEach(data => {

        let parentE = data
        if (data.id == 'panel') return
        while (parentE = parentE.parentElement) {
            if (parentE.id == 'panel') return
        }
        parentE = data
        if (data.id == 'mainPanel') return
        while (parentE = parentE.parentElement) {
            if (parentE.id == 'mainPanel') return
        }

        if (data.id == 'screenSize') return

        let tag = data.tagName.toLowerCase()
        if (tag == 'script' || tag == 'style') return

        let level = 0
        let parent = data
        while (parent = parent.parentElement) {
            level++
        }
        let tagInfo = document.createElement('div')
        tagInfo.innerHTML = `<div style="display:flex; color: white; font-size:12px;">
            <span style="color:orange">${Array(level).fill('---').join('')}</span>
            <span>${tag}${data.id ? ('<b style="color:orange;">#' + data.id + '</b>') : ''} - ${level - 1}</span>
            <span class='tag-size' style='display:flex;'></span>
        </div>`
        let tagSize = tagInfo.getElementsByClassName('tag-size')[0]
        tagSize.innerHTML = ''

        tagInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (c == data) {
                    let rect = c.getBoundingClientRect()
                    let computed = window.getComputedStyle(c)
                    let { fontSize, color, backgroundColor } = computed
                    let cc = [...new Set([...[color, backgroundColor]])]

                    let rgbAndRgba = []
                    cc = cc.map(color => {
                        let [r, g, b, a] = color.split('(')[1].split(')')[0].split(',').map(i => parseFloat(i.trim()))
                        let hex = a == undefined ? RGB2HEX(r, g, b) : RGBA2HEX(r, g, b, a)
                        return { color, hex }
                    })
                    cc = cc.map(c => `<div style="display:inline-flex; width:10px; height:10px; background-color:${c.color}; border:1px solid white; margin:1px; cursor:pointer" onclick="alert('${c.color + ' ' + c.hex}')"></div>`).join(' ')
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                    window.scrollTo({ top: rect.top + window.scrollY - 100, behavior: 'smooth' })
                    tagSize.innerHTML = `<span style="display:flex; justify-content: space-around; align-items:center; color:white; border-radius: 99px; margin: 0px 5px; padding: 0px 5px; background:green; ">${~~rect.width}x${~~rect.height} font:${fontSize}</span> &nbsp;<span style="margin-top:1px">${cc}</span>`
                }
            })
        }
        tagInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                tagSize.innerHTML = ''
                tagSize.style.background = 'transparent'
            })
        }
        panel.appendChild(tagInfo)
    })

    return panel
}

function btnFetchIndex() {
    let zIdx = [...document.body.querySelectorAll('*')]
    let allZ = []
    let style = {}
    zIdx.forEach(c => {
        let z = window.getComputedStyle(c).zIndex
        allZ.push(z)
        style[c] = c.style.boxShadow
    })

    allZ = [...new Set(allZ)]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all z-index in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    allZ.forEach(z => {
        let zInfo = document.createElement('div')
        zInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${z}</div>`

        zInfo.onmouseenter = () => {
            zIdx.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).zIndex == z) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        zInfo.onmouseleave = () => {
            zIdx.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(zInfo)
    })

    return panel
}

function btnFetchFontSize() {
    let nodes = [...document.body.querySelectorAll('*')]
    let allFs = []
    let style = {}
    nodes.forEach(c => {
        let z = window.getComputedStyle(c).fontSize
        allFs.push(z)
        style[c] = c.style.boxShadow
    })

    allFs = [...new Set(allFs)]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all font-size in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    allFs.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).fontSize == z) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        nodeInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(nodeInfo)
    })

    return panel
}

function btnFetchFontFamily() {
    let nodes = [...document.body.querySelectorAll('*')]
    let all = []
    let style = {}
    nodes.forEach(c => {
        let z = window.getComputedStyle(c).fontFamily
        all.push(z)
        style[c] = c.style.boxShadow
    })

    all = [...new Set(all)]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.minWidth = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all font-family in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    all.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).outlineWidth == z) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        nodeInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(nodeInfo)
    })

    return panel
}


function btnFetchBorderRadius() {
    let nodes = [...document.body.querySelectorAll('*')]
    let all = []
    let style = {}
    nodes.forEach(c => {
        let z = window.getComputedStyle(c).borderRadius
        all.push(z)
        style[c] = c.style.boxShadow
    })

    all = [...new Set(all)]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all border-radius in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    all.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).borderRadius == z) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        nodeInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(nodeInfo)
    })

    return panel
}

function btnFetchBorderWidth() {
    let nodes = [...document.body.querySelectorAll('*')]
    let all = []
    let style = {}
    nodes.forEach(c => {
        let z = window.getComputedStyle(c).borderWidth
        all.push(z)
        style[c] = c.style.boxShadow
    })

    all = [...new Set(all)]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all border-width in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    all.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).borderWidth == z) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        nodeInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(nodeInfo)
    })

    return panel
}

function btnFetchOutlineWidth() {
    let nodes = [...document.body.querySelectorAll('*')]
    let all = []
    let style = {}
    nodes.forEach(c => {
        let z = window.getComputedStyle(c).outlineWidth
        all.push(z)
        style[c] = c.style.boxShadow
    })

    all = [...new Set(all)]

    let p = document.getElementById('panel')
    p?.remove()

    let panel = document.createElement('div')
    panel.id = 'panel'
    panel.style.position = 'fixed'
    panel.style.width = '300px'
    panel.style.right = '0px'
    panel.style.top = '0px'
    panel.style.padding = '3px'
    panel.style.background = '#000000CC'
    panel.style.backdropFilter = 'blur(10px)'
    panel.style.zIndex = '99999'
    panel.style.fontFamily = 'Arial'
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all outline-width in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:#333;"/>`

    all.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 5px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).outlineWidth == z) {
                    c.style.boxShadow = `inset 0 0 20px ${shadowColor}`
                }
            })
        }
        nodeInfo.onmouseleave = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
            })
        }
        panel.appendChild(nodeInfo)
    })

    return panel
}


function showScreenSize() {
    let ss = document.createElement('div')
    ss.id = 'screenSize'
    ss.style.position = 'fixed'
    ss.style.left = '0px'
    ss.style.top = '0px'
    ss.style.backgroundColor = '#00000077'
    ss.style.color = 'white'
    ss.style.padding = '0px 10px'
    ss.style.width = '100vw'
    ss.style.zIndex = '99999'
    ss.style.textAlign = 'center'
    ss.style.pointerEvents = 'none'
    ss.style.fontSize = '12px'
    document.body.appendChild(ss)
    ss.innerText = `${window.innerWidth}px x ${window.innerHeight}px`
    window.addEventListener('resize', () => {
        ss.innerText = `${window.innerWidth}px x ${window.innerHeight}px`
    })
    document.body.addEventListener('mouseenter', () => {
        ss.style.display = 'block'
    })
    document.body.addEventListener('mouseleave', () => {
        ss.style.display = 'none'
    })
}

function showSize() {

    let p = document.getElementById('panel')
    p?.remove()

    let mouseoverNodes = []

    let nodes = [...document.body.querySelectorAll('*')]
    nodes.forEach(n => {

        let w = Math.round(parseInt(window.getComputedStyle(n).width))
        let h = Math.round(parseInt(window.getComputedStyle(n).height))
        let fs = window.getComputedStyle(n).fontSize

        if (!(isNaN(w) || isNaN(h))) {
            n.setAttribute('info', `${n.tagName.toLowerCase()}-${w}x${h}, font-${fs}`)
            n.addEventListener('mouseenter', () => {
                nodes.forEach(n => n.style.outline = `0px dashed ${shadowColor}`)
                mouseoverNodes.push(n)
                n.style.outline = `1px dashed ${shadowColor}`
            })
            n.addEventListener('mouseleave', () => {
                n.style.outline = `0px dashed ${shadowColor}`
            })
        }
    })

}

function showMark() {

    document.body.addEventListener('dblclick', e => {
        let x = e.pageX
        let y = e.pageY
        let mark = document.createElement('div')
        mark.className = 'sc_mark'
        mark.style.position = 'absolute'
        mark.style.left = x + 'px'
        mark.style.top = y + 'px'
        mark.style.backgroundColor = 'white'
        mark.innerHTML = `
            <div style = "display:flex;">
                <textarea placeholder="the text is too large""></textarea>
                <span style="color:white; background:#000; padding:0px 6px; cursor: pointer;" onclick = "this.parentElement.parentElement.remove()">x</span>
            </div>`
        document.body.appendChild(mark)
    })

}

function btnComments() {

    let p = document.getElementById('panel')
    p?.remove()

    alert('please double click on screen, and then leave your comment. \nex: the text is too small')

}

function btnPrintscreen() {

    let p = document.getElementById('panel')
    p?.remove()

    alert('when you finish your comments editing, you can use build-in printscreen function of Chrome to download full page image. \n1) Open DevTools. \n2) Run Command(⌘ + Shift + P). \n3) Capture full size screenshot. ')

}

function btnPainter() {

    let canv = document.getElementById('painter')
    if (canv) {
        canv.onmousedown = null
        canv.onmousemove = null
        canv.onmouseup = null
        canv.remove()
    } else {

        let bodyRect = document.body.getBoundingClientRect()
        let canvas = document.createElement('canvas')
        canvas.id = 'painter'
        canvas.width = bodyRect.width
        canvas.height = bodyRect.height
        canvas.style.position = 'absolute'
        canvas.style.left = '0px'
        canvas.style.top = '0px'
        document.body.appendChild(canvas)

        let ctx = canvas.getContext('2d')
        let px = 0
        let py = 0
        canvas.onmousedown = e => {
            px = e.pageX
            py = e.pageY
            canvas.onmousemove = e => {
                ctx.strokeStyle = 'red'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(px, py)
                ctx.lineTo(e.pageX, e.pageY)
                ctx.stroke()
                px = e.pageX
                py = e.pageY
            }
        }
        canvas.onmouseup = e => {
            ctx.closePath()
            canvas.onmousemove = null
        }
    }
}