// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Sửa lại đường dẫn import lần nữa
import "../lib/contracts/token/ERC721/ERC721.sol";
import "../lib/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../lib/contracts/access/Ownable.sol";
import "../lib/contracts/utils/Counters.sol";

contract ByNetfitsNft is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    event NFTMinted(address indexed minter, address indexed owner, uint256 indexed tokenId, string tokenURI);

    constructor(address initialOwner) ERC721("ByNetfits NFT", "BNFT") Ownable(initialOwner) {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMinted(msg.sender, to, tokenId, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}