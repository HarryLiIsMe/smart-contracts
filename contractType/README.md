# 判断合约符合的协议
> 具体请看app.js实现逻辑
## ERC20
由于该协议较早，无法通过接口来获取接口类型，可以通过判断合约中的函数是否存在来判断类型
## ERC721
ERC721协议有专门判断的接口，直接判断`80ac58cd`是否字节码是否存在就能判断出来
```
/*
 * 0x80ac58cd ===
 *   bytes4(keccak256('balanceOf(address)')) ^
 *   bytes4(keccak256('ownerOf(uint256)')) ^
 *   bytes4(keccak256('approve(address,uint256)')) ^
 *   bytes4(keccak256('getApproved(uint256)')) ^
 *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
 *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
 *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
 *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
 *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
 */
```
## ERC1155
ERC1155中有同样的接口可以判断或者根据字节码`d9b67a26`来判断