import { useEffect, useState } from "react";
import { usePalsphereProgram } from "./anchorProvider";

export type Pal = {
  publicKey: string;
  creator: string;
  statement: string;
  verification_url: string;
  image_hash: string;
  confidence_score: number;
  deadline: number;
  stake_amount: number;
  status: any;
  total_stake_for: number;
  total_stake_against: number;
  participants: any[];
  winner: string[] | null;
  oracle: string;
  winning_side: boolean | null;
};

export function usePals() {
  const { program } = usePalsphereProgram();
  const [pals, setPals] = useState<Pal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!program) return;
    setLoading(true);
    program.account.palAccount.all()
      .then(accounts => {
        setPals(
          accounts.map((acc: any) => ({
            publicKey: acc.publicKey.toBase58(),
            ...acc.account,
          }))
        );
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setPals([]);
        // Optionally handle/log error
      });
  }, [program]);

  return { pals, loading };
}
