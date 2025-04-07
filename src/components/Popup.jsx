import { useState, useRef, forwardRef, useImperativeHandle } from "react";

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
                updatedMessage = updatedMessage.substring(
                    1,
                    updatedMessage.length - 2
                );
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

    return <div id='pop-up'>{popUpText}</div>;
});

export default PopUp;