import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, endIcon, id, className = '', ...rest }, ref) => {
    const inputId = id || (typeof rest.name === 'string' ? rest.name : undefined);
    const inputClasses = `block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
    } ${icon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''} ${className}`;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          {/* ⚠️ IMPORTANT: pass ref and ALL props from RHF to the real input */}
          <input
            id={inputId}
            ref={ref}
            {...rest}
            className={inputClasses}
          />
          
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {endIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 