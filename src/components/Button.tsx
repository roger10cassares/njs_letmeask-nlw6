import { ButtonHTMLAttributes } from "react";

import '../styles/button.scss';

type ButtonPrpps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
};

// props: props outlined and what is not isOutlined, passed as props
export function Button({isOutlined = false, ...props}: ButtonPrpps) {


    // Spread operator {...} -> distribute all the props to inside the component
    return(
        <button 
            className={`button ${isOutlined ? 'outlined' : ''}`} 
            {...props} 
        />
    )

}

