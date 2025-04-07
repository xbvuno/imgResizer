import {
	createContext,
	useContext,
	useState,
    cloneElement
} from "react";

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = () => setDialogOpen(true);
	const closeDialog = () => setDialogOpen(false);

    return (
        <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
            {children}
        </DialogContext.Provider>
    )
}

export const DialogOpener = ({ children }) => (
    <DialogContext.Consumer>
        {({ openDialog }) => cloneElement(children, { onClick: openDialog })}
    </DialogContext.Consumer>
);

export const useDialogContext = () => useContext(DialogContext);