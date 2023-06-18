import * as FileSystem from "expo-file-system";

function getTrackId(link) {
  const regex = /\/track\/([^?]+)/;
  const match = link.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    // Return null or handle the case when the track ID is not found
    return null;
  }
}

async function songMetadata(trackId) {
  const response = await fetch(
    `https://api.spotifydown.com/metadata/track/${trackId}`,
    {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Origin: "https://spotifydown.com",
        Pragma: "no-cache",
        Referer: "https://spotifydown.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    }
  );

  return await response.json();
}

async function fetchResourceData(trackId) {
  const response = await fetch(
    `https://api.spotifydown.com/download/${trackId}`,
    {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Origin: "https://spotifydown.com",
        Pragma: "no-cache",
        Referer: "https://spotifydown.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    }
  );

  return await response.json();
}

async function downloadSongFromCorsProxy(url, directory, filename) {
  const encodedUrl = encodeURIComponent(url);

  try {
    const response = await fetch(`https://corsproxy.io/?${encodedUrl}=null`, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Origin: "https://spotifydown.com",
        Pragma: "no-cache",
        Referer: "https://spotifydown.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        Cookie:
          "XSRF-TOKEN=eyJpdiI6Ii9JRGJRS3QreXl3ZTM4TUY2UlNya2c9PSIsInZhbHVlIjoiamxrbHZ1TUErWG5LT3k3b1NxUGdYZnVMSW5ZN1VIZnJMdWpoM0tkcnk2UFo4eXNINFptYS9HUFFZYUtPdGVJVXYyd1A2MFdXaFZEZkR1dFMvdzcxR3ozTmljVDNPeVVmdGFZRE1lVklnRzUxMlFPengvcnY4ZTJJN2NzZVVvR2wiLCJtYWMiOiJmYmM2MmU5YzlmNWNhYmJiMzU2M2IyNjA4MGFiYjVhNWUzMGI1MTc5ZDVlYjVkMTA2Mzk4Mjg3ODgxYTZiMzBlIiwidGFnIjoiIn0%3D; mp3_converter_pro_session=eyJpdiI6Ik9jTTVhVzdidU9Yd1BkZDVRRGFqSkE9PSIsInZhbHVlIjoibUI3NUttR2JoSHlQelViaGw0eHpBamxOWHVxNEZPd3M3N2RxOUFGUnQwYndCWWRpRTE5ckE3L1BZSlJKTVdNOVJNVk15Y0xuOXl1dFpjWS8wZVJpY2JwSndVZGV1WVJOeWlTMW1jOVpuT3FaaG5LaXZoTHpJaS9nYzJFek9GYm4iLCJtYWMiOiJjNzE0N2Y2Njc0YWNiZmUwZWUyMmQwOTdjOGRkMDVlNWJmYmNlYWM0YzM1NTVmMWI5NzcxNWQ0MGJmNGE0MjcwIiwidGFnIjoiIn0%3D",
      },
    });

    const blob = await response.blob();

    if (!(await FileSystem.getInfoAsync(directory)).exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    const filePath = `${directory}/${filename}`;

    await FileSystem.writeAsStringAsync(
      filePath,
      await FileSystem.readAsStringAsync(blob, {
        encoding: FileSystem.EncodingType.Base64,
      })
    );

    console.log("File saved successfully: ", filePath);
  } catch (error) {
    console.error("Error occurred: ", error);
  }
}

async function downloadSong(url, directory, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    if (!(await FileSystem.getInfoAsync(directory)).exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    const filePath = `${directory}/${filename}`;

    await FileSystem.writeAsStringAsync(
      filePath,
      await FileSystem.readAsStringAsync(blob, {
        encoding: FileSystem.EncodingType.Base64,
      })
    );

    console.log("File saved successfully:", filePath);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

export {
  songMetadata,
  fetchResourceData,
  downloadSong,
  downloadSongFromCorsProxy,
  getTrackId,
};
