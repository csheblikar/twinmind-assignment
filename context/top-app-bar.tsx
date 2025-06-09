import { createContext, useContext, useEffect, useRef, useState } from 'react';

type TopAppBarOptions = {
  title?: string | (() => React.ReactNode);
  actionButton?: () => React.ReactNode;
};

type TopAppBarContextType = {
  options: TopAppBarOptions;
  setOptions: React.Dispatch<React.SetStateAction<TopAppBarOptions>>;
};

const TopAppBarContext = createContext<TopAppBarContextType | null>(null);

export function TopAppBarProvider({ children }: React.PropsWithChildren) {
  const [options, setOptions] = useState<TopAppBarOptions>({});
  return (
    <TopAppBarContext.Provider value={{ options, setOptions }}>
      {children}
    </TopAppBarContext.Provider>
  );
}

export function useTopAppBar({ title, actionButton }: TopAppBarOptions = {}) {
  const ctx = useContext(TopAppBarContext);
  if (!ctx) {
    throw new Error('useTopAppBar must be used within a TopAppBarProvider');
  }
  const { options: prevOptions, setOptions } = ctx;

  // Refs to detect if we're truly passing a new function/string:
  const prevTitleRef = useRef(prevOptions.title);
  const prevActionRef = useRef(prevOptions.actionButton);

  useEffect(() => {
    const titleChanged = prevTitleRef.current !== title;
    const actionChanged = prevActionRef.current !== actionButton;

    if (titleChanged || actionChanged) {
      setOptions({ title, actionButton });
      prevTitleRef.current = title;
      prevActionRef.current = actionButton;
    }

    return () => {
      // Only reset if we had set something before:
      if (prevTitleRef.current !== undefined || prevActionRef.current !== undefined) {
        setOptions({ title: undefined, actionButton: undefined });
      }
    };
  }, [title, actionButton, setOptions]);
}

export function useTopAppBarOptions() {
  const ctx = useContext(TopAppBarContext);
  if (!ctx) {
    throw new Error('useTopAppBarOptions must be used within a TopAppBarProvider');
  }
  return ctx.options;
}
