import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";

import {
	DragImgEventListenerEffect,
	PasteImgEventListenerEffect,
	pasteFromClick,
	pasteFromFile,
	ScaledBlobFromUrl,
	saveImage,
	copyImageToClipboard,
} from "./get_source";

import {getSquareSizeFromUrl, 
	tryRemoveCheckGridFromElem} from './square_size'

import { useSettingsContext } from "./SettingsContext";

export const ResizerContext = createContext();
export const useResizerContext = () => useContext(ResizerContext);


function ImageCardOriginal() {
	const [blob, setBlob] = useState(null);
	const { settingsDict } = useSettingsContext();
	const { sourceImg, imgName, popupAlert, sourceBlob } = useResizerContext();
	const [isDisabled, setDisabled] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [img, setImg] = useState(null);
	const [imgSize, setImgSize] = useState(null);
	const [squareSize, setSquareSize] = useState(null)
	const imgRef = useRef();

	useEffect(() => {
		if (!blob) return;

		if (img) URL.revokeObjectURL(img);
		
		setImg(URL.createObjectURL(blob));
	
		setLoading(false);
		setDisabled(false);
	}, [blob]);

	useEffect(() => {
		if (!squareSize)
			return
		
		if (squareSize == 1) {
			setBlob(sourceBlob)
			return
		}
		ScaledBlobFromUrl(sourceImg, 1 / squareSize).then((_blob) => {
			setBlob(_blob);
		});
	}, [squareSize])


	useEffect(() => {
		if (!settingsDict.enable_scale_to_original) return;
		if (!sourceImg) return;
		setLoading(true);
		setSquareSize(null)
		getSquareSizeFromUrl(sourceImg, setSquareSize)
		
	}, [sourceImg, settingsDict.enable_scale_to_original]);

	function renderSize() {
		if (!imgSize || isLoading) return;
		return (
			<p className='size'>
				{imgSize.width} x {imgSize.height}
			</p>
		);
	}

	function onImgLoad() {
		setImgSize(
			(({ naturalWidth, naturalHeight }) => ({
				width: naturalWidth,
				height: naturalHeight,
			}))(imgRef.current)
		);
	}

	function renderImg() {
		if (isLoading) return null;
		if (!settingsDict.enable_scale_to_original) return <p>Disabled by settings</p>;
		if (isDisabled) return <p>Here will be the result to its original size</p>;
		if (img) return <img ref={imgRef} src={img} onLoad={onImgLoad} />;
	}

	function save() {
		saveImage(img, imgName + `_original`)
	}

	function copy() {
		copyImageToClipboard(blob, popupAlert)
	}

	function tryToRemoveCG() {
		tryRemoveCheckGridFromElem(img).then((_blob) => {
			setBlob(_blob);
		});
	}

	return (
		<article className={!settingsDict.enable_scale_to_original ? 'disabled' : undefined}>
			<header>
				<button disabled={isDisabled} onClick={copy} className='symbol'>
					content_copy
				</button>
				<button disabled={isDisabled} onClick={save} className='symbol'>
					save
				</button>
			</header>
			<div className='img-holder' aria-busy={isLoading}>
				{renderImg()}
				{renderSize()}
			</div>
			<footer>
				<p>
					Original {squareSize ? `[x${1 / squareSize}]` : ''}
				</p>
				<button disabled={isDisabled} onClick={tryToRemoveCG} className='symbol'>
				bid_landscape_disabled
				</button>
			</footer>
		</article>
	);
}

function ImageCardUpscale() {
	const [blob, setBlob] = useState(null);
	const { settingsDict } = useSettingsContext();
	const { sourceImg, imgName, popupAlert } = useResizerContext();
	const [isDisabled, setDisabled] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [img, setImg] = useState(null);
	const [imgSize, setImgSize] = useState(null);
	const imgRef = useRef();

	useEffect(() => {
		if (!blob) return;

		if (img) URL.revokeObjectURL(img);

		setImg(URL.createObjectURL(blob));
		setLoading(false);
		setDisabled(false);
	}, [blob]);

	useEffect(() => {
		if (!settingsDict.enable_upscale) return
		if (!sourceImg) return;

		setLoading(true);

		ScaledBlobFromUrl(sourceImg, settingsDict.scale, settingsDict.smoothing).then((_blob) => {
			setBlob(_blob);
		});
	}, [sourceImg, settingsDict.scale, settingsDict.smoothing, settingsDict.enable_upscale]);

	function renderSize() {
		if (!imgSize || isLoading) return;
		return (
			<p className='size'>
				{imgSize.width} x {imgSize.height}
			</p>
		);
	}

	function onImgLoad() {
		setImgSize(
			(({ naturalWidth, naturalHeight }) => ({
				width: naturalWidth,
				height: naturalHeight,
			}))(imgRef.current)
		);
	}

	function renderImg() {
		if (isLoading) return null;
		if (!settingsDict.enable_upscale) return <p>Disabled by settings</p>;
		if (isDisabled) return <p>Here will be the result upscaled</p>;
		if (img) return <img ref={imgRef} src={img} onLoad={onImgLoad} />;
	}

	function save() {
		saveImage(img, imgName + `_upscaled_x${settingsDict.scale}`)
	}

	function copy() {
		copyImageToClipboard(blob, popupAlert)
	}

	return (
		<article className={!settingsDict.enable_upscale ? 'disabled' : undefined}>
			<header>
				<button disabled={isDisabled} onClick={copy} className='symbol'>
					content_copy
				</button>
				<button disabled={isDisabled} onClick={save} className='symbol'>
					save
				</button>
			</header>
			<div className='img-holder' aria-busy={isLoading}>
				{renderImg()}
				{renderSize()}
			</div>
			<footer>
				<p>
					Upscaled {`[x${settingsDict.scale}${settingsDict.smoothing ? ', smoothed' : ''}]`}
				</p>
			</footer>
		</article>
	);
}

