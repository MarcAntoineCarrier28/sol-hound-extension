import React, { useState } from 'react';
import { highlightPresets } from '@/data/const';

interface HighlightStyleProps {
  solanaStyle: {
    colors: string[];
    animationSpeed: number;
  };
  pumpStyle: {
    colors: string[];
    animationSpeed: number;
  };
  onChange: (styles: {
    solanaStyle: { colors: string[], animationSpeed: number };
    pumpStyle: { colors: string[], animationSpeed: number };
  }) => void;
  disabled?: boolean;
}

const HighlightStyleCustomizer: React.FC<HighlightStyleProps> = ({
  solanaStyle,
  pumpStyle,
  onChange,
  disabled = false
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // Function to apply a preset
  const applyPreset = (presetId: string) => {
    if (disabled) return;
    
    const preset = highlightPresets.find(p => p.id === presetId);
    if (preset) {
      onChange({
        solanaStyle: { ...preset.solanaStyle },
        pumpStyle: { ...preset.pumpStyle }
      });
    }
  };
  
  // Handle color selection for Solana style
  const handleSolanaColorChange = (index: number, color: string) => {
    if (disabled) return;
    
    const newColors = [...solanaStyle.colors];
    newColors[index] = color;
    
    onChange({
      solanaStyle: { ...solanaStyle, colors: newColors },
      pumpStyle
    });
  };
  
  // Handle color selection for Pump style
  const handlePumpColorChange = (index: number, color: string) => {
    if (disabled) return;
    
    const newColors = [...pumpStyle.colors];
    newColors[index] = color;
    
    onChange({
      solanaStyle,
      pumpStyle: { ...pumpStyle, colors: newColors }
    });
  };
  
  // Handle animation speed change
  const handleAnimationSpeedChange = (type: 'solana' | 'pump', value: number) => {
    if (disabled) return;
    
    if (type === 'solana') {
      onChange({
        solanaStyle: { ...solanaStyle, animationSpeed: value },
        pumpStyle
      });
    } else {
      onChange({
        solanaStyle,
        pumpStyle: { ...pumpStyle, animationSpeed: value }
      });
    }
  };

  // Determine which preset is currently active (if any)
  const getActivePresetId = (): string | null => {
    return highlightPresets.find(preset => 
      JSON.stringify(preset.solanaStyle) === JSON.stringify(solanaStyle) && 
      JSON.stringify(preset.pumpStyle) === JSON.stringify(pumpStyle)
    )?.id || null;
  };
  
  const activePresetId = getActivePresetId();
  
  const createGradientString = (colors: string[]): string => {
    if (colors.length < 2) return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`;
    
    // Make sure the first and last colors are the same for perfect looping
    const gradientColors = [...colors];
    if (gradientColors[0] !== gradientColors[gradientColors.length - 1]) {
      // If they're not the same, create a symmetrical pattern
      gradientColors.push(...gradientColors.slice(0, -1).reverse());
    }
    
    // Calculate percentage step for even distribution
    const step = 100 / (gradientColors.length - 1);
    
    // Create the gradient with precise percentage stops
    return `linear-gradient(to right, ${gradientColors.map((color, index) => {
      const percentage = Math.round(index * step * 100) / 100; // More precise percentage
      return `${color} ${percentage}%`;
    }).join(', ')})`;
  };
  
  return (
    <div className={`flex flex-col pl-4 mt-2 ml-4 border-l-2 border-purple-600 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <div 
            className="w-8 h-3 rounded-sm" 
            style={{
              backgroundImage: createGradientString(solanaStyle.colors),
              backgroundSize: '200% 100%',
              animation: `preview-sweep ${solanaStyle.animationSpeed}s infinite ease-in-out`
            }}
          ></div>
          <div 
            className="w-8 h-3 rounded-sm" 
            style={{
              backgroundImage: createGradientString(pumpStyle.colors),
              backgroundSize: '200% 100%',
              animation: `preview-sweep ${pumpStyle.animationSpeed}s infinite ease-in-out`
            }}
          ></div>
        </div>
        
        {/* Tab selector */}
        <div className="flex border border-gray-600 rounded overflow-hidden">
          <button
            className={`py-0.5 px-2 text-xs ${activeTab === 'presets' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => !disabled && setActiveTab('presets')}
            disabled={disabled}
          >
            Presets
          </button>
          <button
            className={`py-0.5 px-2 text-xs ${activeTab === 'custom' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => !disabled && setActiveTab('custom')}
            disabled={disabled}
          >
            Custom
          </button>
        </div>
      </div>
      
      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-3 gap-1 mt-2">
          {highlightPresets.map(preset => (
            <div 
              key={preset.id}
              className={`
                p-1 rounded cursor-pointer border transition-all h-10
                ${activePresetId === preset.id 
                  ? 'border-purple-500 bg-gray-600' 
                  : 'border-gray-600 hover:bg-gray-600'
                }
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && applyPreset(preset.id)}
              title={preset.name}
            >
              <div className="text-xs truncate text-center mb-1">{preset.name}</div>
              <div className="w-full h-2 rounded-sm" 
                style={{
                  backgroundImage: createGradientString(preset.solanaStyle.colors),
                  backgroundSize: '200% 100%',
                  animation: `preview-sweep ${preset.solanaStyle.animationSpeed}s infinite ease-in-out`
                }}
              ></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Custom Tab */}
      {activeTab === 'custom' && (
        <div className="flex space-x-2 mt-2">
          {/* Solana Style */}
          <div className="w-1/2">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
              <span className="text-xs text-gray-300">Solana</span>
            </div>
            <div className="flex mb-1 space-x-1">
              {solanaStyle.colors.slice(0, 4).map((color, index) => (
                <input
                  key={`solana-${index}`}
                  type="color"
                  value={color}
                  onChange={(e) => handleSolanaColorChange(index, e.target.value)}
                  disabled={disabled}
                  className="w-5 h-5 cursor-pointer flex-1"
                  aria-label={`Solana color ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-300 mr-1">Speed</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={solanaStyle.animationSpeed}
                onChange={(e) => handleAnimationSpeedChange('solana', parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-1"
              />
            </div>
          </div>
          
          {/* Pump Style */}
          <div className="w-1/2">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-300">Pump</span>
            </div>
            <div className="flex mb-1 space-x-1">
              {pumpStyle.colors.slice(0, 4).map((color, index) => (
                <input
                  key={`pump-${index}`}
                  type="color"
                  value={color}
                  onChange={(e) => handlePumpColorChange(index, e.target.value)}
                  disabled={disabled}
                  className="w-5 h-5 cursor-pointer flex-1"
                  aria-label={`Pump color ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-300 mr-1">Speed</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={pumpStyle.animationSpeed}
                onChange={(e) => handleAnimationSpeedChange('pump', parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Shared keyframes for animations */}
      <style>
        {`
          @keyframes preview-sweep {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default HighlightStyleCustomizer; 