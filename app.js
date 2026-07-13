async function loadVerses() {
  try {
    const response = await fetch("verses.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load verses.json");
    }

    const data = await response.json();

    const settings = data.settings || {};
    const verses = Array.isArray(data.verses) ? data.verses : [];

    const activeVerses = verses.filter(item => item.isActive !== false);

    if (!activeVerses.length) {
      showFallbackVerse();
      return;
    }

    const selectedVerse = getCurrentVerse(activeVerses, settings);

    document.getElementById("verseText").textContent = `「${selectedVerse.verseText}」`;
    document.getElementById("verseReference").textContent = selectedVerse.reference || "";
    document.getElementById("updatedLabel").textContent = getDisplayMonth();

  } catch (error) {
    console.error(error);
    showFallbackVerse();
  }
}

function getCurrentVerse(verses, settings) {
  const rotationDays = Number(settings.rotationDays || 7);
  const startDateText = settings.startDate || "2026-01-01";

  const startDate = new Date(startDateText + "T00:00:00");
  const today = new Date();

  const diffMs = today.getTime() - startDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const cycle = Math.floor(diffDays / rotationDays);
  const index = cycle % verses.length;

  return verses[index];
}

function getDisplayMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function showFallbackVerse() {
  document.getElementById("verseText").textContent = "「你要專心仰賴耶和華，不可倚靠自己的聰明。」";
  document.getElementById("verseReference").textContent = "箴言 3:5";
  document.getElementById("updatedLabel").textContent = getDisplayMonth();
}

document.addEventListener("DOMContentLoaded", loadVerses);
