import { useZutchiLocalStorage } from '../hooks/useLocalStorage';

/**
 * Utility component for debugging local storage
 * Add this to any page during development to test cache functionality
 */
export function ZutchiCacheDebugger() {
  const { getCachedZutchiData, clearZutchiData, cacheZutchiData } = useZutchiLocalStorage();

  const handleClearCache = () => {
    clearZutchiData();
    alert('Cache cleared!');
  };

  const handleShowCache = () => {
    const walletAddress = prompt('Enter wallet address to check cache:');
    if (walletAddress) {
      const cached = getCachedZutchiData(walletAddress);
      alert(JSON.stringify(cached, null, 2));
    }
  };

  const handleSetTestCache = () => {
    const walletAddress = prompt('Enter wallet address:');
    const tokenId = prompt('Enter token ID (or leave empty for null):');
    const hasZutchi = confirm('Has Zutchi?');
    
    if (walletAddress) {
      cacheZutchiData(walletAddress, hasZutchi, tokenId || null);
      alert('Test cache set!');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg">
      <h3 className="text-sm font-bold mb-2">Cache Debug</h3>
      <div className="space-y-2">
        <button 
          onClick={handleShowCache}
          className="block w-full text-xs bg-blue-500 text-white px-2 py-1 rounded"
        >
          Show Cache
        </button>
        <button 
          onClick={handleSetTestCache}
          className="block w-full text-xs bg-green-500 text-white px-2 py-1 rounded"
        >
          Set Test Cache
        </button>
        <button 
          onClick={handleClearCache}
          className="block w-full text-xs bg-red-500 text-white px-2 py-1 rounded"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
}
