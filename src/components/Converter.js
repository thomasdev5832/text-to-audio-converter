import React, { useEffect, useState } from "react";
import "../styles/Converter.css";

const Converter = () => {
  const [entradaTexto, setEntradaTexto] = useState("");
  const [vozesDisponiveis, setVozesDisponiveis] = useState([]);
  const [vozSelecionada, setVozSelecionada] = useState(null);
  const fala = new SpeechSynthesisUtterance();

  useEffect(() => {
    const atualizarValores = () => {
      const vozes = window.speechSynthesis.getVoices();
      setVozesDisponiveis(vozes);
      setVozSelecionada(vozes[0] || null);
    };

    window.speechSynthesis.onvoiceschanged = atualizarValores;
    atualizarValores();
  }, []);

  const handleChangeVoz = (event) => {
    const voz = vozesDisponiveis[event.target.value];
    setVozSelecionada(voz);
    fala.voice = voz;
  };

  const handleClickOuvir = () => {
    fala.text = entradaTexto;
    fala.voice = vozSelecionada;
    window.speechSynthesis.speak(fala);
  };

  const handleClickBaixarTexto = () => {
    const blob = new Blob([entradaTexto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texto.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const arquivo = event.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = (e) => {
        setEntradaTexto(e.target.result);
      };
      leitor.readAsText(arquivo);
    }
  };

  return (
    <div className="container">
      <div className="hero-wrap">
        <h1>
        Speakify
        </h1>
        <p>Simple, easy and fast audio to text converter!</p>
      </div>
      <div id="entrada-de-conteudo">
        <textarea
          placeholder="Type something or send a file to be spoken"
          id="entrada-de-texto"
          value={entradaTexto}
          onChange={(e) => setEntradaTexto(e.target.value)}
        ></textarea>
        <div className="upload-wrap">
          <label htmlFor="upload-arquivo" id="arquivo-label">
            Send file
          </label>
          <input
            type="file"
            id="upload-arquivo"
            accept=".txt"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      <div className="acoes">
        <div className="acao-box">
          <p>Choose a voice</p>
          <select id="selecao-voz" onChange={handleChangeVoz}>
            {vozesDisponiveis.map((voz, index) => (
              <option key={index} value={index}>
                {voz.name}
              </option>
            ))}
          </select>
        </div>
        <div className="acao-box">
          <button id="ouvir-btn" onClick={handleClickOuvir}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 18V6l8 6-8 6Z"/>
            </svg>
            Listen
          </button>
        </div>
        <div className="acao-box">
          <button id="baixar-texto-btn" onClick={handleClickBaixarTexto}>
            <svg  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
            </svg>

            Download text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Converter;
