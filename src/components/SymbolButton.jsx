export default function SymbolButton(props) {
    return (
        <button className='symbol' {...props}>
            {props.children}
        </button>
    );
}