import {
  Spacer ,
  useColorMode, 
  Switch, Flex, 
  Button, 
  IconButton,
  Text,
  Heading,
  Input,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box
} from '@chakra-ui/react';
import {useState, useEffect} from 'react'
import { ethers } from "ethers";
import nhkTokenData from '../../artifacts/contracts/Nhktoken.sol/NhkToken.json';
import claimData from '../../artifacts/contracts/Claim.sol/Claim.json';
import burnData from '../../artifacts/contracts/Burn.sol/Burn.json';

export default function Home() {
  // state variable we use to store our user's public wallet address
  const [currentAccount, setCurrentAccount] = useState("");

  const nhkTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const burnAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const claimAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const [unclaimedTokenBalance, setUnclaimedTokenBalance ] = useState(0);
  const [burnBalance, setBurnBalance] = useState(0);

  const [nhkTokenContract, setNhkTokenContract] = useState({});
  const [burnContract, setBurnContract] = useState({});
  const [claimContract, setClaimContract] = useState({});

  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /*
    Check if we are authorized to access the user's wallet
    */

    const accounts = await ethereum.request({method: 'eth_accounts'}); 
    // So, we use that special method eth_accounts to see if we're authorized to access any of the accounts in the user's wallet. One thing to keep in mind is that the user could have multiple accounts in their wallet. In this case, we just grab the first one.

    
    if (accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      loadBlockChainData(ethereum,accounts)
    } else{
      console.log("No authorized account found")
    }
   } catch (error) {
     console.log(error);
   }
  }

  // loadBlockchain Data
  const loadBlockChainData = async(ethereum, accounts) => {
    // load nhktokenContract 
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    let nhkTokenContract = new ethers.Contract(nhkTokenAddress, nhkTokenData.abi, signer);
    setNhkTokenContract(nhkTokenContract);

    // Burn Contract
    let burnContract = new ethers.Contract(burnAddress, burnData.abi, signer);
    setBurnContract(burnContract)

    // Claim Contract
    let claimContract = new ethers.Contract(claimAddress, claimData.abi, signer);
    setClaimContract(claimContract)

    // unclaimed Token balance 
    let unclaimedBalance = await nhkTokenContract.balanceOf(claimAddress);
    setUnclaimedTokenBalance(ethers.utils.formatEther(unclaimedBalance))

    // burnBalance
    let burnBalance = await nhkTokenContract.balanceOf(burnAddress);
    setBurnBalance(burnBalance)

    console.log(burnBalance);
    console.log(unclaimedBalance);
    console.log(claimContract);
  }

  /* 
  Connect wallet method
  */
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;

      if (!ethereum){
        alert("Get metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    
    } catch (error) {
      console.log(error);
    }
  }

  const claimTokens = async () => {
    await claimContract.claim()
    console.log('Claimed')
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  },[currentAccount])

  return (
    <>
     <Table variant='unstyled'>
        <Thead>
          <Tr>
            <Th fontSize="md" textTransform="none" textAlign="center">Unclaimed Tokens</Th>
            <Th fontSize="md" textTransform="none" textAlign="center">BurnToken balance</Th>
            <Th fontSize="md" textTransform="none" textAlign="center">user unclaimed balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td isNumeric textAlign="center">NHK</Td>
            <Td isNumeric textAlign="center">NHK</Td>
            <Td isNumeric textAlign="center">NHK</Td>
          </Tr>
        </Tbody>
      </Table>
      <Flex
      p={50}
      w="full"
      alignItems="center"
      justifyContent="center"
      >
        <Box
          mx="auto"
          rounded="lg"
          shadow="md"
          maxW="2xl"
          borderWidth='1px' borderRadius='lg'
        >
          <Box p={6} >
          <Flex direction="column" p={4} rounded={6}>
            <Flex>
              <Text mb={6} fontSize="xl">Claim Token</Text>
            </Flex>
            <Text mb={6} fontSize="xl">Unclaimed Balance:{}</Text>
            <Button colorScheme="teal" mb={3} textTransform="uppercase" onClick={claimTokens}> 
              Claim
            </Button>
            {/* {stakingBalance== 0 ? (""):(
            <Button colorScheme="teal" mb={3} textTransform="uppercase"> 
              Burn
            </Button>)} */}
            {!currentAccount && (
            <Button onClick={connectWallet}>
              Connect Wallet
            </Button>
            )}
          </Flex>
          </Box>
        </Box>
      </Flex>
    </>
  )
}
