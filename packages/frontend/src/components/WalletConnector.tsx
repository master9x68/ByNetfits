// packages/frontend/src/components/WalletConnector.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

function WalletConnector() {
  const [account, setAccount] = useState<string | null>(null);
  // Không cần state provider nữa nếu chỉ dùng để lấy signer/account
  // const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Hàm xử lý khi tài khoản thay đổi (tách ra để tái sử dụng)
  const handleAccountsChanged = useCallback((accounts: string[] | unknown) => {
      // Đảm bảo accounts là một mảng string
      if (!Array.isArray(accounts)) {
          console.error("accountsChanged event did not return an array:", accounts);
          setAccount(null); // Reset account nếu dữ liệu không đúng dạng
          // Không nên set lỗi ở đây vì có thể chỉ là sự kiện lạ
          return;
      }

      console.log("Handling accountsChanged:", accounts); // Log để debug
      if (accounts.length === 0) {
          // Người dùng đã ngắt kết nối ví khỏi trang web
          setAccount(null);
          setErrorMessage("Ví đã ngắt kết nối. Vui lòng kết nối lại.");
          // Không cần reload trang ở đây
      } else if (accounts[0] !== account) {
          // Tài khoản đã thay đổi hoặc kết nối thành công
          setAccount(accounts[0]);
          setErrorMessage(null); // Xóa lỗi nếu có
          console.log('Account set:', accounts[0]);
      }
      // Nếu accounts[0] === account, không làm gì cả
  }, [account]); // Phụ thuộc vào account để so sánh

  // Hàm kết nối ví
  const connectWalletHandler = async () => {
    if (isConnecting || account) return; // Không kết nối nếu đang xử lý hoặc đã kết nối

    setErrorMessage(null);
    setIsConnecting(true);

    if (typeof window.ethereum !== 'undefined') { // Kiểm tra window.ethereum rõ ràng hơn
      try {
        // Yêu cầu kết nối và lấy tài khoản
        // phương thức này thường trả về mảng các tài khoản được phép
        const requestedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // *** QUAN TRỌNG: Gọi handleAccountsChanged NGAY LẬP TỨC sau khi request thành công ***
        if (requestedAccounts && Array.isArray(requestedAccounts)) {
             handleAccountsChanged(requestedAccounts);
        } else {
             console.warn("eth_requestAccounts did not return an array:", requestedAccounts);
             // Thử gọi eth_accounts để lấy lại lần nữa
             const accounts = await window.ethereum.request({ method: 'eth_accounts' });
             if (accounts && Array.isArray(accounts)) {
                handleAccountsChanged(accounts);
             }
        }

        // Không cần set provider vào state nữa trừ khi cần dùng provider ở chỗ khác
        // const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        // setProvider(web3Provider);

      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        if (error.code === 4001) { // User rejected request
          setErrorMessage("Bạn đã từ chối kết nối ví.");
        } else {
          setErrorMessage(error.message || "Đã xảy ra lỗi khi kết nối ví.");
        }
        setAccount(null);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setErrorMessage('Không tìm thấy ví Web3 (MetaMask, OKX Wallet,...). Vui lòng cài đặt!');
      setIsConnecting(false);
    }
  };

  // Hàm xử lý khi đổi chain/mạng
  const handleChainChanged = useCallback(() => {
      console.log("Network changed, reloading page...");
      window.location.reload(); // Cách đơn giản nhất để xử lý đổi mạng
  }, []);

  // useEffect để xử lý listener và kiểm tra kết nối ban đầu
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Lắng nghe sự kiện accountsChanged
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // Lắng nghe sự kiện chainChanged
      window.ethereum.on('chainChanged', handleChainChanged);

      // Kiểm tra kết nối có sẵn khi tải trang
      const checkExistingConnection = async () => {
        try {
          // Không set isConnecting ở đây để tránh nhấp nháy nút
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            console.log("Found existing connection:", accounts);
            handleAccountsChanged(accounts); // Cập nhật UI nếu đã có kết nối
          } else {
            console.log("No existing connection found.");
          }
        } catch (err: any) {
           console.error("Error checking existing connection:", err);
           // Chỉ hiển thị lỗi nếu nó không phải là lỗi do người dùng chưa kết nối
           if (err.code !== -32002) { // -32002: Request already pending
               setErrorMessage("Không thể kiểm tra trạng thái ví.");
           }
        }
      };
      checkExistingConnection();

      // Cleanup listeners khi component unmount
      return () => {
        if (window.ethereum.removeListener) { // Kiểm tra xem removeListener có tồn tại không
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
        // Có thể hiển thị thông báo nhẹ nhàng ở đây nếu muốn
        console.log("Ethereum provider (wallet) not detected on initial load.");
    }
    // Chỉ chạy một lần khi component mount, và re-run nếu hàm handleAccountsChanged hoặc handleChainChanged thay đổi (do useCallback)
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
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max max-w-xs z-10">
              <p className="text-xs text-red-400 bg-gray-800/90 px-3 py-1.5 rounded shadow-lg backdrop-blur-sm">
                  {errorMessage}
              </p>
          </div>
      )}
    </div>
  );
}

export default WalletConnector;