import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  collection,
  getDocs,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Vacation {
  email: string;
  name: string;
  vacationType: string;
  startDate: string | null;
  endDate: string | null;
  reason: string;
  notes: string;
}

type VacationContextType = {
  vacations: Vacation[];
  addVacation: (vacation: Vacation) => void;
};

const initialVacationContext: VacationContextType = {
  vacations: [],
  addVacation: () => {},
};

export const VacationContext = createContext<VacationContextType>(
  initialVacationContext,
);

export const useVacations = () => useContext(VacationContext);

export const VacationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [vacations, setVacations] = useState<Vacation[]>([]);

  useEffect(() => {
    const fetchVacations = async () => {
      const q = query(collection(db, "vacations"));
      const querySnapshot = await getDocs(q);
      const fetchedVacations: Vacation[] = [];
      querySnapshot.forEach((document: QueryDocumentSnapshot) => {
        fetchedVacations.push({
          ...document.data(),
        } as Vacation);
        console.log(fetchedVacations);
        console.log("VacationsContext is working!");
      });
      setVacations(fetchedVacations);
    };
    fetchVacations();
  }, []);

  const addVacation = (vacation: Vacation) => {
    console.log(vacation, "addVacation Clicked!");
    // Firebase에 새로운 휴가 정보를 추가하는 비동기 함수
    // db.collection("vacations").add(vacation) 등으로 구현
  };

  const value = useMemo(() => ({ vacations, addVacation }), [vacations]);

  return (
    <VacationContext.Provider value={value}>
      {children}
    </VacationContext.Provider>
  );
};