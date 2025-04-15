// packages/frontend/src/app/page.tsx
import WalletConnector from '@/components/WalletConnector';
// Import thêm các icon cần thiết nếu muốn dùng cho Info Cards
import { FiSearch, FiGrid, FiList, FiSettings, FiShoppingCart, FiFeather, FiShield, FiLink2, FiHelpCircle } from 'react-icons/fi';
import Image from 'next/image';

// --- DỮ LIỆU MẪU VỚI 6 ẢNH CỦA BẠN ---
// *** NHỚ SỬA ĐUÔI FILE (.jpg, .png, .webp...) CHO ĐÚNG VỚI FILE CỦA BẠN ***
const mockFeaturedNFTs = [
  { id: 1, name: "NFT Số 1", artist: "Nghệ sĩ A", price: "1.15 ETH", imageUrl: "/images/nft1.jpg" },
  { id: 2, name: "NFT Số 2", artist: "Nghệ sĩ B", price: "3.25 ETH", imageUrl: "/images/nft2.jpg" },
  { id: 3, name: "NFT Số 3", artist: "Nghệ sĩ C", price: "0.85 ETH", imageUrl: "/images/nft3.jpg" },
  { id: 4, name: "NFT Số 4", artist: "Nghệ sĩ D", price: "4.65 ETH", imageUrl: "/images/nft4.jpg" },
];

const mockTrendingNFTs = [
  { id: 5, name: "NFT Số 5", artist: "Nghệ sĩ E", price: "0.05 ETH", imageUrl: "/images/nft5.jpg" },
  { id: 6, name: "NFT Số 6", artist: "Nghệ sĩ F", price: "0.12 ETH", imageUrl: "/images/nft6.jpg" },
];
// --- KẾT THÚC DỮ LIỆU MẪU ---

// --- COMPONENT NFT CARD (Không đổi) ---
interface NftCardProps {
  id: number;
  name: string;
  artist: string;
  price: string;
  imageUrl: string;
  large?: boolean;
}

