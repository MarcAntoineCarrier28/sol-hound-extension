import React from 'react';

const SocialLinks: React.FC = () => {
  return (
    <div className="pb-2">
      <div className="text-center">
        <div className="flex justify-center space-x-4">
          <a 
            href="https://x.com/Solana_Hound" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>
          <a 
            href="https://discord.gg/aU6rKnBs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
            </svg>
            Discord
          </a>
          <a 
            href="https://sol-hound.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-xs transition-colors"
          >
            <img src="/icon/48.png" alt="SolHound Logo" className="w-3.5 h-3.5 mr-1.5" />
            Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks; 