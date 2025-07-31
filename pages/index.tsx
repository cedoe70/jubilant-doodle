import React from "react"
import Head from "next/head"
import TransactionForm from "../components/TransactionForm"

export default function Home() {
  return (
    <>
      <Head>
        <title>Western Union Clone</title>
      </Head>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <TransactionForm />
      </main>
    </>
  )
}
