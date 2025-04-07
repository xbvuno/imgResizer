import ImageCardOriginal from "../components/ImageCards/ImageCardOriginal";
import ImageCardSource from "../components/ImageCards/ImageCardSource";
import ImageCardUpscale from "../components/ImageCards/ImageCardUpscale";
import PopUp from "../components/Popup";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";

import { PasteImgEventListenerEffect } from "../lib/get_source";

export const ResizerContext = createContext();
export const useResizerContext = () => useContext(ResizerContext);

export const Resizer = () => {
    const [sourceBlob, setSourceBlob] = useState(null);
    const [sourceImg, setSourceImg] = useState(null);
    const [imgName, setImgName] = useState(null);
    const popUpRef = useRef();

    useEffect(() => {
        if (!sourceBlob) return;

        if (sourceImg) URL.revokeObjectURL(sourceImg);

        if (sourceBlob.name) setImgName(sourceBlob.name.split(".")[0]);

        setSourceImg(URL.createObjectURL(sourceBlob));
    }, [sourceBlob]);

    useEffect(PasteImgEventListenerEffect(setSourceBlob, popupAlert), []);

    function popupAlert(message) {
        popUpRef.current.trigger(message);
    }

    return (
        <ResizerContext.Provider
            value={{
                sourceImg,
                imgName,
                setSourceBlob,
                popupAlert,
                sourceBlob,
            }}
        >
            <PopUp ref={popUpRef} />
            <div className='card-container'>
                <ImageCardOriginal />
                <ImageCardSource />
                <ImageCardUpscale />
            </div>
        </ResizerContext.Provider>
    );
};
