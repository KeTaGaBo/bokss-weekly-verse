async function loadCurrentVerse() {
  const statusText = document.getElementById("statusText");
  const verseImage = document.getElementById("verseImage");

  try {
    const response = await fetch("data/current-verse.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load current-verse.json");
    }

    const data = await response.json();

    const imageUrl = data.imageUrl || "images/current-verse.jpg";
    const updatedAt = data.updatedAt || "";
    const title = data.title || "本週金句";

    const cacheBuster = updatedAt
      ? encodeURIComponent(updatedAt)
      : String(Date.now());

    verseImage.src = `${imageUrl}?v=${cacheBuster}`;
    verseImage.alt = title;

    if (updatedAt) {
      statusText.textContent = `最後更新：${formatDateTime(updatedAt)}`;
    } else {
      statusText.textContent = "本週金句";
    }
  } catch (error) {
    console.error("Failed to load current verse:", error);

    verseImage.src = `images/current-verse.jpg?v=${Date.now()}`;
    verseImage.alt = "本週金句";
    statusText.textContent = "本週金句";
  }
}

function formatDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", loadCurrentVerse);
