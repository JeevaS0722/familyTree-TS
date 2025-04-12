// src/utils/detectBrowserAndOS.ts

export interface BrowserInfo {
  name: string;
  version: string;
}

export interface OSInfo {
  name: string;
  version: string;
}

export interface PlatformInfo {
  browser: BrowserInfo;
  os: OSInfo;
}

/**
 * Detects the user's browser name and version, as well as the operating system name and version.
 * @returns {PlatformInfo} An object containing browser and OS information.
 */
export const detectBrowserAndOS = (): PlatformInfo => {
  const userAgent = navigator.userAgent;

  let browserName = 'Unknown Browser';
  let browserVersion = 'Unknown Version';
  let osName = 'Unknown OS';
  let osVersion = 'Unknown Version';

  // ==============================
  // Operating System Detection
  // ==============================

  // macOS Detection
  const macosMatch = userAgent.match(/Mac OS X (\d+[\._]\d+[\._]?\d*)/);
  if (macosMatch) {
    osName = 'Mac OS';
    osVersion = macosMatch[1].replace(/_/g, '.');
  }

  // iOS Detection
  const iosMatch = userAgent.match(
    /iP(hone|od|ad); CPU (?:iPhone )?OS (\d+[\._]\d+[\._]?\d*) like Mac OS X/
  );
  if (iosMatch) {
    osName = 'iOS';
    osVersion = iosMatch[2].replace(/_/g, '.');
  }

  // Windows Detection
  const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
  if (windowsMatch) {
    osName = 'Windows';
    const versionMap: { [key: string]: string } = {
      '10.0': '10',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP',
      '5.0': '2000',
    };
    osVersion = versionMap[windowsMatch[1]] || windowsMatch[1];
  }

  // Android Detection
  const androidMatch = userAgent.match(/Android (\d+(\.\d+)*)/);
  if (androidMatch) {
    osName = 'Android';
    osVersion = androidMatch[1];
  }

  // Linux Detection
  const linuxMatch = userAgent.match(/Linux/);
  if (linuxMatch && osName === 'Unknown OS') {
    osName = 'Linux';
    // OS version detection for Linux is non-trivial and varies across distributions
  }

  // ==============================
  // Browser Detection
  // ==============================

  // Internet Explorer Detection
  const ieMatch = userAgent.match(/(?:MSIE |Trident\/.*rv:)(\d+(\.\d+)?)/);
  if (ieMatch) {
    browserName = 'Internet Explorer';
    browserVersion = ieMatch[1];
  }

  // Microsoft Edge (Legacy) Detection
  const edgeLegacyMatch = userAgent.match(/Edge\/(\d+(\.\d+)?)/);
  if (edgeLegacyMatch) {
    browserName = 'Microsoft Edge (Legacy)';
    browserVersion = edgeLegacyMatch[1];
  }

  // Microsoft Edge (Chromium) Detection
  const edgeChromiumMatch = userAgent.match(/Edg\/(\d+(\.\d+)?)/);
  if (edgeChromiumMatch) {
    browserName = 'Microsoft Edge';
    browserVersion = edgeChromiumMatch[1];
  }

  // Opera Detection
  const operaMatch = userAgent.match(/OPR\/(\d+(\.\d+)?)/);
  if (operaMatch) {
    browserName = 'Opera';
    browserVersion = operaMatch[1];
  }

  // Chrome Detection
  const chromeMatch = userAgent.match(/Chrome\/(\d+(\.\d+)?)/);
  // Ensure it's not Edge Chromium or Opera which also contain "Chrome" in userAgent
  if (
    chromeMatch &&
    !userAgent.includes('Edg/') &&
    !userAgent.includes('OPR/')
  ) {
    browserName = 'Chrome';
    browserVersion = chromeMatch[1];
  }

  // Safari Detection
  const safariMatch = userAgent.match(/Version\/(\d+(\.\d+)?).*Safari/);
  if (
    safariMatch &&
    !userAgent.includes('Chrome') &&
    !userAgent.includes('OPR/') &&
    !userAgent.includes('Edg/')
  ) {
    browserName = 'Safari';
    browserVersion = safariMatch[1];
  }

  // Firefox Detection
  const firefoxMatch = userAgent.match(/Firefox\/(\d+(\.\d+)?)/);
  if (firefoxMatch) {
    browserName = 'Firefox';
    browserVersion = firefoxMatch[1];
  }

  return {
    browser: {
      name: browserName,
      version: browserVersion,
    },
    os: {
      name: osName,
      version: osVersion,
    },
  };
};
