import React, { useRef, useState } from "react";
import "./App.css";
import { fetchtext, fetchimage, fetchmusic } from "./api";
import { useEffect } from "react";

function App() {
  const refPrompt = useRef(null);
  const refType = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState({
    songs: ["", ""],
    image: null,
    text: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [activeOutput, setActiveOutput] = useState(null);
  const [showRules, setShowRules] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    setShowRules(true);
  }, []);

  const send = async () => {
    const prompt = refPrompt.current.value;
    const type = refType.current.value;

    if (!prompt.trim()) {
      alert("Пожалуйста, введите текст для генерации");
      return;
    }

    setIsLoading(true);
    setActiveOutput(type);
    setFeedbackGiven(false);

    try {
      switch (type) {
        case "song":
          const songs = await fetchmusic(prompt);
          setOutput((prev) => ({
            ...prev,
            songs: songs || ["", ""],
          }));
          break;
        case "picture":
          const image = await fetchimage(prompt);
          setOutput((prev) => ({
            ...prev,
            image: image || null,
          }));
          break;
        case "text":
          const text = await fetchtext(prompt);
          setOutput((prev) => ({
            ...prev,
            text: text || "",
          }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Ошибка генерации:", error);
      alert("Произошла ошибка при генерации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (isLiked) => {
    console.log(`Пользователь ${isLiked ? "оценил" : "не оценил"} генерацию`);
    setFeedbackGiven(true);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {showRules && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 style={{ margin: "0 auto", padding: "0" }}>
                Правила платформы
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowRules(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>1. Запрещено генерировать контент, нарушающий законы РФ</p>
              <p>2. Генерация должна соответствовать тематике ВОВ</p>
              <button
                className="btn modal-accept"
                onClick={() => setShowRules(false)}
              >
                Я принимаю условия
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>Генератор искусства через призму военных лет</h1>
            <p>Память о Великой Отечественной Войне в творчестве.</p>
          </div>
          <div className="stripe" />
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="prompt">
                <i className="fas fa-pencil-alt" /> Напишите воспоминание
              </label>
              <textarea
                id="prompt"
                placeholder="Напишите здесь ..."
                defaultValue={""}
                ref={refPrompt}
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">
                <i className="fas fa-list-ul" /> Тип генерации
              </label>
              <select id="type" ref={refType} defaultValue="song">
                <option value="song">Песня</option>
                <option value="picture">Рисунок</option>
                <option value="text">Текст</option>
              </select>
            </div>
            <button
              id="generateBtn"
              className="btn"
              onClick={send}
              disabled={isLoading || !isChecked}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Генерация...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt" /> Сгенерировать
                </>
              )}
            </button>
            <div>
              <label
                style={{
                  textAlign: "center",
                  marginTop: "15px",
                }}
                className="help-text"
              >
                <input
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  type="checkbox"
                />
                {"  "}Я согласен с условиями использования
              </label>
            </div>
            <span
              style={{
                display: "block",
                color: "grey",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Сгенерированный контент, является художественным и может содержать
              неточные или вымышленные элементы
            </span>
          </div>
        </div>

        <div
          id="outputContainer"
          className={`card ${activeOutput ? "" : "hidden"}`}
        >
          <div className="card-header output-header">
            <h2>
              <i className="fas fa-file-alt" /> Сгенерированный контент
            </h2>
          </div>
          <div className="stripe" />
          <div className="card-body">
            {isLoading ? (
              <div className="loader" />
            ) : (
              <div id="outputContent">
                {activeOutput === "song" && (
                  <div className="audio-grid">
                    {output.songs.map((songUrl, index) => (
                      <div key={index} className="audio-player">
                        {songUrl && (
                          <>
                            <audio
                              controls
                              src={songUrl}
                              style={{ width: "100%" }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {activeOutput === "picture" && output.image && (
                  <div id="pictureOutput">
                    <img
                      className="generated-image"
                      src={output.image}
                      alt="Generated content"
                    />
                  </div>
                )}
                {activeOutput === "text" && (
                  <div id="textOutput">
                    <p className="text-output">{output.text}</p>
                  </div>
                )}

                {activeOutput && !isLoading && !feedbackGiven && (
                  <div className="feedback-buttons">
                    <p>Вам понравился результат?</p>
                    <button
                      className="btn feedback-like"
                      onClick={() => handleFeedback(true)}
                    >
                      <i className="fas fa-thumbs-up" /> Понравилось
                    </button>
                    <button
                      className="btn feedback-dislike"
                      onClick={() => handleFeedback(false)}
                    >
                      <i className="fas fa-thumbs-down" /> Не понравилось
                    </button>
                  </div>
                )}

                {feedbackGiven && (
                  <p style={{ textAlign: "center", color: "green" }}>
                    <i className="fas fa-check-circle" /> Спасибо за вашу
                    оценку!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
