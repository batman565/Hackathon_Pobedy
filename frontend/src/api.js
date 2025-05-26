import axios from "axios";

export const fetchimage = async (prompt) => {
  try {
    const response = await axios.post(
      "/api/generate/image",
      { prompt: prompt },
      {
        responseType: "blob",
      }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Ошибка при загрузке изображения:", error);
    throw error;
  }
};

export const fetchtext = async (prompt) => {
  try {
    const response = await axios.post(
      "/api/generate/text",
      { prompt: prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке текста:", error);
    throw error;
  }
};

export const fetchmusic = async (prompt) => {
  try {
    const response = await axios.post("/api/generate/music", {
      prompt: prompt,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке текста:", error);
    throw error;
  }
};
