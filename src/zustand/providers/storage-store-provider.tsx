// providers/storage-store-provider.tsx

"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
	StorageState,
	createStorageStore,
} from "@/zustand/stores/storage-store";

export type StorageStoreApi = ReturnType<typeof createStorageStore>;

export const StorageStoreContext = createContext<StorageStoreApi | undefined>(
	undefined
);

export interface StorageStoreProviderProps {
	children: ReactNode;
}

export const StorageStoreProvider = ({
	children,
}: StorageStoreProviderProps) => {
	const storeRef = useRef<StorageStoreApi | null>(null);

	if (storeRef.current === null) {
		storeRef.current = createStorageStore();
	}

	return (
		<StorageStoreContext.Provider value={storeRef.current}>
			{children}
		</StorageStoreContext.Provider>
	);
};

export const useStorageStore = <T,>(
	selector: (store: StorageState) => T
): T => {
	const storageStoreContext = useContext(StorageStoreContext);

	if (!storageStoreContext) {
		throw new Error(
			"useStorageStore must be used within StorageStoreProvider"
		);
	}

	return useStore(storageStoreContext, selector);
};
