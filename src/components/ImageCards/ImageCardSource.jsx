import { useEffect, useState, useRef } from "react";
import { useResizerContext } from "../../contexts/ResizerContext";
import {
	DragImgEventListenerEffect,
	pasteFromClick,
	pasteFromFile,
} from "../../lib/get_source";

import './ImageCards.css'


export default function ImageCardSource() {
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

	useEffect(() => {
		DragImgEventListenerEffect(imgHolder, setSourceBlob, popupAlert);
	}, [imgHolder]);

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
