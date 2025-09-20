let shadowColor = 'rgba(30, 63, 0, 1)'

window.addEventListener("DOMContentLoaded", () => {
    setGlobalStyle()
    showScreenSize()
    showSize()
    showMark()
    let panel = genPanel()
    panel.innerHTML = '<div style="color: white; text-align: center; margin-bottom: 10px">UI/UX Checker</div>'
    addButton(panel, 'colors', btnFetchColors)
    addButton(panel, 'font-size', btnFetchFontSize)
    addButton(panel, 'border-radius', btnFetchBorderRadius)
    addButton(panel, 'z-index', btnFetchIndex)
    addButton(panel, 'comments', btnComments)
    addButton(panel, 'printscreen', btnPrintscreen)
})

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
    panel.addEventListener('mouseenter', () => {
        panel.style.left = '0px'
    })
    panel.addEventListener('mouseleave', () => {
        panel.style.left = '-195px'
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
    let moreColors = allColors.filter(c => c.match(/rgb/ig).length > 1)
    allColors = allColors.filter(c => c.match(/rgb/ig).length == 1)
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
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all colors in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:white;"/>`

    allColors.forEach(color => {
        let [r, g, b, a] = color.split('(')[1].split(')')[0].split(',').map(i => parseFloat(i.trim()))
        let [h, s, br] = RGB2HSB(r, g, b)
        let colorInfo = document.createElement('div')
        colorInfo.innerHTML = `<div style="background-color:${color};color:${br > 50 ? 'black' : 'white'}; font-size:12px; padding: 0px 2px;">${a == undefined ? RGB2HEX(r, g, b) : RGBA2HEX(r, g, b, a)} | ${color}</div>`

        colorInfo.onmouseenter = () => {
            colors.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).color == color ||
                    window.getComputedStyle(c).backgroundColor == color ||
                    window.getComputedStyle(c).borderColor == color ||
                    window.getComputedStyle(c).outlineColor == color) {
                    c.style.boxShadow = `0 0 20px ${shadowColor}`
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
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all z-index in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:white;"/>`

    allZ.forEach(z => {
        let zInfo = document.createElement('div')
        zInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 0px 2px;">${z}</div>`

        zInfo.onmouseenter = () => {
            zIdx.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).zIndex == z) {
                    c.style.boxShadow = `0 0 10px ${shadowColor}`
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
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all font-size in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:white;"/>`

    allFs.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 0px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).fontSize == z) {
                    c.style.boxShadow = `0 0 10px ${shadowColor}`
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
    document.body.appendChild(panel)

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: white; margin: 0px 5px;">
            <div>⭐️ all border-radius in site</div>
            <div onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;">x</div>
        </div>
        <hr style="margin:3px; border-color:white;"/>`

    all.forEach(z => {
        let nodeInfo = document.createElement('div')
        nodeInfo.innerHTML = `<div style="color: white; font-size:12px; padding: 0px 2px;">${z}</div>`

        nodeInfo.onmouseenter = () => {
            nodes.forEach(c => {
                c.style.boxShadow = style[c]
                if (window.getComputedStyle(c).borderRadius == z) {
                    c.style.boxShadow = `0 0 10px ${shadowColor}`
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
        mark.innerHTML = `
            <div style = "display:flex;">
                <textarea placeholder="text is too large""></textarea>
                <span style="color:white; background:#000; padding:0px 6px; cursor: pointer;" onclick = "this.parentElement.parentElement.remove()">x</span>
            </div>`
        document.body.appendChild(mark)
    })

}

function btnComments() {

    let p = document.getElementById('panel')
    p?.remove()

    alert('please double click on screen, and then leave your comment. \nex: text is too small')

}

function btnPrintscreen() {

    let p = document.getElementById('panel')
    p?.remove()

    alert('when you finish your comments editing, you can use build-in printscreen function of Chrome to download full page image. \n1) Open DevTools. \n2) Run Command(⌘ + Shift + P). \n3) Capture full size screenshot. ')

}