function ImageCardSource() {
	const { setSourceBlob, popupAlert, sourceImg } = useResizerContext();
	const hiddenFileInput = useRef();
	const [imgSize, setImgSize] = useState(null);
	const imgRef = useRef();
	const imgHolder = useRef();

	function HandleOpenFile() {
		if (hiddenFileInput.current) hiddenFileInput.current.click();
	}

	function renderSize() {
		if (!imgSize) return;
		return (
			<p className='size'>
				{imgSize.width} x {imgSize.height}
			</p>
		);
	}

	function onImgLoad() {
		setImgSize(
			(({ naturalWidth, naturalHeight }) => ({
				width: naturalWidth,
				height: naturalHeight,
			}))(imgRef.current)
		);
	}

	function renderImg() {
		if (!sourceImg) return <p>Drag or Paste</p>;
		return <img ref={imgRef} src={sourceImg} onLoad={onImgLoad} />;
	}

	useEffect(
		DragImgEventListenerEffect(imgHolder, setSourceBlob, popupAlert),
		[imgHolder]
	);

	return (
		<article id='img-source'>
			<header>
				<button
					onClick={pasteFromClick(setSourceBlob, popupAlert)}
					className='symbol'
				>
					content_paste
				</button>
				<button onClick={HandleOpenFile} className='symbol'>
					folder_open
				</button>
				<input
					ref={hiddenFileInput}
					onChange={pasteFromFile(setSourceBlob, popupAlert)}
					type='file'
					accept='image/jpeg, image/png, image/webp'
				/>
			</header>
			<div className='img-holder' ref={imgHolder}>
				{renderImg()}
				{renderSize()}
			</div>
			<footer>
				<p>Source image</p>
			</footer>
		</article>
	);
}

const PopUp = forwardRef((props, ref) => {
	const [popUpText, setPopUpText] = useState("");
	const timeoutRef = useRef(null); // Reference to track active timeout

	// Expose trigger function to parent components
	useImperativeHandle(ref, () => ({
		trigger: (message) => {
			// Clear any previously active timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			setPopUpText(message);
			let updatedMessage = message;

			// Function to gradually remove text and reset
			function eatText() {
				updatedMessage = updatedMessage.substring(1, updatedMessage.length - 2);
				setPopUpText(updatedMessage);

				if (updatedMessage.length > 1) {
					timeoutRef.current = setTimeout(eatText, 20); // Set a new timeout
				} else {
					setPopUpText("");
				}
			}

			// Start the process with an initial delay
			timeoutRef.current = setTimeout(eatText, 2000);
		},
	}));

	return <div id="pop-up">{popUpText}</div>;
});

export default function Resizer() {
	const [sourceBlob, setSourceBlob] = useState(null);
	const [sourceImg, setSourceImg] = useState(null);
	const [imgName, setImgName] = useState(null);
	const popUpRef = useRef();

	useEffect(() => {
		if (!sourceBlob) return;

		if (sourceImg) URL.revokeObjectURL(sourceImg);

		setImgName(sourceBlob.name.split('.')[0])

		setSourceImg(URL.createObjectURL(sourceBlob));
	}, [sourceBlob]);

	useEffect(PasteImgEventListenerEffect(setSourceBlob, popupAlert), []);

	function popupAlert(message) {
		popUpRef.current.trigger(message);
	}

	return (
		<ResizerContext.Provider
			value={{ sourceImg, imgName, setSourceBlob, popupAlert, sourceBlob }}
		>
			<PopUp ref={popUpRef} />
			<div className='card-container'>
				<ImageCardOriginal />
				<ImageCardSource />
				<ImageCardUpscale />
			</div>
		</ResizerContext.Provider>
	);
}