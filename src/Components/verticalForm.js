import React from 'react';

const VerticalForm = ({children}) => {
    return (
        <form className="flex-column" style={{margin: "20px", textAlign: "left"}}>
            {children}
        </form>
    )
}
export default VerticalForm;
