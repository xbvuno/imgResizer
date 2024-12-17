const VALID_TYPES = ['image/png', 'image/jpeg', 'image/webp']

function isGoodType(item) {
    for (const type of VALID_TYPES) {
        if (item.type == type) {
            return true
        }
    }
    return false
}

function findGoodType(item) {
    for (const type of VALID_TYPES) {
        if (item.type == type) {
            return type
        }
    }
    return null
}


function imgFromEventItems(items) {
    return Array.from(items).find(item => {
        if (isGoodType(item)) {
            return true
        }
    });
}



function noImgFound(err_callback) {
    err_callback('Not an image or a valid type (PNG, JPEG or WEBP).');
}

function preventEvent(event) {
    event.preventDefault()
}

function BodyDragNotify(event) {
    event.preventDefault()
    setTimeout(() => {
        if (!dropped_in_source)
            drag_err_callback('Drop your image in the source image container')
    }, 200)
}




function DropHandler(event) {
    event.preventDefault()
    dropped_in_source = true
    setTimeout(() => {
        dropped_in_source = false
    }, 500)
    const imageBlob = imgFromEventItems(event.dataTransfer.files)
    if (imageBlob) {
        drag_img_callback(imageBlob);
        return
    }
    noImgFound(drag_err_callback)
}

let dropped_in_source = false

let paste_img_callback, paste_err_callback, 
    drag_img_callback, drag_err_callback

function PasteHandler(event) {
    const imageItem = imgFromEventItems(event.clipboardData.items)
    if (imageItem) {
        paste_img_callback(imageItem.getAsFile());
        return
    }
    noImgFound(paste_err_callback)
}

export function DragImgEventListenerEffect(elem_drag_on, img_callback, err_callback) {
    return () => {
        if (!elem_drag_on.current)
            return

        drag_img_callback = img_callback
        drag_err_callback = err_callback
        document.addEventListener('dragover', preventEvent)
        document.addEventListener('drop', BodyDragNotify)
        elem_drag_on.current.addEventListener('drop', DropHandler)
        return () => {
            document.removeEventListener('dragover', preventEvent)
            document.removeEventListener('drop', BodyDragNotify)
            elem_drag_on.current.removeEventListener('drop', DropHandler)
            drag_img_callback = null
            drag_err_callback = null
        }
    }
}

export function PasteImgEventListenerEffect(img_callback, err_callback) {
    return () => {
        paste_img_callback = img_callback
        paste_err_callback = err_callback
        document.addEventListener('paste', PasteHandler)
        return () => {
            document.removeEventListener('paste', PasteHandler)
            paste_img_callback = null
            paste_err_callback = null
        }
    }
}

export function pasteFromClick(img_callback, err_callback) {
    return () => {
        navigator.clipboard.read()
        .then(items => {
            let imgType = ''
            let imgItem = items.find(item => {
                for (const type of VALID_TYPES)
                    if (item.types.includes(type)) {
                        imgType = type
                        return true
                    }
            })
            if (imgType == '') {
                noImgFound(err_callback)
            }
            else
                imgItem.getType(imgType).then(img => img_callback(img))
        })
        .catch(err => {
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                err_callback('Permission to read from clipboard was denied.');
            } else {
                err_callback('Failed to read clipboard');
            }
            console.error('Failed to read clipboard:', err);
        });
    }
}

export function pasteFromFile(img_callback, err_callback) {
    return (event) => {
        const file = event.target.files[0];
        if (file) {
            if (isGoodType(file)) 
                img_callback(file)
            else
                noImgFound(err_callback)
        }
    }
}


export async function ScaledBlobFromUrl(url, scale, smoothing = false) {
    
    // DA URL A IMG
    const img = new Image()
    img.src = url
    await new Promise(resolve => {img.onload = resolve})

    // DA IMG A CANVAS
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const scaleFactor = parseFloat(scale);
    const newWidth = img.width * scaleFactor;
    const newHeight = img.height * scaleFactor;
    canvas.width = newWidth;
    canvas.height = newHeight;
    context.imageSmoothingEnabled = smoothing
    context.drawImage(img, 0, 0, newWidth, newHeight);

    // DA CANVAS A BLOB
    return new Promise(resolve => {canvas.toBlob(resolve, "image/png")})
}

export async function copyImageToClipboard(blob, alert_func) {
    try {
        const item = new ClipboardItem({
            "image/png": blob
        });
        await navigator.clipboard.write([item]);
        alert_func("Image copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy image to clipboard: ", err);
        alert_func("Failed to copy image to clipboard.");
    }
}

export async function saveImage(url, filename) {
    const link = document.createElement('a'); // Create an <a> element
    link.href = url; // Set the href to the blob URL
    link.download = filename; // Set the download filename
    document.body.appendChild(link); // Append the link to the document
    link.click(); // Trigger the download
    document.body.removeChild(link); // Remove the link
}