"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Khai báo interface cho window.ethereum với kiểu 'unknown' thay cho 'any'
interface EthereumRpc {
    request: (args: { method: string; params?: Array<unknown>; }) => Promise<unknown>; // Thay any[] bằng unknown[], Promise<any> bằng Promise<unknown>
    on: (eventName: string, listener: (...args: unknown[]) => void) => void; // Thay any[] bằng unknown[]
    removeListener: (eventName: string, listener: (...args: unknown[]) => void) => void; // Thay any[] bằng unknown[]
}

declare global {
  interface Window {
    ethereum?: EthereumRpc;
  }
}


function WalletConnector() {
  const [account, setAccount] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const handleAccountsChanged = useCallback((accounts: unknown) => {
      // Kiểm tra accounts là mảng và phần tử đầu tiên là string
      if (!Array.isArray(accounts)) {
          console.error("accountsChanged event did not return an array:", accounts);
          setAccount(null);
          return;
      }

      console.log("Handling accountsChanged:", accounts);
      if (accounts.length === 0) {
          setAccount(null);
          setErrorMessage("Ví đã ngắt kết nối. Vui lòng kết nối lại.");
      } else if (typeof accounts[0] === 'string' && accounts[0] !== account) {
          setAccount(accounts[0]);
          setErrorMessage(null);
          console.log('Account set:', accounts[0]);
      } else if (typeof accounts[0] !== 'string'){
           console.error("First account is not a string:", accounts[0]);
           setAccount(null); // Reset nếu dữ liệu không đúng
      }
  }, [account]);

  const connectWalletHandler = async () => {
    if (isConnecting || account) return;

    setErrorMessage(null);
    setIsConnecting(true);

    if (typeof window.ethereum !== 'undefined') {
      try {
        const requestedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Sau khi request, kết quả trả về (requestedAccounts) nên được kiểm tra cẩn thận hơn
        if (requestedAccounts && Array.isArray(requestedAccounts)) {
             handleAccountsChanged(requestedAccounts);
        } else {
             console.warn("eth_requestAccounts did not return an array or was null/undefined:", requestedAccounts);
             // Thử gọi eth_accounts một cách an toàn hơn
             const accounts = await window.ethereum.request({ method: 'eth_accounts' });
             if (accounts && Array.isArray(accounts)) {
                handleAccountsChanged(accounts);
             } else {
                 console.error("eth_accounts also failed to return a valid array.");
                 setErrorMessage("Không thể lấy được danh sách tài khoản từ ví.");
                 setAccount(null);
             }
        }
      } catch (error: unknown) {
          console.error("Error connecting wallet:", error);
          let message = "Đã xảy ra lỗi khi kết nối ví.";
          let code: number | string | null = null; // Cho phép code là number hoặc string

          if (typeof error === 'object' && error !== null) {
            // Kiểm tra các thuộc tính một cách an toàn
            if ('code' in error) {
                const potentialCode = (error as { code?: unknown }).code;
                if(typeof potentialCode === 'number' || typeof potentialCode === 'string') {
                    code = potentialCode;
                }
            }
            if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
              message = (error as { message: string }).message;
            }
          }

          if (code === 4001) { // MetaMask user rejection code
            setErrorMessage("Bạn đã từ chối kết nối ví.");
          } else if (code === -32002) { // Request already pending
            setErrorMessage("Yêu cầu kết nối ví đã được gửi, vui lòng kiểm tra ví của bạn.");
            // Không reset account trong trường hợp này
          }
          else {
            setErrorMessage(message);
            setAccount(null); // Chỉ reset account nếu lỗi không phải là pending hoặc từ chối
          }
      } finally {
        setIsConnecting(false);
      }
    } else {
      setErrorMessage('Không tìm thấy ví Web3 (MetaMask, OKX Wallet,...). Vui lòng cài đặt!');
      setIsConnecting(false);
    }
  };

  const handleChainChanged = useCallback(() => {
      console.log("Network changed, reloading page...");
      window.location.reload();
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      const checkExistingConnection = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.log("Ethereum provider disappeared before check?");
            return;
        }
        try {
          // Kết quả trả về từ eth_accounts là string[] hoặc có thể là lỗi
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            console.log("Found existing connection:", accounts);
            handleAccountsChanged(accounts); // accounts ở đây chắc chắn là string[] nếu check thành công
          } else {
            console.log("No existing connection found or accounts array is empty.");
            // Không cần set lỗi ở đây, chỉ đơn giản là chưa kết nối
          }
        } catch (err: unknown) {
           console.error("Error checking existing connection:", err);
           let code: number | string | null = null;
           if (typeof err === 'object' && err !== null && 'code' in err) {
               const potentialCode = (err as { code?: unknown }).code;
               if(typeof potentialCode === 'number' || typeof potentialCode === 'string') {
                   code = potentialCode;
               }
           }
           // Chỉ hiển thị lỗi nếu nó không phải là lỗi Request Pending
           if (code !== -32002) {
               setErrorMessage("Không thể kiểm tra trạng thái ví ban đầu.");
           }
        }
      };
      checkExistingConnection();

      // Cleanup listeners khi component unmount
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
        console.log("Ethereum provider (wallet) not detected on initial load.");
    }
  }, [handleAccountsChanged, handleChainChanged]);

  return (
    <div className="relative">
      {account ? (
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md whitespace-nowrap">
          {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
        </span>
      ) : (
        <button
          onClick={connectWalletHandler}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 whitespace-nowrap
            ${isConnecting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            }`}
        >
          {isConnecting ? 'Đang kết nối...' : 'Connect Wallet'}
        </button>
      )}
      {errorMessage && (
          // Thêm key để React re-render khi errorMessage thay đổi, giúp animation hoạt động (nếu có)
          <div key={errorMessage} className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max max-w-xs z-10">
              <p className="text-xs text-red-400 bg-gray-800/90 px-3 py-1.5 rounded shadow-lg backdrop-blur-sm">
                  {errorMessage}
              </p>
          </div>
      )}
    </div>
  );
}

export default WalletConnector;