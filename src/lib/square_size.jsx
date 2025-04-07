function rgbaToHex({ r, g, b, a = 255 }) {
    // Converte r, g, b, a in formato esadecimale (0-255)
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    const hexA = a.toString(16).padStart(2, '0'); // Converte l'alpha in esadecimale (se a non è specificato, usa 255)

    // Restituisce il valore esadecimale
    return `#${hexR}${hexG}${hexB}${hexA}`;
}
  
function sortObjectByValue(obj) {
    // Crea un array di coppie [chiave, valore]
    const entries = Object.entries(obj);
  
    // Ordina le coppie in base al valore (in ordine decrescente)
    entries.sort((a, b) => b[1] - a[1]);
  
    // Crea un nuovo oggetto con le chiavi e valori ordinati
    return Object.fromEntries(entries);
}


function fromDataToMatrix(data, width, height) {
    let imgMtx = []
    for (let y = 0; y < height; y++) {
        let row = []
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            let color = {}
            const vs = ['r', 'g', 'b', 'a']
            for (let z of [0, 1, 2, 3]) {
                color[vs[z]] = data[index + z]
            }
            row.push(color)
        }
        imgMtx.push(row)
    }
    return imgMtx
}

function MatrixToCanvas(imgMtx) {
    // Ottieni le dimensioni della matrice
    const height = imgMtx.length;
    const width = imgMtx[0].length;
  
    // Crea un canvas con le stesse dimensioni dell'immagine
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
  
    // Crea un array per i dati dei pixel
    const pixelData = [];
  
    // Itera sulla matrice imgMtx e prepara i dati dei pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = imgMtx[y][x];
  
        // Aggiungi i valori di colore (r, g, b, a) nell'array pixelData
        pixelData.push(color.r, color.g, color.b, color.a);
      }
    }
  
    // Crea un oggetto ImageData con i dati dei pixel
    const imageData = new ImageData(new Uint8ClampedArray(pixelData), width, height);
  
    // Disegna l'immagine nel canvas
    ctx.putImageData(imageData, 0, 0);
  
    // Restituisci il canvas
    return canvas;
  }

function colorCounts(imgMatrix) {
    const height = imgMatrix.length
    const width = imgMatrix[0].length
    let colors = {}
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = imgMatrix[y][x]
            const hex = rgbaToHex(color)
            if (hex in colors)
                colors[hex] += 1
            else
                colors[hex] = 1
        }
    }
    return sortObjectByValue(colors)
}

function imgRect(imgMatrix, from_x, from_y, width, height) {
    if (imgMatrix.length < from_y + height)
        return
    if (imgMatrix[0].length < from_x + width)
        return

    let section = []
    for (let y = from_y; y < from_y + height; y++) {
        let row = []
        for (let x = from_x; x <  from_x + width; x++) {
            row.push(imgMatrix[y][x])
        }
        section.push(row)
    }
    return section
}

function overlayMatrix(base_matrix, overlay_matrix, from_x, from_y) {
    const base_height = base_matrix.length
    const base_width = base_matrix[0].length
    const overlay_height = overlay_matrix.length
    const overlay_width = overlay_matrix[0].length
    for (let y = 0; y < overlay_height; y++) {
        for (let x = 0; x < overlay_width; x++) {
            const base_matrix_y = y + from_y
            const base_matrix_x = x + from_x
            if (base_matrix_x > base_width || base_matrix_y > base_height)
                continue

            base_matrix[base_matrix_y][base_matrix_x] = overlay_matrix[y][x]
        }
    }
}

function sameColor(c1, c2) {
    const cv = ['r', 'g', 'b', 'a']
    for (let key of cv) {
        if (c1[key] !== c2[key]) {
            return false;
        }
    }
    return true
}

function matrixSameColor(imgMatrix) {
    //console.log(imgMatrix)
    const height = imgMatrix.length
    const width = imgMatrix[0].length
    const first_color = imgMatrix[0][0]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = imgMatrix[y][x]
            //console.log(color, '!==', first_color, ' --? ', color !== first_color)
            if (!sameColor(color, first_color))
                return false
        }
    }
    return true
}

