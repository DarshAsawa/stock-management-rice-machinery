import React, { useEffect } from 'react';

const Modal = ({ 
    show, 
    title, 
    message, 
    onClose, 
    onConfirm, 
    showConfirmButton = false,
    type = 'info', // 'success', 'error', 'warning', 'info'
    autoClose = false,
    autoCloseDelay = 2000
}) => {
    // Auto-close effect for success messages
    useEffect(() => {
        if (show && autoClose && type === 'success') {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [show, autoClose, type, onClose, autoCloseDelay]);

    // Close on outside click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!show) return null;

    const getModalStyles = () => {
        switch (type) {
            case 'success':
                return {
                    headerBg: 'bg-green-500',
                    headerText: 'text-white',
                    icon: '✅',
                    borderColor: 'border-green-200'
                };
            case 'error':
                return {
                    headerBg: 'bg-red-500',
                    headerText: 'text-white',
                    icon: '❌',
                    borderColor: 'border-red-200'
                };
            case 'warning':
                return {
                    headerBg: 'bg-yellow-500',
                    headerText: 'text-white',
                    icon: '⚠️',
                    borderColor: 'border-yellow-200'
                };
            default:
                return {
                    headerBg: 'bg-blue-500',
                    headerText: 'text-white',
                    icon: 'ℹ️',
                    borderColor: 'border-blue-200'
                };
        }
    };

    const styles = getModalStyles();

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200"
            onClick={handleBackdropClick}
        >
            <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border-2 ${styles.borderColor} transform transition-all duration-200 scale-100`}>
                {/* Header */}
                <div className={`${styles.headerBg} ${styles.headerText} px-6 py-4 rounded-t-lg flex items-center gap-3`}>
                    <span className="text-2xl">{styles.icon}</span>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {autoClose && type === 'success' && (
                        <div className="ml-auto">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-700 text-base leading-relaxed">{message}</p>
                    
                    {autoClose && type === 'success' && (
                        <p className="text-sm text-gray-500 mt-3 italic">
                            This message will close automatically in {autoCloseDelay / 1000} seconds...
                        </p>
                    )}
                </div>

                {/* Footer */}
                {!autoClose && (
                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        {showConfirmButton && (
                            <button
                                onClick={onConfirm}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Confirm
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            {showConfirmButton ? 'Cancel' : 'Close'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;