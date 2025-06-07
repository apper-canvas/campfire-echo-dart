import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, whileHover, whileTap, type = "button", ...rest }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
            type={type}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;