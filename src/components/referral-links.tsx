import React from 'react';

// Define referral links for each platform
const REFERRAL_LINKS: Record<string, string> = {
  'Photon': 'https://photon-sol.tinyastro.io/@hound',
  'GMGN': 'https://gmgn.ai/?ref=Ff5COuHZ',
  'Axiom': 'https://axiom.trade/@hound',
};

// Platform logos - use the actual icons from assets folder
const PLATFORM_LOGOS: Record<string, string> = {
  'Photon': '/icon/photon-logo.svg',
  'GMGN': '/icon/gmgn-logo.svg',
  'Axiom': '/icon/axiom-logo.svg',
};

const ReferralLinks: React.FC = () => {
  // Get platforms that have referral links
  const platformsWithReferrals = Object.keys(REFERRAL_LINKS);
  
  if (platformsWithReferrals.length === 0) {
    return null;
  }
  
  return (
    <div className="pt-2">
      <div className="text-xs text-gray-300 font-medium mb-2">Join a trading platform</div>
      <div className="flex items-center justify-center gap-3">
        {platformsWithReferrals.map((platformName) => (
          <a 
            key={platformName} 
            href={REFERRAL_LINKS[platformName]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
            title={`Sign up for ${platformName}`}
          >
            {/* Logo icon for each platform */}
            <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full p-1.5 transition-all hover:bg-gray-700 border border-gray-700 hover:border-purple-500 overflow-hidden">
              {PLATFORM_LOGOS[platformName] ? (
                <img 
                  src={PLATFORM_LOGOS[platformName]} 
                  alt={platformName} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs font-bold">{platformName.charAt(0)}</span>
              )}
            </div>
            
            {/* Tooltip on hover */}
            <span className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 bg-black/80 text-white px-1.5 py-0.5 rounded text-[9px] whitespace-nowrap opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
              {platformName}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ReferralLinks; 