function sameBottomRightBorderColor(imgMatrix) {
    const height = imgMatrix.length
    const width = imgMatrix[0].length
    const first_color = imgMatrix[0][0]

    for (let y = 0; y < height; y++) {
        const color = imgMatrix[y][width - 1]
        if (!sameColor(color, first_color))
            return false
    }

    for (let x = 0; x < width; x++) {
        const color = imgMatrix[height - 1][x]
        if (!sameColor(color, first_color))
            return false
    }

    return true
}


function matrixSetColor(imgMatrix, color) {
    try {
        const height = imgMatrix.length
        const width = imgMatrix[0].length
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                imgMatrix[y][x] = color
            }
        }
        return imgMatrix
    }
    catch (error) {
        console.log(imgMatrix, error)
    }
    
}


function getKeyWithMaxValue(obj) {
    return Object.entries(obj).reduce((max, [key, value]) => {
      if (value > max.value) {
        return { key, value }; // Aggiorna se il valore corrente è più grande
      }
      return max; // Mantieni la coppia esistente se il valore corrente non è maggiore
    }, { key: null, value: -Infinity }).key;
  }

  

function findMatrixSquaresSize(imgMatrix) {

    let imgMtx = [...imgMatrix]
    let z_list = {}

    const height = imgMtx.length
    const width = imgMtx[0].length

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            if (imgMtx[y][x].a == 0) {
                continue
            }

            let z = 1
            let sub = imgRect(imgMtx, x, y, z, z)

            if (!sub || !matrixSameColor(sub)) 
                continue

            while (true) {
                z += 1
                let t_sub = imgRect(imgMtx, x, y, z, z)

                if (!t_sub || !sameBottomRightBorderColor(t_sub)) {
                    z -= 1
                    break
                }
                    

                sub = t_sub
            }

            if (z in z_list) {
                z_list[z] += 1
            } else {
                z_list[z] = 1
            }
            
            matrixSetColor(sub, {r: 0, g: 0, b: 0, a: 0})
            overlayMatrix(imgMtx, sub, x, y)
        }
    }
    return getKeyWithMaxValue(z_list)
}


function fromElemToCanvas(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0);
    return {canvas: canvas, context: ctx}
}

function fromCanvasToMatrix(canvas, context) {
    const data = context.getImageData(0, 0, canvas.width, canvas.height)
    return fromDataToMatrix(data.data, canvas.width, canvas.height)
}

function getSquareSize(imgElement) {
    const {canvas, context} = fromElemToCanvas(imgElement)
    const imgMtx = fromCanvasToMatrix(canvas, context)
    return findMatrixSquaresSize(imgMtx)
}

export function getSquareSizeFromUrl(url, callback) {
    const imgElement = new Image();
    imgElement.src = url;
    imgElement.onload = () => {
        const square = getSquareSize(imgElement)
        callback(square)
    }    
}


function removeAsespriteCheckGrid(imgMatrix) {

    let imgMtx = [...imgMatrix]

    const height = imgMtx.length
    const width = imgMtx[0].length

    const white_part = {r: 192, g: 192, b: 192, a:255}
    const black_part = {r: 128, g: 128, b: 128, a:255}
    const trasparent = {r: 0, g: 0, b: 0, a:0}

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            if (imgMtx[y][x].a == 0) {
                continue
            }

            if (sameColor(imgMtx[y][x], white_part) || sameColor(imgMtx[y][x], black_part))
                imgMtx[y][x] = trasparent
        }
    }

    return imgMtx
}

export async function tryRemoveCheckGridFromElem(url) {

    // DA URL A IMG
    const img = new Image()
    img.src = url
    await new Promise(resolve => {img.onload = resolve})
    const {canvas, context} = fromElemToCanvas(img)
    let imgMtx = fromCanvasToMatrix(canvas, context)

    imgMtx = removeAsespriteCheckGrid(imgMtx)

    const new_canvas = MatrixToCanvas(imgMtx)
    return new Promise(resolve => {new_canvas.toBlob(resolve, "image/png")})
}