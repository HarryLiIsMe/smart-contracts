const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://bsc-mainnet.nodereal.io/v1/");

console.log(provider);


const contractType = async(address) => {
    const c = await provider.getCode(address);
    if(c != "0x" && c.includes("a9059cbb") && c.includes("18160ddd")){
        return "ERC20";
    }else if( c != "0x" && c.includes("80ac58cd")){
        return "ERC721"
    }else if(c != "0x" && c.includes("d9b67a26")){
        return "ERC1155";
    }
}


(async()=>{
    console.log(await contractType("0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6"));
    console.log(await contractType("0xADc466855ebe8d1402C5F7e6706Fccc3AEdB44a0"));
    console.log(await contractType("0xa919cbbd647f0348c12ef409e7f6d4ab8436cf77"));

})()