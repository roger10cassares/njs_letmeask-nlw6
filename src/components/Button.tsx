import { ButtonHTMLAttributes } from "react";

import '../styles/button.scss';

type ButtonPrpps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonPrpps) {


    // Spread operator {...} -> distribute all the props to inside the component
    return(
        <button className="button" {...props} />
    )

}

