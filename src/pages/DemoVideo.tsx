import React from 'react';
import demoVideo from '../assests/demo.mp4';

const DemoVideo: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Demo Video</h1>
      <video controls className="w-full max-w-3xl rounded-xl shadow-md mx-auto">
        <source src={demoVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default DemoVideo;
