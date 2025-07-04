// Feature Flag Types
export interface FeatureFlag {
  key: string;
  value: boolean;
  description?: string;
  title?: string;
}

// Message Types for Chrome Extension Communication
export interface RegisterFlagsMessage {
  type: 'REGISTER_FLAGS';
  flags: FeatureFlag[];
}

export interface FlagUpdatedMessage {
  type: 'FLAG_UPDATED';
  key: string;
  tab: string;
  win: string;
  value: boolean;
}

export type ExtensionMessage = RegisterFlagsMessage | FlagUpdatedMessage;

// Window Extensions for injected scripts
declare global {
  interface Window {
    featureFlagsPluginConfig?: {
      listener: (key: string, value: boolean) => void;
    };
    featureFlagsPluginRegister?: (
      flags: FeatureFlag[],
      listener: (key: string, value: boolean) => void
    ) => void;
    registerMyFeatureFlags?: (
      register: (
        flags: FeatureFlag[],
        listener: (key: string, value: boolean) => void
      ) => void
    ) => void;
  }
}

// Storage Types
export interface StorageData {
  [key: string]: FeatureFlag[];
}

// Event Types
export interface FlagChangeEvent extends Event {
  target: HTMLInputElement & {
    getAttribute(name: 'name' | 'tabId' | 'windowId'): string;
  };
}
