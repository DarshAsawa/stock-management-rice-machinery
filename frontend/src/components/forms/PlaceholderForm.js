import React from 'react';

const PlaceholderForm = ({ title }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800 border-b-2 border-blue-500 pb-2">
                {title}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Under Construction</h3>
                <p className="text-gray-600 mb-6">
                    This feature is being developed and will be available soon.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                        <strong>Coming Soon:</strong> Full functionality for {title} including form handling, 
                        data management, and integration with the backend API.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderForm; 