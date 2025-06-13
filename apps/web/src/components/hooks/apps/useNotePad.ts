import { useCallback, useEffect, useState } from "react";

type SyncStatus = "saved" | "saving" | "synced" | "error";

const useNotePad = () => {
  const [content, setContent] = useState("");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const syncToCloud = useCallback(async () => {
    setSyncStatus("saving");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate random success/failure (90% success rate)
      if (Math.random() > 0.1) {
        setSyncStatus("synced");
        setLastSaved(new Date());
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      setSyncStatus("error");
    }
    setSyncStatus("saved");
  }, []);

  // Auto-save to localStorage when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      syncToCloud();
    }, 3000);

    return () => clearTimeout(timer);
  }, [content, syncToCloud]);

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        syncToCloud();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [syncToCloud]);

  //   const getSyncIcon = () => {
  //     switch (syncStatus) {
  //       // case "saving":
  //       //     return <Cloud className="w-4 h-4 animate-pulse" />;
  //       // case "synced":
  //       //     return <Check className="w-4 h-4" />;
  //       // case "error":
  //       //     return <CloudOff className="w-4 h-4" />;
  //       default:
  //         return <Save className="w-4 h-4" />;
  //     }
  //   };

  const getSyncText = () => {
    switch (syncStatus) {
      case "saving":
        return "Syncing...";
      // case "synced":
      //     return "Synced";
      // case "error":
      //     return "Sync failed";
      default:
        return "Save";
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      // case "saving":
      //     return "bg-blue-500 hover:bg-blue-600";
      // case "synced":
      //     return "bg-green-500 hover:bg-green-600";
      // case "error":
      //     return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

  return {
    content,
    setContent,
    syncStatus,
    syncToCloud,
    lastSaved,
    // getSyncIcon,
    getSyncText,
    getSyncColor,
  };
};

export default useNotePad;