const NftCard = ({ id, name, artist, price, imageUrl, large = false }: NftCardProps) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-300 ease-in-out group ${large ? 'min-w-[300px] sm:min-w-[360px]' : ''}`}>
    <div className={`relative w-full ${large ? 'h-64 sm:h-72' : 'h-56'} group-hover:opacity-90 transition-opacity`}>
      <Image
        src={imageUrl} alt={name} layout="fill" objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-105"
        priority={large}
      />
    </div>
    <div className="p-4">
      <h3 className={`font-semibold truncate text-white mb-1 group-hover:text-purple-300 transition-colors ${large ? 'text-xl' : 'text-lg'}`}>{name}</h3>
      <p className={`text-sm text-gray-400 truncate ${large ? 'mb-4' : 'mb-3'}`}>{artist}</p>
      <div className="flex justify-between items-center">
        <div>
           <p className="text-xs text-gray-500">{large ? 'Giá khởi điểm' : 'Giá'}</p>
           <p className={`font-bold text-purple-400 ${large? 'text-lg' : 'text-md'}`}>{price}</p>
        </div>
        {!large && (
            <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-full transition-colors">Mua ngay</button>
        )}
      </div>
    </div>
  </div>
);

// --- COMPONENT INFO CARD ---
interface InfoCardProps {
  icon: React.ReactNode; // Cho phép truyền icon component
  title: string;
  description: string;
}
const InfoCard = ({ icon, title, description }: InfoCardProps) => (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 text-center flex flex-col items-center hover:bg-gray-700/80 transition-colors">
        <div className="text-4xl text-purple-400 mb-4">{icon}</div>
        <h4 className="font-semibold text-lg text-white mb-2">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
    </div>
);


// --- COMPONENT HOME (ĐÃ THÊM 2 SECTION MỚI) ---
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header (Giữ nguyên) */}
      <header className="bg-gray-900/80 backdrop-blur-lg text-white p-4 sticky top-0 z-50 border-b border-gray-700/50">
        <div className="container mx-auto flex items-center justify-between gap-4">
           <div className="flex items-center gap-6">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 text-transparent bg-clip-text">ByNetfits</h1>
              <nav className="hidden md:flex items-center space-x-5">
                 <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Khám phá</a>
                 <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Thống kê</a>
                 <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Drops</a>
                 <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Tạo</a>
              </nav>
           </div>
           <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative hidden sm:block">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiSearch /></span>
                 <input type="text" placeholder="Tìm kiếm..." className="p-2 pl-10 pr-4 w-48 lg:w-64 rounded-lg text-sm bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"/>
              </div>
              <div className="flex items-center gap-3 text-xl text-gray-400">
                  <button className="hover:text-white transition-colors"><FiGrid /></button>
                  <button className="hover:text-white transition-colors"><FiList /></button>
                  <button className="hover:text-white transition-colors"><FiShoppingCart /></button>
                  <button className="hover:text-white transition-colors"><FiSettings /></button>
              </div>
              <WalletConnector />
           </div>
        </div>
      </header>

      {/* --- SECTION TẠO NFT MỚI --- */}
      <section className="container mx-auto mt-10 mb-16 px-4">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/80 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              {/* Cột trái: Text & Button */}
              <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      Tạo bộ sưu tập NFT<br/> độc nhất vô nhị của bạn
                  </h2>
                  <p className="text-gray-400 mb-8">
                      Thể hiện sự sáng tạo và biến tác phẩm số thành tài sản giá trị trên ByNetfits Studio.
                  </p>
                  <button className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg shadow-lime-500/20">
                      Tạo ngay
                  </button>
              </div>
              {/* Cột phải: Ảnh minh họa */}
              <div className="flex-1 flex justify-center md:justify-end">
                  <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-lg overflow-hidden border-2 border-lime-400/50 shadow-2xl shadow-purple-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                       <Image
                          src="/images/nft1.jpg" // Lấy 1 ảnh làm minh họa
                          alt="Tạo NFT"
                          layout="fill"
                          objectFit="cover"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                       <span className="absolute bottom-4 left-4 text-xs bg-black/50 text-white px-2 py-1 rounded">Minh họa bởi ByNetfits</span>
                  </div>
              </div>
          </div>
      </section>
      {/* --- KẾT THÚC SECTION TẠO NFT --- */}


      {/* Main Content Area */}
      <main className="container mx-auto px-4">

        {/* Featured Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
            Bộ sưu tập Nổi bật 🔥
          </h2>
          <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {mockFeaturedNFTs.map((nft) => (
              <div key={`featured-${nft.id}`} className="flex-shrink-0 first:ml-0 last:mr-0">
                 <NftCard {...nft} large={true} />
              </div>
            ))}
          </div>
        </section>

        {/* Filter Bar Placeholder */}
        <section className="mb-8 p-3 bg-gray-800/50 rounded-lg flex items-center justify-between gap-4 overflow-x-auto">
           <div className='flex items-center gap-3'>
               <span className="text-sm font-medium text-gray-400">Mạng:</span>
               <button className="text-xs bg-purple-600 text-white py-1 px-3 rounded-full">Tất cả</button>
               <button className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full">Ethereum</button>
               <button className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full">Polygon</button>
               <button className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full">Solana</button>
           </div>
           <button className="text-xs text-purple-400 hover:text-purple-300 whitespace-nowrap">Xem thêm</button>
        </section>

        {/* Regular NFT Grid */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Đang Thịnh hành 🚀
            </h2>
             {mockTrendingNFTs.length > 5 && (
                 <a href="#" className="text-sm text-purple-400 hover:text-purple-300">Xem tất cả</a>
             )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mockTrendingNFTs.map((nft) => (
              <NftCard key={nft.id} {...nft} />
            ))}
          </div>
        </section>

        {/* --- SECTION THÔNG TIN/GIỚI THIỆU MỚI --- */}
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-semibold text-white">
                    Cơ bản về ByNetfits
                 </h2>
                 <button className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full transition-colors">
                     Tìm hiểu thêm
                 </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                 <InfoCard
                    icon={<FiFeather />}
                    title="Mint NFT Dễ Dàng"
                    description="Tạo NFT từ hình ảnh, video, audio chỉ với vài cú nhấp chuột."
                 />
                 <InfoCard
                    icon={<FiShield />}
                    title="Giao Dịch An Toàn"
                    description="Xây dựng trên nền tảng blockchain minh bạch và bảo mật."
                 />
                  <InfoCard
                    icon={<FiLink2 />}
                    title="Hỗ Trợ Đa Chuỗi"
                    description="Mở rộng tiềm năng với hỗ trợ nhiều mạng blockchain phổ biến (sắp ra mắt)."
                 />
                  <InfoCard
                    icon={<FiHelpCircle />}
                    title="Hỗ Trợ & Hỏi Đáp"
                    description="Tìm câu trả lời cho các thắc mắc thường gặp về NFT và ByNetfits."
                 />
            </div>
        </section>
         {/* --- KẾT THÚC SECTION THÔNG TIN --- */}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 p-6 mt-16 text-center text-sm text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} ByNetfits NFT Commerce. Mọi quyền được bảo lưu.
      </footer>
    </div>
  );
}