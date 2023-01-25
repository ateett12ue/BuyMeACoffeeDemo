const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address){
    const balance = await provider.getBalance(address);
    return hre.ethers.formatEther(balance);
}


async function main(){
    const contractAddress="0x9E6aedC3D535ed9011de9075328218BFB300b463";
    const contractAbi = abi.abi;

    const provider =  new hre.ethers.provider.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);
    const signer = new hre.ethers.Wallet(provider.env.PRIVATE_KEY, provider);
    const coffeeContract = new hre.ethers.Contract(contractAddress, contractAbi, signer);
    await coffeeContract.deploy()
    console.log("current balance of signer", await getBalance(provider, signer.address), "ETH");
    const contractBalance = await getBalance(provider, coffeeContract.address);
    console.log("current balance of Contract", await getBalance(provider, coffeeContract.address), "ETH");

    if(contractBalance !== "0.0")
    {
        console.log("withdraw funds")
        const withdrawTxn = await coffeeContract.withdrawTxn();
        await withdrawTxn.wait();
    }
    else
    {
        console.log("no funds to withdraw")
    }

}

main().then(()=>process.exit(0)).catch((error)=>{console.log(error); process.exit(1);})