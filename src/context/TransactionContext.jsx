import React, {useEffect, useState} from "react";
import { ethers } from 'ethers'

import { contractAbi, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer)
    console.log('transactiondata: ', {
        provider,
        signer,
        transactionContract
    })
    console.log('transactionContract: ', transactionContract)
    return transactionContract
}

export const TransactionProvider = ({ children }) => {
    
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''})
    const [isLoading, setIsLoading] = useState(false)
    const [TransactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const handleChange = (e, name) => {
        setFormData((prevState)=>({ ...prevState, [name]: e.target.value }))
    }
    const [connected, setConnected] = useState('')
    const [transactions, setTransactions] = useState([])

    const getAllTransactions = async () => {
        try{
            if(!ethereum) return alert("Please install metamask")
            const transactionContract = getEthereumContract()
            const availableTransactions = await transactionContract.getAllTransactioons()
            const structuredTransactions = availableTransactions.map((transaction)=>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amout._hex) / (10 ** 18)
            }))
            console.log(structuredTransactions)
            setTransactions(structuredTransactions)
        }catch(err){
            console.log(err)
            throw new Error("No ethereum object")
        }
    }

    const checkIfWalletIsConnected = async () => {
        try{
            if(!ethereum) return alert("Please install metamask")
            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if(accounts.length){
                setConnected(accounts[0])
                getAllTransactions()
            }else{
                console.log('No accounts found')
            }
        }catch(err){
            console.log(err)
        }
    }

    const checkIfTransactionsExist = async () => {
        try{
            const transactionContract = getEthereumContract()
            const transactionCount = await transactionContract.getTransactionCount()
            window.localStorage.setItem("transactionCount", transactionCount)
        }catch(err){
            console.log(err)
            throw new Error("No ethereum object")
        }
    }

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install metamask")
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        setConnected(accounts[0])
        }catch(err){
            console.log(err)
            throw new Error("No ethereum object")
        }
    }

    const SendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install metamask")
            const { addressTo, amount, keyword, message } = formData
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount)
            await ethereum.request({ 
                method: 'eth_sendTransaction',
                params: [{
                    from: connected,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
             })
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success - ${transactionHash.hash}`)
            const transactionCount = await transactionContract.getTransactionCount()
            setTransactionCount(transactionCount.toNumber())
            window.location.reload()
        }catch(err){
            console.log(err)
            throw new Error("No ethereum object")
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected()
        checkIfTransactionsExist()
    }, [])
    return (
        <TransactionContext.Provider value={{connectWallet, connected, formData, setFormData, handleChange, SendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}