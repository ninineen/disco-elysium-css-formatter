/// <reference types="vite/client" />
﻿const SAMPLE_DOCUMENT_PATH = "samples/emergency-session.html";

export async function fetchSampleDocument(): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}${SAMPLE_DOCUMENT_PATH}`);
  if (!response.ok) {
    throw new Error("The sample document could not be loaded.");
  }
  return response.text();
}