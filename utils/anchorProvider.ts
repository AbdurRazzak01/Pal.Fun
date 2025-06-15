import { useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3, Idl } from "@project-serum/anchor";
import idl from "../idl/palsphere.json";

const PROGRAM_ID = new web3.PublicKey("4dFKkxW4cEacs5YxcWLtzu3QfpwLBoM13vHfks3KqZEU");

export function usePalsphereProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // Memoize the provider and program
  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {});
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, PROGRAM_ID, provider);
  }, [provider]);

  return { program, provider, wallet, connection };
}
